<template>
  <div>
    <QuizShell :mode="'learn'">
      <template #header>
        <div class="flex items-center gap-4">
          <div class="text-sm text-gray-600">
            Session: {{ sessionCount }} answered
          </div>
          <NuxtLink
            to="/learn"
            class="text-sm text-blue-600 hover:text-blue-800"
          >
            Exit
          </NuxtLink>
        </div>
      </template>

      <div
        v-if="loading"
        class="text-center py-12"
      >
        <div class="text-gray-500">Loading next question...</div>
      </div>

      <div
        v-else-if="!currentQuestion"
        class="text-center py-12 space-y-4"
      >
        <div class="text-2xl">🎉</div>
        <div class="text-xl font-semibold text-gray-900">
          No more items to learn right now!
        </div>
        <div class="text-gray-600">
          You've mastered everything in your learning pool.
        </div>
        <NuxtLink
          to="/learn"
          class="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
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
    loadNextQuestion();
  });
</script>
