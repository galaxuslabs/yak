import { describe, expect, it, vi } from "vitest";
import { compressWithDictionary, currentExampleFiles, decompressWithDictionary } from "./compress";
import { DEFAULT_FRAMEWORK, frameworks } from "./frameworks";
import dict1Links from "./share-dictionaries/dict-1.fixtures.json";
import legacyLinks from "./share-dictionaries/legacy-v0.fixtures.json";

// The dictionaries hold image paths without a base path, see the header of dict-1.ts
// examples.ts reads the base path when it loads, so it is imported after the stub
vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
const { examples } = await import("./examples");

/** The example of each framework as a share link record, the default framework last */
const currentExamples = () =>
  [...frameworks]
    .sort((a, b) => Number(a === DEFAULT_FRAMEWORK) - Number(b === DEFAULT_FRAMEWORK))
    .map((framework) =>
      Object.fromEntries(examples[framework].map((file) => [file.name, file.content])),
    );

describe("legacy links", () => {
  for (const [name, { q, files }] of Object.entries(legacyLinks)) {
    it(`decodes the ${name} link`, () => {
      expect(decompressWithDictionary(q).files).toEqual(files);
    });
  }
});

describe("dictionary 1 links", () => {
  // Fails after any edit to dict-1.ts or to the payload format: both break existing ?q=1… links
  for (const [name, { q, files }] of Object.entries(dict1Links)) {
    it(`decodes the ${name} link`, () => {
      expect(decompressWithDictionary(q).files).toEqual(files);
    });
  }
});

describe("current dictionary", () => {
  it("matches the playground examples", () => {
    // Fails after an edit to examples.ts. Old links depend on the frozen
    // dictionaries, so never edit a released one: copy the newest to the next
    // id with the new examples, register it in compress.ts and bump CURRENT_ID
    expect(currentExampleFiles).toEqual(currentExamples());
  });

  it("round-trips each example into a short link", () => {
    for (const files of currentExamples()) {
      const q = compressWithDictionary(files);
      expect(q.length).toBeLessThan(50);
      expect(decompressWithDictionary(q).files).toEqual(files);
    }
  });

  it("rejects an unknown dictionary id", () => {
    expect(() => decompressWithDictionary("zAAAA")).toThrow("Unknown share link dictionary: z");
  });
});
