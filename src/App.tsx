import { useState } from 'react'; // ReactのuseStateフックをインポート
import { useQuiz } from './hooks/useQuiz'; // useQuizフックをインポート
import { QuizCard } from './components/QuizCard'; // QuizCardコンポーネントをインポート
import { ScoreBoard } from './components/ScoreBoard'; // ScoreBoardコンポーネントをインポート
import { QuizResults } from './components/QuizResults'; // QuizResultsコンポーネントをインポート
import { AnswerFeedback } from './components/AnswerFeedback'; // AnswerFeedbackコンポーネントをインポート
import { StartScreen } from './components/StartScreen'; // StartScreenコンポーネントをインポート
import { Gamepad2 } from 'lucide-react'; // lucide-reactライブラリからアイコンをインポート
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-4">
      {/* クイズが開始されていない場合の表示（タイトルはStartScreen側に含まれる） */}
      {!currentQuestion && !isFinished ? (
        <StartScreen onStart={handleStartQuiz} playCount={playCount} />
      ) : (
        <>
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-2 flex items-center justify-center gap-2">
              <Gamepad2 className="w-8 h-8 shrink-0" />
              初代ポケモン名前当てクイズ
            </h1>
            <p className="text-gray-300 text-base md:text-lg">「ポケットモンスター赤・緑」に登場する151匹から出題</p>
          </div>

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
              playCount={playCount}
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
