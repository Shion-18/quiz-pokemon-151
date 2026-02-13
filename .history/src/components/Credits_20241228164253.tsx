import React from 'react';

export const Credits: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-2xl text-center text-sm text-gray-400 mt-8">
      <div className="mb-2">
        <p>
          {t('credits.copyright')}
        </p>
      </div>
      <div className="mt-2">
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
