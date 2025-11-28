<template>
  <div class="text-center space-y-8">
    <div class="space-y-4">
      <h1 class="text-5xl font-bold text-gray-900">Canglish</h1>
      <p class="text-xl text-gray-600">
        Learn Cantonese using English phonetics
      </p>
    </div>

    <!-- Progress Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-3xl font-bold text-blue-600">{{ totalWords }}</div>
        <div class="text-sm text-gray-600">Total Words</div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-3xl font-bold text-purple-600">{{ totalPhrases }}</div>
        <div class="text-sm text-gray-600">Total Phrases</div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-3xl font-bold text-green-600">{{ masteredCount }}</div>
        <div class="text-sm text-gray-600">Mastered</div>
      </div>
    </div>

    <!-- Main Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
      <NuxtLink
        to="/search"
        class="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-8 transition-colors shadow-lg"
      >
        <div class="text-4xl mb-3">🔍</div>
        <div class="text-xl font-semibold mb-2">Search</div>
        <div class="text-sm opacity-90">Find words and phrases</div>
      </NuxtLink>

      <NuxtLink
        to="/learn"
        class="bg-green-500 hover:bg-green-600 text-white rounded-lg p-8 transition-colors shadow-lg"
      >
        <div class="text-4xl mb-3">📚</div>
        <div class="text-xl font-semibold mb-2">Learn</div>
        <div class="text-sm opacity-90">Practice new content</div>
      </NuxtLink>

      <NuxtLink
        to="/review"
        class="bg-purple-500 hover:bg-purple-600 text-white rounded-lg p-8 transition-colors shadow-lg"
        :class="{ 'opacity-50 cursor-not-allowed': !hasReviewItems }"
      >
        <div class="text-4xl mb-3">🔄</div>
        <div class="text-xl font-semibold mb-2">Review</div>
        <div class="text-sm opacity-90">
          {{
            hasReviewItems ? "Review mastered items" : "No items to review yet"
          }}
        </div>
      </NuxtLink>
    </div>

    <!-- Quick Info -->
    <div class="max-w-2xl mx-auto mt-12 text-left bg-gray-50 rounded-lg p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-3">How it works</h2>
      <ul class="space-y-2 text-gray-700">
        <li>
          🔍 <strong>Search:</strong> Find any word or phrase in Cantonese or
          English
        </li>
        <li>
          📚 <strong>Learn:</strong> Master up to 20 words/phrases at a time by
          answering questions
        </li>
        <li>
          🎯 <strong>Unlock Phrases:</strong> Phrases become available after you
          master all their words
        </li>
        <li>
          🔄 <strong>Review:</strong> Keep your skills sharp by reviewing
          mastered content
        </li>
        <li>
          ❤️ <strong>Hearts:</strong> Get 3 chances to build phrases correctly
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  const { words } = useWords();
  const { phrases } = usePhrases();
  const { getMasteredCount } = useProgress();
  const { hasItems } = useReviewPool();

  useHead({
    title: "Home",
  });

  const totalWords = computed(() => words.value.length);
  const totalPhrases = computed(() => phrases.value.length);
  const masteredCount = computed(() => getMasteredCount());
  const hasReviewItems = computed(() => hasItems.value);
</script>
