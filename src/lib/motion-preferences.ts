export function prefersReducedMotion(
  matchMedia: (query: string) => MediaQueryList = window.matchMedia.bind(
    window,
  ),
): boolean {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}
