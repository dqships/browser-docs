import { macAppStoreTargets } from "@/data/store-targets";
import { MacosHeroSlide } from "@/slides/macos/macos-hero-slide";
import { MacosPrivateSlide } from "@/slides/macos/macos-private-slide";
import { MacosSettingsSlide } from "@/slides/macos/macos-settings-slide";
import { MacosWorkflowSlide } from "@/slides/macos/macos-workflow-slide";
import { MacosWrapperSlide } from "@/slides/macos/macos-wrapper-slide";
import type { SlideSetDefinition } from "@/types/slide-definition";

export const macosStoreSlideSet: SlideSetDefinition = {
  id: "macos-app-store",
  label: "macOS App Store Set",
  summary:
    "Five 16:10 screenshots sized for Mac App Store submission and aligned with Safari wrapper review expectations.",
  description:
    "Apple accepts Mac screenshots in 16:10 at 1280x800, 1440x900, 2560x1600, or 2880x1800.",
  storeTargets: macAppStoreTargets,
  slides: [
    {
      slug: "safari-docs-to-markdown",
      name: "Hero",
      headline: "Copy Safari docs as Markdown.",
      Component: MacosHeroSlide,
    },
    {
      slug: "open-copy-paste",
      name: "Workflow",
      headline: "Copy the page. Paste anywhere.",
      Component: MacosWorkflowSlide,
    },
    {
      slug: "shape-output",
      name: "Settings",
      headline: "Choose what gets copied.",
      Component: MacosSettingsSlide,
    },
    {
      slug: "native-wrapper",
      name: "Wrapper",
      headline: "Turn it on in Safari.",
      Component: MacosWrapperSlide,
    },
    {
      slug: "private-by-design",
      name: "Privacy",
      headline: "Your docs stay on your Mac.",
      Component: MacosPrivateSlide,
    },
  ],
};
