import * as prettier from "prettier";
import * as typescriptParser from "prettier/plugins/typescript";
import * as estreePlugin from "prettier/plugins/estree";
import init, { start, transform } from "./wasm";
import { resolveCss } from "./resolve-css";
import type {
  PlaygroundFile,
  TransformOptions,
  TransformedFile,
  WorkerRequest,
  WorkerResponse,
} from "./types";

const post = (message: WorkerResponse) => self.postMessage(message);

// the explicit URL makes the bundler copy the WASM file next to the worker, under the base path
const ready = init({ module_or_path: new URL("./wasm/index_bg.wasm", import.meta.url) }).then(
  () => {
    start();
    post({ type: "ready" });
  },
);

self.addEventListener("message", async (event: MessageEvent<WorkerRequest>) => {
  const { id, framework, files, options } = event.data;
  await ready;
  try {
    const compile = framework === "solid" ? await solidCompiler() : compileReact;
    post({ type: "result", id, framework, files: await transformAll(files, options, compile) });
  } catch (error) {
    post({ type: "error", id, message: error instanceof Error ? error.message : String(error) });
  }
});

type Compiled = Pick<TransformedFile, "executable" | "js" | "jsx">;
type Compile = (file: PlaygroundFile, options: TransformOptions) => Compiled;

/**
 * Each file compiles three times: CommonJS for the preview to run, and two ES modules for
 * the output panel, one with the JSX compiled and one with it kept.
 * All files compile before any CSS resolves, so a file can take constants from any other.
 */
async function transformAll(
  files: PlaygroundFile[],
  options: TransformOptions,
  compile: Compile,
): Promise<TransformedFile[]> {
  const compiled = await Promise.all(files.map((file) => compileFile(file, options, compile)));
  return Promise.all(
    compiled.map(async (file) => ({
      ...file,
      css: await resolveCss(
        file,
        compiled.filter((other) => other !== file),
      ),
    })),
  );
}

async function compileFile(
  file: PlaygroundFile,
  options: TransformOptions,
  compile: Compile,
): Promise<Omit<TransformedFile, "css">> {
  try {
    const { executable, js, jsx } = compile(file, options);
    const [prettyJs, prettyJsx] = await Promise.all([js, jsx].map(formatCode));
    return { ...file, executable, js: prettyJs, jsx: prettyJsx };
  } catch (error) {
    // SWC and Babel report a multi-line diagnostic. Its first line names the problem.
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${message.split("\n")[0].replace("x ", "").trim()} in ${file.name}.tsx`);
  }
}

const formatCode = (code: string) =>
  prettier.format(code, { parser: "typescript", plugins: [typescriptParser, estreePlugin] });

/** React: SWC compiles the JSX itself, with yak's JSX runtime for the css prop. */
const compileReact: Compile = (file, options) => ({
  executable: runSwc(file, options, { jsx: "automatic", commonjs: true, comments: true }),
  js: runSwc(file, options, { jsx: "automatic", commonjs: false, display: true }),
  jsx: runSwc(file, options, { jsx: "preserve", commonjs: false, display: true }),
});

/** Solid: SWC runs yak and keeps the JSX, then Solid's compiler turns the JSX into DOM code. */
let solidPromise: Promise<Compile> | null = null;
function solidCompiler(): Promise<Compile> {
  // Babel is large, so a React-only visit never loads it
  solidPromise ??= import("./solid-compiler").then(({ compileSolidJsx }) => (file, options) => {
    const filename = `${file.name}.tsx`;
    // the dead code elimination runs in this step, so Solid's compiler gets the shorter JSX
    const jsx = runSwc(file, options, { jsx: "preserve", commonjs: false, display: true });
    const withComments = runSwc(file, options, {
      jsx: "preserve",
      commonjs: false,
      comments: true,
    });
    return {
      executable: compileSolidJsx(withComments, filename, true),
      js: compileSolidJsx(jsx, filename, false),
      jsx,
    };
  });
  return solidPromise;
}

function runSwc(
  file: PlaygroundFile,
  options: TransformOptions,
  output: {
    jsx: "automatic" | "preserve";
    commonjs: boolean;
    comments?: boolean;
    /** true for the copies the JS and JSX tabs show, which the preview never runs */
    display?: boolean;
  },
): string {
  // The compiler puts the CSS of a component in a comment on its declaration, and the CSS
  // tab and the preview read it from the CommonJS copy. The minifier removes an unused
  // declaration together with its comment, so only the copies the tabs show are compressed.
  const compress = output.display && options.deadCodeElimination ? DEAD_CODE_ELIMINATION : false;
  const code = transform(
    file.content,
    {
      filename: `${file.name}.tsx`,
      jsc: {
        target: "es2022",
        loose: false,
        minify: { compress, mangle: false },
        // the CSS loader needs the yak comments in the CommonJS copy
        preserveAllComments: output.comments || options.showComments,
        transform: {
          // "preserve" still runs the yak transform, it only leaves the JSX as it is
          react: { runtime: output.jsx, importSource: "@yak/react" },
        },
      },
      ...(output.commonjs ? { module: { type: "commonjs" } } : {}),
      // only class names are minified, by the yak option below
      minify: false,
    },
    {
      // the file names are relative, so the base path has no effect
      basePath: "/",
      minify: options.minify,
      displayNames: !options.minify,
      foldStatic: options.foldStatic,
    },
  ).code;
  return compress ? code.replace(UNUSED_YAK_IMPORT, "") : code;
}

/**
 * A yak import without bindings, which the minifier leaves behind once it removes every use:
 * `import { css } from "@yak/react/internal";` becomes `import "@yak/react/internal";`.
 * Both packages set `"sideEffects": false`, so a bundler removes an import once no binding
 * of it is used. SWC compiles one file and cannot read that flag, so the tabs drop these lines.
 * The `.yak.css` import stays, because a bundler keeps CSS imports for their side effect.
 */
const UNUSED_YAK_IMPORT = /^import\s*(["'])@yak\/(?:react|solid)(?:\/internal)?\1;?[^\S\n]*\n?/gm;

/**
 * The compress passes that remove code, without those that rewrite the rest into a shorter
 * but harder to read form: `className={"y" + (void 0 === "l" ? " y1" : " y2")}` becomes
 * `className={"y y2"}`, and a component that no JSX uses any more disappears.
 * `compress: true` would also inline functions and constants, write `false` as `!1` and
 * turn `const` into `let`, so the output would no longer look like the source.
 */
const DEAD_CODE_ELIMINATION = {
  defaults: false,
  dead_code: true,
  evaluate: true,
  conditionals: true,
  booleans: false,
  comparisons: true,
  unused: true,
  toplevel: true,
  side_effects: true,
  const_to_let: false,
};
