import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isLocalHost } from "@/lib/is-local-host";

export default async function StoreScreenshotsPage() {
  const requestHeaders = await headers();

  if (!isLocalHost(requestHeaders.get("host"))) {
    notFound();
  }

  const { default: StoreScreenshotsClient } = await import(
    "./StoreScreenshotsClient"
  );

  return <StoreScreenshotsClient />;
}
