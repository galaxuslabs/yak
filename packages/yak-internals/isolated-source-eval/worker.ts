/**
 * Worker thread entry point for isolated module evaluation.
 *
 * Each worker is a full Node.js environment with its own ESM module cache.
 * Modules are loaded via dynamic `import()`. Node 22.18.0+ strips TypeScript
 * types natively, so no compilation step or flags are needed.
 */
import { parentPort } from "node:worker_threads";
import { fileURLToPath, pathToFileURL } from "node:url";

/**
 * We import `registerHooks` from `node:module` instead of calling
 * `module.registerHooks()` directly. Node's strip-types parser sees the bare
 * `module` identifier as a CJS global, and combined with top-level `await`
 * (or other ESM syntax), it throws "Cannot determine intended module format".
 * Using the explicit import avoids this ambiguity entirely.
 */
import { registerHooks } from "node:module";

if (!parentPort) {
  throw new Error("This file must be run as a worker thread");
}

/**
 * Maps the absolute path of each file this worker loaded to the absolute paths
 * of the files it imports. The map lives as long as the worker. The evaluator
 * replaces the worker whenever a file in a reported graph changes, so the
 * recorded edges always match the module cache.
 */
const imports = new Map<string, Set<string>>();

/**
 * Records every resolved file as an edge from its importer.
 *
 * The resolve hook only runs when a module links for the first time, so the
 * edges of a cached module are not seen again.
 *
 * Example: `a.yak.ts` and `b.yak.ts` both import `tokens.ts`, which imports
 * `colors.ts`. When `b` is evaluated second, Node takes `tokens.ts` from its
 * cache and never resolves `colors.ts` again. Only the edges recorded for `a`
 * tell that `b` depends on `colors.ts`.
 *
 * `registerHooks()` runs the hook synchronously in this thread, and hooks
 * registered here apply to this worker only. The `parentURL` is also set for
 * `require()` calls, so CommonJS files are recorded too.
 *
 * Only `file://` URLs are recorded, so built-in `node:` modules are left out.
 * Files in `node_modules` are recorded like any other file.
 *
 * `fileURLToPath` turns a `file://` URL into an absolute path for the current
 * platform. On Windows it gives `C:\src\a.ts`, where `URL.pathname` would
 * give `/C:/src/a.ts`.
 */
registerHooks({
  resolve(specifier, context, nextResolve) {
    const result = nextResolve(specifier, context);
    if (result.url.startsWith("file://") && context.parentURL?.startsWith("file://")) {
      const importer = fileURLToPath(context.parentURL);
      let children = imports.get(importer);
      if (!children) {
        children = new Set();
        imports.set(importer, children);
      }
      children.add(fileURLToPath(result.url));
    }
    return result;
  },
});

/**
 * Returns the requested path followed by every file reachable from the entry
 * in the import graph.
 *
 * `entryUrl` is the URL that Node uses as the module key. It differs from the
 * requested path when the path goes through a symlink:
 * `apps/web/node_modules/@acme/theme/theme.yak.ts` is loaded as
 * `packages/theme/theme.yak.ts`.
 *
 * Walking from the module key gives the full list for both paths. The
 * requested path stays first, so `invalidate()` finds the entry by either one.
 */
function dependenciesOf(entryUrl: string | undefined, absolutePath: string): string[] {
  if (!entryUrl?.startsWith("file://")) return [absolutePath];
  const queue = [fileURLToPath(entryUrl)];
  const visited = new Set(queue);
  for (let i = 0; i < queue.length; i++) {
    for (const child of imports.get(queue[i]) ?? []) {
      if (!visited.has(child)) {
        visited.add(child);
        queue.push(child);
      }
    }
  }
  return [...new Set([absolutePath, ...queue])];
}

parentPort.on("message", async (msg: { type: string; id: number; absolutePath: string }) => {
  if (msg.type !== "evaluate") return;

  // The module key of the entry, see dependenciesOf
  let entryUrl: string | undefined;
  try {
    const fileUrl = pathToFileURL(msg.absolutePath).href;
    entryUrl = import.meta.resolve(fileUrl);
    // The path is only known at runtime, so bundlers must not try to resolve it
    const ns = await import(/* turbopackIgnore: true */ fileUrl);

    // Module namespace objects are exotic objects that fail structured clone
    // (postMessage would throw). Copying to a plain object is required.
    const value: Record<string, unknown> = {};
    for (const key of Object.keys(ns)) {
      value[key] = ns[key];
    }

    parentPort!.postMessage({
      type: "result",
      id: msg.id,
      ok: true,
      value,
      dependencies: dependenciesOf(entryUrl, msg.absolutePath),
    });
  } catch (err: unknown) {
    // Catches both evaluation errors (syntax errors, runtime exceptions)
    // and structured clone failures (e.g. when exports contain functions,
    // Symbols, or other non-cloneable values). Both are returned as
    // { ok: false } results — the caller does not need to distinguish.
    const error =
      err instanceof Error
        ? { message: err.message, stack: err.stack ?? "" }
        : { message: String(err), stack: "" };

    // Report the files resolved before the error, so fixing a broken import
    // re-evaluates this entry
    parentPort!.postMessage({
      type: "result",
      id: msg.id,
      ok: false,
      error,
      dependencies: dependenciesOf(entryUrl, msg.absolutePath),
    });
  }
});

parentPort.postMessage({ type: "ready" });
