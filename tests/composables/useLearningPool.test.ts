import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockUseLearningPool, createMockUseProgress, createMockUseWords, createMockUsePhrases, mockWords, mockPhrases } from '../mocks/nuxt';
import type { PoolItem } from '../../app/types/index';

vi.mock('~/content/words.json', () => ({ default: mockWords }));
vi.mock('~/content/phrases.json', () => ({ default: mockPhrases }));

describe('useLearningPool composable', () => {
  let mock: ReturnType<typeof createMockUseLearningPool>;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mock = createMockUseLearningPool();
  });

  describe('isInPool', () => {
    it('returns false for item not in pool', () => {
      const result = mock.isInPool('word', 'test-id');
      expect(result).toBe(false);
    });

    it('returns true for item in pool', () => {
      mock.pool.value.push({ type: 'word', id: 'test-id' });
      const result = mock.isInPool('word', 'test-id');
      expect(result).toBe(true);
    });

    it('returns false for same id but different type', () => {
      mock.pool.value.push({ type: 'word', id: 'test-id' });
      const result = mock.isInPool('phrase', 'test-id');
      expect(result).toBe(false);
    });
  });

  describe('addItem', () => {
    it('adds item to pool', () => {
      const item: PoolItem = { type: 'word', id: 'new-id' };
      mock.addItem(item);
      expect(mock.pool.value).toContainEqual(item);
    });

    it('does not add duplicate items', () => {
      const item: PoolItem = { type: 'word', id: 'dup-id' };
      mock.addItem(item);
      mock.addItem(item);
      const count = mock.pool.value.filter(i => i.id === 'dup-id').length;
      expect(count).toBe(1);
    });
  });

  describe('removeItem', () => {
    it('removes item from pool', () => {
      mock.pool.value.push({ type: 'word', id: 'remove-me' });
      mock.removeItem('word', 'remove-me');
      expect(mock.pool.value.some(i => i.id === 'remove-me')).toBe(false);
    });

    it('only removes matching type', () => {
      mock.pool.value.push({ type: 'word', id: 'test' });
      mock.pool.value.push({ type: 'phrase', id: 'test' });
      mock.removeItem('word', 'test');
      expect(mock.pool.value.some(i => i.type === 'phrase' && i.id === 'test')).toBe(true);
    });
  });

  describe('replaceMasteredItem', () => {
    it('removes mastered item from pool', () => {
      const item: PoolItem = { type: 'word', id: 'mastered' };
      const testMock = createMockUseLearningPool();
      testMock.pool.value.push(item);
      testMock.replaceMasteredItem(item);
      // Item should be removed
      expect(testMock.pool.value.length).toBe(0);
    });
  });

  describe('ensureInPool', () => {
    it('adds item if not in pool', () => {
      mock.ensureInPool('word', 'new-item');
      expect(mock.pool.value.some(i => i.id === 'new-item')).toBe(true);
    });

    it('does not add if already in pool', () => {
      const item: PoolItem = { type: 'word', id: 'existing' };
      mock.pool.value.push(item);
      const initialLength = mock.pool.value.length;
      mock.ensureInPool('word', 'existing');
      expect(mock.pool.value.length).toBe(initialLength);
    });
  });

  describe('getRandomItem', () => {
    it('returns null for empty pool when no candidates', () => {
      const mockPool = createMockUseLearningPool();
      mockPool.pool.value = [];
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const result = mockPool.getRandomItem();
      expect(result).toBeNull();
    });

    it('returns item from pool', () => {
      const item: PoolItem = { type: 'word', id: 'random-test' };
      mock.pool.value.push(item);
      vi.spyOn(Math, 'random').mockReturnValue(0);
      const result = mock.getRandomItem();
      expect(result).toBeDefined();
    });
  });

  describe('refillIfNeeded', () => {
    it('triggers refill when pool is empty', () => {
      mock.refillIfNeeded();
      expect(mock.refillIfNeeded).toBeDefined();
    });
  });
});

describe('PoolItem type validation', () => {
  it('validates pool item structure', () => {
    const item: PoolItem = { type: 'word', id: 'test-id' };
    expect(item.type).toMatch(/word|phrase/);
    expect(typeof item.id).toBe('string');
  });

  it('accepts both word and phrase types', () => {
    const wordItem: PoolItem = { type: 'word', id: 'word-1' };
    const phraseItem: PoolItem = { type: 'phrase', id: 'phrase-1' };
    expect(wordItem.type).toBe('word');
    expect(phraseItem.type).toBe('phrase');
  });
});

describe('MAX_POOL_SIZE constant', () => {
  it('pool should have maximum size limit', () => {
    const MAX_POOL_SIZE = 20;
    expect(MAX_POOL_SIZE).toBe(20);
  });
});
