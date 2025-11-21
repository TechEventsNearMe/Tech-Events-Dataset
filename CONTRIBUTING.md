# Contributing

Thanks for helping grow the Global Tech Events dataset 🎉

## Add a new event

1. **Create a new file**

   In `data/events/`, create a file named with a unique slug, e.g.:

   - `react-advanced-london.json`
   - `aws-reinvent-las-vegas.json`
   - `jsconf-budapest.json`

2. **Use the schema**

   Copy the structure from `data/events/react-advanced-london.json` and update
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
