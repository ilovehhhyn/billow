# Still Days / Billow

A personal 30-day reset, daily planner, focus notebook, and guided journal.

## Website

https://ilovehhhyn.github.io/billow/

GitHub Actions tests the app and publishes the contents of `dist/` to GitHub Pages on each push to `main`.

## Run locally

1. Install Node.js 22 and run `npm ci`.
2. Run `npm test`.
3. Run `python3 -m http.server 8000 --directory dist` and open http://localhost:8000.

## Features and data

- Drag and resize calendar blocks, guided morning/evening journals, 30-day tracking, and sourced focus tips.
- “Shape my day” and feedback use deterministic browser-side rules, not an LLM. No API key or backend is required.
- Voice input uses the browser's SpeechRecognition API where supported. Browser or provider permissions and network availability apply; typing remains available.
- Journal and planner data are saved in localStorage on the current browser and origin. They are not committed to this repository or synced to a server.
- To move existing entries from the original Still Days site, export a backup in Settings there, then import it in Settings on this site. Keep your backup private.
- The GitHub Pages site and this repository are public; the original hosted site's access settings are separate.

## Code and assets

`dist/` contains the complete browser app and bundled assets; no build step is needed. `checks/` contains automated tests. `.openai/hosting.json` preserves the original Sites deployment identity and is unused by GitHub Pages.

Third-party notices and licenses are in `dist/vendor/`. The React Bits-inspired animation is adapted into vanilla JavaScript; this app does not require React.
