# Contributing

Thanks for helping grow the Global Tech Events dataset 🎉

## Add a new event

1. **Create a new file**

   In `data/events/`, create a file named with a unique slug, `<name-of-event>.json` e.g.:

   - `react-advanced-london.json`
   - `react-native-nigeria.json`
   - `jsconf-budapest.json`

2. **Use the schema**

   Copy the template from `data/template.json` and update
   the fields for your event.

3. **Follow the rules**

   - `sector` must be one or more values from `data/sectors.json`
   - `type` must be `in-person`, `online`, or `hybrid`
   - `frequency` must be `annual`, `biannual`, `quarterly`, or `one-time`
   - `languages` should list languages spoken at the event (e.g. `["English"]`)

4. **Validate**

   If you have Node installed, run:

   ```bash
   npm install
   npm run check
   ```
This will:
- validate each event file against schema/events.schema.json
- rebuild data/events.json

1. **Open a Pull Request**

Describe your changes (which event(s) you added/updated) and submit.

## Editing an existing event

- Update the corresponding file in data/events/

- Run npm run check (optional)

- Open a PR

Do not manually edit `data/events.json` – it is auto-generated.