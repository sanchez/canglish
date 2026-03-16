<template>
  <div>
    <div class="max-w-4xl mx-auto space-y-8 mb-8">
      <div class="text-center space-y-4">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white">Review Mode</h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Practice your mastered words and phrases to keep them fresh!
        </p>
      </div>

      <div
        v-if="!hasItems"
        class="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-8 text-center"
      >
        <div class="text-4xl mb-3">📚</div>
        <div class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No items to review yet
        </div>
        <div class="text-gray-600 dark:text-gray-300 mb-4">
          Master some words and phrases first!
        </div>
        <NuxtLink
          to="/learn"
          class="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Go to Learning
        </NuxtLink>
      </div>
    </div>

    <QuizShell
      v-if="hasItems && showQuiz"
      :mode="'review'"
    >
      <template #top-right>
        <button
          @click="exitReview"
          class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 whitespace-nowrap"
        >
          Exit Review
        </button>
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
        <div class="text-gray-500 dark:text-gray-400">Loading next question...</div>
      </div>

      <div v-else-if="currentQuestion?.type === 'word'">
        <WordQuizQuestion
          :question="currentQuestion.question"
          :mode="'review'"
          @answered="handleWordAnswer"
          @next="loadNextQuestion"
        />
      </div>

      <div v-else-if="currentQuestion?.type === 'phrase'">
        <PhraseQuizQuestion
          :question="currentQuestion.question"
          :mode="'review'"
          @answered="handlePhraseAnswer"
          @next="loadNextQuestion"
        />
      </div>
    </QuizShell>

    <div
      v-if="hasItems && !showQuiz"
      class="max-w-4xl mx-auto"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
        <div class="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
          {{ masteredItemsCount }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400 mb-6">Mastered Items Available</div>
        <button
          @click="startReview"
          class="px-8 py-4 bg-purple-600 text-white text-xl font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
        >
          Start Review Session
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { WordQuizQuestion, PhraseQuizQuestion } from "~/types";

  useHead({
    title: "Review",
  });

  const { getMasteredItems, getRandomItem, hasItems } = useReviewPool();
  const { demote } = useProgress();
  const { getNextQuestion: getNextWordQuestion } = useWordQuiz();
  const { getNextQuestion: getNextPhraseQuestion } = usePhraseQuiz();

  const loading = ref(false);
  const sessionCount = ref(0);
  const sessionTarget = ref(0);
  const showQuiz = ref(false);
  const currentQuestion = ref<{
    type: "word" | "phrase";
    question: WordQuizQuestion | PhraseQuizQuestion;
  } | null>(null);

  const masteredItemsCount = computed(() => getMasteredItems().length);

  const startReview = () => {
    sessionTarget.value = getMasteredItems().length;
    showQuiz.value = true;
    loadNextQuestion();
  };

  const exitReview = () => {
    showQuiz.value = false;
    sessionCount.value = 0;
    currentQuestion.value = null;
  };

  const loadNextQuestion = async () => {
    loading.value = true;

    try {
      const item = getRandomItem();

      if (!item) {
        currentQuestion.value = null;
        return;
      }

      if (item.type === "word") {
        const question = getNextWordQuestion([item.id], "review");

        if (question) {
          currentQuestion.value = {
            type: "word",
            question,
          };
        }
      } else {
        const question = getNextPhraseQuestion([item.id], "review");

        if (question) {
          currentQuestion.value = {
            type: "phrase",
            question,
          };
        }
      }
    } finally {
      loading.value = false;
    }
  };

  const handleWordAnswer = (payload: { correct: boolean; wordId: string }) => {
    sessionCount.value++;

    if (!payload.correct) {
      // Demote the word (set score to 3)
      demote("word", payload.wordId);
    }
  };

  const handlePhraseAnswer = (payload: {
    correct: boolean;
    phraseId: string;
  }) => {
    sessionCount.value++;

    if (!payload.correct) {
      // Demote the phrase (set score to 3)
      demote("phrase", payload.phraseId);
    }
  };
</script>
