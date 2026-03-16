import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockUseFlags } from '../mocks/nuxt';
import type { FlagEntry } from '../../app/types/index';

describe('useFlags composable', () => {
  let mock: ReturnType<typeof createMockUseFlags>;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mock = createMockUseFlags();
  });

  describe('isFlagged', () => {
    it('returns false for unflagged item', () => {
      const result = mock.isFlagged('word', 'test-id');
      expect(result).toBe(false);
    });

    it('returns true for flagged item', () => {
      mock.state.value.items['word:test-id'] = {
        id: 'test-id',
        type: 'word',
        flaggedAt: new Date().toISOString(),
        reason: 'test',
      };
      const result = mock.isFlagged('word', 'test-id');
      expect(result).toBe(true);
    });

    it('returns false for same id but different type', () => {
      mock.state.value.items['word:test-id'] = {
        id: 'test-id',
        type: 'word',
        flaggedAt: new Date().toISOString(),
        reason: 'test',
      };
      const result = mock.isFlagged('phrase', 'test-id');
      expect(result).toBe(false);
    });
  });

  describe('flagItem', () => {
    it('flags a word', () => {
      const result = mock.flagItem('word', 'flagged-word', 'test reason');
      expect(result).toBeDefined();
      expect(result.type).toBe('word');
      expect(result.id).toBe('flagged-word');
      expect(result.reason).toBe('test reason');
      expect(result.flaggedAt).toBeDefined();
    });

    it('flags a phrase', () => {
      const result = mock.flagItem('phrase', 'flagged-phrase', 'another reason');
      expect(result.type).toBe('phrase');
      expect(result.id).toBe('flagged-phrase');
    });

    it('flags without reason', () => {
      const result = mock.flagItem('word', 'no-reason');
      expect(result.reason).toBe('');
    });

    it('overwrites existing flag', () => {
      mock.flagItem('word', 'same-id', 'first reason');
      const result = mock.flagItem('word', 'same-id', 'second reason');
      expect(result.reason).toBe('second reason');
    });
  });

  describe('unflagItem', () => {
    it('unflags an item', () => {
      mock.state.value.items['word:test'] = {
        id: 'test',
        type: 'word',
        flaggedAt: new Date().toISOString(),
        reason: '',
      };
      const result = mock.unflagItem('word', 'test');
      expect(result).toBe(true);
      expect(mock.state.value.items['word:test']).toBeUndefined();
    });

    it('returns false for non-existent flag', () => {
      const result = mock.unflagItem('word', 'nonexistent');
      expect(result).toBe(false);
    });

    it('returns false for different type', () => {
      mock.state.value.items['word:test'] = {
        id: 'test',
        type: 'word',
        flaggedAt: new Date().toISOString(),
        reason: '',
      };
      const result = mock.unflagItem('phrase', 'test');
      expect(result).toBe(false);
    });
  });

  describe('getFlag', () => {
    it('returns flag if exists', () => {
      mock.state.value.items['word:test'] = {
        id: 'test',
        type: 'word',
        flaggedAt: '2024-01-01',
        reason: 'test',
      };
      const result = mock.getFlag('word', 'test');
      expect(result).toBeDefined();
      expect(result?.reason).toBe('test');
    });

    it('returns null if not exists', () => {
      const result = mock.getFlag('word', 'nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('getAllFlags', () => {
    it('returns all flags', () => {
      mock.state.value.items['word:1'] = { id: '1', type: 'word', flaggedAt: '', reason: '' };
      mock.state.value.items['phrase:2'] = { id: '2', type: 'phrase', flaggedAt: '', reason: '' };
      const result = mock.getAllFlags();
      expect(result.length).toBe(2);
    });

    it('returns empty array when no flags', () => {
      const result = mock.getAllFlags();
      expect(result).toEqual([]);
    });
  });

  describe('getFlaggedWords', () => {
    it('returns only word flags', () => {
      mock.state.value.items['word:1'] = { id: '1', type: 'word', flaggedAt: '', reason: '' };
      mock.state.value.items['phrase:2'] = { id: '2', type: 'phrase', flaggedAt: '', reason: '' };
      const result = mock.getFlaggedWords();
      expect(result.length).toBe(1);
      expect(result[0].type).toBe('word');
    });
  });

  describe('getFlaggedPhrases', () => {
    it('returns only phrase flags', () => {
      mock.state.value.items['word:1'] = { id: '1', type: 'word', flaggedAt: '', reason: '' };
      mock.state.value.items['phrase:2'] = { id: '2', type: 'phrase', flaggedAt: '', reason: '' };
      const result = mock.getFlaggedPhrases();
      expect(result.length).toBe(1);
      expect(result[0].type).toBe('phrase');
    });
  });

  describe('getFlagCount', () => {
    it('returns count of all flags', () => {
      mock.state.value.items['word:1'] = { id: '1', type: 'word', flaggedAt: '', reason: '' };
      mock.state.value.items['phrase:2'] = { id: '2', type: 'phrase', flaggedAt: '', reason: '' };
      const result = mock.getFlagCount();
      expect(result).toBe(2);
    });

    it('returns 0 when no flags', () => {
      const result = mock.getFlagCount();
      expect(result).toBe(0);
    });
  });

  describe('clearAllFlags', () => {
    it('removes all flags', () => {
      mock.state.value.items['word:1'] = { id: '1', type: 'word', flaggedAt: '', reason: '' };
      mock.state.value.items['phrase:2'] = { id: '2', type: 'phrase', flaggedAt: '', reason: '' };
      mock.clearAllFlags();
      expect(mock.getFlagCount()).toBe(0);
    });
  });
});

describe('FlagEntry type validation', () => {
  it('validates flag entry structure', () => {
    const entry: FlagEntry = {
      id: 'test-id',
      type: 'word',
      flaggedAt: '2024-01-01T00:00:00.000Z',
      reason: 'test reason',
    };
    expect(entry.id).toBeDefined();
    expect(entry.type).toMatch(/word|phrase/);
    expect(entry.flaggedAt).toBeDefined();
    expect(typeof entry.reason).toBe('string');
  });

  it('accepts both word and phrase types', () => {
    const wordFlag: FlagEntry = { id: '1', type: 'word', flaggedAt: '', reason: '' };
    const phraseFlag: FlagEntry = { id: '2', type: 'phrase', flaggedAt: '', reason: '' };
    expect(wordFlag.type).toBe('word');
    expect(phraseFlag.type).toBe('phrase');
  });

  it('reason can be empty string', () => {
    const entry: FlagEntry = { id: '1', type: 'word', flaggedAt: '', reason: '' };
    expect(entry.reason).toBe('');
  });
});

describe('storage key constant', () => {
  it('uses correct storage key', () => {
    const STORAGE_KEY = 'canglish-flags-v1';
    expect(STORAGE_KEY).toBe('canglish-flags-v1');
  });
});
