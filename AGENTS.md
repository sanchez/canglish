# AGENTS.md - Canglish Development Guide

This document provides guidelines for agents working on the Canglish codebase.

## Project Overview

Canglish is a Nuxt 3 application that helps people learn Cantonese using English phonetics. It features word/phrase search, learning quizzes, and progress tracking with localStorage persistence.

## Commands

```bash
# Development
npm run dev              # Start dev server at http://localhost:3000/canglish/

# Build & Deploy
npm run build            # Build for production
npm run generate         # Generate static site (used for GitHub Pages deployment)
npm run preview          # Preview production build
npm run build:content    # Build content JSON from markdown files in words/ and phrases/

# Note: No test framework is currently configured
```

## Project Structure

```
canglish/
├── app/                     # Nuxt application source
│   ├── assets/css/          # Global CSS (Tailwind imports)
│   ├── components/          # Vue components (auto-imported)
│   ├── composables/        # Vue composables (auto-imported as useXxx())
│   ├── content/            # Generated JSON (words.json, phrases.json)
│   ├── layouts/            # Page layouts
│   ├── pages/              # File-based routing
│   │   ├── index.vue       # Home
│   │   ├── search.vue      # Word/phrase search
│   │   ├── review.vue      # Review mastered items
│   │   └── learn/          # Learning modes
│   └── types/              # TypeScript interfaces
├── words/                   # Word data (markdown files by category)
├── phrases/                 # Phrase data (markdown files by category)
├── nuxt.config.ts          # Nuxt configuration
└── tailwind.config.js      # Tailwind CSS configuration
```

## Code Style Guidelines

### TypeScript

- **Always use strict TypeScript** - `strict: true` is enabled in tsconfig.json
- Use explicit types for function parameters and return values
- Use interfaces for object shapes (e.g., `Word`, `Phrase`, `ProgressEntry`)
- Import types using `import type { X }` syntax

```typescript
// Good
import type { Word } from "~/types";
import { getWordId } from "~/types";

const getWordById = (id: string): Word | undefined => {
  return words.value.find((w) => getWordId(w) === id);
};
```

### Vue Components

- Use `<script setup lang="ts">` syntax
- Use Composition API with `ref`, `computed`, `watch`
- Access auto-imported composables directly: `const { words } = useWords()`
- Use Nuxt's `useHead()` for page-specific SEO
- Components are auto-imported; no explicit imports needed

```vue
<script setup lang="ts">
  const { words } = useWords();
  
  useHead({
    title: "Search",
  });

  const searchQuery = ref("");
</script>
```

### Naming Conventions

- **Components**: PascalCase (e.g., `WordListItem`, `HeartsDisplay`)
- **Composables**: `use` prefix (e.g., `useWords`, `useProgress`)
- **Functions**: camelCase
- **Interfaces/Types**: PascalCase
- **File names**: kebab-case for composables, PascalCase for components

### Imports

- Nuxt auto-imports: components from `app/components/`, composables from `app/composables/`, and `~/` resolves to `app/`
- Use `~/types` for type imports
- Use `~/content/` for JSON data imports

```typescript
// Types
import type { Word, Phrase } from "~/types";
import { getWordId, getPhraseId } from "~/types";

// Content (generated JSON)
import wordsData from "~/content/words.json";
```

### State Management

- Use Nuxt's `useState<T>()` for reactive state shared across components
- Use `ref<T>()` for component-local reactive state
- Use `readonly()` when exposing state that shouldn't be mutated externally

```typescript
// Shared state
const state = useState<ProgressState>("progress", () => ({ items: {} }));

// Component-local state
const searchQuery = ref("");

// Expose as readonly
return { words: readonly(words), ... };
```

### localStorage

- Check `process.client` before accessing localStorage (SSR safety)
- Wrap JSON.parse in try/catch for robustness
- Use clear storage keys with versioning (e.g., `canglish-progress-v1`)

```typescript
const state = useState("progress", () => {
  if (process.client) {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse stored progress:", e);
      }
    }
  }
  return { items: {} };
});
```

### Error Handling

- Use try/catch for operations that may fail (JSON parsing, localStorage)
- Log errors with `console.error()` for debugging
- Handle missing data gracefully (return `null` or fallback values)

### CSS & Styling

- Use Tailwind CSS classes throughout
- Common patterns: `space-y-4`, `grid gap-4`, `text-gray-500`, `font-bold`
- See tailwind.config.js for content paths

### Route & Navigation

- Routes are file-based in `app/pages/`
- Use `<NuxtLink>` for internal navigation
- Access current route via `useRoute()` in `<script setup>`

## Learning Mode Functionality

The app has three main modes:

1. **Search Mode** (`/search`): Search words/phrases by English or Cantonese
2. **Learning Mode** (`/learn/words`, `/learn/phrases`): Practice unmastered items
3. **Review Mode** (`/review`): Review mastered items

Progress:
- Words/phrases need 6 correct answers to be "mastered"
- Phrases require all constituent words to be mastered first
- Progress stored in localStorage

## External Resources

- Nuxt 3 docs: https://nuxt.com/docs
- Vue 3 Composition API: https://vuejs.org/api/composition-api.html
- Tailwind CSS: https://tailwindcss.com/docs
- @nuxt/ui: https://ui.nuxt.com
