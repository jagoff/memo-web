import { CONTENT, type LandingCopy, type Locale } from "../content";

export function getCopy(locale: Locale): LandingCopy {
  return CONTENT[locale];
}

export function localizedHref(locale: Locale, anchor?: string): string {
  const base = locale === "en" ? "/" : "/es/";
  return anchor ? base + "#" + anchor : base;
}

export function alternateLocale(locale: Locale): Locale {
  return locale === "en" ? "es" : "en";
}
