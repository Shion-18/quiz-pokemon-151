import { useState, useCallback, useEffect, useRef } from 'react';
import { allPokemon } from '../data';
import type { Pokemon, QuizQuestion } from '../types/pokemon';

// クイズの全体的な設定を定義
const TOTAL_QUESTIONS = 10; // クイズの総問題数
const PLAY_COUNT_KEY = 'pokemon-quiz-play-count'; // ローカルストレージに保存するプレイ回数のキー

// 配列をシャッフルして先頭n個を返す
const pickRandom = (arr: Pokemon[], n: number): Pokemon[] => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
};

// クイズの履歴を記録するためのインターフェイス
export interface QuizHistory {
  pokemon: {
    id: number; // ポケモンのID
    name: {
      japanese: string; // ポケモンの日本語名
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
  const questionPoolRef = useRef<Pokemon[]>([]); // 出題用のポケモンリスト（10匹、重複なし）

  // コンポーネントがマウントされた時に、累積プレイ回数を取得
  useEffect(() => {
    // localStorageから即座に表示（フラッシュ防止）
    const localCount = localStorage.getItem(PLAY_COUNT_KEY);
    if (localCount) {
      setPlayCount(parseInt(localCount, 10));
    }

    // KV APIからサーバー値を取得して上書き
    fetch('/api/play-count')
      .then(res => res.json())
      .then(data => {
        const kvCount = data.count ?? 0;
        setPlayCount(kvCount);
        localStorage.setItem(PLAY_COUNT_KEY, kvCount.toString());
      })
      .catch(err => {
        console.error('Failed to fetch play count:', err);
      });
  }, []);

  // 新しい問題を生成する関数
  const generateQuestion = useCallback(() => {
    if (questionNumber >= TOTAL_QUESTIONS) { // 全ての問題が終了したか確認
      setIsFinished(true); // クイズを終了状態に設定

      // KV APIでアトミックにインクリメント
      fetch('/api/play-count', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          const newCount = data.count ?? playCount + 1;
          setPlayCount(newCount);
          localStorage.setItem(PLAY_COUNT_KEY, newCount.toString());
        })
        .catch(() => {
          // フォールバック: ローカルで楽観的にインクリメント
          const newCount = playCount + 1;
          setPlayCount(newCount);
          localStorage.setItem(PLAY_COUNT_KEY, newCount.toString());
        });

      return;
    }

    // 初回呼び出し時に出題プールを生成（重複なし10匹）
    if (questionPoolRef.current.length === 0) {
      questionPoolRef.current = pickRandom(allPokemon, TOTAL_QUESTIONS);
    }

    const pokemon = questionPoolRef.current[questionNumber];
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
  }, [questionNumber]);

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
    questionPoolRef.current = []; // 出題プールをリセット
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
