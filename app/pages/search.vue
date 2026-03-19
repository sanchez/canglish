<template>
  <div class="max-w-3xl mx-auto space-y-8">
    <!-- Header -->
    <div class="text-center space-y-2">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Search</h1>
      <p class="text-muted">Find words and phrases in Cantonese or English</p>
    </div>

    <!-- Search Input -->
    <SearchBar
      v-model="searchQuery"
      placeholder="Type to search..."
    />

    <!-- Results -->
    <div v-if="searchQuery" class="space-y-8">
      <!-- Words Results -->
      <div v-if="filteredWords.length > 0">
        <div class="flex items-center gap-2 mb-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Words</h2>
          <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-muted">{{ filteredWords.length }}</span>
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
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
        <div class="flex items-center gap-2 mb-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Phrases</h2>
          <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-muted">{{ filteredPhrases.length }}</span>
        </div>
        <div class="grid gap-3">
          <PhraseListItem
            v-for="phrase in filteredPhrases"
            :key="getPhraseId(phrase)"
            :phrase="phrase"
            :progress="getEntry('phrase', getPhraseId(phrase))"
          />
        </div>
      </div>

      <!-- No Results -->
      <EmptyState
        v-if="filteredWords.length === 0 && filteredPhrases.length === 0"
        title="No results found"
        :description="`We couldn't find anything matching &quot;${searchQuery}&quot;.`"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </template>
      </EmptyState>
    </div>

    <!-- Initial Empty State -->
    <EmptyState
      v-if="!searchQuery"
      title="Start searching"
      description="Type in English or Cantonese phonetics to find words and phrases."
    >
      <template #icon>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </template>
    </EmptyState>
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
