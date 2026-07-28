import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // テスト設定（Vitest）
  test: {
    globals: true, // describe/it/expect をimportなしで使う
    environment: 'jsdom', // DOMを使うコンポーネントテスト用
    setupFiles: './src/test/setup.ts',
  },
});
