// ESLintのJavaScript用の設定をインポート
import js from '@eslint/js';
// グローバル変数の設定をインポート
import globals from 'globals';
// React Hooks用のESLintプラグインをインポート
import reactHooks from 'eslint-plugin-react-hooks';
// React Refresh用のESLintプラグインをインポート
import reactRefresh from 'eslint-plugin-react-refresh';
// TypeScript用のESLint設定をインポート
import tseslint from 'typescript-eslint';

// TypeScript用のESLint設定をエクスポート
export default tseslint.config(
  // ビルドされたファイルを無視する設定
  { ignores: ['dist'] },
  {
    // 推奨される設定を拡張
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    // 対象ファイルの指定（TypeScriptファイル）
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      // ECMAScriptのバージョンを2020に設定
      ecmaVersion: 2020,
      // ブラウザのグローバル変数を使用可能に設定
      globals: globals.browser,
    },
    plugins: {
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
  }
);
