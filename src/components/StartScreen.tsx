import React from 'react';
import { Gamepad2, Users } from 'lucide-react';
import type { StarterPokemon } from '../types/pokemon';
import { Credits } from './Credits';

interface StartScreenProps {
  onStart: () => void;
  playCount: number;
}

const starterPokemon: StarterPokemon[] = [
  {
    id: 25,
    name: "ピカチュウ",
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
  },
  {
    id: 1,
    name: "フシギダネ",
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
  },
  {
    id: 4,
    name: "ヒトカゲ",
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png"
  },
  {
    id: 7,
    name: "ゼニガメ",
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png"
  }
];

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, playCount }) => {
  return (
    <>
      <div className="text-center mb-8 max-w-[90%] md:max-w-[80%] lg:max-w-[60%]">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-2 flex items-center justify-center gap-2 leading-relaxed">
          <Gamepad2 className="w-8 h-8 shrink-0" />
          <span className="whitespace-pre-line">
            初代ポケモン
            <br className="md:hidden" />
            名前当てクイズ
          </span>
        </h1>
        <p className="text-gray-300 text-lg md:text-xl leading-relaxed whitespace-pre-line">
          「ポケットモンスター赤・緑」に
          <br className="md:hidden" />
          登場する151匹から出題
        </p>
      </div>

      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8 max-w-2xl w-full relative">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {starterPokemon.map((pokemon) => (
            <div key={pokemon.id} className="flex flex-col items-center">
              <img
                src={pokemon.imageUrl}
                alt={pokemon.name}
                className="w-20 h-20 md:w-24 md:h-24 object-contain hover:scale-110 transition-transform duration-200"
              />
            </div>
          ))}
        </div>
        <div className="text-center mb-16 sm:mb-8">
          <button
            onClick={onStart}
            className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg
                     hover:bg-blue-700 transition-colors duration-200 text-lg
                     transform hover:scale-105 transition-transform duration-200
                     shadow-lg hover:shadow-xl w-full sm:w-auto"
          >
            クイズを始める
          </button>
        </div>
        {playCount > 0 && (
          <div className="absolute bottom-4 right-4 left-4 sm:left-auto">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200 shadow-sm">
              <Users className="w-4 h-4 text-gray-600 shrink-0" />
              <span className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                これまで{playCount}人の
                <br className="sm:hidden" />
                ポケモンファンが、
                <br className="sm:hidden" />
                このクイズを遊びました！
              </span>
            </div>
          </div>
        )}
      </div>
      
      <Credits />
    </>
  );
};