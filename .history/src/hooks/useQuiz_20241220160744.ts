import { useState, useCallback, useEffect } from 'react';
import { allPokemon } from '../data';
import type { QuizQuestion } from '../types/pokemon';

// クイズの全体的な設定を定義
const TOTAL_QUESTIONS = 10; // クイズの総問題数
const PLAY_COUNT_KEY = 'pokemon-quiz-play-count'; // ローカルストレージに保存するプレイ回数のキー

// クイズの履歴を記録するためのインターフェイス
export interface QuizHistory {
  pokemon: {
    id: number; // ポケモンのID
    name: {
      japanese: string; // ポケモンの日本語名
      english: string; // ポケモンの英語名
    };
    imageUrl: string; // ポケモンの画像URL
  };
  userAnswer: string; // ユーザーの回答
  isCorrect: boolean; // 回答が正解かどうか
}

// useQuizフックの定義
export const useQuiz = () => {
  // 現在の問題、スコア、問題番号、クイズ終了フラグ、クイズの履歴、プレイ回数を状態として管理
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null); // 現在の問題
  const [score, setScore] = useState(0); // 現在のスコア
  const [questionNumber, setQuestionNumber] = useState(0); // 現在の問題番号
  const [isFinished, setIsFinished] = useState(false); // クイズが終了したかどうか
  const [history, setHistory] = useState<QuizHistory[]>([]); // クイズの履歴
  const [playCount, setPlayCount] = useState(0); // クイズのプレイ回数

  // コンポーネントがマウントされた時に、ローカルストレージからプレイ回数を取得
  useEffect(() => {
    const count = localStorage.getItem(PLAY_COUNT_KEY); // ローカルストレージからプレイ回数を取得
    setPlayCount(count ? parseInt(count, 10) : 0); // プレイ回数を状態に設定
  }, []);

  // 新しい問題を生成する関数
  const generateQuestion = useCallback(() => {
    if (questionNumber >= TOTAL_QUESTIONS) { // 全ての問題が終了したか確認
      setIsFinished(true); // クイズを終了状態に設定
      const newCount = playCount + 1; // プレイ回数を増やす
      localStorage.setItem(PLAY_COUNT_KEY, newCount.toString()); // ローカルストレージに新しいプレイ回数を保存
      setPlayCount(newCount); // 状態を更新
      return;
    }

    // ランダムにポケモンを選択
    const pokemon = allPokemon[Math.floor(Math.random() * allPokemon.length)];
    // 不正解のオプションを生成
    const incorrectOptions = allPokemon
      .filter(p => p.id !== pokemon.id) // 正解のポケモンを除外
      .map(p => p.name.japanese) // 日本語名を取得
      .sort(() => Math.random() - 0.5) // ランダムに並び替え
      .slice(0, 3); // 3つの不正解オプションを選択
    
    // オプションをシャッフルして正解を含める
    const options = [...incorrectOptions, pokemon.name.japanese]
      .sort(() => Math.random() - 0.5); // オプションをランダムに並び替え

    // 現在の問題を更新
    setCurrentQuestion({
      pokemon, // 選択されたポケモン
      options, // 選択肢
      correctAnswer: pokemon.name.japanese // 正解の答え
    });
  }, [questionNumber, playCount]);

  // ユーザーの答えをチェックする関数
  const checkAnswer = useCallback((answer: string) => {
    if (!currentQuestion) return false; // 現在の問題がない場合は終了
    
    // ユーザーの答えが正解かどうかを判断
    const isCorrect = answer === currentQuestion.correctAnswer; // 正解かどうかをチェック
    if (isCorrect) {
      setScore(prev => prev + 1); // スコアを増やす
    }

    // クイズの履歴を更新
    setHistory(prev => [...prev, {
      pokemon: currentQuestion.pokemon, // 現在のポケモン
      userAnswer: answer, // ユーザーの回答
      isCorrect // 正解かどうか
    }]);

    // 次の問題へ進む
    setQuestionNumber(prev => prev + 1); // 問題番号を増やす
    return isCorrect; // 正解かどうかを返す
  }, [currentQuestion]);

  // クイズをリセットする関数
  const resetQuiz = useCallback(() => {
    setScore(0); // スコアをリセット
    setQuestionNumber(0); // 問題番号をリセット
    setIsFinished(false); // クイズ終了フラグをリセット
    setHistory([]); // 履歴をリセット
    setCurrentQuestion(null); // 現在の問題をリセット
  }, []);

  // フックから返すオブジェクト
  return {
    currentQuestion, // 現在の問題
    score, // 現在のスコア
    questionNumber, // 現在の問題番号
    remainingQuestions: TOTAL_QUESTIONS - questionNumber, // 残りの問題数
    isFinished, // クイズが終了したかどうか
    history, // クイズの履歴
    playCount, // プレイ回数
    generateQuestion, // 新しい問題を生成する関数
    checkAnswer, // 答えをチェックする関数
    resetQuiz // クイズをリセットする関数
  };
};
