import type { Word, Phrase } from "~/types";

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[-\s]/g, "") // Remove hyphens and spaces for matching
    .trim();
}

export const useSearch = () => {
  const filterWords = (words: readonly Word[], query: string): Word[] => {
    if (!query.trim()) return [];

    const normalizedQuery = normalizeText(query);

    return words.filter((word) => {
      const normalizedCantonese = normalizeText(word.cantonese);
      const normalizedEnglish = normalizeText(word.english);

      return (
        normalizedCantonese.includes(normalizedQuery) ||
        normalizedEnglish.includes(normalizedQuery) ||
        word.cantonese.toLowerCase().includes(query.toLowerCase()) ||
        word.english.toLowerCase().includes(query.toLowerCase())
      );
    });
  };

  const filterPhrases = (
    phrases: readonly Phrase[],
    query: string
  ): Phrase[] => {
    if (!query.trim()) return [];

    const normalizedQuery = normalizeText(query);

    return phrases.filter((phrase) => {
      const normalizedCantonese = normalizeText(phrase.cantonese);
      const normalizedEnglish = normalizeText(phrase.english);

      return (
        normalizedCantonese.includes(normalizedQuery) ||
        normalizedEnglish.includes(normalizedQuery) ||
        phrase.cantonese.toLowerCase().includes(query.toLowerCase()) ||
        phrase.english.toLowerCase().includes(query.toLowerCase())
      );
    });
  };

  return {
    filterWords,
    filterPhrases,
  };
};
