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
- The default planner and schedule feedback use browser-side rules. Optional AI planning parses your must-do answer through a protected Cloudflare Worker using OpenAI; it requires a server-side API key.
- Voice input uses the browser's SpeechRecognition API where supported. Browser or provider permissions and network availability apply; typing remains available.
- Journal and planner data are saved in localStorage on the current browser and origin. They are not committed to this repository or synced to a server.
- To move existing entries from the original Still Days site, export a backup in Settings there, then import it in Settings on this site. Keep your backup private.
- The GitHub Pages site and this repository are public; the original hosted site's access settings are separate.

## Code and assets

`dist/` contains the complete browser app and bundled assets; no build step is needed. `checks/` contains automated tests. `.openai/hosting.json` preserves the original Sites deployment identity and is unused by GitHub Pages.

Third-party notices and licenses are in `dist/vendor/`. The React Bits-inspired animation is adapted into vanilla JavaScript; this app does not require React.

## Connect AI planning

Run `python3 scripts/setup-ai.py` in your own interactive terminal. It signs you into Cloudflare, deploys the backend, and asks for your OpenAI API key with echo disabled. Secrets are uploaded over stdin to Cloudflare's secret store; no key is written to disk or Git.

In the website Settings, enter the deployed Worker URL and the separate private access code printed by the setup. The URL is saved on your device; the access code is kept in sessionStorage and must be entered again in a new browser session. Neither is included in journal backups. Never enter your provider API key in the website.

Only the must-do text, energy, wake/finish time, place, selected date, and fixed commitments are sent when you explicitly click Shape my day. The backend supplies the default rhythm and exact work slots to the model. AI returns prioritized task allocations only: it cannot create, move, resize, or remove schedule blocks. Morning rituals, meals, walks, X, drawing, dinner/friends, night reflection, and fixed commitments are copied unchanged. Only titles and notes inside existing focus/work slots are personalized. Work beyond the available minutes is reported separately, including partial tasks. Routine requests can be acknowledged against existing rest blocks but do not change them. Fear, excitement, evening entries, and other journal content are excluded. Requests use `store: false`; provider processing and retention policies still apply. The app/backend do not deliberately log prompts.

The backend rejects missing access codes, disallowed origins, invalid inputs, allocations outside work slots, overfilled slots, invalid tasks, and changed routine blocks. The frontend also rejects responses that alter the baseline layout. It has a five-request-per-minute Cloudflare rate limit (per Cloudflare location, not a global spending cap). Set API project spending controls in your provider account. AI requests incur provider charges. A failed request leaves the current schedule unchanged and offers the default planner explicitly.

`backend/wrangler.jsonc` defaults to the `gpt-4.1-mini` alias; change `OPENAI_MODEL` if needed. Re-running setup rotates the private access code. To update backend code without rotating secrets: `npx wrangler@4 deploy --config backend/wrangler.jsonc`. Frontend GitHub Actions does not deploy the backend.

Tests mock provider responses. Live-model behavior, Cloudflare login/deployment, microphone recognition, and real API credentials require interactive verification after setup.

The morning prompt “What do I want to do today?” accepts a typed or dictated brain dump. Shape my day previews checkable tasks with duration estimates and priorities. Accept the list alone, or both the list and schedule. Importing tasks preserves manually added items and existing completion checkmarks; exact matching titles update rather than duplicate.
