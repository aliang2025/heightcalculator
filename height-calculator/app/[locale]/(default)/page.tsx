import Branding from "@/components/blocks/branding";
import CTA from "@/components/blocks/cta";
import FAQ from "@/components/blocks/faq";
import Feature from "@/components/blocks/feature";
import Feature1 from "@/components/blocks/feature1";
import Feature2 from "@/components/blocks/feature2";
import Feature3 from "@/components/blocks/feature3";
import Hero from "@/components/blocks/hero";
import Pricing from "@/components/blocks/pricing";
import Showcase from "@/components/blocks/showcase";
import Stats from "@/components/blocks/stats";
import Testimonial from "@/components/blocks/testimonial";
import { getLandingPage } from "@/services/page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}`;

  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}`;
  }

  return {
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const page = await getLandingPage(locale);

  // 结构化数据
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": locale === "zh" ? "身高计算器" : "Height Calculator",
    "description": locale === "zh" 
      ? "专业身高计算器提供准确的儿童身高预测、厘米英尺换算、身高百分位查询和成长曲线分析。基于WHO/CDC标准，支持中位父母身高法预测成年身高。"
      : "Professional height calculator provides accurate child height prediction, cm to ft conversion, height percentile lookup, and growth chart analysis. Based on WHO/CDC standards.",
    "url": process.env.NEXT_PUBLIC_WEB_URL,
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      locale === "zh" ? "儿童身高预测" : "Child Height Prediction",
      locale === "zh" ? "厘米英尺换算" : "CM to FT Conversion", 
      locale === "zh" ? "身高百分位查询" : "Height Percentile Lookup",
      locale === "zh" ? "成长曲线分析" : "Growth Chart Analysis"
    ],
    "author": {
      "@type": "Organization",
      "name": locale === "zh" ? "身高计算器团队" : "Height Calculator Team"
    }
  };

  const faqStructuredData = page.faq && page.faq.items ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": page.faq.items.map((item: any) => ({
      "@type": "Question",
      "name": item.title,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.description
      }
    }))
  } : null;

  return (
    <>
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      {faqStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqStructuredData)
          }}
        />
      )}
      
      {page.hero && <Hero hero={page.hero} />}
      {/* {page.branding && <Branding section={page.branding} />} */}
      {page.introduce && <Feature1 section={page.introduce} />}
      {page.benefit && <Feature2 section={page.benefit} />}
      {page.science && <Feature1 section={page.science} />}
      {page.health_guide && <Feature3 section={page.health_guide} />}
      {page.measurement_guide && <Feature section={page.measurement_guide} />}
      {page.usage && <Feature3 section={page.usage} />}
      {page.feature && <Feature section={page.feature} />}
      {page.showcase && <Showcase section={page.showcase} />}
      {page.stats && <Stats section={page.stats} />}
      {/* {page.pricing && <Pricing pricing={page.pricing} />} */}
      {page.testimonial && <Testimonial section={page.testimonial} />}
      {page.faq && <FAQ section={page.faq} />}
      {page.cta && <CTA section={page.cta} />}
    </>
  );
}
