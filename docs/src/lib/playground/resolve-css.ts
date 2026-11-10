import {
  parseExports,
  parseModule,
  resolveCrossFileConstant,
  type ParseContext,
} from "@yak/react/cross-file-resolver";

type PlaygroundFile = { name: string; content: string; executable: string };

const CSS_COMMENT_START = "/*YAK Extracted CSS:\n";

/**
 * Resolves the CSS of `entry` with @yak/react's cross-file resolver against an in-memory
 * file system, so constants from other files and `.yak` files resolve as in a real build.
 * `.yak` files run in the browser instead of the Node worker that the bundler loaders use.
 */
export async function resolveCss(entry: PlaygroundFile, others: PlaygroundFile[]): Promise<string> {
  const entryPath = `/src/${entry.name}.tsx`;
  const files = new Map(others.map((file) => [`/src/./${file.name}.tsx`, file]));
  files.set(entryPath, entry);

  const getFile = (path: string) => {
    const file = files.get(path);
    if (!file) throw new Error(`File not found: ${path}`);
    return file;
  };

  const parseContext: ParseContext = {
    cache: { parse: new Map() },
    extractExports: (path) => parseExports(getFile(path).content),
    getTransformed: (path) => ({ code: getFile(path).executable }),
    evaluateYakModule(path) {
      const exports: Record<string, unknown> = {};
      const require = (request: string) => {
        throw Error(`Module not found: ${request}.`);
      };
      new Function("exports", "require", getFile(path).executable)(exports, require);
      return exports;
    },
  };

  const css = entry.executable
    .split(CSS_COMMENT_START)
    .slice(1)
    .map((part) => part.split("*/")[0])
    .join("");

  const { resolved } = await resolveCrossFileConstant(
    {
      parse: (path) => parseModule(parseContext, path),
      resolve: (specifier, importer) =>
        `${importer.slice(0, importer.lastIndexOf("/"))}/${specifier}.tsx`,
    },
    entryPath,
    css,
  );
  return resolved;
}
