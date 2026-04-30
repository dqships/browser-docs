import { cache } from "react";
import { headers } from "next/headers";
import { detectPreferredDownloadTarget } from "@/lib/download-targets";

export const getRequestDownloadTarget = cache(async () => {
  const userAgent = (await headers()).get("user-agent") ?? "";
  return detectPreferredDownloadTarget(userAgent);
});
