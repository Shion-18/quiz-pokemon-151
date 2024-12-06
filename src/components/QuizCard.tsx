import React from 'react';
import type { QuizQuestion } from '../types/pokemon';

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (answer: string) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({ 
  question, 
  onAnswer
}) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 max-w-md w-full">
      <div className="flex justify-center mb-6">
        <img 
          src={question.pokemon.imageUrl} 
          alt="Pokemon" 
          className="w-48 h-48 object-contain filter blur-lg"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg
                     transition-colors duration-200"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};