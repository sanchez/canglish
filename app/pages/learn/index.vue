<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <div class="text-center space-y-4">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white">Learning Mode</h1>
      <p class="text-lg text-gray-600 dark:text-gray-300">
        Practice up to 20 words and phrases at a time. Score 6/6 to master each
        item!
      </p>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
      <div class="grid grid-cols-2 gap-6 mb-8">
        <div class="text-center">
          <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ poolSize }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Items in Learning Pool</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-green-600 dark:text-green-400">
            {{ sessionCount }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Answered This Session</div>
        </div>
      </div>

      <div class="text-center">
        <NuxtLink
          to="/learn/play"
          class="inline-block px-8 py-4 bg-green-600 text-white text-xl font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-lg"
        >
          Start Learning Session
        </NuxtLink>
      </div>
    </div>

    <div class="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Learning Tips</h2>
      <ul class="space-y-2 text-gray-700 dark:text-gray-300">
        <li>
          • <strong>Words:</strong> Answer multiple choice questions correctly
          to earn points
        </li>
        <li>
          • <strong>Phrases:</strong> Build phrases by selecting words in the
          correct order
        </li>
        <li>
          • <strong>Hearts:</strong> You get 3 hearts for phrase questions.
          Don't run out!
        </li>
        <li>
          • <strong>Progress:</strong> Each correct answer earns 1 point. Get
          6/6 to master!
        </li>
        <li>
          • <strong>Priority:</strong> The app prioritizes phrases where you've
          mastered all the words
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
