import React, { useEffect, useState } from 'react';
import { useQuiz } from './hooks/useQuiz';
import { QuizCard } from './components/QuizCard';
import { ScoreBoard } from './components/ScoreBoard';
import { QuizResults } from './components/QuizResults';
import { AnswerFeedback } from './components/AnswerFeedback';
import { Gamepad2, Users } from 'lucide-react';
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
          {!isFinished && (
            <div className="mb-6">
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