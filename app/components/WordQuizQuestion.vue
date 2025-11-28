<template>
  <div class="space-y-6">
    <div class="text-center">
      <div class="text-sm text-gray-500 mb-2">
        {{ question.promptType === "cantonese" ? "Cantonese" : "English" }}
      </div>
      <div class="text-3xl font-bold text-gray-900 mb-8">
        {{ question.prompt }}
      </div>
    </div>

    <div class="grid grid-cols-1 gap-3">
      <button
        v-for="option in question.options"
        :key="option.id"
        @click="handleAnswer(option.id)"
        :disabled="answered"
        :class="getOptionClass(option.id)"
        class="px-6 py-4 text-lg font-medium rounded-lg transition-all disabled:cursor-not-allowed"
      >
        {{ option.text }}
      </button>
    </div>

    <div
      v-if="answered"
      class="text-center mt-6"
    >
      <button
        @click="handleNext"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Next Question
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

  const handleAnswer = (optionId: string) => {
    if (answered.value) return;

    selectedId.value = optionId;
    answered.value = true;

    const correct = optionId === props.question.correctOptionId;

    setTimeout(() => {
      emit("answered", { correct, wordId: props.question.wordId });
    }, 300);
  };

  const handleNext = () => {
    emit("next");
    // Reset for next question
    answered.value = false;
    selectedId.value = null;
  };

  const getOptionClass = (optionId: string) => {
    if (!answered.value) {
      return "bg-gray-100 hover:bg-gray-200 text-gray-900";
    }

    if (optionId === props.question.correctOptionId) {
      return "bg-green-500 text-white";
    }

    if (optionId === selectedId.value) {
      return "bg-red-500 text-white";
    }

    return "bg-gray-100 text-gray-400";
  };

  // Reset when question changes
  watch(
    () => props.question,
    () => {
      answered.value = false;
      selectedId.value = null;
    }
  );
</script>
