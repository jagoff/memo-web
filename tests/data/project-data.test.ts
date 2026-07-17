import { describe, expect, it, vi } from "vitest";

import {
  loadProjectData,
  ProjectDataSchema,
  type ProjectData,
} from "../../src/lib/project-data";

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

function validApiResponse(url: RequestInfo | URL): Response {
  const value = String(url);

  if (value.endsWith("/releases?per_page=5")) {
    return new Response(
      JSON.stringify([
        {
          tag_name: "v3.7.1",
          published_at: "2026-07-17T19:30:00Z",
          html_url: "https://github.com/jagoff/memo/releases/tag/v3.7.1",
        },
      ]),
    );
  }

  if (value.includes("pypi.org")) {
    return new Response(
      JSON.stringify({
        info: { version: "3.7.1", package_url: snapshot.pypiUrl },
      }),
    );
  }

  return new Response(JSON.stringify({ stargazers_count: 7, forks_count: 3 }));
}

describe("ProjectDataSchema", () => {
  it.each([
    [
      "a non-canonical release URL",
      {
        ...snapshot,
        latestRelease: {
          ...snapshot.latestRelease,
          url: "https://example.com/releases/tag/v3.7.0",
        },
        releases: [
          {
            ...snapshot.releases[0],
            url: "https://example.com/releases/tag/v3.7.0",
          },
        ],
      },
    ],
    [
      "a non-canonical PyPI URL",
      { ...snapshot, pypiUrl: "https://example.com/project/mlx-memo/" },
    ],
    [
      "a latest release that differs from the first release",
      {
        ...snapshot,
        latestRelease: { ...snapshot.latestRelease, tag: "v9.9.9" },
      },
    ],
  ])("rejects %s", (_description, candidate) => {
    expect(ProjectDataSchema.safeParse(candidate).success).toBe(false);
  });
});

describe("loadProjectData", () => {
  it("uses valid remote data even when the snapshot is invalid", async () => {
    const invalidSnapshot = { ...snapshot, stars: -1 } as ProjectData;
    const fetcher = vi.fn(async (url: RequestInfo | URL) => {
      const value = String(url);

      if (value.endsWith("/releases?per_page=5")) {
        return new Response(
          JSON.stringify([
            {
              tag_name: "v3.7.1",
              published_at: "2026-07-17T19:30:00Z",
              html_url: "https://github.com/jagoff/memo/releases/tag/v3.7.1",
            },
          ]),
        );
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
      snapshot: invalidSnapshot,
      now: () => new Date("2026-07-17T20:00:00.000Z"),
    });

    expect(result).toMatchObject({
      stale: false,
      data: {
        latestRelease: {
          tag: "v3.7.1",
          publishedAt: "2026-07-17T19:30:00Z",
          url: "https://github.com/jagoff/memo/releases/tag/v3.7.1",
        },
        updatedAt: "2026-07-17T20:00:00.000Z",
      },
    });
  });

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

  it("retries a failed request exactly once", async () => {
    let projectAttempts = 0;
    const fetcher = vi.fn(async (url: RequestInfo | URL) => {
      if (String(url) === "https://api.github.com/repos/jagoff/memo") {
        projectAttempts += 1;

        if (projectAttempts === 1) {
          return new Response("temporarily unavailable", { status: 503 });
        }
      }

      return validApiResponse(url);
    });

    const result = await loadProjectData({
      fetcher,
      snapshot,
      retryDelayMs: 0,
    });

    expect(result.stale).toBe(false);
    expect(projectAttempts).toBe(2);
    expect(fetcher).toHaveBeenCalledTimes(4);
  });

  it("passes the supplied timeout signal and falls back after it aborts", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const signals: AbortSignal[] = [];
    const fetcher = vi.fn(
      async (url: RequestInfo | URL, init?: RequestInit) => {
        if (String(url) !== "https://api.github.com/repos/jagoff/memo") {
          return validApiResponse(url);
        }

        return new Promise<Response>((_resolve, reject) => {
          const signal = init?.signal;

          if (!(signal instanceof AbortSignal)) {
            reject(new Error("missing abort signal"));
            return;
          }

          signals.push(signal);

          if (signal.aborted) {
            reject(signal.reason);
            return;
          }

          signal.addEventListener("abort", () => reject(signal.reason), {
            once: true,
          });
        });
      },
    );

    try {
      const result = await loadProjectData({
        fetcher,
        snapshot,
        timeoutMs: 0,
        retryDelayMs: 0,
      });

      expect(result).toEqual({ data: snapshot, stale: true });
      expect(fetcher).toHaveBeenCalledTimes(4);
      expect(signals).toHaveLength(2);
      expect(signals.every((signal) => signal.aborted)).toBe(true);
      expect(
        signals.every((signal) => signal.reason?.name === "TimeoutError"),
      ).toBe(true);
      expect(warn).toHaveBeenCalledTimes(1);
    } finally {
      warn.mockRestore();
    }
  });

  it.each([
    ["a non-2xx response", () => new Response("rate limited", { status: 429 })],
    [
      "an invalid response schema",
      () =>
        new Response(
          JSON.stringify({ stargazers_count: "seven", forks_count: 3 }),
        ),
    ],
  ])("falls back once for %s", async (_description, projectResponse) => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    let projectAttempts = 0;
    const fetcher = vi.fn(async (url: RequestInfo | URL) => {
      if (String(url) === "https://api.github.com/repos/jagoff/memo") {
        projectAttempts += 1;
        return projectResponse();
      }

      return validApiResponse(url);
    });

    try {
      const result = await loadProjectData({
        fetcher,
        snapshot,
        retryDelayMs: 0,
      });

      expect(result).toEqual({ data: snapshot, stale: true });
      expect(projectAttempts).toBe(2);
      expect(warn).toHaveBeenCalledTimes(1);
    } finally {
      warn.mockRestore();
    }
  });

  it("throws only when remote data and the snapshot are invalid", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const invalidSnapshot = { ...snapshot, stars: -1 } as ProjectData;
    const fetcher = vi.fn(async () => {
      throw new Error("offline");
    });

    try {
      await expect(
        loadProjectData({
          fetcher,
          snapshot: invalidSnapshot,
          retryDelayMs: 0,
        }),
      ).rejects.toThrow(
        "Remote project data and the local snapshot are invalid",
      );
      expect(warn).toHaveBeenCalledTimes(1);
    } finally {
      warn.mockRestore();
    }
  });
});
