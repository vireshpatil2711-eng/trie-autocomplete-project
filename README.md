# Trie Autocomplete

Plain HTML, CSS and JavaScript. No build step.

## Run
Open `index.html` in a browser, or in VS Code install **Live Server** and choose "Open with Live Server".

## Files
- `js/trie.js` Trie class: insert, search, startsWith, collect, wildcardSearch, fuzzySearch, getSubtree (+ self-tests in the console)
- `js/dictionary.js` popular core words plus about 109,000 extra words (one long string); frequencies come from list position / word length
- `js/state.js` shared helpers, dictionary build, localStorage
- `js/sound.js` keystroke tick (off by default)
- `js/search.js` search UI, path strip, ghost text, keyboard shortcuts, tabs
- `js/race.js` Trie vs linear scan
- `js/constellation.js` canvas star map
- `js/aurora.js` reactive background
- `js/fx.js` snow and sparkles
- `js/wordhunt.js` Word Hunt challenge
- `js/main.js` boot (reads ?q= from the URL)

Scripts are classic (not ES modules), so they share globals and the order in `index.html` matters.
