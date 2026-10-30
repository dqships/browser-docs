import { browserStoreTargets } from "@/data/store-targets";
import { BrowserContextMenuSlide } from "@/slides/browser/browser-context-menu-slide";
import { BrowserHeroSlide } from "@/slides/browser/browser-hero-slide";
import { BrowserHistorySlide } from "@/slides/browser/browser-history-slide";
import { BrowserSettingsSlide } from "@/slides/browser/browser-settings-slide";
import { BrowserStructureSlide } from "@/slides/browser/browser-structure-slide";
import type { SlideSetDefinition } from "@/types/slide-definition";

export const browserStoreSlideSet: SlideSetDefinition = {
  id: "browser-store",
  label: "Browser Store Set",
  summary: "Five full-bleed 16:10 screenshots sized for Chrome Web Store and Firefox AMO.",
  description:
    "Chrome allows up to 5 screenshots at 1280x800. Firefox recommends 1280x800 with a 1.6:1 ratio.",
  storeTargets: browserStoreTargets,
  slides: [
    {
      slug: "copy-or-download",
      name: "Hero",
      headline: "Copy it or download it.",
      Component: BrowserHeroSlide,
    },
    {
      slug: "keep-structure",
      name: "Structure",
      headline: "Content in. Chrome out.",
      Component: BrowserStructureSlide,
    },
    {
      slug: "page-menu",
      name: "Context Menu",
      headline: "Right-click. Copy or save.",
      Component: BrowserContextMenuSlide,
    },
    {
      slug: "copy-history",
      name: "History",
      headline: "Every copy, kept on your device.",
      Component: BrowserHistorySlide,
    },
    {
      slug: "tune-output",
      name: "Settings",
      headline: "Choose what gets copied.",
      Component: BrowserSettingsSlide,
    },
  ],
};
