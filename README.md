# Tech Events (Open Dataset)

An community-maintained dataset of tech events around the world:
conferences, summits, meetups, festivals – across sectors like AI, Web, DevOps, Cloud, Security, Crypto, Product, Design, and more.

All data lives in JSON. No backend. Anyone can contribute via Pull Requests.

## 📅 Events List

<!-- EVENTS-LIST:START -->
**Total Tech Events: 6**

| Event | City | Country | Continent | Website |
|-------|------|---------|-----------|---------|
| Build With React Native Manchester | Manchester | United Kingdom | Europe | [Link](https://buildwithreactnative.com/manchester) |
| GDG Abuja | Abuja | Nigeria | Africa | [Link](https://gdg.community.dev/gdg-abuja) |
| GDG DevFest Lagos | Lagos | Nigeria | Africa | [Link](https://gdglagos.com) |
| React Advanced London | London | United Kingdom | Europe | [Link](https://reactadvanced.com) |
| React Native Nigeria Conference | Lagos | Nigeria | Africa | [Link](https://reactnativenigeria.com) |
| WeAreDevelopers World Congress | Berlin | Germany | Europe | [Link](https://www.wearedevelopers.com/world-congress) |

<!-- EVENTS-LIST:END -->




## Structure

- `data/events/` – one JSON file per event (**source of truth**)
- `data/events.json` – auto-generated combined list of all events
- `data/sectors.json` – canonical list of allowed sectors
- `schema/events.schema.json` – JSON Schema used for validation

## How to add an event

Read our [Contribution guide](https://github.com/TechEventsNearMe/TENM/blob/main/CONTRIBUTING.md) to learn how to add an event to the dataset.

Note: GitHub Actions will validate your file against the schema. If everything is valid, a maintainer will review and merge your PR.
