import React from 'react'; // Reactライブラリをインポートして、Reactコンポーネントを作成できるようにします。

// ScoreBoardPropsインターフェイスの定義
// このインターフェイスは、ScoreBoardコンポーネントが受け取るプロパティ（props）の型を定義します。
// propsは、親コンポーネントから子コンポーネントにデータを渡すための手段です。
interface ScoreBoardProps {
  score: number; // 現在のスコアを表す数値
  remainingQuestions: number; // 残りの問題数を表す数値
  isFinished: boolean; // クイズが終了したかどうかを示すブール値（trueまたはfalse）
}

// ScoreBoardコンポーネントの定義
// React.FCは、関数コンポーネントの型を定義するためのヘルパーです。
// ScoreBoardPropsは、このコンポーネントが受け取るプロパティの型を指定します。
export const ScoreBoard: React.FC<ScoreBoardProps> = ({ remainingQuestions }) => {
  // JSXを返します。JSXは、JavaScript内でHTMLのような構文を使ってUIを記述するためのものです。
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg px-6 py-3 shadow-md">
      {/* 残りの問題数を表示するテキスト */}
      <div className="text-gray-700 font-medium">
        残り問題数: {remainingQuestions} {/* remainingQuestionsプロパティの値を表示します */}
      </div>
    </div>
  );
};
