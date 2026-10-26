import { createHomeMarkdown } from "@/lib/agents/home-markdown";
import { markdownResponse } from "@/lib/agents/markdown-response";

export const dynamic = "force-static";

export function GET() {
  return markdownResponse(createHomeMarkdown());
}
