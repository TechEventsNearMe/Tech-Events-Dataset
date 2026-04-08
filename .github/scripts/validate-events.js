const fs = require("fs");
const path = require("path");

const urls = [];
const errors = [];

// Get all event files from the repo
function getAllEventFiles() {
  const eventsDir = "data/events"; // Adjust path based on your repo structure
  const files = [];

  function walkDir(dir) {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir);
    items.forEach((item) => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (item.endsWith(".json")) {
        files.push(fullPath);
      }
    });
  }

  walkDir(eventsDir);
  return files;
}

// Load existing events to check for duplicates
function loadExistingEvents() {
  const events = {};
  const files = getAllEventFiles();

  files.forEach((file) => {
    try {
      const content = JSON.parse(fs.readFileSync(file, "utf8"));
      if (content.website) {
        if (events[content.website]) {
          events[content.website].files.push(file);
        } else {
          events[content.website] = {
            name: content.name,
            files: [file]
          };
        }
      }
    } catch (err) {
      console.log(`Warning: Could not parse ${file}`);
    }
  });

  return events;
}

// Extract all URLs from an event object
function extractEventUrls(event, fileName) {
  const urlFields = [
    "website",
    "organizer.website",
    "organizer.twitter",
    "socials.twitter",
    "socials.linkedin",
    "socials.youtube",
    "socials.instagram"
  ];

  const eventUrls = [];

  for (const field of urlFields) {
    const value = getNestedValue(event, field);

    if (value) {
      eventUrls.push({ field, url: value });
    }
  }

  return eventUrls;
}

// Helper to get nested object values
function getNestedValue(obj, path) {
  return path.split(".").reduce((current, prop) => current?.[prop], obj);
}

// Main function to extract URLs
async function extractNewEventUrls() {
  // Read changed files
  const changedFiles = fs
    .readFileSync("changed_files.txt", "utf8")
    .split("\n")
    .filter((f) => f.endsWith(".json"));

  if (changedFiles.length === 0) {
    console.log("No JSON files changed");
    return;
  }

  // Load existing events
  const existingEvents = loadExistingEvents();

  // Extract URLs from each new/modified event
  for (const file of changedFiles) {
    if (!fs.existsSync(file)) continue;

    let event;
    try {
      event = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (err) {
      errors.push(
        `❌ **${file}**: Invalid JSON format\n\`\`\`\n${err.message}\n\`\`\``
      );
      continue;
    }

    // Check 1: Validate required fields
    const requiredFields = ["name", "website", "country", "city"];
    for (const field of requiredFields) {
      if (!event[field]) {
        errors.push(`❌ **${file}**: Missing required field: \`${field}\``);
      }
    }

    // Check 2: Duplicate website check
  if (event.website && existingEvents[event.website]) {
  const existing = existingEvents[event.website];
  const otherFiles = existing.files.filter((f) => f !== file);
  if (otherFiles.length > 0) {
    errors.push(
      `❌ **${file}**: Event website \`${event.website}\` already exists in:\n   - ${otherFiles.join("\n   - ")}`
    );
  }
}
console.log(`✓ ${file} - No duplicate website`);

    // Extract all URLs
    console.log(`\nExtracting URLs from ${file}...`);
    const eventUrls = extractEventUrls(event, file);
    
    if (eventUrls.length > 0) {
      urls.push({
        file,
        eventName: event.name,
        urls: eventUrls
      });
    }

    console.log(`✓ ${file} - Extracted ${eventUrls.length} URLs`);
  }

  // Write errors and URLs to files for PR comment
  let commentBody = "";

  if (errors.length > 0) {
    commentBody += `### ❌ Validation Errors Found\n\n${errors.join('\n\n')}\n\n---\n\n`;
  }

  if (urls.length > 0) {
    commentBody += `### 🔗 Extracted URLs\n\n`;
    
    urls.forEach(item => {
      commentBody += `#### ${item.eventName} (\`${item.file}\`)\n\n`;
      item.urls.forEach(urlItem => {
        commentBody += `- **${urlItem.field}**: ${urlItem.url}\n`;
      });
      commentBody += `\n`;
    });
  }

  if (commentBody) {
    fs.writeFileSync('pr-comment.txt', commentBody);
  }

  if (errors.length > 0) {
    process.exit(1);
  }
}

// Run extraction
extractNewEventUrls().catch(err => {
  console.error('Extraction script error:', err);
  process.exit(1);
});