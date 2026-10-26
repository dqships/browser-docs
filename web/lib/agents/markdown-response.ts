/** A text/markdown response. `Vary: Accept` because the same URL can also serve HTML. */
export function markdownResponse(body: string, status = 200): Response {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control":
        status === 200
          ? "public, s-maxage=3600, stale-while-revalidate=86400"
          : "public, max-age=0, must-revalidate",
      Vary: "Accept",
    },
  });
}
