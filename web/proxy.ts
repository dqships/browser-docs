import { NextResponse, type NextRequest } from "next/server";
import { createHomeMarkdown } from "@/lib/agents/home-markdown";
import { markdownResponse } from "@/lib/agents/markdown-response";
import { createNotFoundMarkdown } from "@/lib/agents/not-found-markdown";
import { prefersMarkdown } from "@/lib/agents/prefers-markdown";
import { site } from "@/lib/site";

/** Pages that exist and stay HTML for agents. Blog posts are checked by Next.js itself. */
const htmlPaths = new Set(site.staticPages.map((page) => page.pathname));

/**
 * Content negotiation for agents. A request that prefers text/markdown gets the
 * home page as Markdown, or a Markdown 404 for a path with no page. Other pages
 * keep serving HTML. Browsers always get HTML.
 */
export function proxy(request: NextRequest) {
  if (!prefersMarkdown(request.headers.get("accept"))) {
    return NextResponse.next({ headers: { Vary: "Accept" } });
  }
  const path = request.nextUrl.pathname.replace(/\/+$/, "") || "/";
  if (path === "/") return markdownResponse(createHomeMarkdown());
  if (htmlPaths.has(path) || path.startsWith("/blog/")) {
    return NextResponse.next({ headers: { Vary: "Accept" } });
  }
  return markdownResponse(createNotFoundMarkdown(path), 404);
}

export const config = {
  // Pages only: skip Next internals, Vercel routes, and files with an extension.
  matcher: ["/((?!_next/|_vercel/|og/|.*\\.[\\w]+$).*)"],
};
