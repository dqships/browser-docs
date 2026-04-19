(() => {
  if (globalThis.DocsToMarkdownContent) {
    return;
  }

  const registry = new Map();

  globalThis.DocsToMarkdownContent = {
    has(name) {
      return registry.has(name);
    },
    register(name, value) {
      registry.set(name, value);
      return value;
    },
    require(name) {
      if (!registry.has(name)) {
        throw new Error(`Docs to Markdown content dependency missing: ${name}`);
      }

      return registry.get(name);
    }
  };
})();
