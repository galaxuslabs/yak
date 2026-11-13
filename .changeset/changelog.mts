import github from "@changesets/changelog-github";

// Lists only the new versions of updated dependencies. The default line also links every commit of the dependency, which its own changelog already shows.
const changelog: typeof github = {
  getReleaseLine: github.getReleaseLine,
  getDependencyReleaseLine: async (_changesets, dependencies) =>
    dependencies.length === 0
      ? ""
      : [
          "- Updated dependencies:",
          ...dependencies.map((dependency) => `  - ${dependency.name}@${dependency.newVersion}`),
        ].join("\n"),
};

export default changelog;
