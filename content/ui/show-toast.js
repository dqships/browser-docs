(() => {
  const app = globalThis.WebToMarkdownContent;

  // Page fonts are unknown here, so the toast uses system faces with the
  // brand colors and square geometry from /DESIGN.md.
  const COLORS = {
    paper: "#F2EEE5",
    ink: "#151412",
    signal: "#E2401C",
    signalText: "#B5300F"
  };

  function createToastContainer() {
    const existing = document.querySelector("#web-to-markdown-toast");
    if (existing) {
      return existing;
    }

    const toast = document.createElement("div");
    toast.id = "web-to-markdown-toast";
    toast.setAttribute("role", "status");
    Object.assign(toast.style, {
      alignItems: "center",
      background: COLORS.paper,
      border: `1px solid ${COLORS.ink}`,
      borderRadius: "0",
      boxShadow: `4px 4px 0 ${COLORS.ink}`,
      color: COLORS.ink,
      display: "flex",
      fontFamily: "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace",
      fontSize: "13px",
      fontWeight: "500",
      gap: "10px",
      lineHeight: "1.4",
      maxWidth: "360px",
      opacity: "0",
      padding: "11px 14px",
      position: "fixed",
      right: "24px",
      top: "24px",
      transform: "translateY(-8px)",
      transition: "opacity 120ms linear, transform 120ms linear",
      zIndex: "2147483647"
    });
    document.documentElement.appendChild(toast);
    return toast;
  }

  function createMarker(kind) {
    const marker = document.createElement("span");
    const isError = kind === "error";
    Object.assign(marker.style, {
      background: isError ? COLORS.paper : COLORS.signal,
      border: `2px solid ${isError ? COLORS.signalText : COLORS.signal}`,
      boxSizing: "border-box",
      display: "inline-block",
      flexShrink: "0",
      height: "10px",
      width: "10px"
    });
    return marker;
  }

  app.register("showToast", (message, kind = "info") => {
    const toast = createToastContainer();
    const label = document.createElement("span");
    label.textContent = message;

    toast.style.color = kind === "error" ? COLORS.signalText : COLORS.ink;
    toast.replaceChildren(createMarker(kind), label);
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";

    window.clearTimeout(toast.__webtoMarkdownTimer);
    toast.__webtoMarkdownTimer = window.setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-8px)";
    }, 2800);
  });
})();
