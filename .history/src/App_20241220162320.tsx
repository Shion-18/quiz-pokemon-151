import { useState } from 'react'; // ReactのuseStateフックをインポート
import { useQuiz } from './hooks/useQuiz'; // useQuizフックをインポート
import { QuizCard } from './components/QuizCard'; // QuizCardコンポーネントをインポート
import { ScoreBoard } from './components/ScoreBoard'; // ScoreBoardコンポーネントをインポート
import { QuizResults } from './components/QuizResults'; // QuizResultsコンポーネントをインポート
import { AnswerFeedback } from './components/AnswerFeedback'; // AnswerFeedbackコンポーネントをインポート
import { Gamepad2, Users } from 'lucide-react'; // lucide-reactライブラリからアイコンをインポート
import type { Pokemon } from './types/pokemon'; // Pokemon型をインポート

function App() {
  // useQuizフックから必要な状態と関数を取得
  const { 
    currentQuestion, 
    score,
    remainingQuestions,
    isFinished,
    history,
    playCount,
    generateQuestion, 
    checkAnswer,
    resetQuiz 
  } = useQuiz(); 

  // 正解を表示するかどうかを管理する状態
  const [showingAnswer, setShowingAnswer] = useState(false); 
  // 最後の正解を管理する状態
  const [lastAnswer, setLastAnswer] = useState<{
    isCorrect: boolean;
    correctAnswer: string;
    userAnswer: string;
    pokemon: Pokemon;
  } | null>(null); 

  // クイズを始めるボタンがクリックされた時に、新しい問題を生成
  const handleStartQuiz = () => {
    generateQuestion(); 
  };

  // ユーザーの回答が正しいかどうかをチェックし、状態を更新
  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return; // 現在の問題が存在しない場合は何もしない
    
    const isCorrect = checkAnswer(answer); // ユーザーの回答が正しいかどうかをチェック
    setLastAnswer({
      isCorrect,
      correctAnswer: currentQuestion.pokemon.name.japanese,
      userAnswer: answer,
      pokemon: currentQuestion.pokemon
    });
    setShowingAnswer(true); // 正解を表示するフラグを立てる
  };

  // 次の問題を生成し、状態をリセット
  const handleNextQuestion = () => {
    setShowingAnswer(false); // 正解を表示するフラグを降ろす
    setLastAnswer(null); // 最後の正解をリセット
    generateQuestion(); // 次の問題を生成
  };

  // 初期表示用のポケモンデータ
  const starterPokemon = [
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-100 mb-2 flex items-center justify-center gap-2">
          <Gamepad2 className="w-8 h-8" />
          初代ポケモン名前当てクイズ
        </h1>
        <p className="text-gray-300 text-lg">「ポケットモンスター赤・緑」に登場する151匹から出題</p>
      </div>

      {/* クイズが開始されていない場合の表示 */}
      {!currentQuestion && !isFinished ? (
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-8 max-w-2xl w-full relative">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {starterPokemon.map((pokemon) => (
              <div key={pokemon.id} className="flex flex-col items-center">
                <img
                  src={pokemon.imageUrl}
                  alt={pokemon.name}
                  className="w-24 h-24 object-contain hover:scale-110 transition-transform duration-200"
                />
              </div>
            ))}
          </div>
          <div className="text-center mb-16">
            <button
              onClick={handleStartQuiz}
              className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg
                       hover:bg-blue-700 transition-colors duration-200 text-lg
                       transform hover:scale-105 transition-transform duration-200
                       shadow-lg hover:shadow-xl"
            >
              クイズを始める
            </button>
          </div>
          {playCount > 0 && (
            <div className="absolute bottom-6 right-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200 shadow-sm">
                <Users className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">
                  これまで{playCount}人のポケモンファンが、このクイズを遊びました！
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* クイズが終了していない場合のスコアボード表示 */}
          {!isFinished && (
            <div className="mb-6">
              <ScoreBoard 
                score={score} 
                remainingQuestions={remainingQuestions}
                isFinished={isFinished}
              />
            </div>
          )}

          {/* クイズが終了した場合の結果表示 */}
          {isFinished ? (
            <QuizResults 
              score={score}
              history={history}
              onReset={resetQuiz}
            />
          ) : showingAnswer && lastAnswer ? (
            // 正解を表示する場合のフィードバック表示
            <AnswerFeedback
              isCorrect={lastAnswer.isCorrect}
              correctAnswer={lastAnswer.correctAnswer}
              userAnswer={lastAnswer.userAnswer}
              pokemon={lastAnswer.pokemon}
              onNext={handleNextQuestion}
              currentQuestion={history.length + 1}
              totalQuestions={10}
            />
          ) : (
            // 現在の問題を表示
            currentQuestion && (
              <QuizCard
                question={currentQuestion}
                onAnswer={handleAnswer}
              />
            )
          )}
        </>
      )}
    </div>
  );
}

export default App;
