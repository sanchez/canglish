import { vi } from 'vitest';
import type { Word, Phrase, ProgressEntry, PoolItem, FlagEntry } from '~/types';

export const mockWords: Word[] = [
  { category: 'greetings', cantonese: 'nei', english: 'you', jyutping: 'nei5', notes: '' },
  { category: 'greetings', cantonese: 'ho', english: 'good', jyutping: 'hou2', notes: '' },
  { category: 'greetings', cantonese: 'morning', english: 'morning', jyutping: 'zou2', notes: '' },
  { category: 'numbers', cantonese: 'yat', english: 'one', jyutping: 'jat1', notes: '' },
  { category: 'numbers', cantonese: 'yi', english: 'two', jyutping: 'ji6', notes: '' },
  { category: 'numbers', cantonese: 'sam', english: 'three', jyutping: 'saam1', notes: '' },
  { category: 'food', cantonese: 'faan', english: 'rice', jyutping: 'faan6', notes: '' },
  { category: 'food', cantonese: 'min', english: 'noodles', jyutping: 'min6', notes: '' },
];

export const mockPhrases: Phrase[] = [
  { 
    category: 'greetings', 
    cantonese: 'nei hou', 
    english: 'hello', 
    jyutping: 'nei5 hou2', 
    notes: '',
    tokens: ['nei', 'hou']
  },
  { 
    category: 'greetings', 
    cantonese: 'zou san', 
    english: 'good morning', 
    jyutping: 'zou2 san1', 
    notes: '',
    tokens: ['morning', 'san']
  },
  { 
    category: 'food', 
    cantonese: 'faan min', 
    english: 'rice and noodles', 
    jyutping: 'faan6 min6', 
    notes: '',
    tokens: ['faan', 'min']
  },
];

export const mockWordUsage: Record<string, number> = {
  'word-greetings-nei': 100,
  'word-greetings-ho': 90,
  'word-numbers-yat': 80,
  'word-food-faanc': 70,
};

export const createMockUseWords = () => {
  return {
    words: { value: mockWords },
    getWordById: vi.fn((id: string) => mockWords.find(w => `word-${w.category}-${w.cantonese}-${w.english}` === id)),
    getWordsByIds: vi.fn((ids: string[]) => mockWords.filter(w => ids.includes(`word-${w.category}-${w.cantonese}-${w.english}`))),
    getWordsByCategory: vi.fn((category: string) => mockWords.filter(w => w.category === category)),
    getWordByCantonese: vi.fn((cantonese: string) => mockWords.find(w => w.cantonese === cantonese)),
    getAllCategories: vi.fn(() => [...new Set(mockWords.map(w => w.category))]),
  };
};

export const createMockUsePhrases = () => {
  return {
    phrases: { value: mockPhrases },
    getPhraseById: vi.fn((id: string) => mockPhrases.find(p => `phrase-${p.category}-${p.cantonese}-${p.english}` === id)),
    getPhrasesByIds: vi.fn((ids: string[]) => mockPhrases.filter(p => ids.includes(`phrase-${p.category}-${p.cantonese}-${p.english}`))),
    getPhrasesByCategory: vi.fn((category: string) => mockPhrases.filter(p => p.category === category)),
    getPhrasesUsingWord: vi.fn((wordCantonese: string) => mockPhrases.filter(p => p.tokens.includes(wordCantonese))),
    getPhraseTokens: vi.fn((phraseId: string) => {
      const phrase = mockPhrases.find(p => `phrase-${p.category}-${p.cantonese}-${p.english}` === phraseId);
      return phrase?.tokens || [];
    }),
    getAllCategories: vi.fn(() => [...new Set(mockPhrases.map(p => p.category))]),
  };
};

const mockProgressState = vi.fn(() => ({ items: {} as Record<string, ProgressEntry> }));

export const createMockUseProgress = () => {
  const state = { items: {} as Record<string, ProgressEntry> };
  
  return {
    state: { value: state },
    getEntry: vi.fn((type: 'word' | 'phrase', id: string): ProgressEntry | null => {
      const key = `${type}:${id}`;
      return state.items[key] || null;
    }),
    unlock: vi.fn((type: 'word' | 'phrase', id: string): ProgressEntry => {
      const key = `${type}:${id}`;
      const entry: ProgressEntry = { id, type, score: 0, unlocked: true, mastered: false };
      state.items[key] = entry;
      return entry;
    }),
    increment: vi.fn((type: 'word' | 'phrase', id: string): ProgressEntry => {
      const key = `${type}:${id}`;
      let entry = state.items[key];
      if (!entry) {
        entry = { id, type, score: 0, unlocked: true, mastered: false };
        state.items[key] = entry;
      }
      if (entry.score < 6) {
        entry.score++;
        entry.mastered = entry.score >= 6;
      }
      return entry;
    }),
    demote: vi.fn((type: 'word' | 'phrase', id: string): ProgressEntry => {
      const key = `${type}:${id}`;
      const entry: ProgressEntry = { id, type, score: 3, unlocked: true, mastered: false };
      state.items[key] = entry;
      return entry;
    }),
    getUnlockedWords: vi.fn(() => Object.values(state.items).filter(i => i.type === 'word' && i.unlocked).map(i => i.id)),
    getMasteredWords: vi.fn(() => Object.values(state.items).filter(i => i.type === 'word' && i.mastered).map(i => i.id)),
    getUnlockedPhrases: vi.fn(() => Object.values(state.items).filter(i => i.type === 'phrase' && i.unlocked).map(i => i.id)),
    getMasteredPhrases: vi.fn(() => Object.values(state.items).filter(i => i.type === 'phrase' && i.mastered).map(i => i.id)),
    getMasteredCount: vi.fn(() => Object.values(state.items).filter(i => i.mastered).length),
    getUnmasteredItems: vi.fn(() => Object.values(state.items).filter(i => i.unlocked && !i.mastered)),
    areAllWordsMasteredForPhrase: vi.fn((phraseId: string) => true),
    getEligiblePhrases: vi.fn(() => [] as string[]),
    getWordUsage: vi.fn((wordId: string) => mockWordUsage[wordId] || 0),
  };
};

export const createMockUseFlags = () => {
  const state = { items: {} as Record<string, FlagEntry> };
  
  return {
    state: { value: state },
    isFlagged: vi.fn((type: 'word' | 'phrase', id: string) => !!state.items[`${type}:${id}`]),
    flagItem: vi.fn((type: 'word' | 'phrase', id: string, reason = '') => {
      const entry: FlagEntry = { id, type, flaggedAt: new Date().toISOString(), reason };
      state.items[`${type}:${id}`] = entry;
      return entry;
    }),
    unflagItem: vi.fn((type: 'word' | 'phrase', id: string) => {
      const key = `${type}:${id}`;
      if (state.items[key]) {
        delete state.items[key];
        return true;
      }
      return false;
    }),
    getFlag: vi.fn((type: 'word' | 'phrase', id: string) => state.items[`${type}:${id}`] || null),
    getAllFlags: vi.fn(() => Object.values(state.items)),
    getFlaggedWords: vi.fn(() => Object.values(state.items).filter(f => f.type === 'word')),
    getFlaggedPhrases: vi.fn(() => Object.values(state.items).filter(f => f.type === 'phrase')),
    getFlagCount: vi.fn(() => Object.keys(state.items).length),
    clearAllFlags: vi.fn(() => { state.items = {}; }),
  };
};

export const createMockUseSyncProgress = () => ({
  syncToCloud: vi.fn().mockResolvedValue(true),
  syncFromCloud: vi.fn().mockResolvedValue(null),
  sync: vi.fn().mockResolvedValue({}),
  isSyncing: { value: false },
});

export const createMockUseSyncFlags = () => ({
  syncToCloud: vi.fn().mockResolvedValue(true),
  syncFromCloud: vi.fn().mockResolvedValue(null),
  sync: vi.fn().mockResolvedValue({}),
});

export const createMockUseUser = () => ({
  user: { value: null },
  profile: { value: null },
  isLoading: { value: false },
  isSyncing: { value: false },
  initialize: vi.fn().mockResolvedValue(null),
  linkEmail: vi.fn().mockResolvedValue(false),
  signOut: vi.fn().mockResolvedValue(undefined),
  setSyncing: vi.fn(),
  getOrCreateDeviceId: vi.fn(() => 'test-device-id'),
});

export const createMockUseLearningPool = () => {
  const poolValue: PoolItem[] = [];
  return {
    pool: { value: poolValue },
    addItem: vi.fn((item: PoolItem) => {
      if (!poolValue.some(i => i.type === item.type && i.id === item.id)) {
        poolValue.push(item);
      }
    }),
    removeItem: vi.fn((type: 'word' | 'phrase', id: string) => {
      const idx = poolValue.findIndex(i => i.type === type && i.id === id);
      if (idx >= 0) poolValue.splice(idx, 1);
    }),
    replaceMasteredItem: vi.fn((item: PoolItem) => {
      const idx = poolValue.findIndex(i => i.type === item.type && i.id === item.id);
      if (idx >= 0) poolValue.splice(idx, 1);
    }),
    refillIfNeeded: vi.fn(),
    ensureInPool: vi.fn((type: 'word' | 'phrase', id: string) => {
      if (!poolValue.some(i => i.type === type && i.id === id)) {
        poolValue.push({ type, id });
      }
    }),
    getRandomItem: vi.fn((): PoolItem | null => {
      if (poolValue.length === 0) return null;
      return poolValue[0];
    }),
    isInPool: vi.fn((type: 'word' | 'phrase', id: string): boolean => {
      return poolValue.some(i => i.type === type && i.id === id);
    }),
  };
};

export const createMockUseReviewPool = () => ({
  getMasteredItems: vi.fn(() => [] as PoolItem[]),
  getRandomItem: vi.fn(),
  hasItems: { value: false },
});

export const createMockUseWordQuiz = () => ({
  buildQuestion: vi.fn(),
  getNextQuestion: vi.fn(),
});

export const createMockUsePhraseQuiz = () => ({
  buildQuestion: vi.fn(),
  getNextQuestion: vi.fn(),
});
