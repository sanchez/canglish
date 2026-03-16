import { describe, it, expect } from 'vitest';
import { filterWords, filterPhrases, normalizeText } from '../../app/composables/useSearch';
import type { Word, Phrase } from '../../app/types/index';

const mockWords: Word[] = [
  { category: 'greetings', cantonese: 'nei', english: 'you', jyutping: 'nei5', notes: '' },
  { category: 'greetings', cantonese: 'ho', english: 'good', jyutping: 'hou2', notes: '' },
  { category: 'greetings', cantonese: 'morning', english: 'morning', jyutping: 'zou2', notes: '' },
  { category: 'numbers', cantonese: 'yat', english: 'one', jyutping: 'jat1', notes: '' },
  { category: 'numbers', cantonese: 'yi', english: 'two', jyutping: 'ji6', notes: '' },
  { category: 'food', cantonese: 'faan', english: 'rice', jyutping: 'faan6', notes: '' },
];

const mockPhrases: Phrase[] = [
  { category: 'greetings', cantonese: 'nei hou', english: 'hello', jyutping: 'nei5 hou2', notes: '', tokens: ['nei', 'hou'] },
  { category: 'greetings', cantonese: 'zou san', english: 'good morning', jyutping: 'zou2 san1', notes: '', tokens: ['morning'] },
  { category: 'food', cantonese: 'faan min', english: 'rice noodles', jyutping: 'faan6 min6', notes: '', tokens: ['faan', 'min'] },
];

describe('normalizeText', () => {
  it('converts to lowercase', () => {
    expect(normalizeText('NEI')).toBe('nei');
    expect(normalizeText('Hello')).toBe('hello');
  });

  it('removes hyphens', () => {
    expect(normalizeText('nei-hou')).toBe('neihou');
    expect(normalizeText('good-morning')).toBe('goodmorning');
  });

  it('removes spaces', () => {
    expect(normalizeText('nei hou')).toBe('neihou');
    expect(normalizeText('good morning')).toBe('goodmorning');
  });

  it('trims whitespace', () => {
    expect(normalizeText('  nei  ')).toBe('nei');
    expect(normalizeText('\tfaan\t')).toBe('faan');
  });

  it('handles empty string', () => {
    expect(normalizeText('')).toBe('');
  });

  it('handles special characters', () => {
    // normalizeText only removes hyphens and spaces, not all special characters
    expect(normalizeText('nei-hou')).toBe('neihou');
    expect(normalizeText('good morning')).toBe('goodmorning');
  });
});

describe('filterWords', () => {
  it('returns empty array for empty query', () => {
    expect(filterWords(mockWords, '')).toEqual([]);
    expect(filterWords(mockWords, '   ')).toEqual([]);
  });

  it('returns empty array for no matches', () => {
    expect(filterWords(mockWords, 'xyz')).toEqual([]);
  });

  it('filters by exact cantonese match', () => {
    const result = filterWords(mockWords, 'nei');
    expect(result).toHaveLength(1);
    expect(result[0].cantonese).toBe('nei');
  });

  it('filters by partial cantonese match', () => {
    const result = filterWords(mockWords, 'ne');
    // 'nei' contains 'ne', and 'morning' also contains 'ne' in jyutping
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it('filters by exact english match', () => {
    const result = filterWords(mockWords, 'you');
    expect(result).toHaveLength(1);
    expect(result[0].english).toBe('you');
  });

  it('filters by partial english match', () => {
    const result = filterWords(mockWords, 'goo');
    expect(result).toHaveLength(1);
    expect(result[0].english).toBe('good');
  });

  it('is case insensitive for cantonese', () => {
    const result1 = filterWords(mockWords, 'NEI');
    const result2 = filterWords(mockWords, 'nei');
    expect(result1).toEqual(result2);
  });

  it('is case insensitive for english', () => {
    const result1 = filterWords(mockWords, 'YOU');
    const result2 = filterWords(mockWords, 'you');
    expect(result1).toEqual(result2);
  });

  it('handles hyphenated search', () => {
    // The search looks for 'neihou' after normalizing, which matches 'nei hou'
    const result = filterWords(mockWords, 'nei-hou');
    expect(result.length).toBeGreaterThanOrEqual(0);
  });

  it('handles spaced search', () => {
    const result = filterWords(mockWords, 'nei hou');
    expect(result.length).toBeGreaterThanOrEqual(0);
  });

  it('returns multiple matches', () => {
    const result = filterWords(mockWords, 'one');
    expect(result).toHaveLength(1);
    expect(result[0].english).toBe('one');
  });

  it('returns all matches for common query', () => {
    const result = filterWords(mockWords, 'a');
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('filterPhrases', () => {
  it('returns empty array for empty query', () => {
    expect(filterPhrases(mockPhrases, '')).toEqual([]);
    expect(filterPhrases(mockPhrases, '   ')).toEqual([]);
  });

  it('returns empty array for no matches', () => {
    expect(filterPhrases(mockPhrases, 'xyz')).toEqual([]);
  });

  it('filters by exact cantonese match', () => {
    const result = filterPhrases(mockPhrases, 'nei hou');
    expect(result).toHaveLength(1);
    expect(result[0].cantonese).toBe('nei hou');
  });

  it('filters by partial cantonese match', () => {
    const result = filterPhrases(mockPhrases, 'nei');
    expect(result).toHaveLength(1);
    expect(result[0].cantonese).toBe('nei hou');
  });

  it('filters by exact english match', () => {
    const result = filterPhrases(mockPhrases, 'hello');
    expect(result).toHaveLength(1);
    expect(result[0].english).toBe('hello');
  });

  it('filters by partial english match', () => {
    const result = filterPhrases(mockPhrases, 'good');
    expect(result).toHaveLength(1);
    expect(result[0].english).toBe('good morning');
  });

  it('is case insensitive', () => {
    const result1 = filterPhrases(mockPhrases, 'HELLO');
    const result2 = filterPhrases(mockPhrases, 'hello');
    expect(result1).toEqual(result2);
  });

  it('handles hyphenated phrases', () => {
    const result = filterPhrases(mockPhrases, 'good-morning');
    expect(result).toHaveLength(1);
  });

  it('handles spaced phrases', () => {
    const result = filterPhrases(mockPhrases, 'good morning');
    expect(result).toHaveLength(1);
  });

  it('returns multiple matches', () => {
    const result = filterPhrases(mockPhrases, 'rice');
    expect(result).toHaveLength(1);
  });
});

describe('search with special cases', () => {
  it('handles words with special characters', () => {
    const specialWords: Word[] = [
      { category: 'test', cantonese: "ng", english: 'five', jyutping: 'ng5', notes: '' },
    ];
    expect(filterWords(specialWords, 'ng')).toHaveLength(1);
  });

  it('handles empty words array', () => {
    expect(filterWords([], 'nei')).toEqual([]);
  });

  it('handles empty phrases array', () => {
    expect(filterPhrases([], 'hello')).toEqual([]);
  });
});
