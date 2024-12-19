// ここには、エントリーレベルのソフトウェアエンジニアでも理解できるように、解説コメントを追加します
// まず、必要なモジュールをインポートします
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// ここで、Reactアプリケーションをレンダリングします
// まず、ルート要素を取得します
const rootElement = document.getElementById('root');
// 次に、StrictModeを使用してアプリケーションをラップします
const app = (
  <StrictMode>
      <App />
  </StrictMode>
);
// 最後に、createRootを使用してアプリケーションをレンダリングします
createRoot(rootElement!).render(app);
