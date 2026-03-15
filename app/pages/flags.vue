<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">Flagged Items</h2>
      <button
        v-if="flagCount > 0"
        type="button"
        class="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
        @click="handleClearAll"
      >
        Clear All Flags
      </button>
    </div>

    <div
      v-if="flagCount === 0"
      class="bg-yellow-50 rounded-lg p-8 text-center"
    >
      <div class="text-4xl mb-3">🚩</div>
      <div class="text-xl font-semibold text-gray-900 mb-2">
        No flagged items
      </div>
      <div class="text-gray-600 mb-4">
        Flag words or phrases that need updates from the search page
      </div>
      <NuxtLink
        to="/search"
        class="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Go to Search
      </NuxtLink>
    </div>

    <div
      v-if="flaggedWords.length > 0"
      class="space-y-4"
    >
      <h3 class="text-xl font-semibold text-gray-800">
        Words ({{ flaggedWords.length }})
      </h3>
      <div class="grid gap-4 md:grid-cols-2">
        <div
          v-for="flag in flaggedWords"
          :key="flag.id"
          class="bg-white rounded-lg shadow p-4"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="text-lg font-bold text-gray-900">
                {{ getWordData(flag.id)?.cantonese || flag.id }}
              </div>
              <div class="text-gray-600">
                {{ getWordData(flag.id)?.english || "Unknown" }}
              </div>
              <div
                v-if="getWordData(flag.id)?.jyutping"
                class="text-sm text-gray-500 mt-1"
              >
                Jyutping: {{ getWordData(flag.id)?.jyutping }}
              </div>
              <div class="text-xs text-gray-400 mt-2">
                Flagged: {{ formatDate(flag.flaggedAt) }}
              </div>
            </div>
            <button
              type="button"
              class="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Remove flag"
              @click="unflagItem('word', flag.id)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="flaggedPhrases.length > 0"
      class="space-y-4"
    >
      <h3 class="text-xl font-semibold text-gray-800">
        Phrases ({{ flaggedPhrases.length }})
      </h3>
      <div class="grid gap-4 md:grid-cols-2">
        <div
          v-for="flag in flaggedPhrases"
          :key="flag.id"
          class="bg-white rounded-lg shadow p-4"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="text-lg font-bold text-gray-900">
                {{ getPhraseData(flag.id)?.cantonese || flag.id }}
              </div>
              <div class="text-gray-600">
                {{ getPhraseData(flag.id)?.english || "Unknown" }}
              </div>
              <div
                v-if="getPhraseData(flag.id)?.jyutping"
                class="text-sm text-gray-500 mt-1"
              >
                Jyutping: {{ getPhraseData(flag.id)?.jyutping }}
              </div>
              <div class="text-xs text-gray-400 mt-2">
                Flagged: {{ formatDate(flag.flaggedAt) }}
              </div>
            </div>
            <button
              type="button"
              class="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Remove flag"
              @click="unflagItem('phrase', flag.id)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const { words, getWordById } = useWords();
  const { phrases, getPhraseById } = usePhrases();
  const {
    getFlaggedWords,
    getFlaggedPhrases,
    getFlagCount,
    unflagItem,
    clearAllFlags,
  } = useFlags();

  useHead({
    title: "Flagged Items",
  });

  const flaggedWords = computed(() => getFlaggedWords());
  const flaggedPhrases = computed(() => getFlaggedPhrases());
  const flagCount = computed(() => getFlagCount());

  const getWordData = (id: string) => {
    return getWordById(id);
  };

  const getPhraseData = (id: string) => {
    return getPhraseById(id);
  };

  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all flagged items?")) {
      clearAllFlags();
    }
  };
</script>
