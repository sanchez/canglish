<template>
  <div class="max-w-2xl mx-auto space-y-8">
    <!-- Header -->
    <div class="text-center space-y-3">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Learning Mode</h1>
      <p class="text-muted max-w-md mx-auto">
        Practice words and phrases. Score 6 correct answers to master each item.
      </p>
    </div>

    <!-- Stats Card -->
    <div class="card">
      <div class="grid grid-cols-2 gap-6">
        <div class="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
          <div class="text-3xl font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">{{ poolSize }}</div>
          <div class="text-sm text-muted mt-1">In Learning Pool</div>
        </div>
        <div class="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
          <div class="text-3xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{{ sessionCount }}</div>
          <div class="text-sm text-muted mt-1">Answered Today</div>
        </div>
      </div>
    </div>

    <!-- Start Button -->
    <div class="text-center">
      <NuxtLink
        to="/learn/play"
        class="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Start Learning
      </NuxtLink>
    </div>

    <!-- Tips Card -->
    <div class="card border border-blue-200 dark:border-blue-900/50">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Tips</h2>
      </div>
      <ul class="space-y-3 text-muted">
        <li class="flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span><strong class="text-gray-900 dark:text-white">Words</strong> — Multiple choice questions</span>
        </li>
        <li class="flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span><strong class="text-gray-900 dark:text-white">Phrases</strong> — Select words in correct order</span>
        </li>
        <li class="flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span><strong class="text-gray-900 dark:text-white">Hearts</strong> — 3 chances per phrase question</span>
        </li>
        <li class="flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span><strong class="text-gray-900 dark:text-white">Mastery</strong> — 6 correct answers to master</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  const { pool, refillIfNeeded } = useLearningPool();

  useHead({
    title: "Learn",
  });

  const sessionCount = ref(0);

  const poolSize = computed(() => pool.value.length);

  // Ensure pool is filled on mount
  onMounted(() => {
    refillIfNeeded();
  });
</script>
