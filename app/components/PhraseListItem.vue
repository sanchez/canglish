<template>
  <div class="card-interactive group">
    <div class="flex justify-between items-start gap-4">
      <div class="flex-1 min-w-0">
        <div class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {{ phrase.cantonese }}
        </div>
        <div class="text-base text-muted truncate">{{ phrase.english }}</div>
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
            class="h-5 w-5"
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
      v-if="phrase.notes"
      class="text-sm text-muted mt-2 line-clamp-2"
    >
      {{ phrase.notes }}
    </div>
    <div class="flex items-center gap-3 mt-2 text-xs text-gray-400 dark:text-gray-500">
      <span>{{ phrase.category }}</span>
      <span class="opacity-50">•</span>
      <span>{{ phrase.tokens.length }} words</span>
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
