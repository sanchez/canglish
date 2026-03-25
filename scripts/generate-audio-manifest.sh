#!/bin/bash

# Generate audio manifest for words and phrases
# Usage: ./scripts/generate-audio-manifest.sh

MANIFEST_FILE="app/public/audio/audio-manifest.json"
AUDIO_DIR="app/public/audio"

echo '{"words":{},"phrases":{}}' > "$MANIFEST_FILE"

# Process words
for wav_file in "$AUDIO_DIR/words/"*.wav; do
    if [ -f "$wav_file" ]; then
        basename=$(basename "$wav_file" .wav)
        # Convert filename back to cantonese format (restore spaces)
        # The filename uses hyphens, but cantonese uses spaces
        # We need to look up the actual cantonese from the JSON
        
        # For now, just add with basename
        python3 << EOF
import json

with open('$MANIFEST_FILE', 'r') as f:
    manifest = json.load(f)

cantonese_map = {}
with open('app/content/words.json', 'r') as f:
    words = json.load(f)
    for w in words:
        safe = w['cantonese'].replace(' ', '-')
        cantonese_map[safe] = w['cantonese']

basename = '$basename'
cantonese = cantonese_map.get(basename, basename.replace('-', ' '))
manifest['words'][cantonese] = '/canglish/audio/words/' + basename + '.wav'

with open('$MANIFEST_FILE', 'w') as f:
    json.dump(manifest, f, indent=2)
EOF
    fi
done

# Process phrases
for wav_file in "$AUDIO_DIR/phrases/"*.wav; do
    if [ -f "$wav_file" ]; then
        basename=$(basename "$wav_file" .wav)
        python3 << EOF
import json

with open('$MANIFEST_FILE', 'r') as f:
    manifest = json.load(f)

cantonese_map = {}
with open('app/content/phrases.json', 'r') as f:
    phrases = json.load(f)
    for p in phrases:
        safe = p['cantonese'].replace(' ', '-')
        cantonese_map[safe] = p['cantonese']

basename = '$basename'
cantonese = cantonese_map.get(basename, basename.replace('-', ' '))
manifest['phrases'][cantonese] = '/canglish/audio/phrases/' + basename + '.wav'

with open('$MANIFEST_FILE', 'w') as f:
    json.dump(manifest, f, indent=2)
EOF
    fi
done

echo "Manifest generated: $MANIFEST_FILE"
