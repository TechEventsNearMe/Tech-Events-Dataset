const Ajv = require("ajv");
const fs = require("fs");
const path = require("path");

const ajv = new Ajv({ allErrors: true });

const schema = JSON.parse(fs.readFileSync("./schema/events.schema.json", "utf8"));
const validate = ajv.compile(schema);

const eventsDir = "./data/events";
const files = fs.readdirSync(eventsDir).filter(f => f.endsWith(".json"));

let hasErrors = false;

files.forEach(file => {
  const fullPath = path.join(eventsDir, file);
  const data = JSON.parse(fs.readFileSync(fullPath, "utf8"));

  const valid = validate(data);

  if (!valid) {
    console.error(`❌ Validation failed for ${file}`);
    console.error(validate.errors);
    hasErrors = true;
  } else {
    console.log(`✅ ${file} is valid`);
  }
});

if (hasErrors) {
  process.exit(1);
} else {
  console.log("All event files are valid ✔");
}
