import * as THREE from "three";
import type { LibraryBook } from "./books";

/** Canvas pixels per scene unit. */
const PPU = 420;

type Mode = "color" | "mask";

export type BookTextures = {
  cover: THREE.CanvasTexture;
  coverMask: THREE.CanvasTexture;
  coverRough: THREE.CanvasTexture;
  spine: THREE.CanvasTexture;
  spineMask: THREE.CanvasTexture;
  spineRough: THREE.CanvasTexture;
  inside: THREE.CanvasTexture;
  page: THREE.CanvasTexture;
  cloth: THREE.CanvasTexture;
};

export type SharedTextures = {
  edgeVertical: THREE.CanvasTexture;
  edgeHorizontal: THREE.CanvasTexture;
};

function makeCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width);
  canvas.height = Math.round(height);
  const ctx = canvas.getContext("2d")!;
  return { canvas, ctx };
}

function toTexture(canvas: HTMLCanvasElement, srgb = true) {
  const texture = new THREE.CanvasTexture(canvas);
  if (srgb) texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

/** Deterministic PRNG so every render of a book looks identical. */
function seeded(seedText: string) {
  let h = 2166136261;
  for (let i = 0; i < seedText.length; i++) {
    h ^= seedText.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shade(hex: string, amount: number) {
  const c = new THREE.Color(hex);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  c.setHSL(hsl.h, hsl.s, THREE.MathUtils.clamp(hsl.l + amount, 0, 1));
  return `#${c.getHexString()}`;
}

function paintCloth(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color: string,
  rand: () => number,
) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, w, h);

  // Linen weave: fine warp and weft threads at very low contrast.
  ctx.globalAlpha = 0.07;
  for (let y = 0; y < h; y += 2) {
    ctx.fillStyle = rand() > 0.5 ? "#000" : "#fff";
    ctx.fillRect(0, y, w, 1);
  }
  for (let x = 0; x < w; x += 2) {
    ctx.fillStyle = rand() > 0.5 ? "#000" : "#fff";
    ctx.fillRect(x, 0, 1, h);
  }

  // Mottling from handling and age.
  for (let i = 0; i < 40; i++) {
    const r = 20 + rand() * 120;
    const g = ctx.createRadialGradient(
      rand() * w,
      rand() * h,
      0,
      rand() * w,
      rand() * h,
      r,
    );
    g.addColorStop(
      0,
      rand() > 0.5 ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.4)",
    );
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.globalAlpha = 1;

  // Darkened edges where the cloth wraps the board.
  const edge = ctx.createLinearGradient(0, 0, w, 0);
  edge.addColorStop(0, "rgba(0,0,0,0.25)");
  edge.addColorStop(0.04, "rgba(0,0,0,0)");
  edge.addColorStop(0.96, "rgba(0,0,0,0)");
  edge.addColorStop(1, "rgba(0,0,0,0.25)");
  ctx.fillStyle = edge;
  ctx.fillRect(0, 0, w, h);
}

function foilFill(
  ctx: CanvasRenderingContext2D,
  mode: Mode,
  foil: string,
  h: number,
) {
  if (mode === "mask") return "#fff";
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, shade(foil, 0.08));
  g.addColorStop(0.5, foil);
  g.addColorStop(1, shade(foil, -0.1));
  return g;
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawSpacedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  spacing: number,
) {
  const chars = [...text];
  const total =
    chars.reduce((sum, ch) => sum + ctx.measureText(ch).width, 0) +
    spacing * (chars.length - 1);
  let cursor = x - total / 2;
  for (const ch of chars) {
    ctx.fillText(ch, cursor, y);
    cursor += ctx.measureText(ch).width + spacing;
  }
}

function drawDiamondRule(
  ctx: CanvasRenderingContext2D,
  cx: number,
  y: number,
  half: number,
  unit: number,
) {
  ctx.fillRect(cx - half, y - unit * 0.12, half - unit * 0.9, unit * 0.24);
  ctx.fillRect(
    cx + unit * 0.9,
    y - unit * 0.12,
    half - unit * 0.9,
    unit * 0.24,
  );
  ctx.beginPath();
  ctx.moveTo(cx, y - unit * 0.6);
  ctx.lineTo(cx + unit * 0.6, y);
  ctx.lineTo(cx, y + unit * 0.6);
  ctx.lineTo(cx - unit * 0.6, y);
  ctx.closePath();
  ctx.fill();
}

function drawCover(
  book: LibraryBook,
  serif: string,
  mode: Mode,
): HTMLCanvasElement {
  const w = book.width * PPU;
  const h = book.height * PPU;
  const { canvas, ctx } = makeCanvas(w, h);
  const rand = seeded(`${book.id}-cover`);
  const unit = w / 60;

  if (mode === "color") {
    paintCloth(ctx, w, h, book.cloth, rand);
    // Blind-stamped panel: a debossed frame with a lit lower edge.
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.lineWidth = unit * 0.5;
    ctx.strokeRect(unit * 4, unit * 4, w - unit * 8, h - unit * 8);
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = unit * 0.25;
    ctx.strokeRect(unit * 4.6, unit * 4.6, w - unit * 9.2, h - unit * 9.2);
  } else {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
  }

  ctx.fillStyle = foilFill(ctx, mode, book.foil, h);
  ctx.strokeStyle = mode === "mask" ? "#fff" : book.foil;

  // Fine gilt border inside the blind panel.
  ctx.lineWidth = unit * 0.22;
  ctx.strokeRect(unit * 6.5, unit * 6.5, w - unit * 13, h - unit * 13);

  const title = book.title.toUpperCase();
  let fontSize = unit * 5.4;
  ctx.font = `600 ${fontSize}px ${serif}`;
  let lines = wrapLines(ctx, title, w - unit * 18);
  while (lines.length > 3 && fontSize > unit * 3.6) {
    fontSize *= 0.9;
    ctx.font = `600 ${fontSize}px ${serif}`;
    lines = wrapLines(ctx, title, w - unit * 18);
  }

  ctx.textBaseline = "middle";
  const lineHeight = fontSize * 1.12;
  const blockTop = h * 0.3 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, i) => {
    drawSpacedText(ctx, line, w / 2, blockTop + i * lineHeight, unit * 0.5);
  });

  const ruleY = blockTop + (lines.length - 1) * lineHeight + fontSize * 1.3;
  drawDiamondRule(ctx, w / 2, ruleY, w * 0.22, unit);

  ctx.font = `italic 500 ${unit * 3.2}px ${serif}`;
  ctx.textAlign = "center";
  ctx.fillText(book.author, w / 2, h * 0.82);
  ctx.textAlign = "start";

  return canvas;
}

function drawSpine(
  book: LibraryBook,
  serif: string,
  mode: Mode,
): HTMLCanvasElement {
  // Spine canvas is laid out along the curved spine: u across thickness, v down the height.
  const w = Math.max(book.thickness * PPU * 1.25, 120);
  const h = book.height * PPU;
  const { canvas, ctx } = makeCanvas(w, h);
  const rand = seeded(`${book.id}-spine`);
  const unit = w / 24;

  if (mode === "color") {
    paintCloth(ctx, w, h, book.cloth, rand);
    // Soft highlight down the crown of the rounded spine.
    const crown = ctx.createLinearGradient(0, 0, w, 0);
    crown.addColorStop(0, "rgba(0,0,0,0.35)");
    crown.addColorStop(0.5, "rgba(255,255,255,0.07)");
    crown.addColorStop(1, "rgba(0,0,0,0.35)");
    ctx.fillStyle = crown;
    ctx.fillRect(0, 0, w, h);
    // Raised bands.
    ctx.fillStyle = "rgba(0,0,0,0.28)";
    for (const y of [0.1, 0.13, 0.87, 0.9])
      ctx.fillRect(0, h * y, w, unit * 0.6);
  } else {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
  }

  ctx.fillStyle = foilFill(ctx, mode, book.foil, h);
  for (const y of [0.115, 0.885])
    ctx.fillRect(unit * 3, h * y, w - unit * 6, unit * 0.45);

  // Title reads top-to-bottom, as English spines do; each line of type gets its own zone.
  const drawRun = (
    text: string,
    weight: string,
    maxSize: number,
    zoneStart: number,
    zoneEnd: number,
  ) => {
    const maxLen = h * (zoneEnd - zoneStart);
    let size = maxSize;
    const measure = () => {
      ctx.font = `${weight} ${size}px ${serif}`;
      const spacing = size * 0.08;
      const width =
        [...text].reduce((sum, ch) => sum + ctx.measureText(ch).width, 0) +
        spacing * (text.length - 1);
      return { spacing, width };
    };
    let m = measure();
    while (m.width > maxLen && size > 8) {
      size *= 0.95;
      m = measure();
    }
    ctx.save();
    ctx.translate(w / 2, h * zoneStart + (maxLen - m.width) / 2);
    ctx.rotate(Math.PI / 2);
    ctx.textBaseline = "middle";
    drawSpacedText(ctx, text, m.width / 2, 0, m.spacing);
    ctx.restore();
  };

  drawRun(
    book.title.toUpperCase(),
    "600",
    Math.min(w * 0.42, unit * 11),
    0.16,
    0.64,
  );
  const surname = book.author.split(" ").slice(-1)[0].toUpperCase();
  drawRun(surname, "500", Math.min(w * 0.28, unit * 7), 0.68, 0.84);

  // Small colophon mark at the foot.
  ctx.beginPath();
  ctx.arc(w / 2, h * 0.94, unit * 1.4, 0, Math.PI * 2);
  ctx.lineWidth = unit * 0.35;
  ctx.strokeStyle = mode === "mask" ? "#fff" : book.foil;
  ctx.stroke();

  return canvas;
}

function drawInsideCover(book: LibraryBook, serif: string): HTMLCanvasElement {
  const w = book.width * PPU;
  const h = book.height * PPU;
  const { canvas, ctx } = makeCanvas(w, h);
  const rand = seeded(`${book.id}-inside`);

  // Marbled endpaper in the book's cloth hue.
  ctx.fillStyle = shade(book.cloth, 0.18);
  ctx.fillRect(0, 0, w, h);
  for (let band = 0; band < 70; band++) {
    ctx.beginPath();
    const y0 = rand() * h;
    const amp = 10 + rand() * 40;
    const freq = 0.004 + rand() * 0.01;
    const phase = rand() * Math.PI * 2;
    for (let x = 0; x <= w; x += 6) {
      const y =
        y0 +
        Math.sin(x * freq + phase) * amp +
        Math.sin(x * freq * 3.1) * amp * 0.25;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle =
      rand() > 0.5 ? shade(book.cloth, 0.32) : shade(book.cloth, -0.04);
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 2 + rand() * 7;
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Tipped-in frontispiece plate.
  const pw = w * 0.66;
  const ph = h * 0.58;
  const px = (w - pw) / 2;
  const py = h * 0.17;
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(px + 6, py + 8, pw, ph);
  ctx.fillStyle = "#efe6d3";
  ctx.fillRect(px, py, pw, ph);

  // Etched oval vignette made of hatching.
  const cx = w / 2;
  const cy = py + ph * 0.45;
  const rx = pw * 0.36;
  const ry = ph * 0.34;
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.clip();
  ctx.strokeStyle = "rgba(42,33,24,0.55)";
  ctx.lineWidth = 1.2;
  for (let i = -rx * 2; i < rx * 2; i += 5) {
    ctx.beginPath();
    ctx.moveTo(cx + i, cy - ry);
    ctx.lineTo(cx + i + ry * 0.6, cy + ry);
    ctx.stroke();
  }
  ctx.restore();
  ctx.strokeStyle = "rgba(42,33,24,0.8)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx * 1.06, ry * 1.06, 0, 0, Math.PI * 2);
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Monogram in the oval.
  const initials = book.title
    .replace(/^The /, "")
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
  ctx.fillStyle = "#efe6d3";
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx * 0.5, ry * 0.42, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2a2118";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `italic 500 ${ry * 0.55}px ${serif}`;
  ctx.fillText(initials, cx, cy + ry * 0.04);

  ctx.font = `italic 400 ${pw * 0.06}px ${serif}`;
  ctx.fillStyle = "rgba(42,33,24,0.75)";
  ctx.fillText("Frontispiece", cx, py + ph * 0.9);

  return canvas;
}

function drawFirstPage(book: LibraryBook, serif: string): HTMLCanvasElement {
  const w = book.width * PPU;
  const h = book.height * PPU;
  const { canvas, ctx } = makeCanvas(w, h);
  const rand = seeded(`${book.id}-page`);
  const unit = w / 60;

  ctx.fillStyle = "#f1e8d6";
  ctx.fillRect(0, 0, w, h);
  // Paper tooth.
  for (let i = 0; i < 2600; i++) {
    ctx.fillStyle =
      rand() > 0.5 ? "rgba(90,70,40,0.05)" : "rgba(255,255,255,0.08)";
    ctx.fillRect(rand() * w, rand() * h, 1.5, 1.5);
  }
  // Gutter shadow along the spine (left edge of the right-hand page).
  const gutter = ctx.createLinearGradient(0, 0, w * 0.18, 0);
  gutter.addColorStop(0, "rgba(60,40,20,0.28)");
  gutter.addColorStop(1, "rgba(60,40,20,0)");
  ctx.fillStyle = gutter;
  ctx.fillRect(0, 0, w * 0.18, h);

  ctx.fillStyle = "#2a2118";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  ctx.font = `500 ${unit * 2.1}px ${serif}`;
  drawSpacedText(
    ctx,
    book.category.toUpperCase(),
    w / 2,
    h * 0.14,
    unit * 0.45,
  );

  ctx.fillStyle = "rgba(42,33,24,0.35)";
  ctx.font = `italic 400 ${unit * 11}px ${serif}`;
  ctx.fillText("“", w / 2, h * 0.3);

  ctx.fillStyle = "#2a2118";
  let size = unit * 4.4;
  ctx.font = `italic 500 ${size}px ${serif}`;
  let lines = wrapLines(ctx, book.excerpt, w - unit * 16);
  while (lines.length > 7 && size > unit * 3) {
    size *= 0.92;
    ctx.font = `italic 500 ${size}px ${serif}`;
    lines = wrapLines(ctx, book.excerpt, w - unit * 16);
  }
  const lh = size * 1.32;
  const top = h * 0.46 - ((lines.length - 1) * lh) / 2;
  lines.forEach((line, i) => ctx.fillText(line, w / 2, top + i * lh));

  ctx.fillStyle = "rgba(42,33,24,0.75)";
  ctx.font = `400 ${unit * 2.4}px ${serif}`;
  ctx.fillText(`— ${book.author}`, w / 2, top + lines.length * lh + unit * 4);

  ctx.font = `400 ${unit * 2}px ${serif}`;
  ctx.fillText("i", w / 2, h * 0.93);

  return canvas;
}

function drawPageEdge(vertical: boolean): HTMLCanvasElement {
  const size = 256;
  const { canvas, ctx } = makeCanvas(size, size);
  const rand = seeded(vertical ? "edge-v" : "edge-h");
  ctx.fillStyle = "#e9dec7";
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < size; i += 1.5) {
    ctx.fillStyle = `rgba(110,90,60,${0.05 + rand() * 0.12})`;
    if (vertical) ctx.fillRect(i, 0, 0.8, size);
    else ctx.fillRect(0, i, size, 0.8);
  }
  return canvas;
}

/** Cloth reads as matte, foil as polished: map the foil mask to a roughness map. */
function roughnessFromMask(mask: HTMLCanvasElement) {
  const { canvas, ctx } = makeCanvas(mask.width, mask.height);
  ctx.drawImage(mask, 0, 0);
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = image.data;
  for (let i = 0; i < data.length; i += 4) {
    const v = Math.round(235 - (data[i] / 255) * 150);
    data[i] = data[i + 1] = data[i + 2] = v;
  }
  ctx.putImageData(image, 0, 0);
  return canvas;
}

export function createBookTextures(
  book: LibraryBook,
  serif: string,
): BookTextures {
  const clothCanvas = makeCanvas(256, 256);
  paintCloth(clothCanvas.ctx, 256, 256, book.cloth, seeded(`${book.id}-cloth`));
  const coverMask = drawCover(book, serif, "mask");
  const spineMask = drawSpine(book, serif, "mask");

  return {
    cover: toTexture(drawCover(book, serif, "color")),
    coverMask: toTexture(coverMask, false),
    coverRough: toTexture(roughnessFromMask(coverMask), false),
    spine: toTexture(drawSpine(book, serif, "color")),
    spineMask: toTexture(spineMask, false),
    spineRough: toTexture(roughnessFromMask(spineMask), false),
    inside: toTexture(drawInsideCover(book, serif)),
    page: toTexture(drawFirstPage(book, serif)),
    cloth: toTexture(clothCanvas.canvas),
  };
}

export function createSharedTextures(): SharedTextures {
  return {
    edgeVertical: toTexture(drawPageEdge(true)),
    edgeHorizontal: toTexture(drawPageEdge(false)),
  };
}

function pageSerif() {
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue("--font-serif-next")
      .trim() || "Georgia, serif"
  );
}

/** Flat cover artwork as an image URL, for use outside the WebGL scene. */
export function renderCoverImage(book: LibraryBook) {
  return drawCover(book, pageSerif(), "color").toDataURL("image/jpeg", 0.9);
}

/** Flat spine artwork as an image URL, for use outside the WebGL scene. */
export function renderSpineImage(book: LibraryBook) {
  return drawSpine(book, pageSerif(), "color").toDataURL("image/jpeg", 0.9);
}
