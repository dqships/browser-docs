(() => {
  const app = globalThis.DocsToMarkdownContent;

  function createToastContainer() {
    const existing = document.querySelector("#docs-to-markdown-toast");
    if (existing) {
      return existing;
    }

    const toast = document.createElement("div");
    toast.id = "docs-to-markdown-toast";
    toast.style.background = "rgba(17, 24, 39, 0.85)";
    toast.style.backdropFilter = "blur(12px)";
    toast.style.webkitBackdropFilter = "blur(12px)";
    toast.style.border = "1px solid rgba(55, 65, 81, 0.5)";
    toast.style.borderRadius = "12px";
    toast.style.boxShadow = "0 24px 48px rgba(0, 0, 0, 0.6)";
    toast.style.color = "#F3F4F6";
    toast.style.fontFamily = "'Inter', system-ui, sans-serif";
    toast.style.fontSize = "14px";
    toast.style.fontWeight = "600";
    toast.style.lineHeight = "1.5";
    toast.style.maxWidth = "360px";
    toast.style.opacity = "0";
    toast.style.padding = "12px 16px";
    toast.style.display = "flex";
    toast.style.alignItems = "center";
    toast.style.gap = "8px";
    toast.style.position = "fixed";
    toast.style.right = "24px";
    toast.style.top = "24px";
    toast.style.transform = "translateY(-12px) scale(0.98)";
    toast.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
    toast.style.zIndex = "2147483647";
    document.documentElement.appendChild(toast);
    return toast;
  }

  app.register("showToast", (message, kind = "info") => {
    const toast = createToastContainer();
    const isError = kind === "error";
    const isSuccess = kind === "success";
    const borderColor = isError ? "rgba(239, 68, 68, 0.5)" : isSuccess ? "rgba(16, 185, 129, 0.5)" : "rgba(0, 229, 255, 0.5)";
    const shadowColor = isError ? "rgba(239, 68, 68, 0.2)" : isSuccess ? "rgba(16, 185, 129, 0.2)" : "rgba(0, 229, 255, 0.2)";
    const dotColor = isError ? "#EF4444" : isSuccess ? "#10B981" : "#00E5FF";

    toast.style.borderColor = borderColor;
    toast.style.boxShadow = `0 24px 48px rgba(0, 0, 0, 0.6), 0 0 15px ${shadowColor}`;
    
    toast.innerHTML = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${dotColor};box-shadow:0 0 8px ${dotColor};flex-shrink:0;"></span><span>${message}</span>`;
    
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0) scale(1)";

    window.clearTimeout(toast.__docsToMarkdownTimer);
    toast.__docsToMarkdownTimer = window.setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-12px) scale(0.98)";
    }, 2800);
  });
})();
