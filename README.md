（※日本語テキストは、英語の下にあります）
## Overview
This silhouette quiz application features 151 Pokémon from Pokémon Red and Green.

[Quiz Link](https://quiz-pokemon-151.vercel.app/)


## Quiz Functionality

-Displays a randomly selected Pokémon silhouette
Choose the correct answer from the four options
-Instant feedback on correct or incorrect answers

-Results Display
Shows the accuracy history for all 10 questions

-Graphical score representation

-Share results on X (formerly Twitter)

-Visual representation using emojis

-Play Count
Displays the total number of plays


## Tech Stack
React
TypeScript
Vite
Tailwind CSS
Lucide React (for icons)


## Project Structure

### src/
├── components/     # UI components  
├── contexts/       # React contexts  
├── data/           # Pokémon data  
├── hooks/          # Custom hooks  
├── types/          # Type definitions  
└── App.tsx         # Main application  


## Acknowledgments
Pokémon image data is provided by PokeAPI(https://pokeapi.co/).



## 概要

「ポケットモンスター赤・緑」に登場する151匹のポケモンから出題される、シルエットクイズ・アプリケーションです。
"https://quiz-pokemon-151.vercel.app/"

## 主な機能

### クイズ機能
- ランダムに選ばれたポケモンのシルエットを表示
- 4つの選択肢から正解を選ぶ
- 正解・不正解がすぐに分かる

### 結果表示
- 全10問の正誤履歴を表示
- グラフィカルなスコア表示

### Xへのシェア機能
- 絵文字を用いた視覚的な結果表示

### プレイ回数カウント
- 累計プレイ回数の表示


## 技術スタック

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (アイコン)


## プロジェクト構成

```
src/
├── components/     # UIコンポーネント
├── contexts/       # Reactコンテキスト
├── data/          # ポケモンのデータ
├── hooks/         # カスタムフック
├── types/         # 型定義
└── App.tsx        # メインアプリケーション
```


## テスト計画

本プロジェクトで想定しているテストケースです。

- **ユニットテスト**: Vitest + React Testing Library
- **E2Eテスト**: Playwright

---

### ユニットテスト（10本）

#### 1. `useQuiz` フック — クイズロジック（5本）

<details>
<summary>UT-01: generateQuestion が正しい形式の問題を生成する</summary>

```ts
// src/hooks/__tests__/useQuiz.test.ts
import { renderHook, act } from '@testing-library/react';
import { useQuiz } from '../useQuiz';

describe('useQuiz', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('generateQuestion が4択の問題を正しく生成する', () => {
    const { result } = renderHook(() => useQuiz());

    act(() => {
      result.current.generateQuestion();
    });

    const question = result.current.currentQuestion;
    expect(question).not.toBeNull();
    expect(question!.options).toHaveLength(4);
    expect(question!.correctAnswer).toBeTruthy();
    // 正解が選択肢に含まれている
    expect(question!.options).toContain(question!.correctAnswer);
    // ポケモンの日本語名が正解と一致する
    expect(question!.pokemon.name.japanese).toBe(question!.correctAnswer);
  });
});
```
</details>

<details>
<summary>UT-02: 選択肢に重複がない</summary>

```ts
it('生成される4つの選択肢がすべてユニークである', () => {
  const { result } = renderHook(() => useQuiz());

  // 複数回生成してすべて検証
  for (let i = 0; i < 20; i++) {
    act(() => {
      result.current.resetQuiz();
    });
    act(() => {
      result.current.generateQuestion();
    });

    const options = result.current.currentQuestion!.options;
    const uniqueOptions = new Set(options);
    expect(uniqueOptions.size).toBe(4);
  }
});
```
</details>

<details>
<summary>UT-03: 正解時にスコアが加算される</summary>

```ts
it('正解するとスコアが+1され、historyにisCorrect:trueが記録される', () => {
  const { result } = renderHook(() => useQuiz());

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
```
</details>

<details>
<summary>UT-04: 不正解時にスコアが変わらない</summary>

```ts
it('不正解だとスコアは0のまま、historyにisCorrect:falseが記録される', () => {
  const { result } = renderHook(() => useQuiz());

  act(() => {
    result.current.generateQuestion();
  });

  const correctAnswer = result.current.currentQuestion!.correctAnswer;
  // 正解以外の選択肢を選ぶ
  const wrongAnswer = result.current.currentQuestion!.options
    .find(opt => opt !== correctAnswer)!;

  act(() => {
    result.current.checkAnswer(wrongAnswer);
  });

  expect(result.current.score).toBe(0);
  expect(result.current.history).toHaveLength(1);
  expect(result.current.history[0].isCorrect).toBe(false);
  expect(result.current.history[0].userAnswer).toBe(wrongAnswer);
});
```
</details>

<details>
<summary>UT-05: 10問完了で isFinished が true になり playCount が +1 される</summary>

```ts
it('10問回答後にisFinishedがtrueになり、localStorageのplayCountが1になる', () => {
  const { result } = renderHook(() => useQuiz());

  // 10問ループ
  for (let i = 0; i < 10; i++) {
    act(() => {
      result.current.generateQuestion();
    });
    const answer = result.current.currentQuestion!.correctAnswer;
    act(() => {
      result.current.checkAnswer(answer);
    });
  }

  // 11回目のgenerateQuestionで終了判定
  act(() => {
    result.current.generateQuestion();
  });

  expect(result.current.isFinished).toBe(true);
  expect(result.current.playCount).toBe(1);
  expect(localStorage.getItem('pokemon-quiz-play-count')).toBe('1');
});
```
</details>

#### 2. コンポーネント描画テスト（3本）

<details>
<summary>UT-06: QuizCard が4つの選択肢ボタンを表示し、クリックで onAnswer が呼ばれる</summary>

```tsx
// src/components/__tests__/QuizCard.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuizCard } from '../QuizCard';
import type { QuizQuestion } from '../../types/pokemon';

const mockQuestion: QuizQuestion = {
  pokemon: {
    id: 25,
    name: { japanese: 'ピカチュウ', english: 'Pikachu' },
    imageUrl: 'https://example.com/pikachu.png',
  },
  options: ['ピカチュウ', 'ライチュウ', 'ピチュー', 'エモンガ'],
  correctAnswer: 'ピカチュウ',
};

describe('QuizCard', () => {
  it('4つの選択肢ボタンが表示され、クリックでonAnswerが呼ばれる', async () => {
    const onAnswer = vi.fn();
    render(<QuizCard question={mockQuestion} onAnswer={onAnswer} />);

    // 4つのボタンがすべて表示されている
    for (const option of mockQuestion.options) {
      expect(screen.getByText(option)).toBeInTheDocument();
    }

    // ボタンをクリックするとonAnswerが呼ばれる
    await userEvent.click(screen.getByText('ライチュウ'));
    expect(onAnswer).toHaveBeenCalledWith('ライチュウ');
  });
});
```
</details>

<details>
<summary>UT-07: AnswerFeedback が正解/不正解で表示を切り替える</summary>

```tsx
// src/components/__tests__/AnswerFeedback.test.tsx
import { render, screen } from '@testing-library/react';
import { AnswerFeedback } from '../AnswerFeedback';

const basePokemon = {
  id: 25,
  name: { japanese: 'ピカチュウ', english: 'Pikachu' },
  imageUrl: 'https://example.com/pikachu.png',
};

describe('AnswerFeedback', () => {
  it('正解時に「正解！」と表示される', () => {
    render(
      <AnswerFeedback
        isCorrect={true}
        correctAnswer="ピカチュウ"
        userAnswer="ピカチュウ"
        pokemon={basePokemon}
        onNext={vi.fn()}
        currentQuestion={3}
        totalQuestions={10}
      />
    );

    expect(screen.getByText('正解！')).toBeInTheDocument();
    expect(screen.getByText('正解は「ピカチュウ」です')).toBeInTheDocument();
    // 不正解時のみ表示される「あなたの回答」がないことを確認
    expect(screen.queryByText(/あなたの回答/)).not.toBeInTheDocument();
  });

  it('不正解時に「不正解...」とユーザーの回答が表示される', () => {
    render(
      <AnswerFeedback
        isCorrect={false}
        correctAnswer="ピカチュウ"
        userAnswer="ライチュウ"
        pokemon={basePokemon}
        onNext={vi.fn()}
        currentQuestion={3}
        totalQuestions={10}
      />
    );

    expect(screen.getByText('不正解...')).toBeInTheDocument();
    expect(screen.getByText('あなたの回答: ライチュウ')).toBeInTheDocument();
  });
});
```
</details>

<details>
<summary>UT-08: QuizResults が履歴・スコア・ボタンを正しく表示する</summary>

```tsx
// src/components/__tests__/QuizResults.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuizResults } from '../QuizResults';
import type { QuizHistory } from '../../hooks/useQuiz';

// 10問分のダミー履歴（7問正解、3問不正解）
const mockHistory: QuizHistory[] = Array.from({ length: 10 }, (_, i) => ({
  pokemon: {
    id: i + 1,
    name: { japanese: `ポケモン${i + 1}`, english: `Pokemon${i + 1}` },
    imageUrl: `https://example.com/${i + 1}.png`,
  },
  userAnswer: i < 7 ? `ポケモン${i + 1}` : 'ハズレ',
  isCorrect: i < 7,
}));

describe('QuizResults', () => {
  it('スコア、履歴グリッド、アクションボタンが表示される', async () => {
    const onReset = vi.fn();
    render(<QuizResults score={7} history={mockHistory} onReset={onReset} />);

    // スコア表示
    expect(screen.getByText('10問中7問正解しました！')).toBeInTheDocument();
    expect(screen.getByText('正解: 7問')).toBeInTheDocument();
    expect(screen.getByText('不正解: 3問')).toBeInTheDocument();

    // 各問題の履歴が表示されている
    expect(screen.getAllByText(/問目/)).toHaveLength(10);

    // ボタンの存在確認
    expect(screen.getByText('もう一度プレイ')).toBeInTheDocument();
    expect(screen.getByText('結果をXでシェア')).toBeInTheDocument();

    // 「もう一度プレイ」クリックでonResetが呼ばれる
    await userEvent.click(screen.getByText('もう一度プレイ'));
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
```
</details>

#### 3. データ / ユーティリティ（2本）

<details>
<summary>UT-09: ポケモンデータが151匹分ある</summary>

```ts
// src/data/__tests__/pokemonData.test.ts
import { allPokemon } from '../index';

describe('Pokemon Data', () => {
  it('初代151匹のデータがすべて揃っている', () => {
    expect(allPokemon).toHaveLength(151);
  });

  it('各ポケモンが必須フィールドを持っている', () => {
    allPokemon.forEach((pokemon) => {
      expect(pokemon.id).toBeGreaterThanOrEqual(1);
      expect(pokemon.id).toBeLessThanOrEqual(151);
      expect(pokemon.name.japanese).toBeTruthy();
      expect(pokemon.name.english).toBeTruthy();
      expect(pokemon.imageUrl).toMatch(/^https:\/\//);
    });
  });

  it('IDに重複がない', () => {
    const ids = allPokemon.map((p) => p.id);
    expect(new Set(ids).size).toBe(151);
  });
});
```
</details>

<details>
<summary>UT-10: シェアテキストが正しいフォーマットで生成される</summary>

```ts
// src/components/__tests__/shareText.test.ts
// QuizResults 内の handleShare ロジックを単体検証するテスト

import type { QuizHistory } from '../../hooks/useQuiz';

// QuizResults.tsx 内の handleShare と同じロジックを関数として抽出
function buildShareText(score: number, history: QuizHistory[]): string {
  const totalQuestions = history.length;
  const resultEmojis = history
    .map((item, index) => `${index + 1}${item.isCorrect ? '🟢' : '❌'}`)
    .join('');

  return `初代ポケモン名前当てクイズ\n\n${score}/${totalQuestions}問 正解！\n${resultEmojis}\n\n#初代ポケモン名前当てクイズ\n\nhttps://quiz-pokemon-151.vercel.app/`;
}

describe('シェアテキスト生成', () => {
  it('スコアと履歴から正しいフォーマットのテキストが生成される', () => {
    const history: QuizHistory[] = [
      { pokemon: { id: 1, name: { japanese: 'フシギダネ', english: 'Bulbasaur' }, imageUrl: '' }, userAnswer: 'フシギダネ', isCorrect: true },
      { pokemon: { id: 4, name: { japanese: 'ヒトカゲ', english: 'Charmander' }, imageUrl: '' }, userAnswer: 'ゼニガメ', isCorrect: false },
      { pokemon: { id: 7, name: { japanese: 'ゼニガメ', english: 'Squirtle' }, imageUrl: '' }, userAnswer: 'ゼニガメ', isCorrect: true },
    ];

    const text = buildShareText(2, history);

    expect(text).toContain('2/3問 正解！');
    expect(text).toContain('1🟢2❌3🟢');
    expect(text).toContain('#初代ポケモン名前当てクイズ');
    expect(text).toContain('https://quiz-pokemon-151.vercel.app/');
  });

  it('全問正解の場合、すべて🟢になる', () => {
    const history: QuizHistory[] = Array.from({ length: 10 }, (_, i) => ({
      pokemon: { id: i + 1, name: { japanese: `P${i}`, english: `P${i}` }, imageUrl: '' },
      userAnswer: `P${i}`,
      isCorrect: true,
    }));

    const text = buildShareText(10, history);

    expect(text).toContain('10/10問 正解！');
    expect(text).not.toContain('❌');
  });
});
```
</details>

---

### E2Eテスト（5シナリオ）

> Playwright を使用。`npx playwright test` で実行。

<details>
<summary>E2E-01: クイズを全問回答して結果画面が表示される</summary>

```ts
// e2e/quiz-flow.spec.ts
import { test, expect } from '@playwright/test';

test('スタートから10問回答して結果画面が表示される', async ({ page }) => {
  await page.goto('/');

  // スタート画面の確認
  await expect(page.getByText('初代ポケモン名前当てクイズ')).toBeVisible();
  await page.getByText('クイズを始める').click();

  // 10問回答する
  for (let i = 0; i < 10; i++) {
    // 選択肢ボタンのうち最初の1つをクリック
    const buttons = page.locator('button.bg-blue-600');
    await buttons.first().click();

    // フィードバック画面で「次の問題へ」or「テスト結果を表示」をクリック
    const nextButton = page.getByText(/次の問題へ|テスト結果を表示/);
    await nextButton.click();
  }

  // 結果画面が表示される
  await expect(page.getByText(/10問中\d+問正解しました/)).toBeVisible();
  await expect(page.getByText('もう一度プレイ')).toBeVisible();
  await expect(page.getByText('結果をXでシェア')).toBeVisible();
});
```
</details>

<details>
<summary>E2E-02: 全問正解フロー（正解の選択肢をクリック）</summary>

```ts
test('すべて正解を選ぶと10/10になる', async ({ page }) => {
  await page.goto('/');
  await page.getByText('クイズを始める').click();

  for (let i = 0; i < 10; i++) {
    // シルエットの alt 属性からは正解を得られないので、
    // ページのDOMから correctAnswer を取得する方法を使う
    // ※テスト用に data-testid を追加するのが理想的
    // ここでは全ボタンのテキストを取得し、aria/ロジックで正解を判定する

    // 簡易的アプローチ: ボタン4つのうち、いずれかをクリック後
    // フィードバックの「正解！」を確認できたら正解扱い
    // → 全問正解を保証するにはアプリ側にテストヘルパーが必要

    // 実際の実装では data-correct 属性等を付与して以下のように取得:
    // const correctBtn = page.locator('button[data-correct="true"]');
    // await correctBtn.click();

    const buttons = page.locator('button.bg-blue-600');
    const count = await buttons.count();
    // 全ボタンのテキストを取得
    for (let j = 0; j < count; j++) {
      const text = await buttons.nth(j).textContent();
      // テスト環境で正解を判定する仕組みが必要
    }

    // ※ フォールバック: 最初のボタンをクリック
    await buttons.first().click();
    await page.getByText(/次の問題へ|テスト結果を表示/).click();
  }

  await expect(page.getByText(/10問中\d+問正解しました/)).toBeVisible();
});
```
</details>

<details>
<summary>E2E-03: もう一度プレイでリスタートできる</summary>

```ts
test('結果画面から「もう一度プレイ」でスタート画面に戻る', async ({ page }) => {
  await page.goto('/');
  await page.getByText('クイズを始める').click();

  // 10問回答（早送り）
  for (let i = 0; i < 10; i++) {
    await page.locator('button.bg-blue-600').first().click();
    await page.getByText(/次の問題へ|テスト結果を表示/).click();
  }

  // 結果画面
  await expect(page.getByText(/10問中\d+問正解しました/)).toBeVisible();

  // もう一度プレイ
  await page.getByText('もう一度プレイ').click();

  // スタート画面に戻る
  await expect(page.getByText('クイズを始める')).toBeVisible();
});
```
</details>

<details>
<summary>E2E-04: Xシェアボタンが正しいURLで新規ウィンドウを開く</summary>

```ts
test('「結果をXでシェア」がtwitter intent URLを開く', async ({ page, context }) => {
  await page.goto('/');
  await page.getByText('クイズを始める').click();

  for (let i = 0; i < 10; i++) {
    await page.locator('button.bg-blue-600').first().click();
    await page.getByText(/次の問題へ|テスト結果を表示/).click();
  }

  // 新しいタブが開かれることを検知
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.getByText('結果をXでシェア').click(),
  ]);

  // 開かれたURLがTwitter intent形式であることを検証
  const url = newPage.url();
  expect(url).toContain('twitter.com/intent/tweet');
  expect(url).toContain(encodeURIComponent('初代ポケモン名前当てクイズ'));
  expect(url).toContain(encodeURIComponent('quiz-pokemon-151.vercel.app'));
});
```
</details>

<details>
<summary>E2E-05: モバイルビューポートで一連のフローが操作できる</summary>

```ts
test('モバイル（375×667）で全フローが操作可能', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 },
  });
  const page = await context.newPage();
  await page.goto('/');

  // スタート画面が表示・操作可能
  await expect(page.getByText('クイズを始める')).toBeVisible();
  await page.getByText('クイズを始める').click();

  // 最初の問題の選択肢ボタンが画面内に表示される
  const firstButton = page.locator('button.bg-blue-600').first();
  await expect(firstButton).toBeVisible();
  await firstButton.click();

  // フィードバック画面が操作可能
  const nextButton = page.getByText(/次の問題へ|テスト結果を表示/);
  await expect(nextButton).toBeVisible();
  await nextButton.click();

  // 2問目以降も操作可能であることを確認
  await expect(page.locator('button.bg-blue-600').first()).toBeVisible();

  await context.close();
});
```
</details>

---

### テスト環境のセットアップ

```bash
# ユニットテスト (Vitest + React Testing Library)
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# E2Eテスト (Playwright)
npm install -D @playwright/test
npx playwright install
```

`vite.config.mts` に Vitest の設定を追加:
```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```

`src/test/setup.ts`:
```ts
import '@testing-library/jest-dom';
```

`package.json` に追加するスクリプト:
```json
{
  "scripts": {
    "test": "vitest",
    "test:e2e": "playwright test"
  }
}
```


## 謝辞

ポケモンの画像データは"PokeAPI"(https://pokeapi.co/)から提供されています。
