<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-2">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ label }}</span>
      <span class="text-sm text-muted font-medium tabular-nums">{{ current }} / {{ total }}</span>
    </div>
    <div class="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-500 ease-out"
        :class="percentage >= 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-violet-500'"
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
