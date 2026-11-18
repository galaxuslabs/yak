import * as swc from "@swc/core";
import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const generatedDir = join(dirname(fileURLToPath(import.meta.url)), "generated");
mkdirSync(generatedDir, { recursive: true });

export type Lib = "yak" | "styled-components";

export const libs = ["yak", "styled-components"] as const;

export const styledIdentFor = (lib: Lib) => (lib === "yak" ? "styledYak" : "styled");

// Each library gets its own idiomatic form of a conditional declaration:
// a `css` block (a class toggle) for yak and a CSS string for styled-components
export const conditionalDecl = (lib: Lib) => (predicate: string, decls: string) =>
  lib === "yak"
    ? `\${(p) => ${predicate} && css\`${decls}\`}`
    : `\${(p) => ${predicate} && '${decls.replace(/\n\s*/g, " ")}'}`;

// One interpolation with a ternary chain instead of one interpolation per branch,
// so the runtime calls one function
export const branch = (lib: Lib) => (branches: ReadonlyArray<{ when: string; decls: string }>) => {
  const formatValue = (decls: string) =>
    lib === "yak" ? `css\`${decls}\`` : `'${decls.replace(/\n\s*/g, " ")}'`;
  const chain = branches.reduceRight(
    (acc, { when, decls }) => `${when} ? ${formatValue(decls)} : ${acc}`,
    "false",
  );
  return `\${(p) => ${chain}}`;
};

export const importHeader = (lib: Lib, withCss = true) => {
  const styled = styledIdentFor(lib);
  if (lib === "yak") {
    return `import ${withCss ? `{ styled as ${styled}, css }` : `{ styled as ${styled} }`} from '@yak/react';`;
  }
  return `import ${withCss ? `{ ${styled}, css }` : `{ ${styled} }`} from 'styled-components';`;
};

// tsdown does not run the yak loader, so the yak source is compiled here.
// The benchmarks have no CSS pipeline, so the CSS import goes away and the
// class names become string literals.
function compileYak(source: string): string {
  return (
    "// @ts-nocheck\n" +
    swc
      .transformSync(source, {
        filename: "/foo/index.tsx",
        jsc: {
          experimental: {
            plugins: [[require.resolve("@yak/swc"), { basePath: "/foo/" }]],
          },
          target: "es2022",
          loose: false,
          minify: { compress: false, mangle: false },
          preserveAllComments: true,
        },
        minify: false,
        isModule: true,
      })
      .code.replace(/import[^;\n]+yak.css";/, "")
      .replace(/__styleYak.(\w+)/g, `"$1"`)
      .replace(/(from\s+["']\.\/[\w-]+\.yak)(["'])/g, "$1.compiled$2")
  );
}

export function writeBenchmarkSource(benchmarkName: string, lib: Lib, source: string): void {
  const sourcePath = join(generatedDir, `${benchmarkName}.${lib}.tsx`);
  writeFileSync(sourcePath, source);
  console.log(`${benchmarkName}.${lib}.tsx`);

  if (lib === "yak") {
    const compiledPath = join(generatedDir, `${benchmarkName}.${lib}.compiled.tsx`);
    writeFileSync(compiledPath, compileYak(source));
    console.log(`${benchmarkName}.${lib}.compiled.tsx`);
  }
}
