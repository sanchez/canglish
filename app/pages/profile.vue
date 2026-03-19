<template>
  <div class="space-y-8 max-w-4xl mx-auto">
    <!-- Link Email Modal -->
    <div
      v-if="showLinkModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      @click.self="showLinkModal = false"
    >
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-elevated animate-fade-in">
        <h3 id="modal-title" class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Link Email</h3>
        <p class="text-sm text-muted mb-5">
          Link an email to save your progress permanently. You'll be able to sign in from any device.
        </p>
        <div class="space-y-4">
          <div>
            <label for="email-input" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
            <input
              id="email-input"
              v-model="linkEmailInput"
              type="email"
              class="input-field"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label for="password-input" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
            <input
              id="password-input"
              v-model="linkPassword"
              type="password"
              class="input-field"
              placeholder="••••••••"
            />
          </div>
          <p v-if="linkError" role="alert" class="text-sm text-red-600 dark:text-red-400">{{ linkError }}</p>
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <button class="btn-secondary" @click="showLinkModal = false">Cancel</button>
          <button class="btn-primary" :disabled="isLinking" @click="handleLinkEmail">
            {{ isLinking ? "Linking..." : "Link Email" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Learning Score Hero -->
    <div class="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 rounded-2xl p-8 text-white">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
      <div class="relative text-center">
        <div class="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <div class="text-5xl sm:text-6xl font-bold tabular-nums">{{ learningScore }}</div>
        <div class="text-lg opacity-90 mt-1">items mastered</div>
        <div class="mt-3 text-sm opacity-75">{{ motivationalText }}</div>
      </div>
    </div>

    <!-- Review Session -->
    <div v-if="hasReviewItems" class="card flex items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <div>
          <div class="font-semibold text-gray-900 dark:text-white">Ready to Review</div>
          <div class="text-sm text-muted">{{ masteredItemsCount }} mastered items available</div>
        </div>
      </div>
      <NuxtLink to="/review" class="btn-primary whitespace-nowrap">Start Review</NuxtLink>
    </div>

    <!-- Progress Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card text-center">
        <div class="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{{ masteredWords.length }}</div>
        <div class="text-sm text-muted mt-1">Mastered Words</div>
      </div>
      <div class="card text-center">
        <div class="text-2xl font-bold text-purple-600 dark:text-purple-400 tabular-nums">{{ masteredPhrases.length }}</div>
        <div class="text-sm text-muted mt-1">Mastered Phrases</div>
      </div>
      <div class="card text-center">
        <div class="text-2xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">{{ unlockedWords.length }}</div>
        <div class="text-sm text-muted mt-1">Unlocked Words</div>
      </div>
      <div class="card text-center">
        <div class="text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">{{ unlockedPhrases.length }}</div>
        <div class="text-sm text-muted mt-1">Unlocked Phrases</div>
      </div>
    </div>

    <!-- Flagged Items Section -->
    <div v-if="flagCount > 0" class="card">
      <button
        @click="showFlagged = !showFlagged"
        class="w-full flex items-center justify-between mb-4 text-left"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-rose-600 dark:text-rose-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="font-semibold text-gray-900 dark:text-white">Flagged Items</div>
          <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300">{{ flagCount }}</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 text-gray-400 transition-transform duration-200"
          :class="{ 'rotate-180': showFlagged }"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div v-show="showFlagged" class="space-y-4">
        <div v-if="flaggedWords.length > 0" class="space-y-2">
          <div class="text-sm font-medium text-gray-700 dark:text-gray-300">Words ({{ flaggedWords.length }})</div>
          <div
            v-for="flag in flaggedWords"
            :key="flag.id"
            class="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
          >
            <div>
              <div class="font-medium text-gray-900 dark:text-white">{{ getWordData(flag.id)?.cantonese || flag.id }}</div>
              <div class="text-sm text-muted">{{ getWordData(flag.id)?.english }}</div>
            </div>
            <button
              type="button"
              aria-label="Remove flag"
              class="p-2 text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
              @click="unflagItem('word', flag.id)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <div v-if="flaggedPhrases.length > 0" class="space-y-2">
          <div class="text-sm font-medium text-gray-700 dark:text-gray-300">Phrases ({{ flaggedPhrases.length }})</div>
          <div
            v-for="flag in flaggedPhrases"
            :key="flag.id"
            class="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
          >
            <div>
              <div class="font-medium text-gray-900 dark:text-white">{{ getPhraseData(flag.id)?.cantonese || flag.id }}</div>
              <div class="text-sm text-muted">{{ getPhraseData(flag.id)?.english }}</div>
            </div>
            <button
              type="button"
              aria-label="Remove flag"
              class="p-2 text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
              @click="unflagItem('phrase', flag.id)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <button
          type="button"
          class="text-sm font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors"
          @click="handleClearAllFlags"
        >
          Clear All Flags
        </button>
      </div>
    </div>

    <!-- Learned Words List -->
    <div class="card">
      <h2 class="section-title mb-4">Words You've Learned</h2>
      
      <div class="mb-4">
        <input
          v-model="wordsSearchQuery"
          type="text"
          class="input-field"
          placeholder="Search by English or Cantonese..."
        />
      </div>

      <div v-if="displayedWords.length > 0" class="space-y-2">
        <div
          v-for="word in displayedWords"
          :key="word.id"
          class="flex justify-between items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50"
        >
          <div>
            <div class="font-semibold text-gray-900 dark:text-white">{{ word.word.cantonese }}</div>
            <div class="text-sm text-muted">{{ word.word.english }}</div>
          </div>
          <div class="text-right">
            <div class="text-sm font-medium" :class="word.progress.mastered ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted'">
              {{ word.progress.mastered ? 'Mastered' : `Score: ${word.progress.score}/6` }}
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-10 text-muted">
        {{ wordsSearchQuery ? 'No words match your search' : "You haven't learned any words yet" }}
      </div>

      <div v-if="filteredWords.length > displayedWords.length" class="mt-4 text-center">
        <button
          class="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          @click="loadMoreWords"
        >
          Load more ({{ filteredWords.length - displayedWords.length }} remaining)
        </button>
      </div>
    </div>

    <!-- Account Section -->
    <div class="card">
      <h2 class="section-title mb-4">Account</h2>
      
      <div v-if="profile?.email" class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm text-muted">Linked Email</div>
            <div class="font-medium text-gray-900 dark:text-white">{{ profile.email }}</div>
          </div>
          <div class="flex items-center gap-2">
            <LoadingSpinner v-if="isSyncing" size="sm" />
            <span v-else class="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Synced
            </span>
          </div>
        </div>
        <button
          class="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          @click="handleSignOut"
        >
          Sign out
        </button>
      </div>

      <div v-else class="space-y-4">
        <p class="text-muted">
          Link an email to save your progress permanently and access it from any device.
        </p>
        <button class="btn-primary" @click="showLinkModal = true">
          Link email to save progress
        </button>
      </div>
    </div>

    <!-- Danger Zone -->
    <div class="card border border-red-200 dark:border-red-900/50">
      <h2 class="section-title mb-2 text-red-600 dark:text-red-400">Reset Progress</h2>
      <p class="text-sm text-muted mb-4">
        This will clear all your learning progress. This action cannot be undone.
      </p>
      <button class="btn-danger" @click="handleResetProgress">
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
  const { phrases, getPhraseById } = usePhrases();
  const { profile, isSyncing, linkEmail: linkEmailFn, signOut } = useUser();
  const { getMasteredItems, hasItems } = useReviewPool();
  const { getFlaggedWords, getFlaggedPhrases, getFlagCount, unflagItem, clearAllFlags } = useFlags();

  const wordsSearchQuery = ref("");
  const wordsToShow = ref(10);
  const showLinkModal = ref(false);
  const linkEmailInput = ref("");
  const linkPassword = ref("");
  const isLinking = ref(false);
  const linkError = ref("");
  const showFlagged = ref(false);

  const masteredWords = computed(() => getMasteredWords());
  const masteredPhrases = computed(() => getMasteredPhrases());
  const unlockedWords = computed(() => getUnlockedWords());
  const unlockedPhrases = computed(() => getUnlockedPhrases());
  const masteredItemsCount = computed(() => getMasteredItems().length);
  const hasReviewItems = computed(() => hasItems.value);
  const flaggedWords = computed(() => getFlaggedWords());
  const flaggedPhrases = computed(() => getFlaggedPhrases());
  const flagCount = computed(() => getFlagCount());

  const learningScore = computed(() => {
    return masteredWords.value.length + masteredPhrases.value.length;
  });

  const motivationalText = computed(() => {
    const score = learningScore.value;
    if (score === 0) return "Start your Cantonese journey today!";
    if (score < 5) return "Great beginning — keep going!";
    if (score < 15) return "You're making excellent progress!";
    if (score < 30) return "Impressive mastery — keep it up!";
    return "You're a Cantonese champion!";
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

  const getWordData = (id: string) => {
    return getWordById(id);
  };

  const getPhraseData = (id: string) => {
    return getPhraseById(id);
  };

  const handleClearAllFlags = () => {
    if (confirm("Are you sure you want to clear all flagged items?")) {
      clearAllFlags();
    }
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
