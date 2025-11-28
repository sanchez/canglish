<template>
  <div class="flex space-x-1">
    <span
      v-for="i in maxHearts"
      :key="i"
      class="text-2xl"
      :class="i <= count ? 'text-red-500' : 'text-gray-300'"
    >
      ❤️
    </span>
  </div>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      count: number;
      maxHearts?: number;
    }>(),
    {
      maxHearts: 3,
    }
  );
</script>
