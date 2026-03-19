<template>
  <div class="card-interactive group">
    <div class="flex justify-between items-start gap-4">
      <div class="flex-1 min-w-0">
        <div class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{{ word.cantonese }}</div>
        <div class="text-base text-muted truncate">{{ word.english }}</div>
      </div>
      <div class="flex items-center gap-2 flex-shrink-0">
        <ProgressBadge :entry="progress" />
        <button
          type="button"
          :aria-label="isFlaggedItem ? 'Unflag item' : 'Flag for review'"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          :class="isFlaggedItem ? 'text-rose-500' : 'text-gray-400 dark:text-gray-500 hover:text-rose-500'"
          @click="toggleFlag"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            viewBox="0 0 20 20"
            :fill="isFlaggedItem ? 'currentColor' : 'none'"
          >
            <path
              fill-rule="evenodd"
              d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
    <div
      v-if="word.notes"
      class="text-sm text-muted mt-2 line-clamp-2"
    >
      {{ word.notes }}
    </div>
    <div class="text-xs text-gray-400 dark:text-gray-500 mt-2">{{ word.category }}</div>
  </div>
</template>

<script setup lang="ts">
  import type { Word, ProgressEntry } from "~/types";
  import { getWordId } from "~/types";

  const props = defineProps<{
    word: Word;
    progress: ProgressEntry | null;
  }>();

  const { isFlagged: checkIsFlagged, flagItem, unflagItem } = useFlags();

  const wordId = computed(() => getWordId(props.word));
  const isFlaggedItem = computed(() => checkIsFlagged("word", wordId.value));

  const toggleFlag = () => {
    if (isFlaggedItem.value) {
      unflagItem("word", wordId.value);
    } else {
      flagItem("word", wordId.value);
    }
  };
</script>
