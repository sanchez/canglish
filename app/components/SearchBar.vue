<template>
  <div class="relative">
    <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    </div>
    <input
      v-model="query"
      type="text"
      :placeholder="placeholder"
      class="w-full pl-12 pr-10 py-3.5 text-base bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400 transition-all duration-200"
      aria-label="Search"
    />
    <button
      v-if="query"
      @click="clear"
      aria-label="Clear search"
      class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    modelValue: string;
    placeholder?: string;
  }>();

  const emit = defineEmits<{
    "update:modelValue": [value: string];
  }>();

  const query = computed({
    get: () => props.modelValue,
    set: (value) => emit("update:modelValue", value),
  });

  const clear = () => {
    query.value = "";
  };
</script>
