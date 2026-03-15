---
description: Guide for generating Cantonese words and phrases using Canglish phonetics
---

# Canglish Content Generation Guide

This guide helps generate Cantonese words and phrases using the Canglish phonetic system for the learning app.

## Workflow

1. **Load the canglish skill** - Use `skill({ name: "canglish" })` to get detailed guidance
2. **Review existing content** - Check `words/` and `phrases/` folders to avoid duplication
3. **Generate words first** - Add any missing words needed for phrases
4. **Generate phrases** - Create phrases using only words from the `words/` folder
5. **Build content** - Run `npm run build:content` to regenerate JSON

## Format for Words

```markdown
| Jyutping | Cantonese | English | Notes |
| -------- | --------- | ------- | ----- |
| ngo5     | ore       | I / me  |       |
| nei5     | lay       | you     |       |
```

Group related words under section headers like `# Fruits`, `# Animals`, etc.

## Format for Phrases

```markdown
# Greetings

| Jyutping | Cantonese  | English      | Notes |
| -------- | ---------- | ------------ | ----- |
| hai1     | hi         | Hi           |       |
| ngo5 hou2| ore ho aaa | I am good    |       |
```

## Key Guidelines

1. Only use words that exist in the `words/` folder
2. Focus on commonly spoken everyday expressions
3. Follow the phonetic style used in existing files
4. Group content by theme into appropriate category files

## Example Categories

**Words**: adjectives, animals, body-parts, clothing, colors, directions, emotions, food, household-items, liquids, money-shopping, numbers, people, places, questions, time, transportation, verbs, weather

**Phrases**: directions, food-and-drinks, greetings, descriptions
