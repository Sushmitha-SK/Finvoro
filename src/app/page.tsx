import { FAQSection } from "@/components/landing/faq-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { FinalCTA } from "@/components/landing/final-cta";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { PricingSection } from "@/components/landing/pricing-section";
import { ProductShowcase } from "@/components/landing/product-showcase";
import { SmartInsightsSection } from "@/components/landing/smart-insights-section";
import { ValueStrip } from "@/components/landing/value-strip";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <main>
        <HeroSection />
        <ValueStrip />
        <FeaturesSection />
        <ProductShowcase />
        <HowItWorks />
        <SmartInsightsSection />
        <PricingSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
