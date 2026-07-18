import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  snapshotPathTemplate:
    "{testDir}/{testFilePath}-snapshots/{projectName}-{platform}/{arg}{ext}",
  use: {
    baseURL: "http://127.0.0.1:4321",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 13"] },
    },
  ],
  webServer: {
    command: "corepack pnpm build && corepack pnpm preview --host 127.0.0.1",
    url: "http://127.0.0.1:4321",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
