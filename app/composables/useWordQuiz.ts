import type { WordQuizQuestion, QuizOption } from "~/types";
import { getWordId } from "~/types";

export const useWordQuiz = () => {
  const { words, getWordById } = useWords();
  const { getEntry } = useProgress();

  const buildQuestion = (
    wordId: string,
    mode: "learn" | "review"
  ): WordQuizQuestion | null => {
    const word = getWordById(wordId);
    if (!word) return null;

    const wordId_computed = getWordId(word);

    // Randomly choose prompt type
    const promptType = Math.random() < 0.5 ? "cantonese" : "english";
    const prompt = promptType === "cantonese" ? word.cantonese : word.english;

    // Build options
    const correctOption: QuizOption = {
      id: wordId_computed,
      text: promptType === "cantonese" ? word.english : word.cantonese,
    };

    // Find distractors
    const distractors = findDistractors(word, promptType, 3);

    // Combine and shuffle
    const allOptions = [correctOption, ...distractors];
    shuffleArray(allOptions);

    return {
      wordId: wordId_computed,
      promptType,
      prompt,
      options: allOptions,
      correctOptionId: wordId_computed,
      notes: word.notes,
    };
  };

  const findDistractors = (
    targetWord: any,
    promptType: "cantonese" | "english",
    count: number
  ): QuizOption[] => {
    const distractors: QuizOption[] = [];
    const targetWordId = getWordId(targetWord);

    // First try words from same category
    const sameCategoryWords = words.value.filter(
      (w) => getWordId(w) !== targetWordId && w.category === targetWord.category
    );

    // Shuffle and take some
    shuffleArray(sameCategoryWords);
    for (const word of sameCategoryWords) {
      if (distractors.length >= count) break;
      distractors.push({
        id: getWordId(word),
        text: promptType === "cantonese" ? word.english : word.cantonese,
      });
    }

    // If not enough, add random words
    if (distractors.length < count) {
      const otherWords = words.value.filter(
        (w) => getWordId(w) !== targetWordId && !sameCategoryWords.includes(w)
      );
      shuffleArray(otherWords);

      for (const word of otherWords) {
        if (distractors.length >= count) break;
        distractors.push({
          id: getWordId(word),
          text: promptType === "cantonese" ? word.english : word.cantonese,
        });
      }
    }

    return distractors.slice(0, count);
  };

  const getNextQuestion = (
    candidateIds: string[],
    mode: "learn" | "review"
  ): WordQuizQuestion | null => {
    if (candidateIds.length === 0) return null;

    // Filter based on mode
    const eligible = candidateIds.filter((id) => {
      const entry = getEntry("word", id);
      if (mode === "learn") {
        return !entry || !entry.mastered;
      } else {
        return entry && entry.mastered;
      }
    });

    if (eligible.length === 0) return null;

    // Pick random
    const randomId = eligible[Math.floor(Math.random() * eligible.length)];
    return buildQuestion(randomId, mode);
  };

  return {
    buildQuestion,
    getNextQuestion,
  };
};

// Utility to shuffle array in place
function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
