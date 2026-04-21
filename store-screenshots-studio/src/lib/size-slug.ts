import type { StoreSize } from "@/types/slide-definition";

export function sizeSlug(size: StoreSize) {
  return `${size.width}x${size.height}`;
}
