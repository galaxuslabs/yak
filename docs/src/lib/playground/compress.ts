import { deflateSync, inflateSync, strFromU8, strToU8 } from "fflate";
import { fromUint8Array, toUint8Array } from "js-base64";
import * as dict1 from "./share-dictionaries/dict-1";
import { decodeLegacyLink } from "./share-dictionaries/legacy-v0";

/**
 * Encodes the playground files for the `?q=` share link.
 *
 * A link is one dictionary id char followed by the raw deflate of the files
 * in base64url without padding:
 * `{ index: "…", other: "…" }` -> `index\0…\0other\0…` -> `?q=1<base64url>`
 *
 * Deflate gets a preset dictionary that already holds the playground
 * examples, so a link stores only what differs from them.
 * Each dictionary is frozen once released. Old links name their dictionary
 * in the first char and keep decoding after the examples change.
 *
 * Ids are `1`-`9`, then `a`-`z`. `H` is never an id: links from before the
 * preset dictionaries are base64 gzip and always start with `H4sI`.
 */

/** Frozen dictionaries by id. Never edit or remove an entry. */
const dictionaries = {
  "1": strToU8(dict1.dictionary),
} as const satisfies Record<string, Uint8Array>;

/** The dictionary that new links use: the newest one. Must be a key of `dictionaries`. */
const CURRENT_ID: keyof typeof dictionaries = "1";

const LEGACY_PREFIX = "H4sI";

/** Separates file names and contents in the payload, as in the dictionaries */
const SEPARATOR = "\0";

export const compressWithDictionary = (files: Record<string, string>): string => {
  const payload = Object.entries(files).flat().join(SEPARATOR);
  const deflated = deflateSync(strToU8(payload), {
    level: 9,
    dictionary: dictionaries[CURRENT_ID],
  });
  return CURRENT_ID + fromUint8Array(deflated, true);
};

/** Throws when the link names an unknown dictionary or its data is corrupt */
export const decompressWithDictionary = (q: string): Record<string, string> => {
  if (q.startsWith(LEGACY_PREFIX)) {
    return decodeLegacyLink(q);
  }
  const id = q[0];
  // The id comes from the URL and may be any char
  const dictionary = (dictionaries as Record<string, Uint8Array | undefined>)[id];
  if (!dictionary) {
    throw new Error(`Unknown share link dictionary: ${id}`);
  }
  const parts = strFromU8(inflateSync(toUint8Array(q.slice(1)), { dictionary })).split(SEPARATOR);
  if (parts.length % 2 !== 0) {
    throw new Error("Share link payload has a file name without content");
  }
  const files: Record<string, string> = {};
  for (let i = 0; i < parts.length; i += 2) {
    files[parts[i]] = parts[i + 1];
  }
  return files;
};
