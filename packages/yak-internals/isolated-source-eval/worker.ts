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
 * Absolute paths of the project files resolved since the last `takeDeps()` call
 */
const trackedDeps = new Set<string>();

/**
 * Records every resolved project file to build the dependency list.
 *
 * `registerHooks()` runs the hook synchronously in this thread, so it writes
 * to `trackedDeps` directly. Hooks registered here apply to this worker only,
 * which keeps each worker's `trackedDeps` and module cache separate from the
 * others.
 *
 * Only `file://` URLs outside of `node_modules` are tracked. Node built-ins
 * (`node:*`) and third-party packages are excluded because consumers only
 * need to invalidate on project source file changes.
 *
 * `fileURLToPath` converts `file://` URLs into platform-correct absolute
 * paths (avoids the leading-slash issue `URL.pathname` has on Windows).
 */
registerHooks({
  resolve(specifier, context, nextResolve) {
    const result = nextResolve(specifier, context);
    if (result.url.startsWith("file://") && !result.url.includes("/node_modules/")) {
      trackedDeps.add(fileURLToPath(result.url));
    }
    return result;
  },
});

/**
 * Returns the dependencies tracked since the last call and clears the set.
 *
 * Called after each `import()` completes, so dependencies are scoped to the
 * most recent evaluation. This is safe because evaluations are
 * serialized: only one runs at a time per worker.
 */
function takeDeps(): string[] {
  const list = [...trackedDeps];
  trackedDeps.clear();
  return list;
}

parentPort.on("message", async (msg: { type: string; id: number; absolutePath: string }) => {
  if (msg.type !== "evaluate") return;

  try {
    const fileUrl = pathToFileURL(msg.absolutePath).href;
    // The path is only known at runtime, so bundlers must not try to resolve it
    const ns = await import(/* turbopackIgnore: true */ fileUrl);

    const deps = takeDeps();

    // The entry point may not appear in the dependency set
    // if it was already in the ESM cache from a previous evaluation.
    // The resolve hook only fires on cache misses.
    if (!deps.includes(msg.absolutePath)) {
      deps.unshift(msg.absolutePath);
    }

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
      dependencies: deps,
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

    // Flush partial dependencies that the resolve hook tracked before the
    // error. This allows the evaluator to register them in the reverse
    // dep map so that fixing the broken file triggers re-evaluation.
    const deps = takeDeps();
    if (!deps.includes(msg.absolutePath)) {
      deps.unshift(msg.absolutePath);
    }

    parentPort!.postMessage({
      type: "result",
      id: msg.id,
      ok: false,
      error,
      dependencies: deps,
    });
  }
});

parentPort.postMessage({ type: "ready" });
