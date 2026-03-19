<template>
  <div class="flex items-center gap-1" role="img" :aria-label="`${count} of ${maxHearts} hearts remaining`">
    <svg
      v-for="i in maxHearts"
      :key="i"
      xmlns="http://www.w3.org/2000/svg"
      class="w-6 h-6 transition-all duration-300"
      :class="[
        i <= count ? 'text-rose-500' : 'text-gray-200 dark:text-gray-700',
        shaking && i === count + 1 ? 'animate-shake' : ''
      ]"
      viewBox="0 0 24 24"
      :fill="i <= count ? 'currentColor' : 'none'"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      count: number;
      maxHearts?: number;
    }>(),
    {
      maxHearts: 3,
    }
  );

  const shaking = ref(false);
  const prevCount = ref(props.count);

  watch(() => props.count, (newVal, oldVal) => {
    if (newVal < oldVal) {
      shaking.value = true;
      setTimeout(() => {
        shaking.value = false;
      }, 500);
    }
    prevCount.value = newVal;
  });
</script>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-3px) rotate(-5deg); }
  40% { transform: translateX(3px) rotate(5deg); }
  60% { transform: translateX(-2px) rotate(-3deg); }
  80% { transform: translateX(2px) rotate(3deg); }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}
</style>
