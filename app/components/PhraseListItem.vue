<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow">
    <div class="flex justify-between items-start mb-2">
      <div class="flex-1">
        <div class="text-xl font-bold text-gray-900 dark:text-white">
          {{ phrase.cantonese }}
        </div>
        <div class="text-lg text-gray-600 dark:text-gray-300">{{ phrase.english }}</div>
      </div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          :aria-label="isFlaggedItem ? 'Unflag item' : 'Flag for update'"
          class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          @click="toggleFlag"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            :class="isFlaggedItem ? 'text-red-500 fill-current' : 'text-gray-400 dark:text-gray-500'"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <ProgressBadge :entry="progress" />
      </div>
    </div>
    <div
      v-if="phrase.notes"
      class="text-sm text-gray-500 dark:text-gray-400 mt-2"
    >
      {{ phrase.notes }}
    </div>
    <div class="flex items-center gap-2 mt-2">
      <div class="text-xs text-gray-400 dark:text-gray-500">Category: {{ phrase.category }}</div>
      <div class="text-xs text-gray-400 dark:text-gray-500">
        • {{ phrase.tokens.length }} tokens
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Phrase, ProgressEntry } from "~/types";
  import { getPhraseId } from "~/types";

  const props = defineProps<{
    phrase: Phrase;
    progress: ProgressEntry | null;
  }>();

  const { isFlagged: checkIsFlagged, flagItem, unflagItem } = useFlags();

  const phraseId = computed(() => getPhraseId(props.phrase));
  const isFlaggedItem = computed(() => checkIsFlagged("phrase", phraseId.value));

  const toggleFlag = () => {
    if (isFlaggedItem.value) {
      unflagItem("phrase", phraseId.value);
    } else {
      flagItem("phrase", phraseId.value);
    }
  };
</script>
