import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

// 画面挙動テスト用の設定。実ブラウザ(headless Chromium)上でテストコードを実行する。
// アプリ本体のvite設定(react/vanilla-extract)はテストでは不要なため読み込まない。
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }]
    }
  }
});
