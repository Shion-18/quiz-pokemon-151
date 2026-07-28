import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuizCard } from '../QuizCard';
import { AnswerFeedback } from '../AnswerFeedback';
import { QuizResults } from '../QuizResults';
import type { QuizQuestion } from '../../types/pokemon';
import type { QuizHistory } from '../../hooks/useQuiz';

const pikachu = {
  id: 25,
  name: { japanese: 'ピカチュウ' },
  imageUrl: 'https://example.com/25.png',
};

const mockQuestion: QuizQuestion = {
  pokemon: pikachu,
  options: ['ピカチュウ', 'ライチュウ', 'ピッピ', 'プリン'],
  correctAnswer: 'ピカチュウ',
};

// 10問分のダミー履歴（7問正解・3問不正解）
const mockHistory: QuizHistory[] = Array.from({ length: 10 }, (_, i) => ({
  pokemon: {
    id: i + 1,
    name: { japanese: `ポケモン${i + 1}` },
    imageUrl: `https://example.com/${i + 1}.png`,
  },
  userAnswer: i < 7 ? `ポケモン${i + 1}` : 'ハズレ',
  isCorrect: i < 7,
}));

describe('QuizCard', () => {
  it('4つの選択肢を表示し、クリックでonAnswerが呼ばれる', async () => {
    const onAnswer = vi.fn();
    render(<QuizCard question={mockQuestion} onAnswer={onAnswer} />);

    for (const option of mockQuestion.options) {
      expect(screen.getByText(option)).toBeInTheDocument();
    }

    await userEvent.click(screen.getByText('ライチュウ'));
    expect(onAnswer).toHaveBeenCalledWith('ライチュウ');
  });
});

describe('AnswerFeedback', () => {
  it('正解時は「正解！」を表示し、ユーザーの回答は表示しない', () => {
    render(
      <AnswerFeedback
        isCorrect={true}
        correctAnswer="ピカチュウ"
        userAnswer="ピカチュウ"
        pokemon={pikachu}
        onNext={vi.fn()}
        currentQuestion={3}
        totalQuestions={10}
      />
    );

    expect(screen.getByText('正解！')).toBeInTheDocument();
    expect(screen.getByText('正解は「ピカチュウ」です')).toBeInTheDocument();
    expect(screen.queryByText(/あなたの回答/)).not.toBeInTheDocument();
  });

  it('不正解時は「不正解...」とユーザーの回答を表示する', () => {
    render(
      <AnswerFeedback
        isCorrect={false}
        correctAnswer="ピカチュウ"
        userAnswer="ライチュウ"
        pokemon={pikachu}
        onNext={vi.fn()}
        currentQuestion={3}
        totalQuestions={10}
      />
    );

    expect(screen.getByText('不正解...')).toBeInTheDocument();
    expect(screen.getByText('あなたの回答: ライチュウ')).toBeInTheDocument();
    expect(screen.getByText('次の問題へ')).toBeInTheDocument();
  });

  it('最終問題ではボタンが「テスト結果を表示」になる', async () => {
    const onNext = vi.fn();
    render(
      <AnswerFeedback
        isCorrect={true}
        correctAnswer="ピカチュウ"
        userAnswer="ピカチュウ"
        pokemon={pikachu}
        onNext={onNext}
        currentQuestion={10}
        totalQuestions={10}
      />
    );

    const button = screen.getByText('テスト結果を表示');
    expect(screen.queryByText('次の問題へ')).not.toBeInTheDocument();

    await userEvent.click(button);
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});

describe('QuizResults', () => {
  it('スコア・履歴・ボタンを表示し、もう一度プレイでonResetが呼ばれる', async () => {
    const onReset = vi.fn();
    render(<QuizResults score={7} history={mockHistory} onReset={onReset} playCount={123} />);

    expect(screen.getByText('10問中7問正解しました！')).toBeInTheDocument();
    expect(screen.getByText('正解: 7問')).toBeInTheDocument();
    expect(screen.getByText('不正解: 3問')).toBeInTheDocument();
    expect(screen.getAllByText(/問目/)).toHaveLength(10);
    expect(screen.getByText(/これまで123人/)).toBeInTheDocument();

    await userEvent.click(screen.getByText('もう一度プレイ'));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('シェアボタンがX(Twitter)のintent URLを絵文字付きで開く', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    const history: QuizHistory[] = [
      { pokemon: { id: 1, name: { japanese: 'フシギダネ' }, imageUrl: '' }, userAnswer: 'フシギダネ', isCorrect: true },
      { pokemon: { id: 4, name: { japanese: 'ヒトカゲ' }, imageUrl: '' }, userAnswer: 'ゼニガメ', isCorrect: false },
      { pokemon: { id: 7, name: { japanese: 'ゼニガメ' }, imageUrl: '' }, userAnswer: 'ゼニガメ', isCorrect: true },
    ];

    render(<QuizResults score={2} history={history} onReset={vi.fn()} playCount={0} />);
    await userEvent.click(screen.getByText('結果をXでシェア'));

    expect(openSpy).toHaveBeenCalledTimes(1);
    const shareUrl = openSpy.mock.calls[0][0] as string;
    expect(shareUrl).toContain('https://twitter.com/intent/tweet?text=');

    const shareText = decodeURIComponent(shareUrl.split('text=')[1]);
    expect(shareText).toContain('2/3問 正解！');
    expect(shareText).toContain('1🟢2❌3🟢');
    expect(shareText).toContain('#初代ポケモン名前当てクイズ');
    expect(shareText).toContain('https://quiz-pokemon-151.vercel.app/');

    openSpy.mockRestore();
  });
});
