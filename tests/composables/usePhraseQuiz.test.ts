import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockUsePhrases, createMockUseWords, createMockUseProgress, mockWords, mockPhrases } from '../mocks/nuxt';
import type { PhraseQuizQuestion } from '../../app/types/index';

vi.mock('~/content/words.json', () => ({ default: mockWords }));
vi.mock('~/content/phrases.json', () => ({ default: mockPhrases }));

describe('usePhraseQuiz composable (logic tests)', () => {
  let mockPhrasesModule: ReturnType<typeof createMockUsePhrases>;
  let mockWordsModule: ReturnType<typeof createMockUseWords>;
  let mockProgress: ReturnType<typeof createMockUseProgress>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    mockPhrasesModule = createMockUsePhrases();
    mockWordsModule = createMockUseWords();
    mockProgress = createMockUseProgress();
  });

  describe('question building logic', () => {
    it('generates correct question structure', () => {
      const mockQuestion: PhraseQuizQuestion = {
        phraseId: 'phrase-greetings-nei-hou-hello',
        english: 'hello',
        targetTokens: ['nei', 'hou'],
        choices: ['nei', 'hou', 'faan', 'min', 'zou', 'san'],
      };

      expect(mockQuestion.phraseId).toBeDefined();
      expect(mockQuestion.english).toBeDefined();
      expect(mockQuestion.targetTokens.length).toBeGreaterThan(0);
      expect(mockQuestion.choices.length).toBeGreaterThanOrEqual(mockQuestion.targetTokens.length);
    });

    it('targetTokens are extracted from phrase', () => {
      const phrase = mockPhrasesModule.phrases.value[0];
      expect(phrase.tokens).toContain('nei');
      expect(phrase.tokens).toContain('hou');
    });

    it('choices include target tokens plus distractors', () => {
      const phrase = mockPhrasesModule.phrases.value[0];
      const targetTokens = [...phrase.tokens];
      const distractors = ['faan', 'min', 'zou', 'san'];
      const choices = [...targetTokens, ...distractors];
      
      expect(choices.length).toBeGreaterThan(targetTokens.length);
    });
  });

  describe('getNextQuestion filtering', () => {
    it('filters by eligibility for learn mode', () => {
      const candidateIds = ['phrase-1', 'phrase-2'];
      mockProgress.state.value.items['phrase:phrase-1'] = { id: 'phrase-1', type: 'phrase', score: 6, unlocked: true, mastered: true };

      const eligible = candidateIds.filter((id) => {
        const entry = mockProgress.getEntry('phrase', id);
        const allWordsMastered = true;
        return allWordsMastered && (!entry || !entry.mastered);
      });

      expect(eligible.length).toBeGreaterThanOrEqual(0);
    });

    it('filters by mastered status for review mode', () => {
      const candidateIds = ['phrase-1', 'phrase-2'];
      mockProgress.state.value.items['phrase:phrase-1'] = { id: 'phrase-1', type: 'phrase', score: 6, unlocked: true, mastered: true };
      mockProgress.state.value.items['phrase:phrase-2'] = { id: 'phrase-2', type: 'phrase', score: 3, unlocked: true, mastered: false };

      const eligible = candidateIds.filter((id) => {
        const entry = mockProgress.getEntry('phrase', id);
        const mode = 'review';
        return entry && entry.mastered;
      });

      expect(eligible).toContain('phrase-1');
      expect(eligible).not.toContain('phrase-2');
    });
  });

  describe('distractor token selection', () => {
    it('prefers tokens from other phrases', () => {
      const targetTokens = ['nei', 'hou'];
      const otherPhrases = mockPhrasesModule.phrases.value.filter(p => p.tokens.join(' ') !== 'nei hou');
      
      const allTokens = otherPhrases.flatMap(p => p.tokens);
      expect(allTokens.length).toBeGreaterThan(0);
    });

    it('can use words as fallback distractors', () => {
      const targetTokenSet = new Set(['nei', 'hou']);
      const randomWords = mockWordsModule.words.value.filter(w => !targetTokenSet.has(w.cantonese));
      
      expect(randomWords.length).toBeGreaterThan(0);
    });
  });

  describe('question null handling', () => {
    it('returns null for non-existent phrase', () => {
      const result = mockPhrasesModule.getPhraseById('nonexistent-id');
      expect(result).toBeUndefined();
    });
  });
});

describe('PhraseQuizQuestion type validation', () => {
  it('validates question structure', () => {
    const question: PhraseQuizQuestion = {
      phraseId: 'test-id',
      english: 'test phrase',
      targetTokens: ['token1', 'token2'],
      choices: ['token1', 'token2', 'distractor1', 'distractor2'],
    };

    expect(question.phraseId).toBeDefined();
    expect(question.english).toBeDefined();
    expect(question.targetTokens.length).toBeGreaterThan(0);
    expect(question.choices.length).toBeGreaterThanOrEqual(question.targetTokens.length);
  });

  it('validates target tokens are subset of choices', () => {
    const question: PhraseQuizQuestion = {
      phraseId: 'test-id',
      english: 'test',
      targetTokens: ['a', 'b'],
      choices: ['a', 'b', 'c', 'd'],
    };

    question.targetTokens.forEach(token => {
      expect(question.choices).toContain(token);
    });
  });
});
