// scripts/validate.js
const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const fs = require("fs");
const path = require("path");
const slugify = require("./slugify");

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const schema = JSON.parse(
  fs.readFileSync("./schema/events.schema.json", "utf8")
);
const validateSchema = ajv.compile(schema);

const eventsDir = "./data/events";

// sectors can be either ["AI", "DevOps", ...] or [{ "name": "AI" }, ...]
const sectorsRaw = JSON.parse(
  fs.readFileSync("./data/sectors.json", "utf8")
);
const allowedSectors = Array.isArray(sectorsRaw)
  ? sectorsRaw.map((s) => (typeof s === "string" ? s : s.name))
  : [];

const countryContinent = JSON.parse(
  fs.readFileSync("./data/country-continent.json", "utf8")
);

const validTimezones = Intl.supportedValuesOf("timeZone");

const files = fs.readdirSync(eventsDir).filter((f) => f.endsWith(".json"));

let hasErrors = false;

files.forEach((file) => {
  const fullPath = path.join(eventsDir, file);
  let data;

  try {
    data = JSON.parse(fs.readFileSync(fullPath, "utf8"));
  } catch (e) {
    console.error(`Failed to parse JSON in ${file}: ${e.message}`);
    hasErrors = true;
    return;
  }

  // 1. JSON Schema validation
  const valid = validateSchema(data);
  if (!valid) {
    console.error(`Schema validation failed for ${file}`);
    console.error(validateSchema.errors);
    hasErrors = true;
  }

  // 2. Timezone validation (IANA)
  if (data.timezone && !validTimezones.includes(data.timezone)) {
    console.error(`Invalid timezone in ${file}: ${data.timezone}`);
    hasErrors = true;
  }

  // 3. Sector validation
  if (Array.isArray(data.sector)) {
    data.sector.forEach((sec) => {
      if (!allowedSectors.includes(sec)) {
        console.error(`Invalid sector "${sec}" in ${file}`);
        hasErrors = true;
      }
    });
  }

  // 4. Country ↔ continent validation
  if (data.country && data.continent) {
    const expectedContinent = countryContinent[data.country];
    if (expectedContinent && expectedContinent !== data.continent) {
      console.error(
        `Country/continent mismatch in ${file}: ${data.country} is in ${expectedContinent}, not ${data.continent}`
      );
      hasErrors = true;
    }
  }

  // 5. Filename ↔ slug(name) validation
  if (data.name) {
    const expectedFile = `${slugify(data.name)}.json`;
    if (file !== expectedFile) {
      console.error(
        `Filename mismatch for ${file}. Expected filename: ${expectedFile}`
      );
      hasErrors = true;
    }
  }
});

if (hasErrors) {
  process.exit(1);
} else {
  console.log("All event files are valid ✔");
}
