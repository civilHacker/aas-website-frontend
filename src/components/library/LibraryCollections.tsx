"use client";

import { useMemo, useState, type ReactNode } from "react";
import { LibrarySection } from "./LibrarySection";
import type { LibraryBook, ShelfId } from "./books";

const collections: ShelfId[] = ["arabic", "sufism", "islamic"];

/**
 * The hero shelf followed by one section per collection. While a book is open,
 * the collections after it are hidden so its details lead straight to the footer.
 */
export function LibraryCollections({
  header,
  books,
}: {
  header: ReactNode;
  books: LibraryBook[];
}) {
  const [open, setOpen] = useState<ShelfId | "all" | null>(null);
  const cutoff =
    open === null ? Infinity : collections.indexOf(open as ShelfId);

  const track = useMemo(() => {
    const make = (id: ShelfId | "all") => (shown: boolean) =>
      setOpen((current) => (shown ? id : current === id ? null : current));
    return {
      all: make("all"),
      ...Object.fromEntries(collections.map((id) => [id, make(id)])),
    } as Record<ShelfId | "all", (shown: boolean) => void>;
  }, []);

  return (
    <>
      <LibrarySection header={header} books={books} onDetailsChange={track.all} />
      {collections.map((id, i) => (
        <div key={id} hidden={i > cutoff}>
          <LibrarySection shelf={id} books={books} onDetailsChange={track[id]} />
        </div>
      ))}
    </>
  );
}
