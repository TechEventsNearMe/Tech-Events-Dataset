// scripts/build-events-json.js
const fs = require("fs");
const path = require("path");
const prettier = require("prettier");

(async () => {
  const eventsDir = "./data/events";
  const output = "./data/events.json";

  const files = fs.readdirSync(eventsDir).filter((f) => f.endsWith(".json"));

  let allEvents = [];

  files.forEach((file) => {
    const fullPath = path.join(eventsDir, file);
    const data = JSON.parse(fs.readFileSync(fullPath, "utf8"));
    allEvents.push(data);
  });

  // Sort alphabetically
  allEvents.sort((a, b) => a.name.localeCompare(b.name));

  // Format with Prettier (must await)
  const formatted = await prettier.format(JSON.stringify(allEvents), {
    parser: "json"
  });

  fs.writeFileSync(output, formatted);
  console.log(`Rebuilt ${output} with ${allEvents.length} events ✔`);
})();
