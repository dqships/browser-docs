import type { StoreSize } from "@/types/slide-definition";

export const browserStoreTargets = [
  {
    label: 'Browser store 1280x800',
    width: 1280,
    height: 800,
  },
] as const satisfies readonly StoreSize[];

export const macAppStoreTargets = [
  {
    label: "Mac App Store 2880x1800",
    width: 2880,
    height: 1800,
  },
  {
    label: "Mac App Store 2560x1600",
    width: 2560,
    height: 1600,
  },
  {
    label: "Mac App Store 1440x900",
    width: 1440,
    height: 900,
  },
  {
    label: "Mac App Store 1280x800",
    width: 1280,
    height: 800,
  },
] as const satisfies readonly StoreSize[];
