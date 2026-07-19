import type { LandingCopy, Locale } from "../content";

export const SITE = "https://memo-web-sigma.vercel.app";

const OG_IMAGE = {
  url: `${SITE}/og.jpg`,
  width: 1280,
  height: 640,
  type: "image/jpeg",
} as const;

export function buildSeo(locale: Locale, meta: LandingCopy["meta"]) {
  const path = locale === "en" ? "/" : "/es/";

  return {
    ...meta,
    canonical: SITE + path,
    alternates: [
      { lang: "en", href: SITE + "/" },
      { lang: "es", href: SITE + "/es/" },
      { lang: "x-default", href: SITE + "/" },
    ],
    ogImage: OG_IMAGE,
  };
}

interface StructuredDataOptions {
  locale: Locale;
  meta: LandingCopy["meta"];
  features: LandingCopy["features"];
  faq: LandingCopy["faq"];
  softwareVersion: string;
}

export function buildStructuredData({
  locale,
  meta,
  features,
  faq,
  softwareVersion,
}: StructuredDataOptions) {
  const seo = buildSeo(locale, meta);
  const websiteId = `${SITE}/#website`;
  const softwareId = `${SITE}/#software`;
  const authorId = "https://github.com/jagoff#person";
  const webPageId = `${seo.canonical}#webpage`;
  const imageId = `${seo.canonical}#primaryimage`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: `${SITE}/`,
        name: "memo",
        description: meta.description,
        inLanguage: ["en", "es"],
        publisher: { "@id": authorId },
      },
      {
        "@type": "Person",
        "@id": authorId,
        name: "Fernando Ferrari",
        url: "https://github.com/jagoff",
        sameAs: ["https://github.com/jagoff"],
      },
      {
        "@type": "ImageObject",
        "@id": imageId,
        url: seo.ogImage.url,
        contentUrl: seo.ogImage.url,
        width: seo.ogImage.width,
        height: seo.ogImage.height,
      },
      {
        "@type": "WebPage",
        "@id": webPageId,
        url: seo.canonical,
        name: meta.title,
        description: meta.description,
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        about: { "@id": softwareId },
        primaryImageOfPage: { "@id": imageId },
      },
      {
        "@type": "SoftwareApplication",
        "@id": softwareId,
        name: "memo",
        alternateName: "mlx-memo",
        description: meta.description,
        url: `${SITE}/`,
        image: { "@id": imageId },
        codeRepository: "https://github.com/jagoff/memo",
        downloadUrl: "https://pypi.org/project/mlx-memo/",
        installUrl: "https://github.com/jagoff/memo#installation",
        applicationCategory: "DeveloperApplication",
        applicationSubCategory: "AI agent memory",
        operatingSystem: ["macOS", "Linux"],
        softwareVersion,
        isAccessibleForFree: true,
        license: "https://opensource.org/license/mit/",
        author: { "@id": authorId },
        featureList: features.map(
          (feature) => `${feature.title}: ${feature.body}`,
        ),
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://pypi.org/project/mlx-memo/",
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${seo.canonical}#faq-schema`,
        url: `${seo.canonical}#faq`,
        name: faq.title,
        description: faq.body,
        inLanguage: locale,
        isPartOf: { "@id": webPageId },
        mainEntity: faq.items.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: {
            "@type": "Answer",
            text: answer,
          },
        })),
      },
    ],
  };
}
