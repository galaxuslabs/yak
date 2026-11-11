import { viteYak } from "next-yak/vite";
viteYak({
  a: 1,
  experiments: { transpilationMode: "Css" },
  b: 2,
});
viteYak({ a: 1, experiments: { transpilationMode: "Css" } });
