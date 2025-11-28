import type { ProgressEntry } from "~/types";
import wordUsageData from "~/content/wordUsage.json";

interface ProgressState {
  items: Record<string, ProgressEntry>; // key: `${type}:${id}`
}

const STORAGE_KEY = "canglish-progress-v1";

export const useProgress = () => {
  const { words, getWordByCantonese } = useWords();
  const { phrases, getPhraseTokens } = usePhrases();

  // Initialize state from localStorage or default
  const state = useState<ProgressState>("progress", () => {
    if (process.client) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error("Failed to parse stored progress:", e);
        }
      }
    }
    return { items: {} };
  });

  // Save to localStorage whenever state changes
  const saveToStorage = () => {
    if (process.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value));
    }
  };

  const makeKey = (type: "word" | "phrase", id: string): string => {
    return `${type}:${id}`;
  };

  const getEntry = (
    type: "word" | "phrase",
    id: string
  ): ProgressEntry | null => {
    const key = makeKey(type, id);
    return state.value.items[key] || null;
  };

  const unlock = (type: "word" | "phrase", id: string): ProgressEntry => {
    const key = makeKey(type, id);
    const existing = state.value.items[key];

    if (existing) {
      return existing;
    }

    const entry: ProgressEntry = {
      id,
      type,
      score: 0,
      unlocked: true,
      mastered: false,
    };

    state.value.items[key] = entry;
    saveToStorage();
    return entry;
  };

  const increment = (type: "word" | "phrase", id: string): ProgressEntry => {
    const key = makeKey(type, id);
    let entry = state.value.items[key];

    if (!entry) {
      entry = unlock(type, id);
    }

    if (entry.score < 6) {
      entry.score++;
      entry.mastered = entry.score >= 6;
      state.value.items[key] = entry;
      saveToStorage();
    }

    return entry;
  };

  const demote = (type: "word" | "phrase", id: string): ProgressEntry => {
    const key = makeKey(type, id);
    let entry = state.value.items[key];

    if (!entry) {
      entry = unlock(type, id);
    }

    entry.score = 3;
    entry.mastered = false;
    state.value.items[key] = entry;
    saveToStorage();

    return entry;
  };

  const getUnlockedWords = (): string[] => {
    return Object.values(state.value.items)
      .filter((item) => item.type === "word" && item.unlocked)
      .map((item) => item.id);
  };

  const getMasteredWords = (): string[] => {
    return Object.values(state.value.items)
      .filter((item) => item.type === "word" && item.mastered)
      .map((item) => item.id);
  };

  const getUnlockedPhrases = (): string[] => {
    return Object.values(state.value.items)
      .filter((item) => item.type === "phrase" && item.unlocked)
      .map((item) => item.id);
  };

  const getMasteredPhrases = (): string[] => {
    return Object.values(state.value.items)
      .filter((item) => item.type === "phrase" && item.mastered)
      .map((item) => item.id);
  };

  const getMasteredCount = (): number => {
    return Object.values(state.value.items).filter((item) => item.mastered)
      .length;
  };

  const getUnmasteredItems = (): ProgressEntry[] => {
    return Object.values(state.value.items).filter(
      (item) => item.unlocked && !item.mastered
    );
  };

  // Check if all words in a phrase are mastered
  const areAllWordsMasteredForPhrase = (phraseId: string): boolean => {
    const tokens = getPhraseTokens(phraseId);

    for (const token of tokens) {
      const word = getWordByCantonese(token);

      if (!word) {
        // Token doesn't match any word - phrase is not eligible
        return false;
      }

      const wordProgress = getEntry("word", word.id);

      if (!wordProgress || !wordProgress.mastered) {
        // Word is not mastered - phrase is not eligible
        return false;
      }
    }

    return true;
  };

  // Get all phrases where all constituent words are mastered
  const getEligiblePhrases = (): string[] => {
    return phrases.value
      .filter((phrase) => areAllWordsMasteredForPhrase(phrase.id))
      .map((phrase) => phrase.id);
  };

  const getWordUsage = (wordId: string): number => {
    const usage = wordUsageData as Record<string, number>;
    return usage[wordId] || 0;
  };

  return {
    getEntry,
    unlock,
    increment,
    demote,
    getUnlockedWords,
    getMasteredWords,
    getUnlockedPhrases,
    getMasteredPhrases,
    getMasteredCount,
    getUnmasteredItems,
    areAllWordsMasteredForPhrase,
    getEligiblePhrases,
    getWordUsage,
  };
};
