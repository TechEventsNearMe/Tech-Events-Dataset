# Tech Events (Open Dataset)

An community-maintained dataset of tech events around the world:
conferences, summits, meetups, festivals – across sectors like AI, Web, DevOps, Cloud, Security, Crypto, Product, Design, and more.

All data lives in JSON. No backend. Anyone can contribute via Pull Requests.

## 📅 Events List

<!-- EVENTS-LIST:START -->
**Total Tech Events: 15**

| Event | City | Country | Continent | Website |
|-------|------|---------|-----------|---------|
| Africa Tech Summit Kigali | Kigali | Rwanda | Africa | [Link](https://www.africatechsummit.com/kigali/) |
| Build With React Native Manchester | Manchester | United Kingdom | Europe | [Link](https://buildwithreactnative.com/manchester) |
| GDG Abuja | Abuja | Nigeria | Africa | [Link](https://gdg.community.dev/gdg-abuja) |
| GDG DevFest Lagos | Lagos | Nigeria | Africa | [Link](https://gdglagos.com) |
| JSConf India | Bengaluru | India | Asia | [Link](https://jsconf.in) |
| KubeCon + CloudNativeCon | Atlanta | United States | North America | [Link](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/) |
| LiverpoolJS | Liverpool | United Kingdom | Europe | [Link](https://www.meetup.com/liverpooljs) |
| Microsoft Build | Seattle | United States | North America | [Link](https://build.microsoft.com) |
| NDC Sydney | Sydney | Australia | Oceania | [Link](https://ndcsydney.com) |
| NodeConf Argentina | Buenos Aires | Argentina | South America | [Link](https://nodeconf.com.ar) |
| NVIDIA GTC | San Jose | United States | North America | [Link](https://www.nvidia.com/gtc/) |
| React Advanced London | London | United Kingdom | Europe | [Link](https://reactadvanced.com) |
| React India | Goa | India | Asia | [Link](https://www.reactindia.io) |
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
