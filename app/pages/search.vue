<template>
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-gray-900">Search Cantonese & English</h2>

    <SearchBar
      v-model="searchQuery"
      placeholder="Search by English or Cantonese..."
    />

    <div
      v-if="searchQuery"
      class="space-y-6"
    >
      <!-- Words Results -->
      <div v-if="filteredWords.length > 0">
        <h3 class="text-xl font-semibold text-gray-800 mb-3">
          Words ({{ filteredWords.length }})
        </h3>
        <div class="grid gap-4 md:grid-cols-2">
          <WordListItem
            v-for="word in filteredWords"
            :key="getWordId(word)"
            :word="word"
            :progress="getEntry('word', getWordId(word))"
          />
        </div>
      </div>

      <!-- Phrases Results -->
      <div v-if="filteredPhrases.length > 0">
        <h3 class="text-xl font-semibold text-gray-800 mb-3">
          Phrases ({{ filteredPhrases.length }})
        </h3>
        <div class="grid gap-4">
          <PhraseListItem
            v-for="phrase in filteredPhrases"
            :key="getPhraseId(phrase)"
            :phrase="phrase"
            :progress="getEntry('phrase', getPhraseId(phrase))"
          />
        </div>
      </div>

      <!-- No Results -->
      <div
        v-if="filteredWords.length === 0 && filteredPhrases.length === 0"
        class="text-center py-12"
      >
        <p class="text-gray-500 text-lg">
          No results found for "{{ searchQuery }}"
        </p>
        <p class="text-gray-400 text-sm mt-2">Try a different search term</p>
      </div>
    </div>

    <div
      v-else
      class="text-center py-12"
    >
      <p class="text-gray-500 text-lg">
        Start typing to search words and phrases
      </p>
      <p class="text-gray-400 text-sm mt-2">
        Search works with both English and Cantonese phonetics
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { getWordId, getPhraseId } from "~/types";

  const { words } = useWords();
  const { phrases } = usePhrases();
  const { filterWords, filterPhrases } = useSearch();
  const { getEntry } = useProgress();

  useHead({
    title: "Search",
  });

  const searchQuery = ref("");

  const filteredWords = computed(() => {
    return filterWords(words.value, searchQuery.value);
  });

  const filteredPhrases = computed(() => {
    return filterPhrases(phrases.value, searchQuery.value);
  });
</script>
