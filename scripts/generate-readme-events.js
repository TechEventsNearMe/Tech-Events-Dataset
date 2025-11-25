// scripts/generate-readme-events.js
const fs = require("fs");
const path = require("path");

const eventsDir = "./data/events";
const events = [];

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

// Build markdown section
let markdown = `**Total Tech Events: ${totalEvents}**\n\n`;

markdown += `| Event | City | Country | Continent | Website / Relevant link |
|-------|------|---------|-----------|--------------------------|
`;

events.forEach((ev) => {
  markdown += `| ${ev.name} | ${ev.city} | ${ev.country} | ${ev.continent} | [Link](${ev.website}) |\n`;
});

// Read README
let readme = fs.readFileSync("README.md", "utf8");

// Replace between markers
const start = "<!-- EVENTS-LIST:START -->";
const end = "<!-- EVENTS-LIST:END -->";

const before = readme.substring(0, readme.indexOf(start) + start.length);
const after = readme.substring(readme.indexOf(end));

const newReadme = `${before}\n${markdown}\n${after}`;

fs.writeFileSync("README.md", newReadme);

console.log(`README updated with ${totalEvents} events ✔`);
