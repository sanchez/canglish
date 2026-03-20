<template>
  <div class="max-w-xl mx-auto space-y-8 animate-fade-in">
    <!-- Hero Section -->
    <div class="text-center pt-8">
      <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
        Learn Cantonese
      </h1>
      <p class="text-gray-500 dark:text-gray-400 text-base">
        Master Cantonese using English phonetics
      </p>
    </div>

    <!-- Quiz Area -->
    <div v-if="!isDone">
      <!-- Progress -->
      <div class="flex items-center justify-between mb-4">
        <span class="text-sm text-gray-500 dark:text-gray-400">{{ sessionCount }} answered</span>
        <div class="flex items-center gap-2">
          <div class="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gray-900 dark:bg-white rounded-full transition-all duration-300"
              :style="{ width: `${sessionProgress}%` }"
            ></div>
          </div>
          <span class="text-sm text-gray-500 dark:text-gray-400">{{ poolSize }} left</span>
        </div>
      </div>

      <!-- Question -->
      <div v-if="currentQuestion" class="space-y-6">
        <!-- Prompt -->
        <div class="text-center">
          <div class="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-500 dark:text-gray-400 mb-4">
            {{ currentQuestion.promptType === "cantonese" ? "Cantonese" : "English" }}
          </div>
          <div class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {{ currentQuestion.prompt }}
          </div>
          <div v-if="currentQuestion.notes" class="text-sm text-gray-500 dark:text-gray-400 italic">
            {{ currentQuestion.notes }}
          </div>
        </div>

        <!-- Options -->
        <div class="grid grid-cols-1 gap-3">
          <button
            v-for="(option, index) in currentQuestion.options"
            :key="option.id"
            @click="handleAnswer(option.id)"
            :disabled="answered"
            :class="getOptionClass(option.id)"
            class="group relative px-5 py-4 text-base font-medium rounded-xl transition-all duration-200 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-white"
          >
            <span class="flex items-center justify-between gap-3">
              <span class="flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold">
                  {{ String.fromCharCode(65 + index) }}
                </span>
                <span>{{ option.text }}</span>
              </span>
              <svg v-if="answered && option.id === currentQuestion.correctOptionId" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else-if="answered && option.id === selectedId && option.id !== currentQuestion.correctOptionId" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          </button>
        </div>

        <!-- Next Button -->
        <div v-if="answered && !isAutoAdvancing" class="text-center pt-2">
          <button @click="loadNextQuestion" class="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors">
            Continue
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-else class="text-center py-12">
        <div class="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-white rounded-full animate-spin mx-auto"></div>
        <p class="text-gray-500 dark:text-gray-400 mt-3">Loading...</p>
      </div>
    </div>

    <!-- Completion State -->
    <div v-else class="text-center py-12 space-y-6">
      <div class="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">All done for now!</h2>
        <p class="text-gray-500 dark:text-gray-400">You've completed {{ sessionCount }} questions. Come back later to learn more.</p>
      </div>
      <div class="flex justify-center gap-4 text-sm">
        <NuxtLink to="/search" class="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
          Search words
        </NuxtLink>
        <NuxtLink to="/review" class="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors" :class="{ 'opacity-50': !hasReviewItems }">
          Review
        </NuxtLink>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="flex justify-center gap-12 text-center pt-4">
      <div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{{ masteredCount }}</div>
        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">Mastered</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { WordQuizQuestion, QuizOption } from "~/types";
  import { getWordId } from "~/types";

  const { words } = useWords();
  const { phrases } = usePhrases();
  const { getMasteredCount, increment, getEntry } = useProgress();
  const { pool, refillIfNeeded, replaceMasteredItem } = useLearningPool();

  useHead({
    title: "Home",
  });

  const masteredCount = computed(() => getMasteredCount());
  const poolSize = computed(() => pool.value.length);

  const sessionCount = ref(0);
  const currentQuestion = ref<WordQuizQuestion | null>(null);
  const answered = ref(false);
  const selectedId = ref<string | null>(null);
  const isAutoAdvancing = ref(false);
  const isDone = ref(false);

  const sessionProgress = computed(() => {
    const total = sessionCount.value + poolSize.value;
    if (total === 0) return 0;
    return (sessionCount.value / total) * 100;
  });

  const hasReviewItems = computed(() => {
    const { hasItems } = useReviewPool();
    return hasItems.value;
  });

  const buildQuestion = (wordId: string): WordQuizQuestion | null => {
    const { getWordById } = useWords();
    const word = getWordById(wordId);
    if (!word) return null;

    const promptType = Math.random() < 0.5 ? "cantonese" : "english";
    const prompt = promptType === "cantonese" ? word.cantonese : word.english;

    const correctOption: QuizOption = {
      id: wordId,
      text: promptType === "cantonese" ? word.english : word.cantonese,
    };

    const distractors = findDistractors(word, promptType, 3);
    const allOptions = [correctOption, ...distractors];
    shuffleArray(allOptions);

    return {
      wordId,
      promptType,
      prompt,
      options: allOptions,
      correctOptionId: wordId,
      notes: word.notes,
    };
  };

  const findDistractors = (targetWord: Word, promptType: "cantonese" | "english", count: number): QuizOption[] => {
    const distractors: QuizOption[] = [];
    const targetWordId = getWordId(targetWord);

    const sameCategoryWords = words.value.filter(
      (w) => getWordId(w) !== targetWordId && w.category === targetWord.category
    );

    shuffleArray(sameCategoryWords);
    for (const word of sameCategoryWords) {
      if (distractors.length >= count) break;
      distractors.push({
        id: getWordId(word),
        text: promptType === "cantonese" ? word.english : word.cantonese,
      });
    }

    if (distractors.length < count) {
      const otherWords = words.value.filter(
        (w) => getWordId(w) !== targetWordId && !sameCategoryWords.includes(w)
      );
      shuffleArray(otherWords);

      for (const word of otherWords) {
        if (distractors.length >= count) break;
        distractors.push({
          id: getWordId(word),
          text: promptType === "cantonese" ? word.english : word.cantonese,
        });
      }
    }

    return distractors.slice(0, count);
  };

  function shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  const loadNextQuestion = () => {
    answered.value = false;
    selectedId.value = null;
    isAutoAdvancing.value = false;

    if (pool.value.length === 0) {
      isDone.value = true;
      currentQuestion.value = null;
      return;
    }

    const wordIds = pool.value.filter((p) => p.type === "word").map((p) => p.id);
    if (wordIds.length === 0) {
      isDone.value = true;
      currentQuestion.value = null;
      return;
    }

    // Shuffle and try to build a question, retrying if needed
    shuffleArray(wordIds);
    for (const wordId of wordIds) {
      const question = buildQuestion(wordId);
      if (question) {
        currentQuestion.value = question;
        return;
      }
    }

    // All questions failed to build - pool might be empty or corrupted
    isDone.value = true;
    currentQuestion.value = null;
  };

  const handleAnswer = (optionId: string) => {
    if (answered.value || !currentQuestion.value) return;

    selectedId.value = optionId;
    answered.value = true;

    const correct = optionId === currentQuestion.value.correctOptionId;

    if (correct) {
      isAutoAdvancing.value = true;
      const entry = increment("word", currentQuestion.value.wordId);
      if (entry.mastered) {
        replaceMasteredItem({ type: "word", id: currentQuestion.value.wordId });
      }
    }

    setTimeout(() => {
      if (correct) {
        sessionCount.value++;
        setTimeout(() => {
          loadNextQuestion();
        }, 800);
      }
    }, 300);
  };

  const getOptionClass = (optionId: string) => {
    if (!answered.value) {
      return "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white";
    }

    if (optionId === currentQuestion.value?.correctOptionId) {
      return "bg-emerald-500 text-white";
    }

    if (optionId === selectedId.value) {
      return "bg-red-500 text-white";
    }

    return "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 opacity-50";
  };

  onMounted(() => {
    refillIfNeeded();
    loadNextQuestion();
  });
</script>
