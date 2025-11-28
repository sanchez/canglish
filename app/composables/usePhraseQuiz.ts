import type { PhraseQuizQuestion } from "~/types";

export const usePhraseQuiz = () => {
  const { phrases, getPhraseById } = usePhrases();
  const { words } = useWords();
  const { getEntry, areAllWordsMasteredForPhrase } = useProgress();

  const buildQuestion = (
    phraseId: string,
    mode: "learn" | "review"
  ): PhraseQuizQuestion | null => {
    const phrase = getPhraseById(phraseId);
    if (!phrase) return null;

    // For learn mode, ensure all words are mastered
    if (mode === "learn" && !areAllWordsMasteredForPhrase(phraseId)) {
      return null;
    }

    const targetTokens = [...phrase.tokens];

    // Build choices: target tokens + distractors
    const distractors = findDistractorTokens(phrase, 4);
    const allChoices = [...targetTokens, ...distractors];

    shuffleArray(allChoices);

    return {
      phraseId: phrase.id,
      english: phrase.english,
      targetTokens,
      choices: allChoices,
    };
  };

  const findDistractorTokens = (targetPhrase: any, count: number): string[] => {
    const distractors = new Set<string>();
    const targetTokenSet = new Set(targetPhrase.tokens);

    // Get tokens from other phrases
    const otherPhrases = phrases.value.filter((p) => p.id !== targetPhrase.id);
    shuffleArray(otherPhrases);

    for (const phrase of otherPhrases) {
      if (distractors.size >= count) break;

      for (const token of phrase.tokens) {
        if (distractors.size >= count) break;
        if (!targetTokenSet.has(token)) {
          distractors.add(token);
        }
      }
    }

    // If still need more, use random words
    if (distractors.size < count) {
      const randomWords = [...words.value];
      shuffleArray(randomWords);

      for (const word of randomWords) {
        if (distractors.size >= count) break;
        if (!targetTokenSet.has(word.cantonese)) {
          distractors.add(word.cantonese);
        }
      }
    }

    return Array.from(distractors).slice(0, count);
  };

  const getNextQuestion = (
    candidateIds: string[],
    mode: "learn" | "review"
  ): PhraseQuizQuestion | null => {
    if (candidateIds.length === 0) return null;

    // Filter based on mode
    const eligible = candidateIds.filter((id) => {
      const entry = getEntry("phrase", id);

      if (mode === "learn") {
        // Must have all words mastered and phrase not yet mastered
        return areAllWordsMasteredForPhrase(id) && (!entry || !entry.mastered);
      } else {
        // Must be mastered
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
