# Global Tech Events (Open Dataset)

An open, community-maintained dataset of tech events around the world:
conferences, summits, meetups, festivals – across sectors like AI, Web, DevOps,
Cloud, Security, Crypto, Product, Design, and more.

All data lives in JSON. No backend. Anyone can contribute via Pull Requests.

## Structure

- `data/events/` – one JSON file per event (**source of truth**)
- `data/events.json` – auto-generated combined list of all events
- `data/sectors.json` – canonical list of allowed sectors
- `schema/events.schema.json` – JSON Schema used for validation

## How to add an event

1. Fork this repo
2. Create a new file in `data/events/`, e.g. `my-cool-conf-2026.json`
3. Copy the example from `data/events/react-advanced-london.json`
4. Fill in all required fields
5. Run `npm install` and `npm run check` locally (optional but recommended)
6. Open a Pull Request

GitHub Actions will validate your file against the schema.

If everything is valid, a maintainer will review and merge your PR.
