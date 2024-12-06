import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const LanguageSwitch: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="absolute top-4 right-4 flex gap-2">
      <button
        onClick={() => setLanguage('ja')}
        className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
          language === 'ja'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        日本語
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
          language === 'en'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        English
      </button>
    </div>
  );
};