<template>
  <div class="space-y-6">
    <!-- Header with hearts -->
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium text-muted">Build the phrase</span>
      </div>
      <HeartsDisplay :count="hearts" />
    </div>

    <!-- English prompt -->
    <div class="text-center py-4">
      <div class="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-medium text-muted mb-3">
        English
      </div>
      <div class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ question.english }}
      </div>
    </div>

    <!-- Built phrase area -->
    <div
      class="min-h-[72px] bg-gray-50 dark:bg-gray-800/80 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 transition-colors duration-200"
    >
      <div
        v-if="selectedTokens.length === 0"
        class="h-full flex items-center justify-center text-sm text-muted"
      >
        Tap words below to build the phrase
      </div>
      <div
        v-else
        class="flex flex-wrap gap-2"
      >
        <TransitionGroup name="list">
          <button
            v-for="(token, index) in selectedTokens"
            :key="`selected-${index}`"
            @click="removeToken(index)"
            class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            {{ token }}
          </button>
        </TransitionGroup>
      </div>
    </div>

    <!-- Available choices -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
      <button
        v-for="(choice, index) in availableChoices"
        :key="`choice-${index}`"
        @click="addToken(choice)"
        :disabled="completed"
        :class="getChoiceClass(choice)"
        class="px-4 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 font-medium"
      >
        {{ choice }}
      </button>
    </div>

    <!-- Actions -->
    <div
      v-if="!completed"
      class="flex gap-3"
    >
      <button
        @click="reset"
        class="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 font-medium"
      >
        Reset
      </button>
    </div>

    <!-- Feedback -->
    <div
      v-if="feedback"
      class="text-center py-3"
    >
      <div
        class="inline-flex items-center gap-2 text-lg font-semibold mb-4"
        :class="feedback.correct ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'"
      >
        <svg v-if="feedback.correct" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ feedback.message }}
      </div>
      <button
        v-if="completed && !isAutoAdvancing"
        @click="handleNext"
        class="btn-primary px-6 py-3"
      >
        Continue
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { PhraseQuizQuestion } from "~/types";

  const props = defineProps<{
    question: PhraseQuizQuestion;
    mode: "learn" | "review";
  }>();

  const emit = defineEmits<{
    answered: [
      payload: { correct: boolean; phraseId: string; heartsUsed: number }
    ];
    next: [];
  }>();

  const hearts = ref(3);
  const selectedTokens = ref<string[]>([]);
  const availableChoices = ref<string[]>([]);
  const originalChoices = ref<string[]>([]);
  const completed = ref(false);
  const feedback = ref<{ correct: boolean; message: string } | null>(null);
  const isAutoAdvancing = ref(false);
  const wrongToken = ref<string | null>(null);

  const addToken = (token: string) => {
    if (completed.value) return;

    const index = availableChoices.value.indexOf(token);
    if (index !== -1) {
      selectedTokens.value.push(token);
      availableChoices.value.splice(index, 1);

      // Check immediately after adding token
      checkAnswer();
    }
  };

  const removeToken = (index: number) => {
    if (completed.value) return;

    const token = selectedTokens.value[index];
    selectedTokens.value.splice(index, 1);

    // Return token to original position in choices
    rebuildAvailableChoices();
  };

  const rebuildAvailableChoices = () => {
    // Rebuild choices in original order, excluding selected tokens
    availableChoices.value = originalChoices.value.filter(
      (choice) => !selectedTokens.value.includes(choice)
    );
  };

  const reset = () => {
    selectedTokens.value = [];
    rebuildAvailableChoices();
    feedback.value = null;
  };

  const checkAnswer = () => {
    if (selectedTokens.value.length === 0 || completed.value) return;

    // Check if current sequence matches the beginning of target
    const currentLength = selectedTokens.value.length;
    let isCorrectSoFar = true;

    for (let i = 0; i < currentLength; i++) {
      if (selectedTokens.value[i] !== props.question.targetTokens[i]) {
        isCorrectSoFar = false;
        break;
      }
    }

    if (!isCorrectSoFar) {
      // Wrong token - remove last token and lose a heart
      const wrong = selectedTokens.value.pop();
      wrongToken.value = wrong || null;
      hearts.value--;

      console.log(
        "[PhraseQuiz] Wrong token selected, hearts remaining:",
        hearts.value
      );

      // Rebuild choices in original order
      rebuildAvailableChoices();

      // Clear wrong token highlight after a brief moment
      setTimeout(() => {
        wrongToken.value = null;
      }, 500);

      if (hearts.value <= 0) {
        completed.value = true;
        feedback.value = {
          correct: false,
          message: `The correct answer was: ${props.question.targetTokens.join(" ")}`,
        };

        setTimeout(() => {
          emit("answered", {
            correct: false,
            phraseId: props.question.phraseId,
            heartsUsed: 3,
          });
        }, 300);
      }
      return;
    }

    if (currentLength === props.question.targetTokens.length) {
      completed.value = true;
      isAutoAdvancing.value = true;
      feedback.value = {
        correct: true,
        message: "Correct! Well done!",
      };

      setTimeout(() => {
        const heartsUsed = 3 - hearts.value;
        emit("answered", {
          correct: true,
          phraseId: props.question.phraseId,
          heartsUsed,
        });

        // Auto-advance on correct answer
        setTimeout(() => {
          emit("next");
          isAutoAdvancing.value = false;
        }, 800);
      }, 300);
    }
  };

  const handleNext = () => {
    if (isAutoAdvancing.value) return;
    emit("next");
  };

  const getChoiceClass = (choice: string) => {
    if (wrongToken.value === choice) {
      return "bg-red-500 text-white scale-95";
    }
    return "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:scale-[1.02]";
  };

  const arraysEqual = (a: string[], b: string[]): boolean => {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
  };

  // Initialize on mount and when question changes
  const initialize = () => {
    hearts.value = 3;
    selectedTokens.value = [];
    originalChoices.value = [...props.question.choices];
    availableChoices.value = [...props.question.choices];
    completed.value = false;
    feedback.value = null;
    wrongToken.value = null;
  };

  watch(() => props.question, initialize, { immediate: true });
</script>
