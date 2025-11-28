import type { PoolItem } from "~/types";
import { getWordId } from "~/types";

interface LearningPoolState {
  items: PoolItem[];
}

const POOL_STORAGE_KEY = "canglish-learning-pool-v1";
const MAX_POOL_SIZE = 20;

export const useLearningPool = () => {
  const { words } = useWords();
  const { phrases } = usePhrases();
  const {
    getEntry,
    unlock,
    areAllWordsMasteredForPhrase,
    getEligiblePhrases,
    getWordUsage,
  } = useProgress();

  // Initialize pool from localStorage
  const state = useState<LearningPoolState>("learning-pool", () => {
    if (process.client) {
      const stored = localStorage.getItem(POOL_STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error("Failed to parse stored learning pool:", e);
        }
      }
    }
    return { items: [] };
  });

  const saveToStorage = () => {
    if (process.client) {
      localStorage.setItem(POOL_STORAGE_KEY, JSON.stringify(state.value));
    }
  };

  const isInPool = (type: "word" | "phrase", id: string): boolean => {
    return state.value.items.some(
      (item) => item.type === type && item.id === id
    );
  };

  const addItem = (item: PoolItem) => {
    if (!isInPool(item.type, item.id)) {
      state.value.items.push(item);
      unlock(item.type, item.id);
      saveToStorage();
    }
  };

  const removeItem = (type: "word" | "phrase", id: string) => {
    state.value.items = state.value.items.filter(
      (item) => !(item.type === type && item.id === id)
    );
    saveToStorage();
  };

  const replaceMasteredItem = (masteredItem: PoolItem) => {
    removeItem(masteredItem.type, masteredItem.id);
    refillIfNeeded();
  };

  const refillIfNeeded = () => {
    const currentSize = state.value.items.length;

    if (currentSize >= MAX_POOL_SIZE) {
      return;
    }

    const needed = MAX_POOL_SIZE - currentSize;
    const candidates: PoolItem[] = [];

    // Priority 1: Eligible phrases (all words mastered, phrase not yet mastered)
    const eligiblePhraseIds = getEligiblePhrases();
    console.log("[LearningPool] Eligible phrases:", eligiblePhraseIds.length);

    for (const phraseId of eligiblePhraseIds) {
      if (isInPool("phrase", phraseId)) continue;

      const entry = getEntry("phrase", phraseId);
      if (entry && entry.mastered) continue;

      candidates.push({ type: "phrase", id: phraseId });
      console.log("[LearningPool] Adding eligible phrase:", phraseId);
    }

    console.log("[LearningPool] Total phrase candidates:", candidates.length);

    // Priority 2: Unmastered words ordered by usage frequency
    const wordsByUsage = [...words.value]
      .map((word) => ({
        word,
        usage: getWordUsage(getWordId(word)),
      }))
      .sort((a, b) => b.usage - a.usage);

    for (const { word } of wordsByUsage) {
      const wordId = getWordId(word);
      if (isInPool("word", wordId)) continue;

      const entry = getEntry("word", wordId);

      // Include unlocked but not mastered words
      if (entry && entry.unlocked && !entry.mastered) {
        candidates.push({ type: "word", id: wordId });
      }
    }

    // Priority 3: New words (not yet unlocked) by frequency
    for (const { word } of wordsByUsage) {
      const wordId = getWordId(word);
      if (isInPool("word", wordId)) continue;

      const entry = getEntry("word", wordId);

      if (!entry || !entry.unlocked) {
        candidates.push({ type: "word", id: wordId });
      }
    }

    // Add candidates up to the needed amount
    const toAdd = candidates.slice(0, needed);
    for (const candidate of toAdd) {
      addItem(candidate);
    }
  };

  const ensureInPool = (type: "word" | "phrase", id: string) => {
    if (!isInPool(type, id)) {
      // Remove oldest item if at capacity
      if (state.value.items.length >= MAX_POOL_SIZE) {
        state.value.items.shift();
      }
      addItem({ type, id });
    }
  };

  const getRandomItem = (): PoolItem | null => {
    if (state.value.items.length === 0) {
      refillIfNeeded();
    }

    if (state.value.items.length === 0) {
      return null;
    }

    const index = Math.floor(Math.random() * state.value.items.length);
    return state.value.items[index];
  };

  return {
    pool: computed(() => state.value.items),
    addItem,
    removeItem,
    replaceMasteredItem,
    refillIfNeeded,
    ensureInPool,
    getRandomItem,
    isInPool,
  };
};
