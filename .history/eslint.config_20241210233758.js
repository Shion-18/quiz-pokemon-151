// ESLintのJavaScript用の設定をインポート
import js from '@eslint/js';
// グローバル変数の設定をインポート
import globals from 'globals';
// React Hooks用のESLintプラグインをインポート
import reactHooks from 'eslint-plugin-react-hooks';
// React Refresh用のESLintプラグインをインポート
import reactRefresh from 'eslint-plugin-react-refresh';
// TypeScript用のESLintプラグインとパーサーをインポート
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

// TypeScript用のESLint設定をエクスポート
export default {
  // ビルドされたファイルを無視する設定
  ignorePatterns: ['dist'],
  overrides: [
    {
      // 対象ファイルの指定（TypeScriptファイル）
      files: ['**/*.{ts,tsx}'],
      parser: tsParser,
      extends: [
        js.configs.recommended,
        'plugin:@typescript-eslint/recommended',
      ],
      languageOptions: {
        // ECMAScriptのバージョンを2020に設定
        ecmaVersion: 2020,
        // ブラウザのグローバル変数を使用可能に設定
        globals: globals.browser,
      },
      plugins: {
        // TypeScript用のプラグインを設定
        '@typescript-eslint': tsPlugin,
        // React Hooks用のプラグインを設定
        'react-hooks': reactHooks,
        // React Refresh用のプラグインを設定
        'react-refresh': reactRefresh,
      },
      rules: {
        // React Hooksの推奨ルールを適用
        ...reactHooks.configs.recommended.rules,
        // React Refreshの特定のルールを警告として設定
        'react-refresh/only-export-components': [
          'warn',
          { allowConstantExport: true },
        ],
      },
    },
  ],
};
