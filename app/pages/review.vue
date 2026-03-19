<template>
  <div class="max-w-2xl mx-auto space-y-8">
    <!-- Header -->
    <div class="text-center space-y-3">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Review Mode</h1>
      <p class="text-muted max-w-md mx-auto">
        Keep your mastered words and phrases fresh with spaced practice.
      </p>
    </div>

    <!-- No Items State -->
    <div v-if="!hasItems" class="card text-center">
      <div class="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No items to review</h2>
      <p class="text-muted mb-6">Master some words and phrases first to start reviewing.</p>
      <NuxtLink to="/learn" class="btn-primary inline-flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        Go to Learning
      </NuxtLink>
    </div>

    <!-- Start Review Card -->
    <div v-if="hasItems && !showQuiz" class="card text-center">
      <div class="text-4xl font-bold text-violet-600 dark:text-violet-400 tabular-nums mb-2">
        {{ masteredItemsCount }}
      </div>
      <div class="text-sm text-muted mb-6">Mastered items ready for review</div>
      <button
        @click="startReview"
        class="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Start Review
      </button>
    </div>

    <!-- Quiz -->
    <QuizShell
      v-if="hasItems && showQuiz"
      :mode="'review'"
    >
      <template #top-right>
        <button
          @click="exitReview"
          class="text-sm font-medium text-muted hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Exit
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
        <LoadingSpinner size="lg" label="Loading next question..." />
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
