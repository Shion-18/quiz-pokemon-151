<<<<<<< HEAD
// Pokemonインターフェースの定義
// このインターフェースは、ポケモンの情報を表します。
export interface Pokemon {
  id: number; // ポケモンのID
  name: {
    japanese: string; // ポケモンの日本語名
    english: string; // ポケモンの英語名
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
=======
export interface Pokemon {
  id: number;
  name: {
    japanese: string;
    english: string;
  };
  imageUrl: string;
}

export interface StarterPokemon {
  id: number;
  name: string;
  imageUrl: string;
}

export interface QuizQuestion {
  pokemon: Pokemon;
  options: string[];
  correctAnswer: string;
}
>>>>>>> 666b29f1f3817e693ed1b67e77311c0320f70774
