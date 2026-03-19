<template>
  <div>
    <QuizShell :mode="'learn'">
      <template #top-right>
        <NuxtLink
          to="/learn"
          class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 whitespace-nowrap"
        >
          Exit
        </NuxtLink>
      </template>

      <template #header>
        <ProgressBar
          :current="sessionCount"
          :total="sessionTarget"
          label="Session Progress"
        />
      </template>

      <div
        v-if="loading"
        class="text-center py-12"
      >
        <LoadingSpinner size="lg" label="Loading next question..." />
      </div>

      <div
        v-else-if="!currentQuestion"
        class="text-center py-12 space-y-4"
      >
        <div class="w-20 h-20 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="text-xl font-semibold text-gray-900 dark:text-white">
          All done for now!
        </div>
        <div class="text-muted max-w-xs mx-auto">
          You've mastered everything in your learning pool. Come back later to learn more.
        </div>
        <NuxtLink
          to="/learn"
          class="inline-flex items-center gap-2 mt-4 px-6 py-3 btn-primary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Learn
        </NuxtLink>
      </div>

      <div v-else-if="currentQuestion.type === 'word'">
        <WordQuizQuestion
          :question="currentQuestion.question"
          :mode="'learn'"
          @answered="handleWordAnswer"
          @next="loadNextQuestion"
        />
      </div>

      <div v-else-if="currentQuestion.type === 'phrase'">
        <PhraseQuizQuestion
          :question="currentQuestion.question"
          :mode="'learn'"
          @answered="handlePhraseAnswer"
          @next="loadNextQuestion"
        />
      </div>
    </QuizShell>
  </div>
</template>

<script setup lang="ts">
  import type { WordQuizQuestion, PhraseQuizQuestion } from "~/types";

  useHead({
    title: "Learning Session",
  });

  const { pool, refillIfNeeded, replaceMasteredItem } = useLearningPool();
  const { increment, getEntry } = useProgress();
  const { getNextQuestion: getNextWordQuestion } = useWordQuiz();
  const { getNextQuestion: getNextPhraseQuestion } = usePhraseQuiz();

  const loading = ref(false);
  const sessionCount = ref(0);
  const sessionTarget = ref(0);
  const currentQuestion = ref<{
    type: "word" | "phrase";
    question: WordQuizQuestion | PhraseQuizQuestion;
  } | null>(null);

  const loadNextQuestion = async () => {
    loading.value = true;

    try {
      // Ensure pool is filled
      refillIfNeeded();

      if (pool.value.length === 0) {
        currentQuestion.value = null;
        return;
      }

      // Get random item from pool
      const poolItems = pool.value;
      const randomIndex = Math.floor(Math.random() * poolItems.length);
      const item = poolItems[randomIndex];

      if (item.type === "word") {
        const wordIds = poolItems
          .filter((p) => p.type === "word")
          .map((p) => p.id);
        const question = getNextWordQuestion(wordIds, "learn");

        if (question) {
          currentQuestion.value = {
            type: "word",
            question,
          };
        } else {
          // Try again with different selection
          loadNextQuestion();
        }
      } else {
        const phraseIds = poolItems
          .filter((p) => p.type === "phrase")
          .map((p) => p.id);
        const question = getNextPhraseQuestion(phraseIds, "learn");

        if (question) {
          currentQuestion.value = {
            type: "phrase",
            question,
          };
        } else {
          // Try again with different selection
          loadNextQuestion();
        }
      }
    } finally {
      loading.value = false;
    }
  };

  const handleWordAnswer = (payload: { correct: boolean; wordId: string }) => {
    sessionCount.value++;

    if (payload.correct) {
      const entry = increment("word", payload.wordId);

      if (entry.mastered) {
        // Remove from pool and refill
        replaceMasteredItem({ type: "word", id: payload.wordId });
      }
    }
  };

  const handlePhraseAnswer = (payload: {
    correct: boolean;
    phraseId: string;
    heartsUsed: number;
  }) => {
    sessionCount.value++;

    if (payload.correct) {
      const entry = increment("phrase", payload.phraseId);

      if (entry.mastered) {
        // Remove from pool and refill
        replaceMasteredItem({ type: "phrase", id: payload.phraseId });
      }
    }
  };

  // Load first question on mount
  onMounted(() => {
    refillIfNeeded();
    sessionTarget.value = pool.value.length;
    loadNextQuestion();
  });
</script>
