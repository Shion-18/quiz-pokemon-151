// Pokemonインターフェースの定義
// このインターフェースは、ポケモンの情報を表します。
export interface Pokemon {
  id: number; // ポケモンのID
  name: {
    japanese: string; // ポケモンの日本語名
  };
  imageUrl: string; // ポケモンの画像URL
}

// StarterPokemonインターフェースの定義
// このインターフェースは、スタート画面に並べる代表ポケモンを表します。
export interface StarterPokemon {
  id: number; // ポケモンのID
  name: string; // 画像のalt属性に使う日本語名
  imageUrl: string; // ポケモンの画像URL
}

// QuizQuestionインターフェースの定義
// このインターフェースは、クイズの問題を表します。
export interface QuizQuestion {
  pokemon: Pokemon; // クイズの問題となるポケモン
  options: string[]; // 回答の選択肢
  correctAnswer: string; // 正しい回答
}
