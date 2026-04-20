(() => {
  if (globalThis.WebToMarkdownContent) {
    return;
  }

  const registry = new Map();

  globalThis.WebToMarkdownContent = {
    has(name) {
      return registry.has(name);
    },
    register(name, value) {
      registry.set(name, value);
      return value;
    },
    require(name) {
      if (!registry.has(name)) {
        throw new Error(`Web to Markdown content dependency missing: ${name}`);
      }

      return registry.get(name);
    }
  };
})();
