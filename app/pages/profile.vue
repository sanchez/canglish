<template>
  <div class="space-y-8">
    <!-- Link Email Modal -->
    <div
      v-if="showLinkModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="showLinkModal = false"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Link Email</h3>
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Link an email to save your progress permanently. You'll be able to sign in from any device.
        </p>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              v-model="linkEmailInput"
              type="email"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              v-model="linkPassword"
              type="password"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
              placeholder="••••••••"
            />
          </div>
          <p v-if="linkError" class="text-sm text-red-600 dark:text-red-400">{{ linkError }}</p>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            @click="showLinkModal = false"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
            :disabled="isLinking"
            @click="handleLinkEmail"
          >
            {{ isLinking ? "Linking..." : "Link Email" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Learning Score Hero -->
    <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
      <div class="text-center">
        <div class="text-6xl font-bold mb-2">🎯</div>
        <div class="text-5xl font-bold">{{ learningScore }}</div>
        <div class="text-xl opacity-90">items mastered</div>
      </div>
    </div>

    <!-- Progress Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
        <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ masteredWords.length }}</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">Mastered Words</div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
        <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ masteredPhrases.length }}</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">Mastered Phrases</div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
        <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ unlockedWords.length }}</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">Unlocked Words</div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
        <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ unlockedPhrases.length }}</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">Unlocked Phrases</div>
      </div>
    </div>

    <!-- Learned Words List -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Words You've Learned</h2>
      
      <div class="mb-4">
        <input
          v-model="wordsSearchQuery"
          type="text"
          class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border"
          placeholder="Search by English or Cantonese..."
        />
      </div>

      <div v-if="displayedWords.length > 0" class="space-y-2">
        <div
          v-for="word in displayedWords"
          :key="word.id"
          class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <div>
            <div class="font-medium text-gray-900 dark:text-white">{{ word.word.cantonese }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">{{ word.word.english }}</div>
          </div>
          <div class="text-right">
            <div class="text-sm font-medium" :class="word.progress.mastered ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'">
              {{ word.progress.mastered ? 'Mastered' : `Score: ${word.progress.score}/6` }}
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
        {{ wordsSearchQuery ? 'No words match your search' : 'You haven\'t learned any words yet' }}
      </div>

      <div v-if="filteredWords.length > displayedWords.length" class="mt-4 text-center">
        <button
          class="px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
          @click="loadMoreWords"
        >
          Load more ({{ filteredWords.length - displayedWords.length }} remaining)
        </button>
      </div>
    </div>

    <!-- Account Section -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Account</h2>
      
      <div v-if="profile?.email" class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Linked Email</div>
            <div class="font-medium text-gray-900 dark:text-white">{{ profile.email }}</div>
          </div>
          <div class="flex items-center space-x-2">
            <span v-if="isSyncing" class="text-sm text-gray-500 dark:text-gray-400 animate-spin">🔄</span>
            <span v-else class="text-sm text-green-600 dark:text-green-400">✓ Synced</span>
          </div>
        </div>
        <button
          class="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
          @click="handleSignOut"
        >
          Sign out
        </button>
      </div>

      <div v-else class="space-y-4">
        <p class="text-gray-600 dark:text-gray-400">
          Link an email to save your progress permanently and access it from any device.
        </p>
        <button
          class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
          @click="showLinkModal = true"
        >
          Link email to save progress
        </button>
      </div>
    </div>

    <!-- Reset Progress -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Reset Progress</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        This will clear all your learning progress. This action cannot be undone.
      </p>
      <button
        class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
        @click="handleResetProgress"
      >
        Reset all progress
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { getWordId } from "~/types";
  import type { Word } from "~/types";

  interface WordWithProgress {
    id: string;
    word: Word;
    progress: {
      score: number;
      mastered: boolean;
    };
  }

  useHead({
    title: "Profile",
  });

  const { getMasteredWords, getMasteredPhrases, getUnlockedWords, getUnlockedPhrases, getEntry } = useProgress();
  const { words, getWordById } = useWords();
  const { profile, isSyncing, linkEmail: linkEmailFn, signOut } = useUser();

  const wordsSearchQuery = ref("");
  const wordsToShow = ref(10);
  const showLinkModal = ref(false);
  const linkEmailInput = ref("");
  const linkPassword = ref("");
  const isLinking = ref(false);
  const linkError = ref("");

  const masteredWords = computed(() => getMasteredWords());
  const masteredPhrases = computed(() => getMasteredPhrases());
  const unlockedWords = computed(() => getUnlockedWords());
  const unlockedPhrases = computed(() => getUnlockedPhrases());

  const learningScore = computed(() => {
    return masteredWords.value.length + masteredPhrases.value.length;
  });

  const filteredWords = computed((): WordWithProgress[] => {
    const allUnlocked = [...unlockedWords.value];
    
    return allUnlocked
      .map((id) => {
        const word = getWordById(id);
        const entry = getEntry("word", id);
        if (!word || !entry) return null;
        return {
          id,
          word,
          progress: {
            score: entry.score,
            mastered: entry.mastered,
          },
        };
      })
      .filter((item): item is WordWithProgress => item !== null)
      .filter((item) => {
        if (!wordsSearchQuery.value) return true;
        const query = wordsSearchQuery.value.toLowerCase();
        return (
          item.word.cantonese.toLowerCase().includes(query) ||
          item.word.english.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        if (a.progress.mastered && !b.progress.mastered) return -1;
        if (!a.progress.mastered && b.progress.mastered) return 1;
        return b.progress.score - a.progress.score;
      });
  });

  const displayedWords = computed(() => {
    return filteredWords.value.slice(0, wordsToShow.value);
  });

  const loadMoreWords = () => {
    wordsToShow.value += 10;
  };

  const handleLinkEmail = async () => {
    if (!linkEmailInput.value || !linkPassword.value) {
      linkError.value = "Please enter email and password";
      return;
    }
    isLinking.value = true;
    linkError.value = "";

    const success = await linkEmailFn(linkEmailInput.value, linkPassword.value);
    if (success) {
      showLinkModal.value = false;
      linkEmailInput.value = "";
      linkPassword.value = "";
    } else {
      linkError.value = "Failed to link email";
    }
    isLinking.value = false;
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleResetProgress = () => {
    if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      if (process.client) {
        localStorage.removeItem("canglish-progress-v1");
        window.location.reload();
      }
    }
  };
</script>
