<template>
  <div class="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
    <div class="flex justify-between items-start mb-2">
      <div class="flex-1">
        <div class="text-xl font-bold text-gray-900">
          {{ phrase.cantonese }}
        </div>
        <div class="text-lg text-gray-600">{{ phrase.english }}</div>
      </div>
      <ProgressBadge :entry="progress" />
    </div>
    <div
      v-if="phrase.notes"
      class="text-sm text-gray-500 mt-2"
    >
      {{ phrase.notes }}
    </div>
    <div class="flex items-center gap-2 mt-2">
      <div class="text-xs text-gray-400">Category: {{ phrase.category }}</div>
      <div class="text-xs text-gray-400">
        • {{ phrase.tokens.length }} tokens
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Phrase, ProgressEntry } from "~/types";

  defineProps<{
    phrase: Phrase;
    progress: ProgressEntry | null;
  }>();
</script>
