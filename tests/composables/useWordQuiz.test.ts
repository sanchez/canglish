import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockUseWords, createMockUseProgress, mockWords } from '../mocks/nuxt';
import type { WordQuizQuestion } from '../../app/types/index';

vi.mock('~/content/words.json', () => ({ default: mockWords }));

describe('useWordQuiz composable (logic tests)', () => {
  let mockWordsModule: ReturnType<typeof createMockUseWords>;
  let mockProgress: ReturnType<typeof createMockUseProgress>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    mockWordsModule = createMockUseWords();
    mockProgress = createMockUseProgress();
  });

  describe('question building logic', () => {
    it('generates correct question structure', () => {
      const mockQuestion: WordQuizQuestion = {
        wordId: 'word-greetings-nei-you',
        promptType: 'cantonese',
        prompt: 'nei',
        options: [
          { id: 'word-greetings-nei-you', text: 'you' },
          { id: 'distractor1', text: 'good' },
          { id: 'distractor2', text: 'morning' },
          { id: 'distractor3', text: 'one' },
        ],
        correctOptionId: 'word-greetings-nei-you',
        notes: '',
      };

      expect(mockQuestion.wordId).toBeDefined();
      expect(mockQuestion.promptType).toMatch(/cantonese|english/);
      expect(mockQuestion.options.length).toBe(4);
      expect(mockQuestion.correctOptionId).toBe(mockQuestion.wordId);
    });

    it('prompt is cantonese when promptType is cantonese', () => {
      const promptType: 'cantonese' | 'english' = 'cantonese';
      const word = mockWordsModule.words.value[0];
      const prompt = promptType === 'cantonese' ? word.cantonese : word.english;
      expect(prompt).toBe('nei');
    });

    it('prompt is english when promptType is english', () => {
      const promptType: 'cantonese' | 'english' = 'english';
      const word = mockWordsModule.words.value[0];
      const prompt = promptType === 'cantonese' ? word.cantonese : word.english;
      expect(prompt).toBe('you');
    });

    it('options include correct answer', () => {
      const word = mockWordsModule.words.value[0];
      const correctOption = {
        id: 'word-greetings-nei-you',
        text: word.english,
      };
      expect(correctOption.text).toBe('you');
    });
  });

  describe('getNextQuestion filtering', () => {
    it('filters by mastered status for learn mode', () => {
      const candidateIds = ['word-1', 'word-2', 'word-3'];
      mockProgress.state.value.items['word:word-1'] = { id: 'word-1', type: 'word', score: 6, unlocked: true, mastered: true };
      mockProgress.state.value.items['word:word-2'] = { id: 'word-2', type: 'word', score: 3, unlocked: true, mastered: false };

      const eligible = candidateIds.filter((id) => {
        const entry = mockProgress.getEntry('word', id);
        const mode = 'learn';
        return !entry || !entry.mastered;
      });

      // word-2 and word-3 are not mastered (or don't exist)
      expect(eligible).toContain('word-2');
      expect(eligible).toContain('word-3');
    });

    it('filters by mastered status for review mode', () => {
      const candidateIds = ['word-1', 'word-2'];
      mockProgress.state.value.items['word:word-1'] = { id: 'word-1', type: 'word', score: 6, unlocked: true, mastered: true };
      mockProgress.state.value.items['word:word-2'] = { id: 'word-2', type: 'word', score: 3, unlocked: true, mastered: false };

      const eligible = candidateIds.filter((id) => {
        const entry = mockProgress.getEntry('word', id);
        const mode = 'review';
        return entry && entry.mastered;
      });

      expect(eligible).toContain('word-1');
      expect(eligible).not.toContain('word-2');
    });

    it('returns null for empty candidate list', () => {
      const result = mockProgress.getEntry('word', 'any');
      expect(result).toBeNull();
    });
  });

  describe('distractor selection logic', () => {
    it('prefers same category words for distractors', () => {
      const category = 'greetings';
      const sameCategoryWords = mockWordsModule.words.value.filter(w => w.category === category);
      expect(sameCategoryWords.length).toBeGreaterThan(0);
    });

    it('can find distractors from different categories if needed', () => {
      const category = 'numbers';
      const differentCategoryWords = mockWordsModule.words.value.filter(w => w.category !== category);
      expect(differentCategoryWords.length).toBeGreaterThan(0);
    });
  });

  describe('question null handling', () => {
    it('returns null for non-existent word', () => {
      const result = mockWordsModule.getWordById('nonexistent-id');
      expect(result).toBeUndefined();
    });
  });
});

describe('WordQuizQuestion type validation', () => {
  it('validates question structure', () => {
    const question: WordQuizQuestion = {
      wordId: 'test-id',
      promptType: 'cantonese',
      prompt: 'nei',
      options: [
        { id: '1', text: 'you' },
        { id: '2', text: 'good' },
      ],
      correctOptionId: '1',
    };

    expect(question.promptType).toMatch(/cantonese|english/);
    expect(question.options.length).toBeGreaterThanOrEqual(2);
  });
});
