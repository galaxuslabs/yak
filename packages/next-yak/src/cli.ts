#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { createInterface } from "node:readline/promises";
import { parseArgs } from "node:util";
import { CHANGE, type Change } from "./changes.ts";
import { isMigratable, migrateFile } from "./migrate.ts";
import { WARNING, type Warning, type WarningType } from "./warnings.ts";

const HELP = `Usage: npx next-yak migrate [folder] [options]

Moves a project from next-yak to @yak/react. The default folder is the current folder.

Options:
  --text       Also rename next-yak in comments, prose strings, Markdown and CSS files
               (the default when the codemod cannot ask)
  --no-text    Rename next-yak only in code
  --dry-run    Show a summary of the changes, but do not write them
  --force      Run when git has uncommitted changes, without the question
  --help       Show this help

Guide: https://yak.style/docs/migration-from-next-yak`;

const SKIP_FOLDERS = new Set([
  "node_modules",
  ".git",
  ".next",
  ".turbo",
  ".yarn",
  "dist",
  "build",
  "out",
  "coverage",
]);

const OPTIONS = {
  text: { type: "boolean", default: false },
  "no-text": { type: "boolean", default: false },
  "dry-run": { type: "boolean", default: false },
  force: { type: "boolean", default: false },
  help: { type: "boolean", default: false },
} as const;

async function main() {
  let parsed: ReturnType<typeof parseArgs<{ allowPositionals: true; options: typeof OPTIONS }>>;
  try {
    parsed = parseArgs({ allowPositionals: true, options: OPTIONS });
  } catch (error) {
    // the first sentence names the option, the rest explains a parseArgs detail
    console.error(`${(error as Error).message.split(". ")[0]}.\n\n${HELP}`);
    process.exitCode = 1;
    return;
  }
  const { values, positionals } = parsed;
  const [command, folder = "."] = positionals;
  if (values.help || command === undefined) {
    console.log(HELP);
    return;
  }
  if (command !== "migrate") {
    console.error(`Unknown command "${command}".\n\n${HELP}`);
    process.exitCode = 1;
    return;
  }

  const root = resolve(folder);
  const gitRoot = git(root, ["rev-parse", "--show-toplevel"])?.trim();
  const interactive = Boolean(process.stdin.isTTY && process.stdout.isTTY);
  if (
    gitRoot &&
    !values.force &&
    !values["dry-run"] &&
    git(root, ["status", "--porcelain", "--", "."])
  ) {
    const force =
      interactive &&
      (await ask(
        "Git shows uncommitted changes. The changes of the codemod then mix with them. Continue anyway?",
        false,
      ));
    if (!force) {
      console.error("Commit or stash your changes first, or use --force.");
      process.exitCode = 1;
      return;
    }
  }

  // without a terminal, the codemod renames the old names in comments and docs too
  const text =
    values.text ||
    (!values["no-text"] &&
      (!interactive ||
        (await ask(
          "Also rename next-yak in comments, prose strings, Markdown and CSS files?",
          true,
        ))));
  const options = { text };
  const files = (gitRoot && gitFiles(root)) || walk(root);
  let changed = 0;
  const changes = new Map<Change, number>();
  const warnings: Warning[] = [];
  for (const file of files.filter((file) => isMigratable(file, options))) {
    const path = join(root, file);
    let code: string;
    try {
      code = readFileSync(path, "utf8");
    } catch {
      continue;
    }
    const result = migrateFile(file, code, options);
    warnings.push(...result.warnings);
    if (result.code === code) continue;
    changed++;
    for (const type of result.changes) changes.set(type, (changes.get(type) ?? 0) + 1);
    if (!values["dry-run"]) writeFileSync(path, result.code);
  }

  printSummary(changed, changes, values["dry-run"]);
  if (warnings.length) printWarnings(warnings, options.text);
  if (changed && !values["dry-run"]) {
    const steps = [
      ...(warnings.length
        ? ["Fix the places that the codemod cannot migrate. The list is above."]
        : []),
      "Run your package manager to install the new @yak packages.",
      "Start your project and make sure that the styles show.",
    ];
    console.log(`\nNext steps:\n${steps.map((step, i) => `  ${i + 1}. ${step}`).join("\n")}`);
    console.log(
      "\nIf something does not work after the migration, open an issue: https://github.com/galaxuslabs/yak/issues/new",
    );
  }
}

/** asks a yes or no question in the terminal, Enter gives the default answer */
async function ask(question: string, defaultAnswer: boolean): Promise<boolean> {
  const readline = createInterface({ input: process.stdin, output: process.stdout });
  // Ctrl+C or Ctrl+D stops the codemod before it changes a file
  const cancel = () => {
    readline.close();
    console.log("\nThe codemod stopped. It changed no files.");
    process.exit(130);
  };
  readline.on("SIGINT", cancel);
  const choices = defaultAnswer ? "[Y/n] (default: Y)" : "[y/N] (default: N)";
  try {
    for (;;) {
      // a closed input ends the question with an error
      const answer = (await readline.question(`${question} ${choices} `).catch(cancel))!.trim();
      if (answer === "") return defaultAnswer;
      if (/^y$/i.test(answer)) return true;
      if (/^n$/i.test(answer)) return false;
      console.log(
        `Type "y" for yes or "n" for no. Press Enter for ${defaultAnswer ? "yes" : "no"}.`,
      );
    }
  } finally {
    readline.close();
  }
}

const count = (value: number) => value.toLocaleString("en-US");
const plural = (value: number, noun: string) => `${count(value)} ${noun}${value === 1 ? "" : "s"}`;

/** prints the number of changed files for each type of change */
function printSummary(changed: number, changes: Map<Change, number>, dryRun: boolean) {
  console.log(`\n${plural(changed, "file")} ${dryRun ? "would change" : "changed"}:`);
  const width = count(Math.max(0, ...changes.values())).length;
  for (const type of Object.values(CHANGE)) {
    const files = changes.get(type);
    if (files) console.log(`  ${count(files).padStart(width)}  ${type}`);
  }
  if (dryRun) console.log("\nThis was a dry run. The codemod wrote no files.");
}

/** prints the places that the user must change, grouped by the kind of code and the reason */
function printWarnings(warnings: Warning[], text: boolean) {
  const groups = new Map<WarningType, Warning[]>();
  for (const warning of warnings)
    groups.set(warning.type, [...(groups.get(warning.type) ?? []), warning]);
  const files = new Set(warnings.map((warning) => warning.location.replace(/:\d+$/, ""))).size;
  console.log(
    `\n${plural(files, "file")} ${files === 1 ? "needs" : "need"} your help. The codemod cannot migrate these parts:`,
  );
  for (const type of Object.values(WARNING) as WarningType[]) {
    const group = groups.get(type);
    if (!group) continue;
    console.log(`\n${count(group.length)} ${group.length === 1 ? type.one : type.many}`);
    console.log(`  ${type.reason}`);
    if (!text && type.textMode)
      console.log("  The codemod changes these too when you run it again with `--text`.");
    for (const { location, detail } of group)
      console.log(`    ${location}${detail ? `  ${detail}` : ""}`);
  }
}

function git(cwd: string, args: string[]): string | null {
  try {
    return execFileSync("git", args, {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      // the file list of a large monorepo is bigger than the default of 1 MB
      maxBuffer: 1024 * 1024 * 1024,
    });
  } catch {
    return null;
  }
}

/** the tracked and untracked files that git does not ignore, or null when git fails */
function gitFiles(root: string): string[] | null {
  const output = git(root, ["ls-files", "-z", "--cached", "--others", "--exclude-standard"]);
  return output === null ? null : [...new Set(output.split("\0").filter(Boolean))];
}

function walk(root: string, dir = root): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_FOLDERS.has(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(root, path));
    // the file patterns use `/`, as in the file list of git
    else if (entry.isFile()) files.push(relative(root, path).split(sep).join("/"));
  }
  return files;
}

await main();
