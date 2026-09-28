# Project instructions

- Use the `typesafe:typesafe-ai` skill for any feature that needs AI judgment (routing, ranking, extraction, verification). Jev is TypeSafe's model; read live docs at https://docs.typesafe.ai/llms.txt before writing integration code.
- API key: `TYPESAFE_API_KEY` user env var. Never write it to files; keep it server-side in web apps.
- SDKs: Python `typesafe-sdk` (installed globally); JS `@typesafe-ai/sdk` via `bun add` once a JS project exists.
