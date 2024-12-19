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
}

// AnswerFeedbackコンポーネントの定義
export const AnswerFeedback: React.FC<AnswerFeedbackProps> = ({
  isCorrect, // 正解かどうかのフラグを受け取る
  correctAnswer, // 正解の答えを受け取る
  userAnswer, // ユーザーの答えを受け取る
  pokemon, // ポケモンの情報を受け取る
  onNext // 次の問題へ進むための関数を受け取る
}) => {
  return (
    // コンポーネントの全体を囲むdiv
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 max-w-md w-full">
      {/* 中央に配置するためのflexコンテナ */}
      <div className="flex flex-col items-center">
        {/* 正解か不正解かを示すアイコン */}
        <div className="mb-4">
          {isCorrect ? (
            <CheckCircle2 className="w-16 h-16 text-green-500" /> // 正解の場合のアイコン
          ) : (
            <XCircle className="w-16 h-16 text-red-400" /> // 不正解の場合のアイコン
          )}
        </div>
        
        {/* ポケモンの画像を表示する部分 */}
        <div className="w-48 h-48 flex items-center justify-center mb-4">
          <img 
            src={pokemon.imageUrl} // ポケモンの画像URL
            alt={pokemon.name.japanese} // ポケモンの日本語名をalt属性に設定
            className="w-full h-full object-contain" // 画像のスタイル
          />
        </div>

        {/* 正解・不正解のメッセージとユーザーの答えを表示する部分 */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-2 text-gray-900">
            {isCorrect ? "正解！" : "不正解..."} // 正解か不正解かのメッセージ
          </h3>
          <p className="text-lg text-gray-700">
            正解は「{correctAnswer}」です // 正解の答えを表示
          </p>
          {!isCorrect && (
            <p className="text-gray-500 mt-1">
              あなたの回答: {userAnswer} // 不正解の場合、ユーザーの答えを表示
            </p>
          )}
        </div>

        {/* 次の問題へ進むボタン */}
        <button
          onClick={onNext} // ボタンがクリックされたときにonNext関数を呼び出す
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg
                   transition-colors duration-200" // ボタンのスタイル
        >
          次の問題へ // ボタンのラベル
        </button>
      </div>
    </div>
  );
};
