#!/bin/bash

# Generate audio files for all words and phrases using espeak-ng
# Usage: ./scripts/generate-audio.sh

AUDIO_DIR="app/public/audio"
WORDS_FILE="app/content/words.json"
PHRASES_FILE="app/content/phrases.json"

mkdir -p "$AUDIO_DIR/words" "$AUDIO_DIR/phrases"

echo "Starting audio generation..."
echo "Voice: Cantonese (yue)"

# Generate word audio files
echo "Generating word audio files..."
WORDS_COUNT=0
SKIPPED=0

while IFS= read -r word_json; do
    cantonese=$(echo "$word_json" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('cantonese',''))" 2>/dev/null)
    
    if [ -z "$cantonese" ]; then
        continue
    fi
    
    # Create a safe filename from cantonese text
    safe_name=$(echo "$cantonese" | tr ' ' '-' | tr -cd 'a-zA-Z0-9-_')
    
    if [ -z "$safe_name" ]; then
        safe_name="word_$WORDS_COUNT"
    fi
    
    output_file="$AUDIO_DIR/words/${safe_name}.wav"
    
    # Skip if already exists
    if [ -f "$output_file" ]; then
        SKIPPED=$((SKIPPED + 1))
        continue
    fi
    
    # Generate audio using espeak-ng with Cantonese voice
    # -s 130: slower speed (130 wpm vs default 175)
    # -p 40: lower pitch for more natural tone
    echo "$cantonese" | espeak-ng -v yue -s 130 -p 40 -w "$output_file" 2>/dev/null
    
    if [ -f "$output_file" ]; then
        WORDS_COUNT=$((WORDS_COUNT + 1))
    fi
    
    # Progress indicator
    if [ $((WORDS_COUNT % 50)) -eq 0 ]; then
        echo "  Generated $WORDS_COUNT word audio files..."
    fi
    
done < <(cat "$WORDS_FILE" | python3 -c "import json,sys; [print(json.dumps(w)) for w in json.load(sys.stdin)]")

echo "Generated $WORDS_COUNT new word audio files (skipped $SKIPPED existing)"

# Generate phrase audio files
echo "Generating phrase audio files..."
PHRASES_COUNT=0
SKIPPED=0

while IFS= read -r phrase_json; do
    cantonese=$(echo "$phrase_json" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('cantonese',''))" 2>/dev/null)
    
    if [ -z "$cantonese" ]; then
        continue
    fi
    
    safe_name=$(echo "$cantonese" | tr ' ' '-' | tr -cd 'a-zA-Z0-9-_')
    
    if [ -z "$safe_name" ]; then
        safe_name="phrase_$PHRASES_COUNT"
    fi
    
    output_file="$AUDIO_DIR/phrases/${safe_name}.wav"
    
    if [ -f "$output_file" ]; then
        SKIPPED=$((SKIPPED + 1))
        continue
    fi
    
    echo "$cantonese" | espeak-ng -v yue -s 130 -p 40 -w "$output_file" 2>/dev/null
    
    if [ -f "$output_file" ]; then
        PHRASES_COUNT=$((PHRASES_COUNT + 1))
    fi
    
    if [ $((PHRASES_COUNT % 20)) -eq 0 ]; then
        echo "  Generated $PHRASES_COUNT phrase audio files..."
    fi
    
done < <(cat "$PHRASES_FILE" | python3 -c "import json,sys; [print(json.dumps(p)) for p in json.load(sys.stdin)]")

echo "Generated $PHRASES_COUNT new phrase audio files (skipped $SKIPPED existing)"
echo "Done! Audio files saved to $AUDIO_DIR"
