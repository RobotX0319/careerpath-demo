/**
 * Playwright Configuration
 * 
 * Basic E2E testing configuration
 */

export interface PlaywrightConfig {
  testDir: string;
  timeout: number;
  expect: {
    timeout: number;
  };
  fullyParallel: boolean;
  forbidOnly: boolean;
  retries: number;
  workers: number;
  reporter: string;
  use: {
    baseURL: string;
    trace: string;
    screenshot: string;
    video: string;
  };
  projects: Array<{
    name: string;
    use: {
      [key: string]: any;
    };
  }>;
  webServer?: {
    command: string;
    port: number;
    reuseExistingServer: boolean;
  };
}

const config: PlaywrightConfig = {
  testDir: './e2e',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium'
      },
    },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox'
      },
    },
    {
      name: 'webkit',
      use: {
        browserName: 'webkit'
      },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
};

export default config;