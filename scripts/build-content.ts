import { readdir, readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = join(__dirname, "..");
const wordsDir = join(rootDir, "words");
const phrasesDir = join(rootDir, "phrases");
const outputDir = join(rootDir, "app", "content");

interface Word {
  jyutping: string;
  cantonese: string;
  english: string;
  notes: string;
  category: string;
}

interface Phrase {
  jyutping: string;
  cantonese: string;
  english: string;
  notes: string;
  category: string;
  tokens: string[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function parseMarkdownTable(
  content: string
): Array<{ jyutping: string; cantonese: string; english: string; notes: string }> {
  const lines = content.split("\n");
  const rows: Array<{ jyutping: string; cantonese: string; english: string; notes: string }> = [];

  let inTable = false;
  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) continue;

    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      if (
        trimmed.includes("---") ||
        trimmed.toLowerCase().includes("jyutping") ||
        trimmed.toLowerCase().includes("cantonese")
      ) {
        inTable = true;
        continue;
      }

      if (inTable) {
        const cells = trimmed
          .split("|")
          .map((cell) => cell.trim())
          .filter((cell) => cell.length > 0);

        if (cells.length >= 3) {
          rows.push({
            jyutping: cells[0],
            cantonese: cells[1],
            english: cells[2],
            notes: cells[3] || "",
          });
        }
      }
    }
  }

  return rows;
}

function tokenizePhrase(cantonese: string): string[] {
  // Split on spaces, preserve hyphens within tokens
  return cantonese
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0);
}

async function loadWords(): Promise<Word[]> {
  const files = await readdir(wordsDir);
  const words: Word[] = [];

  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    const category = file.replace(".md", "");
    const content = await readFile(join(wordsDir, file), "utf-8");
    const rows = parseMarkdownTable(content);

for (const row of rows) {
    words.push({
      jyutping: row.jyutping,
      cantonese: row.cantonese,
      english: row.english,
      notes: row.notes,
      category,
    });
  }
  }

  return words;
}

async function loadPhrases(): Promise<Phrase[]> {
  const files = await readdir(phrasesDir);
  const phrases: Phrase[] = [];

  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    const category = file.replace(".md", "");
    const content = await readFile(join(phrasesDir, file), "utf-8");
    const rows = parseMarkdownTable(content);

for (const row of rows) {
    const tokens = tokenizePhrase(row.jyutping);

    phrases.push({
      jyutping: row.jyutping,
      cantonese: row.cantonese,
      english: row.english,
      notes: row.notes,
      category,
      tokens,
    });
  }
  }

  return phrases;
}

function getWordId(word: Word): string {
  return `word-${word.category}-${slugify(word.cantonese)}-${slugify(
    word.english
  )}`;
}

function getPhraseId(phrase: Phrase): string {
  return `phrase-${phrase.category}-${slugify(phrase.cantonese)}-${slugify(
    phrase.english
  )}`;
}

function computeWordUsage(
  words: Word[],
  phrases: Phrase[]
): Record<string, number> {
  const usage: Record<string, number> = {};

  // Initialize all words with 0
  for (const word of words) {
    usage[getWordId(word)] = 0;
  }

  // Count usage in phrases
  for (const phrase of phrases) {
    for (const token of phrase.tokens) {
      // Find matching word by cantonese text
      const matchingWord = words.find((w) => w.cantonese === token);
      if (matchingWord) {
        usage[getWordId(matchingWord)]++;
      }
    }
  }

  return usage;
}

async function main() {
  console.log("Building content JSON from markdown...");

  // Load data
  const words = await loadWords();
  const phrases = await loadPhrases();
  const wordUsage = computeWordUsage(words, phrases);

  console.log(`Loaded ${words.length} words from ${wordsDir}`);
  console.log(`Loaded ${phrases.length} phrases from ${phrasesDir}`);

  // Ensure output directory exists
  await mkdir(outputDir, { recursive: true });

  // Write JSON files
  await writeFile(
    join(outputDir, "words.json"),
    JSON.stringify(words, null, 2),
    "utf-8"
  );

  await writeFile(
    join(outputDir, "phrases.json"),
    JSON.stringify(phrases, null, 2),
    "utf-8"
  );

  await writeFile(
    join(outputDir, "wordUsage.json"),
    JSON.stringify(wordUsage, null, 2),
    "utf-8"
  );

  console.log(`✅ Generated content JSON in ${outputDir}`);
  console.log(`   - words.json (${words.length} entries)`);
  console.log(`   - phrases.json (${phrases.length} entries)`);
  console.log(`   - wordUsage.json`);
}

main().catch(console.error);
