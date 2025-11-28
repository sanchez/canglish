<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
  useHead({
    titleTemplate: (titleChunk) => {
      return titleChunk
        ? `${titleChunk} - Canglish`
        : "Canglish - Learn Cantonese";
    },
  });
</script>
