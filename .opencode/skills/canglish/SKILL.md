---
name: canglish
description: Generate Cantonese words and phrases using the Canglish phonetic system
compatibility: opencode
metadata:
  audience: linguists
  workflow: content-creation
---

## What I Do

I help generate Cantonese words and phrases using Canglish - a phonetic way of writing Cantonese using English letters. The phonetics represent how Cantonese words sound.

## When to Use Me

Use this skill when you need to:
- Add new vocabulary words to the app
- Create new phrases for everyday conversations
- Expand the dataset with common Cantonese expressions

## Project Structure

The Canglish app stores content in two locations:

- `words/` - Individual vocabulary words organized by category
- `phrases/` - Common phrases organized by theme

### Existing Word Categories

- adjectives.md, animals.md, body-parts.md, clothing.md, colors.md
- descriptor.md, directions.md, emotions.md, food.md, household-items.md
- liquids.md, money-shopping.md, numbers.md, people.md, places.md
- questions.md, time.md, transportation.md, verbs.md, weather.md

### Existing Phrase Categories

- directions.md, food-and-drinks.md, greetings.md, descriptions.md

## Format for Words

Words use a markdown table with four columns (Jyutping, Cantonese, English, Notes):

```markdown
| Jyutping | Cantonese | English | Notes |
| -------- | --------- | ------- | ----- |
| ngo5     | ore       | I / me  |       |
| nei5     | lay       | you     |       |
```

Group related words under section headers:

```markdown
# Fruits

| Jyutping  | Cantonese    | English | Notes |
| --------- | ------------ | ------- | ----- |
| hoeng1 ziu1| her-ung chiew| banana  |       |
| ping4 gwa1 | ping gaw     | apple   |       |
```

## Format for Phrases

Phrases also use markdown tables:

```markdown
# Greetings

| Jyutping | Cantonese  | English      | Notes |
| -------- | ---------- | ------------ | ----- |
| hai1     | hi         | Hi           |       |
| ngo5 hou2| ore ho aaa | I am good    |       |
| nei5 hou2| nay ho ma  | How are you? |       |
```

## Phonetic Guidelines

Follow these rules when creating Canglish representations:

1. **Base on existing patterns** - Review existing words in the `words/` folder to match the phonetic style
2. **Use common sounds** - Cantonese has tones, but Canglish typically ignores tone marks
3. **Keep it simple** - Use recognizable English letter combinations
4. **Be consistent** - If "ch" sounds like "ch" in "church", use the same representation elsewhere
5. **Consider the accent** - Canglish should reflect how words sound in natural HK Cantonese speech, not literal Jyutping conversion

## Accent and Natural Speech

**Important:** Canglish represents how Cantonese actually sounds when spoken, not literal Jyutping conversion. HK Cantonese has distinct pronunciation patterns:

### Initial Consonant Shifts

| Standard Jyutping | HK Pronunciation | Canglish | Example |
| ----------------- | ---------------- | -------- | ------- |
| ngo-               | o- (ng dropped)  | ore     | ngo5 → ore (I/me) |
| nei5              | lei5             | lay     | nei5 → lay (you) |
| ng- initial       | often subtle     | o- or ng- | ngo5 → ore, ngau4 → ngau or ow |

### Common Accent Patterns

1. **"ng" at word start** - Often softened or dropped in casual HK speech
   - ngo5 (我) → "ore" not "ngo"
   - ngau4 (牛) → "ow" or "ngau" (both acceptable)

2. **n/l interchange** - HK speakers often pronounce "n" as "l" 
   - nei5 (你) → "lay" not "nei"
   - lou5 syu2 (老鼠) → "low shu"

3. **Soft endings** - Final consonants are often subtle
   - Keep them simple: "mow" (not "maauu"), "gow" (not "gauu")

4. **Hyphens for compound words in words/** - Use hyphens in words/ folder
   - pang-yau (朋友), ngau-yuk-min (牛肉麵)

5. **Spaces for phrases** - Use space-separated in phrases/ folder
   - ore ho aaa, lay ho ma

## Converting Jyutping to Canglish

When converting from Jyutping (standard Cantonese romanization) to Canglish (English phonetic spelling), follow these guidelines:

### Basic Consonant Mappings

| Jyutping | Canglish | Example |
| -------- | -------- | ------- |
| b-       | b-       | baa1 → baa (eight) |
| p-       | p-       | po1 → po |
| m-       | m-       | maa1 → ma |
| f-       | f-       | faa1 → faa |
| d-       | d-       | daa1 → daa |
| t-       | t-       | ta1 → ta |
| n-       | n-       | naa1 → naa |
| l-       | l-       | laa1 → laa |
| g-       | g-       | gaa1 → gaa |
| k-       | k-       | kaa1 → kaa |
| ng-      | ng-      | ngo5 → ngo → ore (the "ng" is subtle) |
| gw-      | gw-      | gwai3 → gwai |
| kw-      | kw-      | kwai1 → kwai |

### Sibilants and Affricates (Important!)

| Jyutping | Canglish | Example |
| -------- | -------- | ------- |
| z-       | j-       | zi1 → ji, zyu1 → ju, zau2 → jow |
| c-       | ch-      | ca1 → cha, caa4 → cha, cin4 → chin |
| s-       | s-       | si1 → si, sik1 → sik |

### Special Consonant Rules

| Jyutping | Canglish | Notes |
| -------- | -------- | ----- |
| j-       | y-       | jaan2 → yan |
| w-       | w-       | waa1 → waa |
| h-       | h-       | hai1 → hi |

### Vowel Mappings (Critical!)

| Jyutping | Canglish | Example |
| -------- | -------- | ------- |
| aa       | aa / a   | gaa1 → gaa, caa4 → cha |
| a        | u / a    | Can be tricky, check existing patterns |
| e        | e / ay   | se1 → say |
| i        | ee / i   | si1 → see, ji6 → yee, zi1 → ji |
| o        | o / aw   | go1 → go |
| u        | oo / u   | fu1 → foo, hung4 → hoong |
| au       | ow (cow) | gau2 → gow, maau1 → mow, zau2 → jow |
| ou       | ow (low) | mou5 → mow, hou2 → ho |
| oe       | eu       | goek3 → geuk |
| eo       | eu       | seon1 → seun |
| yu       | yu       | jyu1 → yu |

### Nasal Endings

| Jyutping | Canglish | Notes |
| -------- | -------- | ----- |
| -m       | -m       | sam1 → sam |
| -n       | -n       | san1 → san |
| -ng      | -ng      | sang1 → sang |

### Plosive Endings (Stop Consonants)

| Jyutping | Canglish | Notes |
| -------- | -------- | ----- |
| -p       | -p       | Often subtle/brief |
| -t       | -t       | Often subtle/brief |
| -k       | -k       | Often subtle/brief |

### Tone Handling

Canglish does not represent tones explicitly. Ignore tone numbers when converting.

### Common Conversion Examples

1. **ngo5 (我)** → "ore" - The "ng" at the start is often subtle in casual speech
2. **nei5 (你)** → "lay" - "n" and "l" are interchangeable in colloquial Cantonese
3. **gau2 (狗)** → "gow" - The "au" sounds like "ow" in "cow"
4. **maau1 (猫)** → "mow" - The "au" sounds like "ow" in "cow"
5. **ji6 (二)** → "yee" - The "j" is like "y", and "i" sounds like "ee"
6. **zi1 (字)** → "ji" - The "z" sounds like "j", and "i" sounds like "ee"
7. **ca1 (叉)** → "cha" - The "c" sounds like "ch"

### Tips for Consistency

1. **Check existing words first** - Look for similar Jyutping sounds in `words/` files
2. **Use intuitive English** - Spell it how an English speaker would read it aloud
3. **Prefer common spellings** - "ay" over "ei", "ee" over "i" for long e sounds
4. **Test the sound** - If unsure, consider how it would sound when read by an English speaker

## Workflow

1. **Review existing content** - Read files in `words/` and `phrases/` to avoid duplication
2. **Check for missing words** - Ensure all words used in phrases exist in the `words/` folder
3. **Generate new content** - Add new words first, then phrases that use those words
4. **Run build command** - After adding content, run `npm run build:content` to regenerate JSON

## Important Notes

- Only use words that exist in the `words/` folder when creating phrases
- If a necessary word is missing, generate it first before creating phrases
- Focus on commonly spoken words and phrases for everyday conversations
- Avoid rare or overly formal expressions
