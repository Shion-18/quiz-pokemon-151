import React, { createContext, useContext, useState, ReactNode } from 'react';

// コンテキストの型を定義
interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
}

// デフォルト値を設定
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// プロバイダーコンポーネントを作成
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('ja'); // デフォルトの言語を日本語に設定

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// カスタムフックを作成
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 
