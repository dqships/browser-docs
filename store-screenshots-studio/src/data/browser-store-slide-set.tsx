import { browserStoreTargets } from "@/data/store-targets";
import { BrowserContextMenuSlide } from "@/slides/browser/browser-context-menu-slide";
import { BrowserHeroSlide } from "@/slides/browser/browser-hero-slide";
import { BrowserLocalSlide } from "@/slides/browser/browser-local-slide";
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
      slug: "copy-pages-fast",
      name: "Hero",
      headline: "Web page in. Markdown out.",
      Component: BrowserHeroSlide,
    },
    {
      slug: "keep-structure",
      name: "Structure",
      headline: "Content in. Chrome out.",
      Component: BrowserStructureSlide,
    },
    {
      slug: "copy-from-page-menu",
      name: "Context Menu",
      headline: "Three ways to copy.",
      Component: BrowserContextMenuSlide,
    },
    {
      slug: "tune-output",
      name: "Settings",
      headline: "Choose what gets copied.",
      Component: BrowserSettingsSlide,
    },
    {
      slug: "local-no-cloud",
      name: "Trust",
      headline: "Nothing leaves your browser.",
      Component: BrowserLocalSlide,
    },
  ],
};
