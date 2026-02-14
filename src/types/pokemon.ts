// Pokemonインターフェースの定義
// このインターフェースは、ポケモンの情報を表します。
export interface Pokemon {
  id: number; // ポケモンのID
  name: {
    japanese: string; // ポケモンの日本語名
  };
  imageUrl: string; // ポケモンの画像URL
}

// QuizQuestionインターフェースの定義
// このインターフェースは、クイズの問題を表します。
export interface QuizQuestion {
  pokemon: Pokemon; // クイズの問題となるポケモン
  options: string[]; // 回答の選択肢
  correctAnswer: string; // 正しい回答
}
