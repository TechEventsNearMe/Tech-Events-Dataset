const fs = require("fs");
const path = require("path");

const eventsDir = "./data/events";
const output = "./data/events.json";

const files = fs.readdirSync(eventsDir).filter(f => f.endsWith(".json"));

let allEvents = [];

files.forEach(file => {
  const fullPath = path.join(eventsDir, file);
  const data = JSON.parse(fs.readFileSync(fullPath, "utf8"));
  allEvents.push(data);
});

fs.writeFileSync(output, JSON.stringify(allEvents, null, 2));
console.log(`Rebuilt ${output} with ${allEvents.length} events ✔`);
