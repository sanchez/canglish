<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <NuxtLink
              to="/"
              class="flex items-center px-2 text-xl font-bold text-gray-900"
            >
              Canglish
            </NuxtLink>
          </div>
          <div class="flex items-center space-x-4">
            <NuxtLink
              to="/search"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              Search
            </NuxtLink>
            <NuxtLink
              to="/learn"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              Learn
            </NuxtLink>
            <NuxtLink
              to="/review"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              Review
            </NuxtLink>
            <div class="flex items-center px-3 py-2 text-sm text-gray-600">
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
  const masteredCount = computed(() => getMasteredCount());
</script>
