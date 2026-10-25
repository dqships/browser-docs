import { ClosingCtaSection } from "@/app/landing/closing-cta-section";
import { CopyMethodsSection } from "@/app/landing/copy-methods-section";
import { HeroSection } from "@/app/landing/hero-section";
import { KeepDropSection } from "@/app/landing/keep-drop-section";
import { PrivacyBand } from "@/app/landing/privacy-band";
import { ScreenshotsSection } from "@/app/landing/screenshots-section";
import { SettingsSection } from "@/app/landing/settings-section";
import { SiteFooter } from "@/app/site-footer";
import { SiteHeader } from "@/app/site-header";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-paper">
      <SiteHeader variant="landing" />
      <main className="flex-1">
        <HeroSection />
        <KeepDropSection />
        <CopyMethodsSection />
        <SettingsSection />
        <ScreenshotsSection />
        <PrivacyBand />
        <ClosingCtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
