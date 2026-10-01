import { marked, type Tokens } from "marked";
import { slugify } from "./slugify";

export type TocEntry = { id: string; text: string; depth: number };

/** Renders Markdown to HTML with stable heading ids, plus a flat table of contents (## and ### only). */
export function renderMarkdownWithToc(body: string): { html: string; toc: TocEntry[] } {
  const usedIds = new Set<string>();
  const toUniqueId = (text: string) => {
    const base = slugify(text) || "section";
    let id = base;
    let suffix = 2;
    while (usedIds.has(id)) {
      id = `${base}-${suffix++}`;
    }
    usedIds.add(id);
    return id;
  };

  const toc: TocEntry[] = [];
  const renderer = new marked.Renderer();
  renderer.heading = function (token: Tokens.Heading) {
    const text = this.parser.parseInline(token.tokens);
    const id = toUniqueId(token.text);
    if (token.depth >= 2 && token.depth <= 3) {
      toc.push({ id, text: token.text, depth: token.depth });
    }
    return `<h${token.depth} id="${id}">${text}</h${token.depth}>\n`;
  };

  const html = marked.parse(body, { renderer }) as string;
  return { html, toc };
}
