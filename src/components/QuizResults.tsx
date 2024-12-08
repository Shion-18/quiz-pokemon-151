import React from 'react';
import type { QuizHistory } from '../hooks/useQuiz';
import { CheckCircle2, XCircle, Share2 } from 'lucide-react';

interface QuizResultsProps {
  score: number;
  history: QuizHistory[];
  onReset: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({ score, history, onReset }) => {
  const totalQuestions = history.length;
  const incorrectCount = totalQuestions - score;

  const handleShare = () => {
    const resultEmojis = history.map((item, index) => 
      `${index + 1}${item.isCorrect ? '🟢' : '❌'}`
    ).join('');
    
    const shareText = `初代ポケモン名前当てクイズ\n\n${score}/${totalQuestions}問 正解！\n${resultEmojis}\n\n#初代ポケモン名前当てクイズ`;

    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8 max-w-4xl w-full">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center leading-relaxed whitespace-pre-line">
        10問中{score}問
        <br className="md:hidden" />
        正解しました！
      </h2>

      <div className="mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded shrink-0"></div>
              <span>正解: {score}問</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-400 rounded shrink-0"></div>
              <span>不正解: {incorrectCount}問</span>
            </div>
          </div>
          <div className="h-6 flex rounded-full overflow-hidden">
            <div 
              className="bg-green-500 transition-all duration-500"
              style={{ width: `${(score / totalQuestions) * 100}%` }}
            ></div>
            <div 
              className="bg-red-400 transition-all duration-500"
              style={{ width: `${(incorrectCount / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {history.map((item, index) => (
          <div 
            key={index}
            className="flex items-center gap-4 bg-blue-50 rounded-lg p-4"
          >
            <img 
              src={item.pokemon.imageUrl}
              alt={item.pokemon.name.japanese}
              className="w-20 h-20 md:w-24 md:h-24 object-contain shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium whitespace-nowrap">
                  {index + 1}問目
                </span>
                {item.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                )}
              </div>
              <p className="text-sm text-gray-600 break-words">
                正解は「{item.pokemon.name.japanese}」です
              </p>
              {!item.isCorrect && (
                <p className="text-sm text-gray-500 break-words">
                  あなたの回答: {item.userAnswer}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={onReset}
          className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg
                   hover:bg-blue-700 transition-colors duration-200 w-full sm:w-auto"
        >
          もう一度プレイ
        </button>
        <button
          onClick={handleShare}
          className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg
                   hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center gap-2
                   w-full sm:w-auto"
        >
          <Share2 className="w-5 h-5 shrink-0" />
          <span className="whitespace-nowrap">結果をXでシェア</span>
        </button>
      </div>
    </div>
  );
}