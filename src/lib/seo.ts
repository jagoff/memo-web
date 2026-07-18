import type { LandingCopy, Locale } from "../content";

const SITE = "https://memo-memory.vercel.app";

export function buildSeo(locale: Locale, meta: LandingCopy["meta"]) {
  const path = locale === "en" ? "/" : "/es/";

  return {
    ...meta,
    canonical: SITE + path,
    alternates: [
      { lang: "en", href: SITE + "/" },
      { lang: "es", href: SITE + "/es/" },
    ],
    ogImage: SITE + "/og.jpg",
  };
}
