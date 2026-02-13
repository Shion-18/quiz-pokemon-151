import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

export const Credits: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-2xl text-center text-sm text-gray-400 mt-8">
      {/* このdivは全体の幅を100%にし、最大幅を2xlに設定しています。テキストは中央揃えで、フォントサイズは小さく、色は灰色（#9CA3AF）です。上部に8のマージンを追加しています。 */}
      <div className="mb-2">
        {/* このdivは下部に2のマージンを追加しています。 */}
        <p>
          {t('credits.copyright')}
        </p>
      </div>
      <div className="mt-2">
        {/* このdivは上部に2のマージンを追加しています。 */}
        <p>
          {t('credits.dataProvider')}
          <a 
            href="https://pokeapi.co/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors duration-200 ml-1"
          >
            PokéAPI
          </a>
        </p>
      </div>
    </div>
  );
};
