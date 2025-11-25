// scripts/generate-readme-events.js
const fs = require("fs");
const path = require("path");

const eventsDir = "./data/events";
const events = [];

// Load event files
const files = fs.readdirSync(eventsDir).filter((f) => f.endsWith(".json"));

files.forEach((file) => {
  const fullPath = path.join(eventsDir, file);
  const data = JSON.parse(fs.readFileSync(fullPath, "utf8"));
  events.push(data);
});

// Sort alphabetically
events.sort((a, b) => a.name.localeCompare(b.name));

// Count total events
const totalEvents = events.length;

// Build markdown table
let markdown = `**Total Tech Events: ${totalEvents}**\n\n`;

markdown += `| Event | City | Country | Continent | Website |
|-------|------|---------|-----------|---------|
`;

events.forEach((ev) => {
  markdown += `| ${ev.name} | ${ev.city} | ${ev.country} | ${ev.continent} | [Link](${ev.website}) |\n`;
});

// Read README
let readme = fs.readFileSync("README.md", "utf8");

// Marker tags
const start = "<!-- EVENTS-LIST:START -->";
const end = "<!-- EVENTS-LIST:END -->";

// Ensure markers exist
const startIndex = readme.indexOf(start);
const endIndex = readme.indexOf(end);

if (startIndex === -1 || endIndex === -1) {
  console.error("❌ ERROR: README markers not found.");
  process.exit(1);
}

// Split README around markers properly
const before = readme.substring(0, startIndex + start.length);
const after = readme.substring(endIndex + end.length);

// Build final README content
const newReadme = `${before}\n${markdown}\n${after}`;

// Write back to README.md
fs.writeFileSync("README.md", newReadme);

console.log(`README updated with ${totalEvents} events ✔`);
