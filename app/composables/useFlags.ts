import type { FlagEntry } from "~/types";

interface FlagsState {
  items: Record<string, FlagEntry>;
}

const STORAGE_KEY = "canglish-flags-v1";

export const useFlags = () => {
  const state = useState<FlagsState>("flags", () => {
    if (process.client) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error("Failed to parse stored flags:", e);
        }
      }
    }
    return { items: {} };
  });

  const saveToStorage = () => {
    if (process.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value));
    }
  };

  const makeKey = (type: "word" | "phrase", id: string): string => {
    return `${type}:${id}`;
  };

  const isFlagged = (type: "word" | "phrase", id: string): boolean => {
    const key = makeKey(type, id);
    return !!state.value.items[key];
  };

  const flagItem = (
    type: "word" | "phrase",
    id: string,
    reason: string = ""
  ): FlagEntry => {
    const key = makeKey(type, id);
    const entry: FlagEntry = {
      id,
      type,
      flaggedAt: new Date().toISOString(),
      reason,
    };
    state.value.items[key] = entry;
    saveToStorage();
    return entry;
  };

  const unflagItem = (type: "word" | "phrase", id: string): boolean => {
    const key = makeKey(type, id);
    if (state.value.items[key]) {
      delete state.value.items[key];
      saveToStorage();
      return true;
    }
    return false;
  };

  const getFlag = (type: "word" | "phrase", id: string): FlagEntry | null => {
    const key = makeKey(type, id);
    return state.value.items[key] || null;
  };

  const getAllFlags = (): FlagEntry[] => {
    return Object.values(state.value.items);
  };

  const getFlaggedWords = (): FlagEntry[] => {
    return getAllFlags().filter((f) => f.type === "word");
  };

  const getFlaggedPhrases = (): FlagEntry[] => {
    return getAllFlags().filter((f) => f.type === "phrase");
  };

  const getFlagCount = (): number => {
    return Object.keys(state.value.items).length;
  };

  const clearAllFlags = (): void => {
    state.value.items = {};
    saveToStorage();
  };

  return {
    isFlagged,
    flagItem,
    unflagItem,
    getFlag,
    getAllFlags,
    getFlaggedWords,
    getFlaggedPhrases,
    getFlagCount,
    clearAllFlags,
  };
};
