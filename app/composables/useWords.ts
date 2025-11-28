import type { Word } from "~/types";
import { getWordId } from "~/types";
import wordsData from "~/content/words.json";

export const useWords = () => {
  const words = ref<Word[]>(wordsData as Word[]);

  const getWordById = (id: string): Word | undefined => {
    return words.value.find((w) => getWordId(w) === id);
  };

  const getWordsByIds = (ids: string[]): Word[] => {
    return words.value.filter((w) => ids.includes(getWordId(w)));
  };

  const getWordsByCategory = (category: string): Word[] => {
    return words.value.filter((w) => w.category === category);
  };

  const getWordByCantonese = (cantonese: string): Word | undefined => {
    // Direct match first
    let word = words.value.find((w) => w.cantonese === cantonese);

    // Handle common spelling variations if no direct match
    if (!word) {
      const variations: Record<string, string> = {
        nay: "lay", // "you" variation
        lay: "nay",
      };

      const altSpelling = variations[cantonese];
      if (altSpelling) {
        word = words.value.find((w) => w.cantonese === altSpelling);
      }
    }

    return word;
  };

  const getAllCategories = (): string[] => {
    return [...new Set(words.value.map((w) => w.category))];
  };

  return {
    words: readonly(words),
    getWordById,
    getWordsByIds,
    getWordsByCategory,
    getWordByCantonese,
    getAllCategories,
  };
};
