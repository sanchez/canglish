<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-1">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ label }}</span>
      <span class="text-sm text-gray-500 dark:text-gray-400">{{ current }} / {{ total }}</span>
    </div>
    <div class="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
      <div
        class="h-full bg-blue-600 dark:bg-blue-400 rounded-full transition-all duration-300 ease-out"
        :style="{ width: `${percentage}%` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    current: number;
    total: number;
    label?: string;
  }>();

  const percentage = computed(() => {
    if (props.total === 0) return 0;
    return Math.min((props.current / props.total) * 100, 100);
  });
</script>
