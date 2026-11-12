import type MagicString from "magic-string";

export interface Item {
  start: number;
  end: number;
  /** where the item starts with its leading comments, defaults to `start` */
  leadingStart?: number;
}

/**
 * Removes items of a comma separated list (object properties, array elements) together with
 * their commas, and keeps the layout of the items that stay. `open` and `close` are the
 * offsets right after the opening and right before the closing bracket.
 */
export function removeItems(
  edits: MagicString,
  list: Item[],
  remove: Item[],
  open: number,
  close: number,
) {
  if (list.every((item) => remove.includes(item))) {
    edits.remove(open, close);
    return;
  }
  for (let i = 0; i < list.length; i++) {
    if (!remove.includes(list[i])) continue;
    // a run of removed items ends at the next kept one, or at the end of the list
    let last = i;
    while (last + 1 < list.length && remove.includes(list[last + 1])) last++;
    const next = list[last + 1];
    if (next) {
      edits.remove(list[i].leadingStart ?? list[i].start, next.leadingStart ?? next.start);
    } else {
      edits.remove(list[i - 1].end, list[last].end);
    }
    i = last;
  }
}
