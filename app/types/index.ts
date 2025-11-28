export interface Word {
  id: string;
  cantonese: string;
  english: string;
  notes: string;
  category: string;
}

export interface Phrase {
  id: string;
  cantonese: string;
  english: string;
  notes: string;
  category: string;
  tokens: string[];
}

export interface ProgressEntry {
  id: string;
  type: "word" | "phrase";
  score: number; // 0-6
  unlocked: boolean;
  mastered: boolean; // derived from score >= 6
}

export interface PoolItem {
  id: string;
  type: "word" | "phrase";
}

export interface WordQuizQuestion {
  wordId: string;
  promptType: "cantonese" | "english";
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface PhraseQuizQuestion {
  phraseId: string;
  english: string;
  targetTokens: string[];
  choices: string[];
}
