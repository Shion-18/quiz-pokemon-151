import React, { useState } from 'react';
import { useQuiz } from './hooks/useQuiz';
import { QuizCard } from './components/QuizCard';
import { ScoreBoard } from './components/ScoreBoard';
import { QuizResults } from './components/QuizResults';
import { AnswerFeedback } from './components/AnswerFeedback';
import { StartScreen } from './components/StartScreen';
import type { Pokemon } from './types/pokemon';

function App() {
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

  const [showingAnswer, setShowingAnswer] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<{
    isCorrect: boolean;
    correctAnswer: string;
    userAnswer: string;
    pokemon: Pokemon;
  } | null>(null);

  const handleStartQuiz = () => {
    generateQuestion();
  };

  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return;
    
    const isCorrect = checkAnswer(answer);
    setLastAnswer({
      isCorrect,
      correctAnswer: currentQuestion.pokemon.name.japanese,
      userAnswer: answer,
      pokemon: currentQuestion.pokemon
    });
    setShowingAnswer(true);
  };

  const handleNextQuestion = () => {
    setShowingAnswer(false);
    setLastAnswer(null);
    generateQuestion();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-4">
      {!currentQuestion && !isFinished ? (
        <StartScreen onStart={handleStartQuiz} playCount={playCount} />
      ) : (
        <>
          {!isFinished && (
            <div className="mb-6 w-full max-w-md">
              <ScoreBoard 
                score={score} 
                remainingQuestions={remainingQuestions}
                isFinished={isFinished}
              />
            </div>
          )}

          {isFinished ? (
            <QuizResults 
              score={score}
              history={history}
              onReset={resetQuiz}
            />
          ) : showingAnswer && lastAnswer ? (
            <AnswerFeedback
              isCorrect={lastAnswer.isCorrect}
              correctAnswer={lastAnswer.correctAnswer}
              userAnswer={lastAnswer.userAnswer}
              pokemon={lastAnswer.pokemon}
              onNext={handleNextQuestion}
            />
          ) : (
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