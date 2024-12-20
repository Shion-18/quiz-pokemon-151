import React from 'react'; // Reactライブラリをインポートして、コンポーネントを作成できるようにします。
import type { QuizQuestion } from '../types/pokemon'; // QuizQuestion型をインポートして、クイズの問題の型を定義します。

// QuizCardPropsインターフェイスの定義
// このインターフェイスは、QuizCardコンポーネントが受け取るプロパティの型を定義します。
interface QuizCardProps {
  question: QuizQuestion; // クイズの問題を表すオブジェクト
  onAnswer: (answer: string) => void; // ユーザーが選択した答えを親コンポーネントに返すための関数
}

// QuizCardコンポーネントの定義
// React.FCは、関数コンポーネントの型を定義するためのヘルパーです。
// QuizCardPropsは、このコンポーネントが受け取るプロパティの型です。
export const QuizCard: React.FC<QuizCardProps> = ({ 
  question, // クイズの問題オブジェクトを受け取ります。
  onAnswer // ユーザーの回答を処理する関数を受け取ります。
}) => {
  // コンポーネントのJSXを返します。
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 max-w-md w-full">
      {/* ポケモンの画像を中央に表示するためのコンテナ */}
      <div className="flex justify-center mb-6">
        <img 
          src={question.pokemon.imageUrl} // ポケモンの画像URLを指定します。
          alt="Pokemon" // 画像が表示されない場合の代替テキストを指定します。
          className="w-48 h-48 object-contain filter blur-lg" // 画像のスタイルを指定します。
        />
      </div>
      {/* クイズの選択肢を2列のグリッドで表示します。 */}
      <div className="grid grid-cols-2 gap-4">
        {question.options.map((option, index) => (
          <button
            key={index} // 各ボタンに一意のキーを設定します。
            onClick={() => onAnswer(option)} // ボタンがクリックされたときに選択した答えを親コンポーネントに返します。
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg
                     transition-colors duration-200" // ボタンのスタイルを指定します。
          >
            {option} // ボタンに表示されるテキストを指定します。
          </button>
        ))}
      </div>
    </div>
  );
<<<<<<< HEAD
};
=======
};
>>>>>>> 666b29f1f3817e693ed1b67e77311c0320f70774
