import { describe, expect, it, vi } from "vitest";

import { loadProjectData, type ProjectData } from "../../src/lib/project-data";

const snapshot: ProjectData = {
  stars: 6,
  forks: 2,
  latestRelease: {
    tag: "v3.7.0",
    publishedAt: "2026-07-16T03:56:09Z",
    url: "https://github.com/jagoff/memo/releases/tag/v3.7.0",
  },
  releases: [
    {
      tag: "v3.7.0",
      publishedAt: "2026-07-16T03:56:09Z",
      url: "https://github.com/jagoff/memo/releases/tag/v3.7.0",
    },
  ],
  pypiVersion: "3.7.0",
  pypiUrl: "https://pypi.org/project/mlx-memo/",
  updatedAt: "2026-07-17T19:00:00.000Z",
};

describe("loadProjectData", () => {
  it("uses validated remote data", async () => {
    const fetcher = vi.fn(async (url: RequestInfo | URL) => {
      const value = String(url);

      if (value.endsWith("/releases?per_page=5")) {
        return new Response(JSON.stringify([snapshot.latestRelease]));
      }

      if (value.includes("pypi.org")) {
        return new Response(
          JSON.stringify({
            info: { version: "3.7.1", package_url: snapshot.pypiUrl },
          }),
        );
      }

      return new Response(
        JSON.stringify({ stargazers_count: 7, forks_count: 3 }),
      );
    });

    const result = await loadProjectData({
      fetcher,
      snapshot,
      now: () => new Date("2026-07-17T20:00:00.000Z"),
    });

    expect(result.stale).toBe(false);
    expect(result.data.stars).toBe(7);
    expect(result.data.pypiVersion).toBe("3.7.1");
  });

  it("falls back to the dated snapshot", async () => {
    const fetcher = vi.fn(async () => {
      throw new Error("offline");
    });

    const result = await loadProjectData({
      fetcher,
      snapshot,
      retryDelayMs: 0,
    });

    expect(result).toEqual({ data: snapshot, stale: true });
  });
});
