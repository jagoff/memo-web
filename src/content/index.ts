import { en } from "./en";
import { es } from "./es";
import type { LandingCopy, Locale } from "./types";

export const CONTENT: Record<Locale, LandingCopy> = { en, es };
export type { LandingCopy, Locale };
