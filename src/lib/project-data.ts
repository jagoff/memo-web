import { z } from "zod";

import projectSnapshot from "../data/project-snapshot.json";

const PROJECT_URL = "https://api.github.com/repos/jagoff/memo";
const RELEASES_URL = `${PROJECT_URL}/releases?per_page=5`;
const PYPI_API_URL = "https://pypi.org/pypi/mlx-memo/json";
const PYPI_PROJECT_URL = "https://pypi.org/project/mlx-memo/";
const GITHUB_RELEASE_PATH_PREFIX = "/jagoff/memo/releases/";

const GitHubReleaseUrlSchema = z.url().refine(
  (value) => {
    const url = new URL(value);

    return (
      url.origin === "https://github.com" &&
      url.pathname.startsWith(GITHUB_RELEASE_PATH_PREFIX) &&
      url.pathname.length > GITHUB_RELEASE_PATH_PREFIX.length
    );
  },
  { message: "Expected a jagoff/memo GitHub release URL" },
);

const ReleaseSchema = z.object({
  tag: z.string().min(1),
  publishedAt: z.iso.datetime({ offset: true }),
  url: GitHubReleaseUrlSchema,
});

export const ProjectDataSchema = z
  .object({
    stars: z.number().int().nonnegative(),
    forks: z.number().int().nonnegative(),
    latestRelease: ReleaseSchema,
    releases: z.array(ReleaseSchema).min(1),
    pypiVersion: z.string().min(1),
    pypiUrl: z.literal(PYPI_PROJECT_URL),
    updatedAt: z.iso.datetime({ offset: true }),
  })
  .superRefine((data, context) => {
    const firstRelease = data.releases[0];

    if (
      !firstRelease ||
      firstRelease.tag !== data.latestRelease.tag ||
      firstRelease.publishedAt !== data.latestRelease.publishedAt ||
      firstRelease.url !== data.latestRelease.url
    ) {
      context.addIssue({
        code: "custom",
        message: "latestRelease must equal releases[0]",
        path: ["latestRelease"],
      });
    }
  });

export type ProjectData = z.infer<typeof ProjectDataSchema>;

export type Fetcher = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export interface LoadProjectDataOptions {
  fetcher?: Fetcher;
  snapshot?: ProjectData;
  now?: () => Date;
  timeoutMs?: number;
  retryDelayMs?: number;
}

export interface ProjectDataResult {
  data: ProjectData;
  stale: boolean;
}

const GitHubProjectSchema = z.object({
  stargazers_count: z.number().int().nonnegative(),
  forks_count: z.number().int().nonnegative(),
});

const GitHubReleaseSchema = z.union([
  z
    .object({
      tag_name: z.string().min(1),
      published_at: z.iso.datetime({ offset: true }),
      html_url: GitHubReleaseUrlSchema,
    })
    .transform((release) => ({
      tag: release.tag_name,
      publishedAt: release.published_at,
      url: release.html_url,
    })),
  ReleaseSchema,
]);

const GitHubReleasesSchema = z.array(GitHubReleaseSchema).min(1);

const PyPiProjectSchema = z.object({
  info: z.object({
    version: z.string().min(1),
    package_url: z.literal(PYPI_PROJECT_URL),
  }),
});

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function fetchJson<T>(
  fetcher: Fetcher,
  url: string,
  schema: z.ZodType<T>,
  timeoutMs: number,
  retryDelayMs: number,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetcher(url, {
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      return schema.parse(await response.json());
    } catch (error) {
      lastError = error;

      if (attempt === 0) {
        await delay(retryDelayMs);
      }
    }
  }

  throw lastError;
}

export async function loadProjectData(
  options: LoadProjectDataOptions = {},
): Promise<ProjectDataResult> {
  const snapshotResult = ProjectDataSchema.safeParse(
    options.snapshot ?? projectSnapshot,
  );
  const fetcher = options.fetcher ?? fetch;
  const now = options.now ?? (() => new Date());
  const timeoutMs = options.timeoutMs ?? 2500;
  const retryDelayMs = options.retryDelayMs ?? 100;

  try {
    const [project, releases, pypi] = await Promise.all([
      fetchJson(
        fetcher,
        PROJECT_URL,
        GitHubProjectSchema,
        timeoutMs,
        retryDelayMs,
      ),
      fetchJson(
        fetcher,
        RELEASES_URL,
        GitHubReleasesSchema,
        timeoutMs,
        retryDelayMs,
      ),
      fetchJson(
        fetcher,
        PYPI_API_URL,
        PyPiProjectSchema,
        timeoutMs,
        retryDelayMs,
      ),
    ]);

    const latestRelease = releases[0];

    if (!latestRelease) {
      throw new Error("GitHub returned no releases");
    }

    const data = ProjectDataSchema.parse({
      stars: project.stargazers_count,
      forks: project.forks_count,
      latestRelease,
      releases,
      pypiVersion: pypi.info.version,
      pypiUrl: pypi.info.package_url,
      updatedAt: now().toISOString(),
    });

    return { data, stale: false };
  } catch (error) {
    if (snapshotResult.success) {
      console.warn(
        "Unable to refresh public project data; using snapshot.",
        error,
      );
      return { data: snapshotResult.data, stale: true };
    }

    const failure = new AggregateError(
      [error, snapshotResult.error],
      "Remote project data and the local snapshot are invalid.",
    );

    console.warn("Unable to load public project data.", failure);
    throw failure;
  }
}
