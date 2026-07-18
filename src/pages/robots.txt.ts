import type { APIRoute } from "astro";

const ROBOTS = `User-agent: *
Allow: /
Sitemap: https://memo-memory.vercel.app/sitemap-index.xml
`;

export const GET: APIRoute = () =>
  new Response(ROBOTS, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
