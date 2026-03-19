<template>
  <div class="space-y-6">
    <!-- Prompt -->
    <div class="text-center">
      <div class="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-medium text-muted mb-4">
        {{ question.promptType === "cantonese" ? "Cantonese" : "English" }}
      </div>
      <div class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {{ question.prompt }}
      </div>
      <div
        v-if="question.notes"
        class="text-sm text-muted italic"
      >
        {{ question.notes }}
      </div>
    </div>

    <!-- Options -->
    <div class="grid grid-cols-1 gap-3">
      <button
        v-for="(option, index) in question.options"
        :key="option.id"
        @click="handleAnswer(option.id)"
        :disabled="answered"
        :class="getOptionClass(option.id)"
        class="group relative px-5 py-4 text-base font-medium rounded-xl transition-all duration-200 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
      >
        <span class="flex items-center justify-between gap-3">
          <span class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-white/20 dark:bg-gray-800/50 flex items-center justify-center text-sm font-semibold">
              {{ String.fromCharCode(65 + index) }}
            </span>
            <span>{{ option.text }}</span>
          </span>
          <svg v-if="answered && option.id === question.correctOptionId" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else-if="answered && option.id === selectedId && option.id !== question.correctOptionId" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </span>
      </button>
    </div>

    <!-- Next Button -->
    <div
      v-if="answered && !isAutoAdvancing"
      class="text-center pt-2"
    >
      <button
        @click="handleNext"
        class="btn-primary px-6 py-3"
      >
        Continue
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { WordQuizQuestion } from "~/types";

  const props = defineProps<{
    question: WordQuizQuestion;
    mode: "learn" | "review";
  }>();

  const emit = defineEmits<{
    answered: [payload: { correct: boolean; wordId: string }];
    next: [];
  }>();

  const answered = ref(false);
  const selectedId = ref<string | null>(null);
  const isAutoAdvancing = ref(false);

  const handleAnswer = (optionId: string) => {
    if (answered.value) return;

    selectedId.value = optionId;
    answered.value = true;

    const correct = optionId === props.question.correctOptionId;

    if (correct) {
      isAutoAdvancing.value = true;
    }

    setTimeout(() => {
      emit("answered", { correct, wordId: props.question.wordId });

      if (correct) {
        setTimeout(() => {
          emit("next");
          answered.value = false;
          selectedId.value = null;
          isAutoAdvancing.value = false;
        }, 800);
      }
    }, 300);
  };

  const handleNext = () => {
    if (isAutoAdvancing.value) return;
    emit("next");
    answered.value = false;
    selectedId.value = null;
  };

  const getOptionClass = (optionId: string) => {
    if (!answered.value) {
      return "bg-gray-100 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-900 dark:text-white hover:scale-[1.01] hover:shadow-md";
    }

    if (optionId === props.question.correctOptionId) {
      return "bg-emerald-500 text-white shadow-md";
    }

    if (optionId === selectedId.value) {
      return "bg-red-500 text-white shadow-md";
    }

    return "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 opacity-50";
  };

  watch(
    () => props.question,
    () => {
      answered.value = false;
      selectedId.value = null;
    }
  );
</script>
