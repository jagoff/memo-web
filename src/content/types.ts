export type Locale = "en" | "es";

export interface FeatureCopy {
  id: "time-machine" | "contradictions" | "capture" | "cross-agent";
  title: string;
  body: string;
}

export interface ComparisonRow {
  capability: string;
  memo: string;
  cloud: string;
  vector: string;
}

export interface LandingCopy {
  meta: { title: string; description: string };
  nav: { how: string; features: string; install: string; github: string };
  hero: {
    eyebrow: string;
    title: string;
    body: string;
    install: string;
    github: string;
  };
  problem: {
    eyebrow: string;
    title: string;
    body: string;
    lost: string;
    kept: string;
  };
  loop: {
    eyebrow: string;
    title: string;
    body: string;
    steps: readonly [string, string, string];
  };
  featuresHeading: { eyebrow: string; title: string; body: string };
  features: readonly FeatureCopy[];
  evidence: {
    eyebrow: string;
    title: string;
    body: string;
    illustration: string;
    updated: string;
  };
  install: {
    eyebrow: string;
    title: string;
    body: string;
    macos: string;
    linux: string;
    copy: string;
    copied: string;
    copyFailed: string;
    docs: string;
  };
  comparison: {
    eyebrow: string;
    title: string;
    body: string;
    headers: readonly [string, string, string, string];
    rows: readonly ComparisonRow[];
    full: string;
  };
  final: {
    eyebrow: string;
    title: string;
    body: string;
    install: string;
    github: string;
  };
  footer: { source: string; pypi: string; license: string; by: string };
}
