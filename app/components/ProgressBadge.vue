<template>
  <div
    class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold"
    :class="badgeClass"
  >
    <svg v-if="isMastered" xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
    </svg>
    {{ displayText }}
  </div>
</template>

<script setup lang="ts">
  import type { ProgressEntry } from "~/types";

  const props = defineProps<{
    entry: ProgressEntry | null;
  }>();

  const isMastered = computed(() => props.entry?.mastered);

  const badgeClass = computed(() => {
    if (!props.entry || !props.entry.unlocked) {
      return "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400";
    }

    if (props.entry.mastered) {
      return "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300";
    }

    return "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300";
  });

  const displayText = computed(() => {
    if (!props.entry || !props.entry.unlocked) {
      return "Locked";
    }

    if (props.entry.mastered) {
      return "Mastered";
    }

    return `${props.entry.score}/6`;
  });
</script>
