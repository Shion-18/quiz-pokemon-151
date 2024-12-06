export interface Pokemon {
  id: number;
  name: {
    japanese: string;
    english: string;
  };
  imageUrl: string;
}

export interface QuizQuestion {
  pokemon: Pokemon;
  options: string[];
  correctAnswer: string;
}