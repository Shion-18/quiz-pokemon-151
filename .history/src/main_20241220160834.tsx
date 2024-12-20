// ここには、エントリーレベルのソフトウェアエンジニアでも理解できるように、解説コメントを追加します
// まず、必要なモジュールをインポートします
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
<<<<<<< HEAD

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
=======
import { LanguageProvider } from './contexts/LanguageContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>
);
>>>>>>> 666b29f1f3817e693ed1b67e77311c0320f70774
