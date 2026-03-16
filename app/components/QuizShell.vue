<template>
  <div class="max-w-3xl mx-auto">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <div class="mb-6">
        <div class="flex justify-between items-center mb-3">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ mode === "learn" ? "Learning Mode" : "Review Mode" }}
          </div>
          <slot name="top-right" />
        </div>
        <slot name="header" />
      </div>

      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    mode: "learn" | "review";
  }>();
</script>
