<template>
  <div
    class="inline-flex items-center px-2 py-1 rounded text-sm font-medium"
    :class="badgeClass"
  >
    {{ displayText }}
  </div>
</template>

<script setup lang="ts">
  import type { ProgressEntry } from "~/types";

  const props = defineProps<{
    entry: ProgressEntry | null;
  }>();

  const badgeClass = computed(() => {
    if (!props.entry || !props.entry.unlocked) {
      return "bg-gray-200 text-gray-700";
    }

    if (props.entry.mastered) {
      return "bg-green-100 text-green-800";
    }

    return "bg-blue-100 text-blue-800";
  });

  const displayText = computed(() => {
    if (!props.entry || !props.entry.unlocked) {
      return "Locked";
    }

    if (props.entry.mastered) {
      return "Mastered";
    }

    return `Learning ${props.entry.score}/6`;
  });
</script>
