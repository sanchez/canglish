<template>
  <div
    v-if="isVisible"
    class="fixed bottom-4 left-1/2 -translate-x-1/2 bg-amber-100 dark:bg-amber-900/50 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-md z-50"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
    </svg>
    <div class="flex-1 text-sm">
      <p class="font-medium">Audio not available</p>
      <p class="text-xs opacity-80">Pre-recorded audio files are missing. Run the audio generation script.</p>
    </div>
    <button
      @click="dismiss"
      class="p-1 hover:bg-amber-200 dark:hover:bg-amber-800 rounded transition-colors"
      aria-label="Dismiss"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
  const isVisible = ref(false);
  const dismissedKey = "canglish-audio-warning-dismissed";

  const checkAudioManifest = async () => {
    if (!process.client) return;

    try {
      const response = await fetch("/canglish/audio/audio-manifest.json");
      if (!response.ok) {
        const wasDismissed = sessionStorage.getItem(dismissedKey);
        if (!wasDismissed) {
          isVisible.value = true;
        }
        return;
      }

      const manifest = await response.json();
      const audioCount = Object.keys(manifest.words || {}).length + Object.keys(manifest.phrases || {}).length;

      if (audioCount === 0) {
        const wasDismissed = sessionStorage.getItem(dismissedKey);
        if (!wasDismissed) {
          isVisible.value = true;
        }
      }
    } catch {
      const wasDismissed = sessionStorage.getItem(dismissedKey);
      if (!wasDismissed) {
        isVisible.value = true;
      }
    }
  };

  const dismiss = () => {
    isVisible.value = false;
    sessionStorage.setItem(dismissedKey, "true");
  };

  onMounted(() => {
    checkAudioManifest();
  });
</script>
