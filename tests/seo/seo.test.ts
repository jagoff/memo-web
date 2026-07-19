import { describe, expect, it } from "vitest";
import { buildSeo, buildStructuredData } from "../../src/lib/seo";

describe("buildSeo", () => {
  it("builds reciprocal canonical locale metadata", () => {
    const seo = buildSeo("es", {
      title: "memo ES",
      description: "Memoria local",
    });
    expect(seo.canonical).toBe("https://memo-web-sigma.vercel.app/es/");
    expect(seo.alternates).toEqual([
      { lang: "en", href: "https://memo-web-sigma.vercel.app/" },
      { lang: "es", href: "https://memo-web-sigma.vercel.app/es/" },
      { lang: "x-default", href: "https://memo-web-sigma.vercel.app/" },
    ]);
    expect(seo.ogImage).toEqual({
      url: "https://memo-web-sigma.vercel.app/og.jpg",
      width: 1280,
      height: 640,
      type: "image/jpeg",
    });
  });

  it("builds a localized graph from visible product and FAQ content", () => {
    const data = buildStructuredData({
      locale: "en",
      meta: {
        title: "Persistent Memory for AI Agents | memo",
        description: "Local semantic memory for AI coding agents.",
      },
      features: [
        {
          id: "capture",
          title: "Auto-capture",
          body: "Capture durable facts.",
        },
      ],
      faq: {
        eyebrow: "FAQ",
        title: "AI agent memory, explained.",
        body: "Answers about memo.",
        items: [
          {
            question: "What is memo?",
            answer: "memo is a local MCP memory server.",
          },
        ],
      },
      softwareVersion: "3.7.0",
    });

    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@graph"]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ "@type": "WebSite" }),
        expect.objectContaining({ "@type": "WebPage", inLanguage: "en" }),
        expect.objectContaining({
          "@type": "SoftwareApplication",
          softwareVersion: "3.7.0",
          featureList: ["Auto-capture: Capture durable facts."],
        }),
        expect.objectContaining({
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What is memo?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "memo is a local MCP memory server.",
              },
            },
          ],
        }),
      ]),
    );
  });
});
