import React from 'react';

interface ScoreBoardProps {
  score: number;
  remainingQuestions: number;
  isFinished: boolean;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ remainingQuestions }) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg px-6 py-3 shadow-md">
      <div className="text-gray-700 font-medium">
        残り問題数: {remainingQuestions}
      </div>
    </div>
  );
};