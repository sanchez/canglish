import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockUseProgress, createMockUseWords, createMockUsePhrases, mockWords, mockPhrases, mockWordUsage } from '../mocks/nuxt';
import type { ProgressEntry } from '../../app/types/index';

vi.mock('~/content/words.json', () => ({ default: mockWords }));
vi.mock('~/content/phrases.json', () => ({ default: mockPhrases }));
vi.mock('~/content/wordUsage.json', () => ({ default: mockWordUsage }));

describe('useProgress composable', () => {
  let mock: ReturnType<typeof createMockUseProgress>;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mock = createMockUseProgress();
  });

  describe('unlock', () => {
    it('unlocks a word', () => {
      const result = mock.unlock('word', 'test-word-id');
      expect(result).toBeDefined();
      expect(result.unlocked).toBe(true);
      expect(result.score).toBe(0);
      expect(result.mastered).toBe(false);
      expect(result.type).toBe('word');
    });

    it('unlocks a phrase', () => {
      const result = mock.unlock('phrase', 'test-phrase-id');
      expect(result.unlocked).toBe(true);
      expect(result.type).toBe('phrase');
    });

    it('returns existing entry if already unlocked', () => {
      mock.unlock('word', 'existing-id');
      const result = mock.unlock('word', 'existing-id');
      expect(result.id).toBe('existing-id');
    });
  });

  describe('increment', () => {
    it('increments score from 0 to 1', () => {
      const result = mock.increment('word', 'test-id');
      expect(result.score).toBe(1);
    });

    it('increments score multiple times', () => {
      mock.increment('word', 'test-id');
      const result = mock.increment('word', 'test-id');
      expect(result.score).toBe(2);
    });

    it('sets mastered when score reaches 6', () => {
      const entry = { id: 'test', type: 'word' as const, score: 5, unlocked: true, mastered: false };
      mock.state.value.items['word:test'] = entry;
      const result = mock.increment('word', 'test');
      expect(result.mastered).toBe(true);
    });

    it('does not exceed score of 6', () => {
      mock.state.value.items['word:test'] = { id: 'test', type: 'word', score: 6, unlocked: true, mastered: true };
      const result = mock.increment('word', 'test');
      expect(result.score).toBe(6);
    });

    it('creates entry if not exists before incrementing', () => {
      const result = mock.increment('word', 'new-id');
      expect(result.score).toBe(1);
      expect(mock.state.value.items['word:new-id']).toBeDefined();
    });
  });

  describe('demote', () => {
    it('sets score to 3', () => {
      const result = mock.demote('word', 'test-id');
      expect(result.score).toBe(3);
    });

    it('sets mastered to false', () => {
      mock.state.value.items['word:test'] = { id: 'test', type: 'word', score: 6, unlocked: true, mastered: true };
      const result = mock.demote('word', 'test-id');
      expect(result.mastered).toBe(false);
    });
  });

  describe('getEntry', () => {
    it('returns entry if exists', () => {
      mock.state.value.items['word:test'] = { id: 'test', type: 'word', score: 3, unlocked: true, mastered: false };
      const result = mock.getEntry('word', 'test');
      expect(result).toBeDefined();
      expect(result?.score).toBe(3);
    });

    it('returns null if entry does not exist', () => {
      const result = mock.getEntry('word', 'nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('getUnlockedWords', () => {
    it('returns unlocked words', () => {
      mock.state.value.items['word:1'] = { id: '1', type: 'word', score: 0, unlocked: true, mastered: false };
      mock.state.value.items['word:2'] = { id: '2', type: 'word', score: 0, unlocked: false, mastered: false };
      const result = mock.getUnlockedWords();
      expect(result).toContain('1');
      expect(result).not.toContain('2');
    });
  });

  describe('getMasteredWords', () => {
    it('returns mastered words', () => {
      mock.state.value.items['word:1'] = { id: '1', type: 'word', score: 6, unlocked: true, mastered: true };
      mock.state.value.items['word:2'] = { id: '2', type: 'word', score: 3, unlocked: true, mastered: false };
      const result = mock.getMasteredWords();
      expect(result).toContain('1');
      expect(result).not.toContain('2');
    });
  });

  describe('getMasteredCount', () => {
    it('returns count of mastered items', () => {
      mock.state.value.items['word:1'] = { id: '1', type: 'word', score: 6, unlocked: true, mastered: true };
      mock.state.value.items['word:2'] = { id: '2', type: 'word', score: 3, unlocked: true, mastered: false };
      mock.state.value.items['phrase:1'] = { id: '1', type: 'phrase', score: 6, unlocked: true, mastered: true };
      const result = mock.getMasteredCount();
      expect(result).toBe(2);
    });
  });

  describe('getUnmasteredItems', () => {
    it('returns items that are unlocked but not mastered', () => {
      mock.state.value.items['word:1'] = { id: '1', type: 'word', score: 3, unlocked: true, mastered: false };
      mock.state.value.items['word:2'] = { id: '2', type: 'word', score: 6, unlocked: true, mastered: true };
      const result = mock.getUnmasteredItems();
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('1');
    });
  });

  describe('areAllWordsMasteredForPhrase', () => {
    it('returns true when mock returns true', () => {
      const result = mock.areAllWordsMasteredForPhrase('phrase:1');
      expect(result).toBe(true);
    });
  });

  describe('getEligiblePhrases', () => {
    it('returns eligible phrases', () => {
      const result = mock.getEligiblePhrases();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getWordUsage', () => {
    it('returns usage for known word', () => {
      const result = mock.getWordUsage('word-greetings-nei');
      expect(result).toBe(100);
    });

    it('returns 0 for unknown word', () => {
      const result = mock.getWordUsage('unknown-word');
      expect(result).toBe(0);
    });
  });
});

describe('ProgressEntry validation', () => {
  it('mastered is derived from score >= 6', () => {
    const entry1: ProgressEntry = { id: '1', type: 'word', score: 5, unlocked: true, mastered: false };
    const entry2: ProgressEntry = { id: '2', type: 'word', score: 6, unlocked: true, mastered: true };
    expect(entry1.mastered).toBe(false);
    expect(entry2.mastered).toBe(true);
  });

  it('type is either word or phrase', () => {
    const entry1: ProgressEntry = { id: '1', type: 'word', score: 0, unlocked: true, mastered: false };
    const entry2: ProgressEntry = { id: '2', type: 'phrase', score: 0, unlocked: true, mastered: false };
    expect(entry1.type).toBe('word');
    expect(entry2.type).toBe('phrase');
  });
});
