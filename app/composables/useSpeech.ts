interface AudioManifest {
  words: Record<string, string>;
  phrases: Record<string, string>;
}

let audioManifest: AudioManifest | null = null;
let manifestLoaded = false;
let currentAudio: HTMLAudioElement | null = null;

const loadManifest = async (): Promise<AudioManifest | null> => {
  if (manifestLoaded && audioManifest) {
    return audioManifest;
  }

  if (!process.client) {
    return null;
  }

  try {
    const response = await fetch("/canglish/audio/audio-manifest.json");
    if (response.ok) {
      audioManifest = await response.json();
      manifestLoaded = true;
      console.log("[Speech] Audio manifest loaded");
    }
  } catch {
    console.warn("[Speech] Failed to load audio manifest");
  }

  return audioManifest;
};

const getAudioUrl = (text: string): string | null => {
  if (!audioManifest) {
    return null;
  }

  const normalizedText = text.toLowerCase().trim();
  return audioManifest.words[normalizedText] || audioManifest.phrases[normalizedText] || null;
};

export const useSpeech = () => {
  const isSpeaking = ref(false);
  const audioAvailable = ref(false);

  const checkAudioAvailable = async (): Promise<boolean> => {
    if (!process.client) {
      return false;
    }

    const manifest = await loadManifest();
    if (manifest) {
      const count = Object.keys(manifest.words).length + Object.keys(manifest.phrases).length;
      if (count > 0) {
        audioAvailable.value = true;
        console.log(`[Speech] ${count} audio files available`);
        return true;
      }
    }
    return false;
  };

  const speak = async (text: string): Promise<void> => {
    if (!process.client || !text) {
      return;
    }

    if (!audioAvailable.value) {
      await checkAudioAvailable();
    }

    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }

    isSpeaking.value = true;

    const audioUrl = getAudioUrl(text);
    if (audioUrl) {
      try {
        currentAudio = new Audio(audioUrl);
        currentAudio.playbackRate = 0.8;
        currentAudio.onended = () => {
          isSpeaking.value = false;
          currentAudio = null;
        };
        currentAudio.onerror = () => {
          isSpeaking.value = false;
          currentAudio = null;
        };
        await currentAudio.play();
      } catch {
        isSpeaking.value = false;
        currentAudio = null;
      }
    } else {
      isSpeaking.value = false;
    }
  };

  const stop = (): void => {
    if (!process.client) {
      return;
    }
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    isSpeaking.value = false;
  };

  onMounted(() => {
    checkAudioAvailable();
  });

  return {
    speak,
    stop,
    isSpeaking: readonly(isSpeaking),
    isAvailable: checkAudioAvailable,
  };
};
