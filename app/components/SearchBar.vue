<template>
  <div class="relative">
    <input
      v-model="query"
      type="text"
      :placeholder="placeholder"
      class="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      @input="handleInput"
    />
    <div
      v-if="query"
      class="absolute right-3 top-3"
    >
      <button
        @click="clear"
        class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
      >
        ✕
      </button>
    </div>
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

  const handleInput = () => {
    // Input is already handled by v-model
  };

  const clear = () => {
    query.value = "";
  };
</script>
