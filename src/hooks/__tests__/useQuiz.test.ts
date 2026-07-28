import { renderHook, act, waitFor } from '@testing-library/react';
import { useQuiz } from '../useQuiz';

// useQuiz はマウント時に GET /api/play-count、10問終了時に POST /api/play-count を呼ぶ。
// テストではネットワークに出ないよう fetch をモックする。
const mockFetch = vi.fn();

// GET は 7、POST は 42 を返す（どちらが呼ばれたか区別できるようにする）
const respondWithCount = (_url: string, init?: RequestInit) =>
  Promise.resolve({
    json: async () => ({ count: init?.method === 'POST' ? 42 : 7 }),
  });

// マウント時の GET が解決するまで待ってからフックを返す
const setupQuiz = async () => {
  const view = renderHook(() => useQuiz());
  await waitFor(() => expect(view.result.current.playCount).toBe(7));
  return view;
};

describe('useQuiz', () => {
  beforeEach(() => {
    localStorage.clear();
    mockFetch.mockReset();
    mockFetch.mockImplementation(respondWithCount);
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('正解を含む一意な4つの選択肢を持つ問題を生成する', async () => {
    const { result } = await setupQuiz();

    // 1セッション分（10問）すべての選択肢を検証する
    for (let i = 0; i < 10; i++) {
      act(() => {
        result.current.generateQuestion();
      });

      const question = result.current.currentQuestion;
      expect(question).not.toBeNull();
      expect(question!.options).toHaveLength(4);
      expect(new Set(question!.options).size).toBe(4);
      expect(question!.options).toContain(question!.correctAnswer);
      expect(question!.correctAnswer).toBe(question!.pokemon.name.japanese);

      act(() => {
        result.current.checkAnswer(question!.correctAnswer);
      });
    }
  });

  it('正解するとスコアが加算され、履歴に正解として記録される', async () => {
    const { result } = await setupQuiz();

    act(() => {
      result.current.generateQuestion();
    });
    const correctAnswer = result.current.currentQuestion!.correctAnswer;

    act(() => {
      result.current.checkAnswer(correctAnswer);
    });

    expect(result.current.score).toBe(1);
    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].isCorrect).toBe(true);
    expect(result.current.history[0].userAnswer).toBe(correctAnswer);
  });

  it('不正解だとスコアは変わらず、選んだ回答が履歴に残る', async () => {
    const { result } = await setupQuiz();

    act(() => {
      result.current.generateQuestion();
    });
    const question = result.current.currentQuestion!;
    const wrongAnswer = question.options.find((option) => option !== question.correctAnswer)!;

    act(() => {
      result.current.checkAnswer(wrongAnswer);
    });

    expect(result.current.score).toBe(0);
    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].isCorrect).toBe(false);
    expect(result.current.history[0].userAnswer).toBe(wrongAnswer);
  });

  it('1セッションの10問に同じポケモンは出題されない', async () => {
    const { result } = await setupQuiz();

    const askedIds: number[] = [];
    for (let i = 0; i < 10; i++) {
      act(() => {
        result.current.generateQuestion();
      });
      const question = result.current.currentQuestion!;
      askedIds.push(question.pokemon.id);

      act(() => {
        result.current.checkAnswer(question.correctAnswer);
      });
    }

    expect(askedIds).toHaveLength(10);
    expect(new Set(askedIds).size).toBe(10);
  });

  it('10問回答後にクイズが終了し、プレイ回数をPOSTして更新する', async () => {
    const { result } = await setupQuiz();

    for (let i = 0; i < 10; i++) {
      act(() => {
        result.current.generateQuestion();
      });
      const correctAnswer = result.current.currentQuestion!.correctAnswer;
      act(() => {
        result.current.checkAnswer(correctAnswer);
      });
    }

    expect(result.current.isFinished).toBe(false);

    // 11回目の generateQuestion が終了判定とプレイ回数の加算を行う
    act(() => {
      result.current.generateQuestion();
    });

    expect(result.current.isFinished).toBe(true);
    expect(result.current.score).toBe(10);
    expect(mockFetch).toHaveBeenCalledWith('/api/play-count', { method: 'POST' });

    await waitFor(() => expect(result.current.playCount).toBe(42));
    expect(localStorage.getItem('pokemon-quiz-play-count')).toBe('42');
  });

  it('resetQuizでスコア・履歴・出題状態が初期化される', async () => {
    const { result } = await setupQuiz();

    act(() => {
      result.current.generateQuestion();
    });
    act(() => {
      result.current.checkAnswer(result.current.currentQuestion!.correctAnswer);
    });
    expect(result.current.score).toBe(1);

    act(() => {
      result.current.resetQuiz();
    });

    expect(result.current.score).toBe(0);
    expect(result.current.history).toHaveLength(0);
    expect(result.current.currentQuestion).toBeNull();
    expect(result.current.isFinished).toBe(false);
    expect(result.current.remainingQuestions).toBe(10);
  });
});
