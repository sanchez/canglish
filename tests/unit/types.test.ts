import { describe, it, expect } from 'vitest';
import { getWordId, getPhraseId } from '../../app/types/index';
import type { Word, Phrase } from '../../app/types/index';

describe('getWordId', () => {
  const createWord = (overrides: Partial<Word> = {}): Word => ({
    category: 'greetings',
    cantonese: 'nei',
    english: 'you',
    jyutping: 'nei5',
    notes: '',
    ...overrides,
  });

  it('generates correct ID for basic word', () => {
    const word = createWord();
    expect(getWordId(word)).toBe('word-greetings-nei-you');
  });

  it('generates consistent ID regardless of input order', () => {
    const word1 = createWord({ cantonese: 'ho', english: 'good' });
    const word2 = createWord({ cantonese: 'ho', english: 'good' });
    expect(getWordId(word1)).toBe(getWordId(word2));
  });

  it('handles multi-word english', () => {
    const word = createWord({ english: 'good morning' });
    expect(getWordId(word)).toBe('word-greetings-nei-good-morning');
  });

  it('handles special characters in cantonese', () => {
    const word = createWord({ cantonese: 'jau' });
    expect(getWordId(word)).toBe('word-greetings-jau-you');
  });

  it('handles different categories', () => {
    const word1 = createWord({ category: 'numbers' });
    const word2 = createWord({ category: 'food' });
    expect(getWordId(word1)).toContain('word-numbers-');
    expect(getWordId(word2)).toContain('word-food-');
  });

  it('handles empty notes', () => {
    const word = createWord({ notes: '' });
    expect(getWordId(word)).toBe('word-greetings-nei-you');
  });
});

describe('getPhraseId', () => {
  const createPhrase = (overrides: Partial<Phrase> = {}): Phrase => ({
    category: 'greetings',
    cantonese: 'nei hou',
    english: 'hello',
    jyutping: 'nei5 hou2',
    notes: '',
    tokens: ['nei', 'hou'],
    ...overrides,
  });

  it('generates correct ID for basic phrase', () => {
    const phrase = createPhrase();
    expect(getPhraseId(phrase)).toBe('phrase-greetings-nei-hou-hello');
  });

  it('generates consistent ID regardless of input order', () => {
    const phrase1 = createPhrase({ cantonese: 'nei hou', english: 'hello' });
    const phrase2 = createPhrase({ cantonese: 'nei hou', english: 'hello' });
    expect(getPhraseId(phrase1)).toBe(getPhraseId(phrase2));
  });

  it('handles multi-word cantonese', () => {
    const phrase = createPhrase({ cantonese: 'nei hou a' });
    expect(getPhraseId(phrase)).toBe('phrase-greetings-nei-hou-a-hello');
  });

  it('handles multi-word english', () => {
    const phrase = createPhrase({ english: 'good morning' });
    expect(getPhraseId(phrase)).toBe('phrase-greetings-nei-hou-good-morning');
  });

  it('handles different categories', () => {
    const phrase1 = createPhrase({ category: 'numbers' });
    const phrase2 = createPhrase({ category: 'food' });
    expect(getPhraseId(phrase1)).toContain('phrase-numbers-');
    expect(getPhraseId(phrase2)).toContain('phrase-food-');
  });

  it('includes tokens in ID generation', () => {
    const phrase = createPhrase({ tokens: ['faan', 'min'] });
    expect(getPhraseId(phrase)).toBe('phrase-greetings-nei-hou-hello');
  });
});

describe('slugify function (internal)', () => {
  it('converts cantonese and english to lowercase', () => {
    const word = { category: 'Test', cantonese: 'ABC', english: 'DEF', jyutping: 'abc', notes: '' };
    const id = getWordId(word);
    expect(id).toContain('abc');
    expect(id).toContain('def');
  });

  it('removes special characters except hyphens', () => {
    const word = { category: 'greetings', cantonese: 'nei!@#', english: 'you$%', jyutping: 'nei', notes: '' };
    // Special characters are removed
    expect(getWordId(word)).not.toContain('!');
    expect(getWordId(word)).not.toContain('@');
  });

  it('replaces spaces with hyphens', () => {
    const word = { category: 'greetings', cantonese: 'nei hou', english: 'good day', jyutping: 'nei', notes: '' };
    expect(getWordId(word)).toContain('good-day');
  });

  it('handles multiple consecutive hyphens', () => {
    const word = { category: 'greetings', cantonese: 'nei--hou', english: 'you', jyutping: 'nei', notes: '' };
    expect(getWordId(word)).toContain('nei-hou');
  });
});
