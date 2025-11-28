You are senior linguist designed to help people learn Cantonese using English phenetics.

Each top level folder has a responsibility, make sure to follow the folder structure to understand the context of the files:

- `words/`: List out all the words, grouped into categories
- `rules.md`: List out the phonetic rules to help people understand how to pronounce the words, additionally also include how to order words and other common tips and tricks. This should be a file that people read over time so make sure to put beginner friendly stuff towards the top (This file is only important to contributors of the repository, not to users of the app)
- `phrases/`: Provide commonly used phrases using the words from the `words/` folder
- `app/`: Nuxt application that runs a client side app hosted on GitHub Pages that people can use to learn Cantonese

# Summarization

During your work, you may need to summarize your existing history, to help with this make sure to create "important" blocks of information representing key milestones and point in your work. To represent these blocks, use the following format:

<important>
Description of the important milestone or point
</important>

Make sure to also include any relevant information that may help you in the future, as well as the important information regarding the original user's prompt in the important block.

> When summarizing, ensure that you capture all relevant details and context to maintain continuity in future interactions.

# App Requirements

The following notes the functionality requirements of the frontend application:

1. **Word Search**: Users should be able to search for Cantonese words using either the English phenetic representation or the English translation.
2. **Word Learning**: Users should be able to "unlock" new words by discovering them and then as they get the answer correct, they progress through "mastering" the word.
   - This will be in the form of having the word on the screen in either English or Cantonese and picking the correct answer from a list of 4 other options. To make it difficult, the other options should be similar sounding words.
3. **Phrase Learning**: Users should be able to practice phrases using the words they have learnt so far. If the user hasn't learnt enough words to form the phrase, the phrase should not show up.
   - This should be a similar thing to the word learning, where the phrases are picked from random "learnt" phrases and the user has to build out the phrase from a list of words shown on the screen.
   - They need to build the phrase in the correct order, with the correct words.
   - If they make a mistake on the phrase, they lose a heart, if they lose 3 hearts on the phrase then it doesn't count towards mastering the phrase.
4. **Progress Tracking**: The app should track the user's progress, showing which words have been unlocked and mastered.

## Learning Modes

There should be 3 main learning modes of the application, they are:

### Search Mode

Search mode should allow users to search for phrases or words in either English or Cantonese using the phenetic representation. Then show them the word, some details and their current progress through mastering the word/phrase.

### Learning Mode

Learning mode should automatically pick words or phrases that the user hasn't mastered yet and:

- For words, show them the word in either English or Cantonese and have them pick the correct answer from a list of 4 other options.
- For phrases, show them the phrase in English then the user has to pick the correct words in order from a list of words shown on the screen.
  - The words on the screen should be made up of words required for the phrase (in random order) and some extra words to make it more difficult.
- If the user gets the answer correct, they progress through mastering the word/phrase, if they get it wrong they don't progress.
  - A correct answer should award one point towards mastering the word/phrase, for a total of 6 points to master it.
- There should be a maximum of 20 words/phrases being learnt at any one time, once the user masters a word/phrase it should be replaced with a new one that they haven't mastered yet.
- The words/phrases should be shown on the screen in a random order, and keep going until the user decides to exit learning mode.
- If there are less than 20 words/phrases that are currently being learnt, then the application should pick a new word/phrase to add to the learning list, following these rules:
  - Prioritise phrases over words. Only phrases which contain words the user has mastered
  - If there are no phrases available, pick words that haven't been unlocked yet.
  - Prioritise words that are most common in the available phrases.

### Review Mode

Review mode should allow users to review the words and phrases they have already mastered:

- Follow the same functionality as the Learning Mode
- Pick words/phrases that the user has already mastered
- Pick words/phrases in random order
- If the user gets the answer correct, it doesn't affect their progress as they have already mastered it.
- If the user gets the answer wrong, it should "unmaster" the word/phrase, immediately moving it to the learnt pile and setting it's score to 3.

# Nuxt 4 Features & Patterns Used in Canglish

This document summarizes the Nuxt 4 functionality and patterns actually used in the Canglish app, with a focus on what is unique or special about Nuxt 4 compared to plain Vue.

---

## 1. File‑Based App Structure

- **File‑based routing**: any `.vue` file in `app/pages/` becomes a route.
  - `app/pages/index.vue` → `/`
  - `app/pages/search.vue` → `/search`
  - `app/pages/learn/words.vue` → `/learn/words`
- **Layouts**: shared chrome is defined in `app/layouts/` and wrapped via `<NuxtLayout>` in `app/app.vue`.
- **Auto‑imports**:
  - Components in `app/components/` are globally available as `<MyComponent />`.
  - Composables in `app/composables/` are globally available as `useSomething()`.
- **Static generation**: `npm run generate` builds a static site suitable for GitHub Pages.

These conventions are specific to Nuxt and remove the need to manually register routes, components, or composables.

---

## 2. Core Nuxt Config & App Shell

- Main config lives in `nuxt.config.ts`:
  - `ssr: true` for universal rendering.
  - `srcDir: "app/"` so Nuxt treats `app/` as the source root.
  - `app.head` for global SEO defaults (title, `lang`, favicon, etc.).
  - `app.pageTransition` and `app.layoutTransition` for global transitions.
  - Global CSS from `app/assets/css/main.css` via the `css` array.
- `app/app.vue` typically wraps layout + page:
  - `<NuxtLayout><NuxtPage /></NuxtLayout>`.
  - Can also define global transitions and head/SEO with `useHead` / `useSeoMeta`.

Nuxt 4’s `app` block and automatic wiring of `app/app.vue` as the root entry are key differences from plain Vue.

---

## 3. Routing & Navigation

- **Automatic routes** from `app/pages/` (including dynamic `[id].vue` segments).
- **Navigation** via `<NuxtLink>` for client‑side routing and automatic prefetching when links enter the viewport.
- **Route access** via `useRoute()` in `<script setup>`.
- **Route middleware** (Nuxt‑only feature):
  - Anonymous (inline) middleware via `definePageMeta({ middleware() { ... } })`.
  - Named middleware in `app/middleware/*.ts` used with `definePageMeta({ middleware: 'name' })`.
  - Global middleware in `app/middleware/*.global.ts` that run on every route.
- **Route validation** via `definePageMeta({ validate(route) { ... } })` to accept/reject routes or customize error codes.

These middleware and validation hooks are Nuxt‑specific extensions on top of `vue-router`.

---

## 4. SEO & Head Management (Unhead)

Nuxt 4 integrates [Unhead] for typed, reactive head/SEO management:

- **Global defaults** via `app.head` in `nuxt.config.ts` (non‑reactive, app‑wide).
- **Per‑page or app‑level reactive head** via:
  - `useHead({ ... })` for arbitrary tags (title, meta, link, script, html/body attrs, etc.).
  - `useSeoMeta({ ... })` for strongly‑typed SEO fields (e.g. `ogTitle`, `twitterCard`).
- **Head components** available in templates: `<Head>`, `<Title>`, `<Meta>`, `<Link>`, `<Body>`, `<Html>`, etc.
- **Title templates & template params** for dynamic titles across pages.
- **Body tag positioning** of scripts/styles (e.g. `tagPosition: 'bodyClose'`).

This replaces manual `<head>` management and is a core Nuxt 4 capability.

---

## 5. Transitions & View Transitions API

Nuxt adds high‑level control over transitions across pages and layouts:

- **Global page/layout transitions** via `app.pageTransition` and `app.layoutTransition` in `nuxt.config.ts`.
- **Per‑page overrides** via `definePageMeta({ pageTransition: {...}, layoutTransition: {...} })`.
- **CSS‑based transitions** using Vue’s `<Transition>` classes (e.g. `.page-enter-active`).
- **JS hook transitions** with callbacks (`onBeforeEnter`, `onEnter`, etc.).
- **Dynamic transitions** based on route or params using inline middleware to modify `to.meta.pageTransition`.
- **View Transitions API (experimental)**:
  - Enable via `experimental.viewTransition` in `nuxt.config.ts`.
  - Optional disabling of Vue transitions when native View Transitions are available.

These are Nuxt‑level wrappers around Vue transitions, with additional routing awareness.

---

## 6. Data Fetching: `useFetch`, `useAsyncData`, `$fetch`

Nuxt 4 provides a unified data‑fetching story designed for SSR and hydration:

- **`$fetch`**: auto‑imported wrapper around `ofetch` for simple network calls (usually client‑side or inside handlers).
- **`useFetch(url, options)`**:
  - SSR‑aware wrapper around `$fetch` and `useAsyncData`.
  - Ensures data fetched on the server is serialized into the payload and reused on the client.
  - Returns `{ data, error, status, refresh/execute, clear }`.
- **`useAsyncData(key, handler, options)`**:
  - General async wrapper for arbitrary async logic (including third‑party SDKs / CMS clients).
  - Shares the same return shape and many options with `useFetch`.
- **Important Nuxt‑specific options/patterns**:
  - `lazy` / `useLazyFetch` / `useLazyAsyncData` for non‑blocking, non‑navigation‑blocking fetching.
  - `server: false` for client‑only calls.
  - `pick` and `transform` to minimize payload size between server and client.
  - Keys and caching via `key` (or URL) and access through `useNuxtData`.
  - `watch`, computed URLs, and reactive options for auto‑refetching.
  - `immediate: false` to delay the first fetch until user interaction.

These APIs are central to how Canglish fetches quiz/search/progress data.

---

## 7. Server Runtime (Nitro) & API Routes

- **Server routes** live under `server/api/*.ts` and are handled by Nitro.
  - Example: `server/api/words.get.ts` → `/api/words`.
  - Use `defineEventHandler(event => { ... })` to build responses.
- **Shared server utilities** in `server/utils/` for reading and caching markdown from `words/` and `phrases/`.
- **Request helpers** like `useRequestFetch`, `useRequestHeaders`, and `useRequestEvent` to work with headers/cookies and SSR context.

This built‑in server runtime is a Nuxt‑exclusive feature and avoids maintaining a separate backend.

---

## 8. Canglish‑Specific Mapping to Nuxt

How the Canglish app maps its domain features onto Nuxt 4:

- **Word Search**

  - Route: `app/pages/search.vue`.
  - Data: `useFetch('/api/words')`, then client‑side filtering by English and phonetics.
  - UI: search input + list of matching words.

- **Word Learning (Quiz)**

  - Route: `app/pages/learn/words.vue`.
  - Backend: `server/api/quiz/word.get.ts` returns a question + 4 options.
  - Frontend: quiz components in `app/components/` and state in `useWordQuiz()`.

- **Phrase Learning (Build‑the‑Phrase)**

  - Route: `app/pages/learn/phrases.vue`.
  - Backend: `server/api/quiz/phrase.get.ts` exposes only phrases made from unlocked words.
  - Frontend: phrase builder UI + hearts logic inside `usePhraseQuiz()`.

- **Progress Tracking**
  - Composable: `useProgress()` in `app/composables/useProgress.ts`.
  - Storage: `localStorage` (via `useStorage` or manual access) and optionally synced to an API endpoint later.

Pages stay thin, delegating logic to composables and data loading to server routes.

---

## 9. Development & Deployment

- **Install dependencies**: `npm install`.
- **Run dev server**: `npm run dev`.
- **Generate static site**: `npm run generate` (used for GitHub Pages deployment).

Nuxt 4 handles bundling, routing, SSR, and static generation, allowing the Canglish repo to focus on content (markdown) and learning logic rather than low‑level app wiring.
