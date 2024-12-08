import { useState, useCallback, useEffect } from 'react';
import { allPokemon } from '../data';
import type { QuizQuestion } from '../types/pokemon';

const TOTAL_QUESTIONS = 10;
const PLAY_COUNT_KEY = 'pokemon-quiz-play-count';

export interface QuizHistory {
  pokemon: {
    id: number;
    name: {
      japanese: string;
      english: string;
    };
    imageUrl: string;
  };
  userAnswer: string;
  isCorrect: boolean;
}

export const useQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [history, setHistory] = useState<QuizHistory[]>([]);
  const [playCount, setPlayCount] = useState(0);

  useEffect(() => {
    const count = localStorage.getItem(PLAY_COUNT_KEY);
    setPlayCount(count ? parseInt(count, 10) : 0);
  }, []);

  const generateQuestion = useCallback(() => {
    if (questionNumber >= TOTAL_QUESTIONS) {
      setIsFinished(true);
      // クイズ終了時にプレイ回数を増やす
      const newCount = playCount + 1;
      localStorage.setItem(PLAY_COUNT_KEY, newCount.toString());
      setPlayCount(newCount);
      return;
    }

    const pokemon = allPokemon[Math.floor(Math.random() * allPokemon.length)];
    const incorrectOptions = allPokemon
      .filter(p => p.id !== pokemon.id)
      .map(p => p.name.japanese)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const options = [...incorrectOptions, pokemon.name.japanese]
      .sort(() => Math.random() - 0.5);

    setCurrentQuestion({
      pokemon,
      options,
      correctAnswer: pokemon.name.japanese
    });
  }, [questionNumber, playCount]);

  const checkAnswer = useCallback((answer: string) => {
    if (!currentQuestion) return false;
    
    const isCorrect = answer === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setHistory(prev => [...prev, {
      pokemon: currentQuestion.pokemon,
      userAnswer: answer,
      isCorrect
    }]);

    setQuestionNumber(prev => prev + 1);
    return isCorrect;
  }, [currentQuestion]);

  const resetQuiz = useCallback(() => {
    setScore(0);
    setQuestionNumber(0);
    setIsFinished(false);
    setHistory([]);
    setCurrentQuestion(null);
  }, []);

  return {
    currentQuestion,
    score,
    questionNumber,
    remainingQuestions: TOTAL_QUESTIONS - questionNumber,
    isFinished,
    history,
    playCount,
    generateQuestion,
    checkAnswer,
    resetQuiz
  };
};