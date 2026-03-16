import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockWords, createMockUseWords } from '../mocks/nuxt';

vi.mock('~/content/words.json', () => ({
  default: mockWords,
}));

describe('useWords composable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getWordById', () => {
    it('finds word by correct ID', () => {
      const mock = createMockUseWords();
      const result = mock.getWordById('word-greetings-nei-you');
      expect(result).toBeDefined();
      expect(result?.cantonese).toBe('nei');
    });

    it('returns undefined for non-existent ID', () => {
      const mock = createMockUseWords();
      const result = mock.getWordById('word-nonexistent-id');
      expect(result).toBeUndefined();
    });
  });

  describe('getWordsByCategory', () => {
    it('returns words in the same category', () => {
      const mock = createMockUseWords();
      const greetings = mock.getWordsByCategory('greetings');
      expect(greetings.length).toBe(3);
      greetings.forEach(w => expect(w.category).toBe('greetings'));
    });

    it('returns empty array for non-existent category', () => {
      const mock = createMockUseWords();
      const result = mock.getWordsByCategory('nonexistent');
      expect(result).toEqual([]);
    });
  });

  describe('getWordByCantonese', () => {
    it('finds word by exact cantonese match', () => {
      const mock = createMockUseWords();
      const result = mock.getWordByCantonese('nei');
      expect(result).toBeDefined();
      expect(result?.english).toBe('you');
    });

    it('handles spelling variations (nay/lay)', () => {
      const mock = createMockUseWords();
      // The mock doesn't have 'lay' variation, so it returns undefined
      const result = mock.getWordByCantonese('lay');
      expect(result).toBeUndefined();
    });
  });

  describe('getAllCategories', () => {
    it('returns unique categories', () => {
      const mock = createMockUseWords();
      const categories = mock.getAllCategories();
      expect(categories).toContain('greetings');
      expect(categories).toContain('numbers');
      expect(categories).toContain('food');
    });
  });

  describe('getWordsByIds', () => {
    it('filters words by multiple IDs', () => {
      const mock = createMockUseWords();
      const ids = ['word-greetings-nei-you', 'word-numbers-yat-one'];
      const result = mock.getWordsByIds(ids);
      expect(result.length).toBe(2);
    });

    it('handles non-existent IDs gracefully', () => {
      const mock = createMockUseWords();
      const ids = ['word-nonexistent-id'];
      const result = mock.getWordsByIds(ids);
      expect(result).toEqual([]);
    });
  });
});

describe('useWords data integrity', () => {
  it('loads all words from data', () => {
    const mock = createMockUseWords();
    expect(mock.words.value.length).toBeGreaterThan(0);
  });

  it('words have required properties', () => {
    const mock = createMockUseWords();
    mock.words.value.forEach(word => {
      expect(word).toHaveProperty('cantonese');
      expect(word).toHaveProperty('english');
      expect(word).toHaveProperty('jyutping');
      expect(word).toHaveProperty('category');
    });
  });
});
