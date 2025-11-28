export interface Word {
  cantonese: string;
  english: string;
  notes: string;
  category: string;
}

export interface Phrase {
  cantonese: string;
  english: string;
  notes: string;
  category: string;
  tokens: string[];
}

// Helper to compute word ID at runtime
export function getWordId(word: Word): string {
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  return `word-${word.category}-${slugify(word.cantonese)}-${slugify(
    word.english
  )}`;
}

// Helper to compute phrase ID at runtime
export function getPhraseId(phrase: Phrase): string {
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  return `phrase-${phrase.category}-${slugify(phrase.cantonese)}-${slugify(
    phrase.english
  )}`;
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
  notes?: string;
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
