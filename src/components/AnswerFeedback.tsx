import React from 'react'; // Reactライブラリをインポート
import { CheckCircle2, XCircle } from 'lucide-react'; // lucide-reactライブラリからアイコンをインポート
import type { Pokemon } from '../types/pokemon'; // Pokemon型の定義をインポート

// AnswerFeedbackPropsインターフェイスの定義
interface AnswerFeedbackProps {
  isCorrect: boolean; // 正解かどうかを示すフラグ
  correctAnswer: string; // 正解の答え
  userAnswer: string; // ユーザーの答え
  pokemon: Pokemon; // ポケモンの情報
  onNext: () => void; // 次の問題へ進むための関数
  currentQuestion: number; // 現在の問題番号
  totalQuestions: number; // 全体の問題数
}

// AnswerFeedbackコンポーネントの定義
export const AnswerFeedback: React.FC<AnswerFeedbackProps> = ({
  isCorrect, // 正解かどうかのフラグを受け取る
  correctAnswer, // 正解の答えを受け取る
  userAnswer, // ユーザーの答えを受け取る
  pokemon, // ポケモンの情報を受け取る
  onNext, // 次の問題へ進むための関数を受け取る
  currentQuestion, // 現在の問題番号を受け取る
  totalQuestions // 全体の問題数を受け取る
}) => {
  return (
    // コンポーネントの全体を囲むdiv
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 max-w-md w-full">
      <div className="flex flex-col items-center">
        {/* 上部: アイコン + 画像 + 結果テキストを横並びでコンパクトに */}
        <div className="flex items-center gap-4 mb-6 w-full">
          <div className="w-32 h-32 flex-shrink-0 flex items-center justify-center relative">
            <img
              src={pokemon.imageUrl}
              alt={pokemon.name.japanese}
              className="w-full h-full object-contain"
            />
            <div className="absolute -top-2 -right-2">
              {isCorrect ? (
                <CheckCircle2 className="w-8 h-8 text-green-500 bg-white rounded-full" />
              ) : (
                <XCircle className="w-8 h-8 text-red-400 bg-white rounded-full" />
              )}
            </div>
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-xl font-bold mb-1 text-gray-900">
              {isCorrect ? "正解！" : "不正解..."}
            </h3>
            <p className="text-base text-gray-700">
              正解は「{correctAnswer}」です
            </p>
            {!isCorrect && (
              <p className="text-gray-500 text-sm mt-1">
                あなたの回答: {userAnswer}
              </p>
            )}
          </div>
        </div>

        {/* ボタン: QuizCardの選択肢ボタンと同じ位置に来るようにする */}
        <button
          onClick={onNext}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg
                   transition-colors duration-200"
        >
          {currentQuestion === totalQuestions ? "テスト結果を表示" : "次の問題へ"}
        </button>
      </div>
    </div>
  );
};
