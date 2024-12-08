import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { Pokemon } from '../types/pokemon';

interface AnswerFeedbackProps {
  isCorrect: boolean;
  correctAnswer: string;
  userAnswer: string;
  pokemon: Pokemon;
  onNext: () => void;
}

export const AnswerFeedback: React.FC<AnswerFeedbackProps> = ({
  isCorrect,
  correctAnswer,
  userAnswer,
  pokemon,
  onNext
}) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 max-w-md w-full">
      <div className="flex flex-col items-center">
        <div className="mb-4">
          {isCorrect ? (
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          ) : (
            <XCircle className="w-16 h-16 text-red-400" />
          )}
        </div>
        
        <div className="w-48 h-48 flex items-center justify-center mb-4">
          <img 
            src={pokemon.imageUrl} 
            alt={pokemon.name.japanese}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-2 text-gray-900">
            {isCorrect ? "正解！" : "不正解..."}
          </h3>
          <p className="text-lg text-gray-700">
            正解は「{correctAnswer}」です
          </p>
          {!isCorrect && (
            <p className="text-gray-500 mt-1">
              あなたの回答: {userAnswer}
            </p>
          )}
        </div>

        <button
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg
                   transition-colors duration-200"
        >
          次の問題へ
        </button>
      </div>
    </div>
  );
};