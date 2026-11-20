import github from "@changesets/changelog-github";

type Options = Record<string, unknown> & { template?: string; maintainers?: string[] };

// Separates the authors from the rendered template, since the template language has no conditionals.
const AUTHORS_MARKER = "\u0000";

const changelog: typeof github = {
  getReleaseLine: async (changeset, type, options: Options | null) => {
    const template = options?.template ?? "\n- {summary} {ref}";
    const line = await github.getReleaseLine(changeset, type, {
      ...options,
      template: `${template}${AUTHORS_MARKER}{authors}`,
    });
    const maintainers = new Set((options?.maintainers ?? []).map((name) => name.toLowerCase()));
    return line.replace(new RegExp(`${AUTHORS_MARKER}(.*)`), (_, authors: string) => {
      const contributors = [...authors.matchAll(/\[@([^\]]+)\]\(([^)]*)\)/g)]
        .filter(([, name, url]) => !maintainers.has(name.toLowerCase()) && !url.includes("/apps/"))
        .map(([, name]) => `@${name}`);
      return contributors.length === 0 ? "" : ` Thanks ${contributors.join(", ")}!`;
    });
  },
  // Lists only the new versions of updated dependencies. The default line also links every commit of the dependency, which its own changelog already shows.
  getDependencyReleaseLine: async (_changesets, dependencies) =>
    dependencies.length === 0
      ? ""
      : [
          "- Updated dependencies:",
          ...dependencies.map((dependency) => `  - ${dependency.name}@${dependency.newVersion}`),
        ].join("\n"),
};

export default changelog;
