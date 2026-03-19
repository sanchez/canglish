<template>
  <div class="max-w-2xl mx-auto animate-fade-in">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-elevated overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <div
              class="w-2.5 h-2.5 rounded-full"
              :class="mode === 'learn' ? 'bg-emerald-500' : 'bg-violet-500'"
            />
            <span class="text-sm font-medium text-muted">
              {{ mode === "learn" ? "Learning" : "Review" }}
            </span>
          </div>
          <slot name="top-right" />
        </div>
        <div class="mt-3">
          <slot name="header" />
        </div>
      </div>
      <div class="p-6">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    mode: "learn" | "review";
  }>();
</script>
