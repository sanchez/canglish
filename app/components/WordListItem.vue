<template>
  <div class="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
    <div class="flex justify-between items-start mb-2">
      <div class="flex-1">
        <div class="text-xl font-bold text-gray-900">{{ word.cantonese }}</div>
        <div class="text-lg text-gray-600">{{ word.english }}</div>
      </div>
      <ProgressBadge :entry="progress" />
    </div>
    <div
      v-if="word.notes"
      class="text-sm text-gray-500 mt-2"
    >
      {{ word.notes }}
    </div>
    <div class="text-xs text-gray-400 mt-1">Category: {{ word.category }}</div>
  </div>
</template>

<script setup lang="ts">
  import type { Word, ProgressEntry } from "~/types";

  defineProps<{
    word: Word;
    progress: ProgressEntry | null;
  }>();
</script>
