<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center mb-4">
      <div class="text-sm text-gray-500">Build the phrase</div>
      <HeartsDisplay :count="hearts" />
    </div>

    <div class="text-center mb-8">
      <div class="text-sm text-gray-500 mb-2">English</div>
      <div class="text-2xl font-bold text-gray-900">
        {{ question.english }}
      </div>
    </div>

    <!-- Built phrase area -->
    <div
      class="min-h-[80px] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4"
    >
      <div
        v-if="selectedTokens.length === 0"
        class="text-center text-gray-400"
      >
        Tap tokens below to build the phrase
      </div>
      <div
        v-else
        class="flex flex-wrap gap-2"
      >
        <button
          v-for="(token, index) in selectedTokens"
          :key="`selected-${index}`"
          @click="removeToken(index)"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {{ token }}
        </button>
      </div>
    </div>

    <!-- Available choices -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <button
        v-for="(choice, index) in availableChoices"
        :key="`choice-${index}`"
        @click="addToken(choice)"
        :disabled="completed"
        :class="[
          wrongToken === choice
            ? 'bg-red-500 text-white'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-900',
          'px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        ]"
      >
        {{ choice }}
      </button>
    </div>

    <!-- Actions -->
    <div
      v-if="!completed"
      class="flex gap-3 mt-6"
    >
      <button
        @click="reset"
        class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
      >
        Reset
      </button>
    </div>

    <!-- Feedback -->
    <div
      v-if="feedback"
      class="text-center"
    >
      <div
        :class="feedback.correct ? 'text-green-600' : 'text-red-600'"
        class="text-lg font-semibold mb-3"
      >
        {{ feedback.message }}
      </div>
      <button
        v-if="completed && !isAutoAdvancing"
        @click="handleNext"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Next Question
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
        // Out of hearts
        completed.value = true;
        feedback.value = {
          correct: false,
          message: `❌ Out of hearts! The correct answer was: ${props.question.targetTokens.join(
            " "
          )}`,
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

    // Check if phrase is complete
    if (currentLength === props.question.targetTokens.length) {
      // Phrase is complete and correct!
      completed.value = true;
      isAutoAdvancing.value = true;
      feedback.value = {
        correct: true,
        message: "🎉 Correct! Well done!",
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

};ript>
