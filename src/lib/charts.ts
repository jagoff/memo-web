import type { ProjectData } from "./project-data";

export interface ReleasePoint {
  tag: string;
  x: number;
  y: number;
  url: string;
}

const CHART_PADDING = 12;

export function releasePoints(
  releases: ProjectData["releases"],
  width: number,
  height: number,
): ReleasePoint[] {
  const orderedReleases = [...releases].sort(
    (left, right) =>
      new Date(left.publishedAt).getTime() -
      new Date(right.publishedAt).getTime(),
  );

  if (orderedReleases.length === 0) {
    return [];
  }

  if (orderedReleases.length === 1) {
    const release = orderedReleases[0]!;

    return [
      {
        tag: release.tag,
        x: width / 2,
        y: height / 2,
        url: release.url,
      },
    ];
  }

  const usableWidth = width - CHART_PADDING * 2;
  const usableHeight = height - CHART_PADDING * 2;

  return orderedReleases.map((release, index) => ({
    tag: release.tag,
    x: CHART_PADDING + (usableWidth * index) / (orderedReleases.length - 1),
    y: CHART_PADDING + usableHeight * (index % 2 === 0 ? 0.35 : 0.7),
    url: release.url,
  }));
}
