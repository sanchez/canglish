# Canglish - Learn Cantonese

A client-side web app for learning Cantonese using English phonetics. Built with Nuxt 4 and deployed on GitHub Pages.

## Features

- 🔍 **Search**: Find words and phrases in English or Cantonese
- 📚 **Learning Mode**: Practice up to 20 words/phrases at a time
- 🎯 **Smart Phrase Unlocking**: Phrases become available only after mastering all constituent words
- 🔄 **Review Mode**: Keep your skills sharp by reviewing mastered content
- ❤️ **Hearts System**: Get 3 chances to build phrases correctly
- 💾 **Local Progress**: All progress is saved in your browser

## Development

### Prerequisites

- Node.js 18+ and npm

### Setup

```bash
# Install dependencies
npm install

# Build content JSON from markdown
npm run build:content

# Start dev server
npm run dev
```

Visit `http://localhost:3000/canglish/` in your browser.

### Content Management

Words are stored in `words/*.md` and phrases in `phrases/*.md` as markdown tables.

After editing markdown files, regenerate the JSON:

```bash
npm run build:content
```

Then commit the updated JSON files in `app/content/`.

### Build for Production

```bash
# Generate static site
npm run generate
```

Output will be in `.output/public/` ready for deployment to GitHub Pages.

## Project Structure

```
canglish/
├── app/                      # Nuxt app source
│   ├── assets/css/          # Global styles
│   ├── components/          # Vue components
│   ├── composables/         # Composable functions
│   ├── content/             # Generated JSON (committed)
│   ├── layouts/             # App layouts
│   ├── pages/               # Route pages
│   ├── types/               # TypeScript types
│   └── app.vue              # Root component
├── words/                   # Word definitions (markdown)
├── phrases/                 # Phrase definitions (markdown)
├── scripts/                 # Build scripts
│   └── build-content.ts    # Markdown to JSON converter
├── nuxt.config.ts          # Nuxt configuration
└── package.json            # Dependencies & scripts
```

## How It Works

1. **Content Build**: Markdown tables → JSON with stable IDs and tokenization
2. **Progress Tracking**: localStorage stores per-item scores (0-6) and mastery state
3. **Learning Pool**: Maintains 20 items, prioritizing eligible phrases and high-frequency words
4. **Quiz Generation**: Client-side question building with category-based distractors
5. **Phrase Eligibility**: Simple token→word matching ensures all words are mastered before phrase unlock

## License

See [LICENSE](LICENSE) file.
