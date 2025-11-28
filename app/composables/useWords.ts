import type { Word } from "~/types";
import wordsData from "~/content/words.json";

export const useWords = () => {
  const words = ref<Word[]>(wordsData as Word[]);

  const getWordById = (id: string): Word | undefined => {
    return words.value.find((w) => w.id === id);
  };

  const getWordsByIds = (ids: string[]): Word[] => {
    return words.value.filter((w) => ids.includes(w.id));
  };

  const getWordsByCategory = (category: string): Word[] => {
    return words.value.filter((w) => w.category === category);
  };

  const getWordByCantonese = (cantonese: string): Word | undefined => {
    return words.value.find((w) => w.cantonese === cantonese);
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
