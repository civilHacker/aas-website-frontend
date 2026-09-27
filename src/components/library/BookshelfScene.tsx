"use client";

/* eslint-disable react-hooks/immutability -- three.js objects are mutated imperatively inside the render loop by design. */

import {
  Canvas,
  useFrame,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import {
  copyPageTexture,
  createBookTextures,
  createReadingPage,
  createSharedTextures,
  type BookTextures,
  type SharedTextures,
} from "./bookTextures";
import type { BookInsight, LibraryBook } from "./books";
import { BACKDROP_RATIO, scenePalette, TABLE_LINE } from "./palette";

/** Mutable state shared between the DOM controls and the render loop (no React re-renders per frame). */
export type ShelfController = {
  target: number;
  display: number;
  selected: number | null;
  opening: boolean;
  openT: number;
  hovered: number | null;
  /** A page of the open book is mid-turn; further turns wait for it. */
  turning: boolean;
  dragMoved: boolean;
  reducedMotion: boolean;
  /** Which books pass the active shelf filter; target/display are slot positions among these. */
  visible: boolean[];
  onDisplay?: (display: number) => void;
  /** Screen position (canvas pixels) just above the hovered book, or null when nothing is hovered. */
  onHover?: (index: number | null, x: number, y: number) => void;
};

type SceneProps = {
  books: LibraryBook[];
  controller: RefObject<ShelfController>;
  onSelect: (index: number) => void;
  onCenteredChange: (index: number) => void;
  onPanelChange: (visible: boolean) => void;
  onClosed: () => void;
  /** Clicking the open book's right page turns forward (1), its left page back (-1). */
  onTurn: (dir: 1 | -1) => void;
  /** Page `n` of the open book, reached by turning in `dir`. */
  page?: {
    index: number;
    insight: BookInsight;
    n: number;
    dir: 1 | -1;
  } | null;
};

type BookHandle = {
  group: THREE.Group;
  hinge: THREE.Group;
  leaf: THREE.Group;
  leafFront: THREE.MeshStandardMaterial;
  page: THREE.MeshStandardMaterial;
  materials: THREE.MeshStandardMaterial[];
};

const FOV = 28;
const BOARD = 0.035;
const SPINE_BULGE = 0.32;
const BASE_Z = 0.3;
const FRONT_Z = 0.82;
const GAP = 0.035;
const COVER_MARGIN = 0.2;
const OPEN_SECONDS = 1.8;
/** Opened almost flat so both pages face the reader. */
const HINGE_ANGLE = (-168 * Math.PI) / 180;
const PANEL_REVEAL = 0.72;
const FLY_STAGGER = 0.065;
const FLY_SECONDS = 1.2;
const TURN_SECONDS = 0.9;
/** Width of the open book in book widths: the page plus the cover lying back at HINGE_ANGLE. */
const SPREAD = 2;
/** The leaf shares the cover's hinge; it starts on the page block and lands just above the cover's inner face. */
const LEAF_Z = -BOARD / 2 + 0.003;
const LEAF_LIFT = 0.007;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};
const easeInOut = (v: number) => {
  const t = clamp01(v);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};
const easeOut = (v: number) => 1 - Math.pow(1 - clamp01(v), 3);
const easeOutBack = (v: number) => {
  const t = clamp01(v);
  const c1 = 1.3;
  return 1 + (c1 + 1) * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const lerp = THREE.MathUtils.lerp;
const damp = THREE.MathUtils.damp;

function hash(i: number, salt: number) {
  const s = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function Book({
  book,
  index,
  textures,
  shared,
  onRegister,
  onSelect,
  onTurn,
  controller,
}: {
  book: LibraryBook;
  index: number;
  textures: BookTextures;
  shared: SharedTextures;
  onRegister: (index: number, handle: BookHandle | null) => void;
  onSelect: (index: number) => void;
  onTurn: (dir: 1 | -1) => void;
  controller: RefObject<ShelfController>;
}) {
  const { width: W, height: H, thickness: T } = book;
  const groupRef = useRef<THREE.Group>(null);
  const hingeRef = useRef<THREE.Group>(null);
  const leafRef = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    const spine = new THREE.CylinderGeometry(
      T / 2,
      T / 2,
      H,
      28,
      1,
      false,
      Math.PI,
      Math.PI,
    );
    spine.scale(SPINE_BULGE, 1, 1);
    return {
      board: new THREE.BoxGeometry(W, H, BOARD),
      pages: new THREE.BoxGeometry(W - 0.05, H - 0.07, T - 2 * BOARD),
      leaf: new THREE.PlaneGeometry(W - 0.05, H - 0.07),
      spine,
    };
  }, [W, H, T]);

  const materials = useMemo(() => {
    const cloth = new THREE.MeshStandardMaterial({
      map: textures.cloth,
      roughness: 0.9,
    });
    const cover = new THREE.MeshStandardMaterial({
      map: textures.cover,
      metalnessMap: textures.coverMask,
      metalness: 0.95,
      roughnessMap: textures.coverRough,
      roughness: 1,
    });
    const spine = new THREE.MeshStandardMaterial({
      map: textures.spine,
      metalnessMap: textures.spineMask,
      metalness: 0.95,
      roughnessMap: textures.spineRough,
      roughness: 1,
    });
    const inside = new THREE.MeshStandardMaterial({
      map: textures.inside,
      roughness: 0.85,
    });
    const page = new THREE.MeshStandardMaterial({
      map: textures.page,
      roughness: 0.95,
    });
    const edgeV = new THREE.MeshStandardMaterial({
      map: shared.edgeVertical,
      roughness: 0.95,
    });
    const edgeH = new THREE.MeshStandardMaterial({
      map: shared.edgeHorizontal,
      roughness: 0.95,
    });
    const leafFront = new THREE.MeshStandardMaterial({ roughness: 0.95 });
    const leafBack = new THREE.MeshStandardMaterial({
      map: shared.pageBack,
      roughness: 0.95,
      side: THREE.BackSide,
    });
    return {
      page,
      leafFront,
      leafBack,
      back: [cloth, cloth, cloth, cloth, cloth, cloth],
      front: [cloth, cloth, cloth, cloth, cover, inside],
      pages: [edgeV, edgeV, edgeH, edgeH, page, edgeH],
      spine: [spine, cloth, cloth],
      all: [
        cloth,
        cover,
        spine,
        inside,
        page,
        edgeV,
        edgeH,
        leafFront,
        leafBack,
      ],
    };
  }, [textures, shared]);

  useEffect(() => {
    if (groupRef.current && hingeRef.current && leafRef.current) {
      onRegister(index, {
        group: groupRef.current,
        hinge: hingeRef.current,
        leaf: leafRef.current,
        leafFront: materials.leafFront,
        page: materials.page,
        materials: materials.all,
      });
    }
    return () => onRegister(index, null);
  }, [index, materials, onRegister]);

  useEffect(
    () => () => {
      geometry.board.dispose();
      geometry.pages.dispose();
      geometry.leaf.dispose();
      geometry.spine.dispose();
    },
    [geometry],
  );
  useEffect(
    () => () => {
      materials.leafFront.map?.dispose();
      materials.all.forEach((m) => m.dispose());
    },
    [materials],
  );

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    const c = controller.current;
    if (c.dragMoved) return;
    if (c.selected === index && c.opening) {
      // Raycasts also hit the hidden leaf lying over the right page, so read the first visible surface.
      const hit = event.intersections.find(({ object }) => {
        for (let o: THREE.Object3D | null = object; o; o = o.parent)
          if (!o.visible) return false;
        return true;
      });
      if (c.openT >= PANEL_REVEAL && !c.turning)
        onTurn(hit?.object.name === "left" ? -1 : 1);
      return;
    }
    onSelect(index);
  };
  const handleOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    controller.current.hovered = index;
    document.body.style.cursor = "pointer";
  };
  const handleOut = () => {
    if (controller.current.hovered === index) controller.current.hovered = null;
    document.body.style.cursor = "";
  };

  return (
    <group
      ref={groupRef}
      visible={false}
      onClick={handleClick}
      onPointerOver={handleOver}
      onPointerOut={handleOut}
    >
      <mesh
        geometry={geometry.board}
        material={materials.back}
        position={[0, 0, -T / 2 + BOARD / 2]}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={geometry.pages}
        material={materials.pages}
        position={[-0.025, 0, 0]}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={geometry.spine}
        material={materials.spine}
        position={[-W / 2, 0, 0]}
        castShadow
        receiveShadow
      />
      <group
        ref={leafRef}
        visible={false}
        position={[-W / 2, 0, T / 2 - BOARD / 2]}
      >
        <mesh
          name="left"
          geometry={geometry.leaf}
          material={materials.leafFront}
          position={[(W - 0.05) / 2, 0, LEAF_Z]}
        />
        <mesh
          name="left"
          geometry={geometry.leaf}
          material={materials.leafBack}
          position={[(W - 0.05) / 2, 0, LEAF_Z]}
        />
      </group>
      <group ref={hingeRef} position={[-W / 2, 0, T / 2 - BOARD / 2]}>
        <mesh
          name="left"
          geometry={geometry.board}
          material={materials.front}
          position={[W / 2, 0, 0]}
          castShadow
          receiveShadow
        />
      </group>
    </group>
  );
}

type Pose = {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
  s: number;
};

function Shelf({
  books,
  controller,
  onSelect,
  onCenteredChange,
  onPanelChange,
  onClosed,
  onTurn,
  page,
}: SceneProps) {
  const { camera, size, gl, scene } = useThree();
  const shown = useRef<{ index: number; n: number } | null>(null);
  const tip = useMemo(() => new THREE.Vector3(), []);
  const [assets, setAssets] = useState<{
    books: BookTextures[];
    shared: SharedTextures;
  } | null>(null);
  const handles = useRef<(BookHandle | null)[]>([]);
  const floorRef = useRef<THREE.Mesh>(null);

  const anim = useRef({
    flyClock: -1,
    hover: books.map(() => 0),
    presence: books.map(() => 1),
    lastX: books.map(() => 0),
    centered: -1,
    panel: false,
    baseY: -1.25,
    /** Book whose leaf is visible: turning, or resting on the open cover. */
    turning: -1,
    turnT: 1,
    turnDir: 1 as 1 | -1,
    /** The page revealed once a backward turn lands. */
    pending: null as THREE.Texture | null,
    /** Pages remain turned over on the left once a backward turn lands. */
    keepLeaf: false,
    tipShown: false,
  });

  /** Puts `texture` on a book's right-hand page, disposing the reading page it replaces. */
  const setPage = (index: number, texture: THREE.Texture) => {
    const handle = handles.current[index];
    if (!handle || !assets) return;
    const old = handle.page.map;
    handle.page.map = texture;
    handle.page.needsUpdate = true;
    if (old && old !== texture && old !== assets.books[index].page)
      old.dispose();
  };
  const setLeaf = (handle: BookHandle, texture: THREE.Texture) => {
    handle.leafFront.map?.dispose();
    handle.leafFront.map = texture;
    handle.leafFront.needsUpdate = true;
  };

  useEffect(() => {
    if (!assets || !page) return;
    const handle = handles.current[page.index];
    if (!handle) return;
    const prev = shown.current;
    if (prev?.index === page.index && prev.n === page.n) return;
    shown.current = { index: page.index, n: page.n };
    const next = createReadingPage(books[page.index], page.insight, page.n);
    const c = controller.current;
    const a = anim.current;
    const turn =
      prev?.index === page.index && c.selected === page.index && c.openT > 0.5;
    a.pending?.dispose();
    a.pending = null;
    if (!turn) {
      setPage(page.index, next);
      a.turning = -1;
      return;
    }
    a.turning = page.index;
    a.turnT = 0;
    a.turnDir = page.dir;
    c.turning = true;
    if (page.dir > 0) {
      // The current page lifts off as the leaf, revealing the next one beneath.
      if (handle.page.map) setLeaf(handle, copyPageTexture(handle.page.map));
      setPage(page.index, next);
    } else {
      // A leaf comes back from the left carrying the earlier page.
      setLeaf(handle, copyPageTexture(next));
      a.pending = next;
      a.keepLeaf = page.n > 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- setPage/setLeaf only touch refs.
  }, [assets, page, books, controller]);

  useEffect(() => {
    let cancelled = false;
    const serif =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--font-serif-next")
        .trim() || "Georgia, serif";
    const fonts = [
      `600 40px ${serif}`,
      `italic 400 40px ${serif}`,
      `500 40px ${serif}`,
      `italic 500 40px ${serif}`,
    ];
    Promise.all(fonts.map((f) => document.fonts.load(f)))
      .catch(() => undefined)
      .then(() => {
        if (cancelled) return;
        setAssets({
          books: books.map((book) => createBookTextures(book, serif)),
          shared: createSharedTextures(),
        });
      });
    return () => {
      cancelled = true;
    };
  }, [books]);

  useEffect(() => {
    if (!assets) return;
    return () => {
      assets.books.forEach((set) =>
        Object.values(set).forEach((t) => t.dispose()),
      );
      Object.values(assets.shared).forEach((t) => t.dispose());
    };
  }, [assets]);

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = scenePalette.environment;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height;
    const halfTan = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const narrow = aspect < 0.8;
    const fitWidth = narrow ? 5.2 : 8.6;
    const distance = Math.max(
      narrow ? 13 : 11,
      fitWidth / (2 * halfTan * aspect),
    );
    cam.fov = FOV;
    cam.position.set(0, 0.9, distance);
    cam.lookAt(0, 0, 0);
    cam.updateProjectionMatrix();
    cam.updateMatrixWorld();

    // Stand the books on the table in the cover-cropped backdrop photo.
    const imageH = Math.max(size.height, size.width / BACKDROP_RATIO);
    const tableY = size.height / 2 + (TABLE_LINE - 0.5) * imageH;
    const ndcY = 1 - (2 * tableY) / size.height;
    const ray = new THREE.Vector3(0, ndcY, 0.5)
      .unproject(cam)
      .sub(cam.position)
      .normalize();
    const t = (BASE_Z - cam.position.z) / ray.z;
    anim.current.baseY = cam.position.y + ray.y * t;
  }, [camera, size]);

  const register = useMemo(
    () => (index: number, handle: BookHandle | null) => {
      handles.current[index] = handle;
    },
    [],
  );

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 1 / 30);
    const a = anim.current;
    const c = controller.current;
    const count = books.length;

    if (floorRef.current) floorRef.current.position.y = a.baseY;
    if (!assets) return;
    if (a.flyClock < 0) a.flyClock = 0;
    else a.flyClock += dt;

    // Only books in the active shelf filter take a slot on the table.
    const order: number[] = [];
    const slotOf: number[] = books.map(() => -1);
    for (let i = 0; i < count; i++) {
      if (c.visible[i]) {
        slotOf[i] = order.length;
        order.push(i);
      }
    }
    const slots = order.length;

    c.display = damp(c.display, c.target, 7, dt);
    if (Math.abs(c.display - c.target) < 0.0005) c.display = c.target;
    c.onDisplay?.(c.display);
    const centered =
      order[Math.min(slots - 1, Math.max(0, Math.round(c.display)))] ?? -1;
    if (centered !== a.centered) {
      a.centered = centered;
      onCenteredChange(centered);
    }

    // Open / close timeline.
    if (c.selected !== null) {
      c.openT = clamp01(c.openT + ((c.opening ? 1 : -1) * dt) / OPEN_SECONDS);
      if (!c.opening && c.openT === 0) {
        setPage(c.selected, assets.books[c.selected].page);
        a.pending?.dispose();
        a.pending = null;
        a.turning = -1;
        c.turning = false;
        shown.current = null;
        c.selected = null;
        onClosed();
      }
    }
    const panel = c.selected !== null && c.opening && c.openT >= PANEL_REVEAL;
    if (panel !== a.panel) {
      a.panel = panel;
      onPanelChange(panel);
    }
    const openT = c.openT;
    const selected = c.selected;

    // Layout: every visible book's footprint, with the centred one turned cover-forward.
    const facing = books.map((_, i) =>
      slotOf[i] < 0 ? 0 : 1 - smooth(Math.abs(slotOf[i] - c.display)),
    );
    const centers: number[] = [];
    let cursor = 0;
    for (const i of order) {
      const book = books[i];
      const footprint = lerp(
        book.thickness + GAP,
        book.width + book.thickness * SPINE_BULGE * 0.5 + COVER_MARGIN * 2,
        facing[i],
      );
      centers.push(cursor + footprint / 2);
      cursor += footprint;
    }
    const lo = Math.max(0, Math.min(slots - 1, Math.floor(c.display)));
    const hi = Math.min(slots - 1, lo + 1);
    const focusX =
      slots > 0 ? lerp(centers[lo], centers[hi], c.display - lo) : 0;

    // Where the opened book lands.
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height;
    const narrow = aspect < 0.95;
    const openZ = narrow ? 1.6 : 2.4;
    const halfTan = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    const visibleH = 2 * (cam.position.z - openZ) * halfTan;
    const visibleW = visibleH * aspect;

    const recede = easeInOut(openT / 0.5);
    const glide = easeInOut(openT / 0.62);
    const hingeT = easeInOut((openT - 0.38) / 0.62);
    if (a.turning >= 0 && a.turnT < 1) {
      a.turnT = Math.min(1, a.turnT + dt / TURN_SECONDS);
      if (a.turnT === 1) {
        c.turning = false;
        if (a.turnDir < 0) {
          if (a.pending) setPage(a.turning, a.pending);
          a.pending = null;
          if (a.keepLeaf) a.turnDir = 1;
          else a.turning = -1;
        }
      }
    }

    const pose: Pose = { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, s: 1 };
    for (let i = 0; i < count; i++) {
      const handle = handles.current[i];
      if (!handle) continue;
      const book = books[i];
      const f = facing[i];
      const slot = slotOf[i];

      a.presence[i] = damp(a.presence[i], slot >= 0 ? 1 : 0, 5, dt);
      a.hover[i] = damp(
        a.hover[i],
        c.hovered === i && selected === null ? 1 : 0,
        10,
        dt,
      );
      const lift = a.hover[i];
      if (slot >= 0) a.lastX[i] = centers[slot] - focusX;

      const spineZ =
        FRONT_Z - (book.width / 2 + (book.thickness / 2) * SPINE_BULGE);
      const coverZ = FRONT_Z - book.thickness / 2 + 0.12;
      pose.x = a.lastX[i];
      pose.y = a.baseY + book.height / 2 + 0.07 * lift;
      pose.z = lerp(spineZ, coverZ, f) + 0.12 * lift;
      pose.rx = 0;
      pose.ry = lerp(Math.PI / 2, 0, f);
      pose.rz = 0;
      pose.s = 1;

      // Fly-in from off-screen, outermost books first so the centre book lands last.
      const rank = count - 1 - Math.abs(i - (count - 1) / 2) * 2;
      const delay = c.reducedMotion
        ? 0
        : Math.max(0, rank) * (FLY_STAGGER * (12 / count));
      const flyT = c.reducedMotion ? 1 : (a.flyClock - delay) / FLY_SECONDS;
      if (flyT < 1) {
        const side = i < count / 2 ? -1 : 1;
        const p = easeOut(flyT);
        const r = easeOutBack(flyT);
        const startX = side * (9 + hash(i, 1) * 4);
        const startY = a.baseY + 3.8 + hash(i, 2) * 3;
        const startZ = 1 + hash(i, 3) * 2.5;
        pose.x = lerp(startX, pose.x, p);
        pose.y = lerp(startY, pose.y, p) + Math.sin(p * Math.PI) * 0.6;
        pose.z = lerp(startZ, pose.z, p);
        pose.rx = lerp((hash(i, 4) - 0.5) * 1.8, pose.rx, r);
        pose.ry = lerp(pose.ry + side * (1.2 + hash(i, 5)), pose.ry, r);
        pose.rz = lerp((hash(i, 6) - 0.5) * 1.4, pose.rz, r);
      }

      let opacity = flyT <= 0 ? 0 : 1;
      let hinge = 0;

      // Filtered-out books sink back into the room.
      const gone = 1 - a.presence[i];
      pose.z -= 1.6 * gone;
      pose.y -= 0.15 * gone;
      pose.s *= lerp(1, 0.92, gone);
      opacity *= 1 - smooth(gone);

      if (selected !== null) {
        if (i === selected) {
          // Sized to read: the open spread, centred on the spine, fills the space beside the panel.
          const s = narrow
            ? Math.min(
                (0.94 * visibleW) / (SPREAD * book.width),
                (0.5 * visibleH) / book.height,
              )
            : Math.min(
                (0.6 * visibleW) / (SPREAD * book.width),
                (0.72 * visibleH) / book.height,
              );
          const spineX = narrow ? 0 : -0.16 * visibleW;
          const target: Pose = {
            x: spineX + (book.width / 2) * s,
            y: narrow ? visibleH * 0.17 : -0.03 * visibleH,
            z: openZ,
            rx: -0.08,
            ry: 0,
            rz: 0,
            s,
          };
          const g = glide;
          pose.x = lerp(pose.x, target.x, g);
          pose.y = lerp(pose.y, target.y, g) + Math.sin(g * Math.PI) * 0.35;
          pose.z = lerp(pose.z, target.z, g);
          pose.rx = lerp(pose.rx, target.rx, g);
          pose.ry = lerp(pose.ry, target.ry, g);
          pose.s = lerp(pose.s, target.s, g);
          hinge = HINGE_ANGLE * hingeT;
        } else {
          pose.z -= 1.8 * recede;
          pose.y -= 0.25 * recede;
          pose.s *= lerp(1, 0.9, recede);
          opacity *= 1 - recede;
        }
      }

      const g = handle.group;
      g.position.set(pose.x, pose.y, pose.z);
      g.rotation.set(pose.rx, pose.ry, pose.rz);
      g.scale.setScalar(pose.s);
      handle.hinge.rotation.y = hinge;
      handle.leaf.visible = i === a.turning;
      if (i === a.turning) {
        const eased = easeInOut(a.turnT);
        const t = a.turnDir > 0 ? eased : 1 - eased;
        handle.leaf.rotation.y = Math.max(HINGE_ANGLE * t, hinge);
        for (const side of handle.leaf.children)
          side.position.z = LEAF_Z - LEAF_LIFT * t;
      }

      g.visible = opacity > 0.01;
      const fading = opacity < 0.999;
      for (const mat of handle.materials) {
        if (mat.transparent !== fading) {
          mat.transparent = fading;
          mat.depthWrite = !fading;
          mat.needsUpdate = true;
        }
        mat.opacity = opacity;
      }
      g.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) obj.castShadow = opacity > 0.4;
      });
    }

    const hovered = c.hovered;
    const hoverGroup =
      hovered !== null ? handles.current[hovered]?.group : null;
    if (
      hovered !== null &&
      hoverGroup?.visible &&
      selected === null &&
      a.presence[hovered] > 0.5
    ) {
      tip
        .set(
          hoverGroup.position.x,
          hoverGroup.position.y +
            (books[hovered].height / 2) * hoverGroup.scale.y +
            0.08,
          hoverGroup.position.z,
        )
        .project(camera);
      c.onHover?.(
        hovered,
        ((tip.x + 1) / 2) * size.width,
        ((1 - tip.y) / 2) * size.height,
      );
      a.tipShown = true;
    } else if (a.tipShown) {
      c.onHover?.(null, 0, 0);
      a.tipShown = false;
    }
  });

  return (
    <>
      <ambientLight
        color={scenePalette.ambient}
        intensity={scenePalette.ambientIntensity}
      />
      <directionalLight
        castShadow
        position={scenePalette.keyPosition}
        color={scenePalette.key}
        intensity={scenePalette.keyIntensity}
        shadow-mapSize={[1024, 1024]}
        shadow-radius={9}
        shadow-blurSamples={16}
        shadow-bias={-0.0008}
        shadow-normalBias={0.025}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
      />
      <directionalLight
        position={[4, 1.5, 8]}
        color={scenePalette.fill}
        intensity={scenePalette.fillIntensity}
      />

      <mesh ref={floorRef} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[40, 12]} />
        <shadowMaterial transparent opacity={scenePalette.shadowOpacity} />
      </mesh>

      {assets &&
        books.map((book, i) => (
          <Book
            key={book.id}
            book={book}
            index={i}
            textures={assets.books[i]}
            shared={assets.shared}
            onRegister={register}
            onSelect={onSelect}
            onTurn={onTurn}
            controller={controller}
          />
        ))}
    </>
  );
}

export default function BookshelfScene(props: SceneProps) {
  return (
    <Canvas
      shadows="variance"
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: FOV, position: [0, 0.2, 10], near: 0.1, far: 100 }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
      onPointerMissed={() => {
        props.controller.current.hovered = null;
        document.body.style.cursor = "";
      }}
    >
      <Shelf {...props} />
    </Canvas>
  );
}
