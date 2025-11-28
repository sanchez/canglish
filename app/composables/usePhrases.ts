import type { Phrase } from "~/types";
import phrasesData from "~/content/phrases.json";

export const usePhrases = () => {
  const phrases = ref<Phrase[]>(phrasesData as Phrase[]);

  const getPhraseById = (id: string): Phrase | undefined => {
    return phrases.value.find((p) => p.id === id);
  };

  const getPhrasesByIds = (ids: string[]): Phrase[] => {
    return phrases.value.filter((p) => ids.includes(p.id));
  };

  const getPhrasesByCategory = (category: string): Phrase[] => {
    return phrases.value.filter((p) => p.category === category);
  };

  const getPhrasesUsingWord = (wordCantonese: string): Phrase[] => {
    return phrases.value.filter((p) => p.tokens.includes(wordCantonese));
  };

  const getPhraseTokens = (phraseId: string): string[] => {
    const phrase = getPhraseById(phraseId);
    return phrase?.tokens || [];
  };

  const getAllCategories = (): string[] => {
    return [...new Set(phrases.value.map((p) => p.category))];
  };

  return {
    phrases: readonly(phrases),
    getPhraseById,
    getPhrasesByIds,
    getPhrasesByCategory,
    getPhrasesUsingWord,
    getPhraseTokens,
    getAllCategories,
  };
};
