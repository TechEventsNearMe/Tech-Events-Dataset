const fs = require("fs");
const path = require("path");
const axios = require("axios");

const TIMEOUT = 5000; // 5 second timeout per URL
const errors = [];

// Helper function to validate URLs
async function isValidUrl(url) {
  if (!url || typeof url !== "string") {
    return false;
  }

  try {
    // Basic URL format check
    const urlObj = new URL(url);

    // Check if it's http or https
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return false;
    }

    // Verify the link is accessible (HEAD request, fallback to GET)
    try {
      await axios.head(url, {
        timeout: TIMEOUT,
        maxRedirects: 5,
        validateStatus: (status) => status < 400 // Accept 2xx and 3xx
      });
      return true;
    } catch (err) {
      // If HEAD fails, try GET
      try {
        await axios.get(url, {
          timeout: TIMEOUT,
          maxRedirects: 5,
          validateStatus: (status) => status < 400
        });
        return true;
      } catch {
        return false;
      }
    }
  } catch {
    return false;
  }
}

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

// Validate all URLs in an event object
async function validateEventUrls(event) {
  const urlFields = [
    "website",
    "organizer.website",
     "organizer.twitter",
    "socials.twitter",
    "socials.linkedin",
    "socials.youtube",
    "socials.instagram"
  ];

  const failedUrls = [];

  for (const field of urlFields) {
    const value = getNestedValue(event, field);

    if (value) {
      const isValid = await isValidUrl(value);
      if (!isValid) {
        failedUrls.push({ field, url: value });
      }
    }
  }

  return failedUrls;
}

// Helper to get nested object values
function getNestedValue(obj, path) {
  return path.split(".").reduce((current, prop) => current?.[prop], obj);
}

// Main validation function
async function validateNewEvents() {
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

  // Validate each new/modified event
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
      } else {
        console.log(`✓ ${file} - No duplicate website`);
      }
    } else {
      console.log(`✓ ${file} - No duplicate website`);
    }

    // Check 3: Validate all URLs
    console.log(`\nValidating URLs in ${file}...`);
    const failedUrls = await validateEventUrls(event);
    
    if (failedUrls.length > 0) {
      const urlErrors = failedUrls
        .map(fu => `   - ${fu.field}: \`${fu.url}\``)
        .join('\n');
      errors.push(`❌ **${file}**: Invalid or unreachable URLs\n${urlErrors}`);
    }

    console.log(`✓ ${file} passed validation`);
  }

  // Write errors to file for PR comment
  if (errors.length > 0) {
    const errorMessage = `### ❌ Validation Errors Found\n\n${errors.join('\n\n')}\n\n---\n\n**Please fix the above issues and push a new commit.**`;
    fs.writeFileSync('validation-errors.txt', errorMessage);
    process.exit(1);
  } else {
    console.log('\n✅ All validations passed!');
  }
}

// Run validation
validateNewEvents().catch(err => {
  console.error('Validation script error:', err);
  process.exit(1);
});