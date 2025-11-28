import type { PoolItem } from "~/types";

export const useReviewPool = () => {
  const { words } = useWords();
  const { phrases } = usePhrases();
  const { getEntry } = useProgress();

  const getMasteredItems = (): PoolItem[] => {
    const items: PoolItem[] = [];

    // Add all mastered words
    for (const word of words.value) {
      const entry = getEntry("word", word.id);
      if (entry && entry.mastered) {
        items.push({ type: "word", id: word.id });
      }
    }

    // Add all mastered phrases
    for (const phrase of phrases.value) {
      const entry = getEntry("phrase", phrase.id);
      if (entry && entry.mastered) {
        items.push({ type: "phrase", id: phrase.id });
      }
    }

    return items;
  };

  const getRandomItem = (): PoolItem | null => {
    const items = getMasteredItems();

    if (items.length === 0) {
      return null;
    }

    const index = Math.floor(Math.random() * items.length);
    return items[index];
  };

  const hasItems = computed(() => getMasteredItems().length > 0);

  return {
    getMasteredItems,
    getRandomItem,
    hasItems,
  };
};
