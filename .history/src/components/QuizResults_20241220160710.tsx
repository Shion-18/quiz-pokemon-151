import React from 'react'; // Reactライブラリをインポート
import type { QuizHistory } from '../hooks/useQuiz'; // useQuizフックからQuizHistory型をインポート
import { CheckCircle2, XCircle, Share2 } from 'lucide-react'; // lucide-reactライブラリからアイコンをインポート

// QuizResultsPropsインターフェイスの定義
// このインターフェイスは、QuizResultsコンポーネントが受け取るプロパティの型を定義します。
interface QuizResultsProps {
  score: number; // ユーザーが正解した問題数
  history: QuizHistory[]; // クイズの履歴を保持する配列
  onReset: () => void; // クイズをリセットするための関数
}

// QuizResultsコンポーネントの定義
// このコンポーネントは、クイズの結果を表示します。
export const QuizResults: React.FC<QuizResultsProps> = ({ score, history, onReset }) => {
  const totalQuestions = history.length; // 全問題数を計算
  const incorrectCount = totalQuestions - score; // 不正解した問題数を計算

  // 結果をシェアするための関数
  // ユーザーが結果をシェアしたいときに呼び出されます。
  const handleShare = () => {
    // 各問題の結果をエモジで表した文字列を作成
    const resultEmojis = history.map((item, index) => 
      `${index + 1}${item.isCorrect ? '🟢' : '❌'}`
    ).join('');
    
    // シェアするテキストを作成
    const shareText = `初代ポケモン名前当てクイズ\n\n${score}/${totalQuestions}問 正解！\n${resultEmojis}\n\n#初代ポケモン名前当てクイズ\n\nhttps://quiz-pokemon-151.vercel.app/`;

    // シェアするためのURLを作成
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(shareUrl, '_blank'); // シェアするためのウィンドウを開く
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-8 max-w-4xl w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        10問中{score}問正解しました！
      </h2>

      {/* スコアグラフを表示する部分 */}
      <div className="mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>正解: {score}問</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-400 rounded"></div>
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

      {/* 各問題の履歴を表示する部分 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {history.map((item, index) => (
          <div 
            key={index}
            className="flex items-center gap-4 bg-blue-50 rounded-lg p-4"
          >
            <img 
              src={item.pokemon.imageUrl}
              alt={item.pokemon.name.japanese}
<<<<<<< HEAD
              className="w-24 h-24 object-contain"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">
                  {index + 1}問目
                </span>
                {item.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
              </div>
              <p className="text-sm text-gray-600">
                正解は「{item.pokemon.name.japanese}」です
              </p>
              {!item.isCorrect && (
                <p className="text-sm text-gray-500">
=======
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
>>>>>>> 666b29f1f3817e693ed1b67e77311c0320f70774
                  あなたの回答: {item.userAnswer}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={onReset} // クイズをリセットするボタン
          className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg
                   hover:bg-blue-700 transition-colors duration-200"
        >
          もう一度プレイ
        </button>
        <button
          onClick={handleShare} // 結果をシェアするボタン
          className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg
                   hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          結果をXでシェア
        </button>
      </div>
    </div>
  );
<<<<<<< HEAD
};
=======
}
>>>>>>> 666b29f1f3817e693ed1b67e77311c0320f70774
