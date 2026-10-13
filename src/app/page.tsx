import { LenisProvider } from "@/components/providers/lenis-provider";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { ValueStrip } from "@/components/landing/value-strip";
import { FeaturesSection } from "@/components/landing/features-section";
import { ProductShowcase } from "@/components/landing/product-showcase";
import { HowItWorks } from "@/components/landing/how-it-works";
import { SmartInsightsSection } from "@/components/landing/smart-insights-section";
import { FAQSection } from "@/components/landing/faq-section";
import { FinalCTA } from "@/components/landing/final-cta";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function Home() {
  return (
    <LenisProvider>
      <div className="min-h-screen bg-background">
        <LandingNavbar />
        <main>
          <HeroSection />
          <ValueStrip />
          <FeaturesSection />
          <ProductShowcase />
          <HowItWorks />
          <SmartInsightsSection />
          <FAQSection />
          <FinalCTA />
        </main>
        <LandingFooter />
      </div>
    </LenisProvider>

  );
}
