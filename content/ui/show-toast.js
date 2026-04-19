(() => {
  const app = globalThis.DocsToMarkdownContent;

  function createToastContainer() {
    const existing = document.querySelector("#docs-to-markdown-toast");
    if (existing) {
      return existing;
    }

    const toast = document.createElement("div");
    toast.id = "docs-to-markdown-toast";
    toast.style.background = "#101714";
    toast.style.borderRadius = "14px";
    toast.style.boxShadow = "0 16px 32px rgba(0, 0, 0, 0.28)";
    toast.style.color = "#fff";
    toast.style.font = "600 14px/1.4 system-ui, sans-serif";
    toast.style.maxWidth = "360px";
    toast.style.opacity = "0";
    toast.style.padding = "12px 14px";
    toast.style.position = "fixed";
    toast.style.right = "20px";
    toast.style.top = "20px";
    toast.style.transform = "translateY(-8px)";
    toast.style.transition = "opacity 140ms ease, transform 140ms ease";
    toast.style.zIndex = "2147483647";
    document.documentElement.appendChild(toast);
    return toast;
  }

  app.register("showToast", (message, kind = "info") => {
    const toast = createToastContainer();
    const background =
      kind === "error" ? "#7f251c" : kind === "success" ? "#174c2e" : "#101714";

    toast.style.background = background;
    toast.textContent = message;
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";

    window.clearTimeout(toast.__docsToMarkdownTimer);
    toast.__docsToMarkdownTimer = window.setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-8px)";
    }, 2200);
  });
})();
