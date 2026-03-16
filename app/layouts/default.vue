<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <header class="bg-white dark:bg-gray-800 shadow">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <NuxtLink
              to="/"
              class="flex items-center px-2 text-xl font-bold text-gray-900 dark:text-white"
            >
              Canglish
            </NuxtLink>
          </div>
          <div class="flex items-center space-x-4">
            <NuxtLink
              to="/search"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Search
            </NuxtLink>
            <NuxtLink
              to="/learn"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Learn
            </NuxtLink>
            <NuxtLink
              to="/review"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Review
            </NuxtLink>
            <NuxtLink
              to="/flags"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Flagged
              <span
                v-if="flagCount > 0"
                class="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300"
              >
                {{ flagCount }}
              </span>
            </NuxtLink>
            <NuxtLink
              to="/profile"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Profile
            </NuxtLink>
            <button
              @click="toggleTheme"
              class="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            >
              <span v-if="isDark">☀️</span>
              <span v-else>🌙</span>
            </button>
            <div class="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
              <span class="mr-2">🎯</span>
              <span>{{ masteredCount }} mastered</span>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
  const { getMasteredCount } = useProgress();
  const { getFlagCount } = useFlags();
  const { isDark, toggleTheme } = useTheme();
  const masteredCount = computed(() => getMasteredCount());
  const flagCount = computed(() => getFlagCount());
</script>
