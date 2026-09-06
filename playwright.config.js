import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test',
  webServer: process.env.PW_NO_SERVER
    ? undefined
    : { command: 'npm run build && npm run preview', port: 4173, reuseExistingServer: !process.env.CI, timeout: 120_000 },
  use: { baseURL: 'http://localhost:4173', headless: true,
    launchOptions: { args: ['--no-sandbox', '--enable-unsafe-swiftshader'] } },
  reporter: 'list',
});
