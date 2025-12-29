# Turborepo with Expo and NestJS

This repository uses Turborepo to orchestrate multiple packages/apps:

- Expo React Native mobile application
- NestJS backend API
- Shared libraries for code reuse

## Project Structure

- `apps/mobile` - Expo React Native app
- `apps/backend` - NestJS backend API
- `packages/shared` - Shared TypeScript library
- `packages/database` - Prisma schema, generated client, and seeds

## Development

- Run both apps in parallel: `npm run dev` (executes `turbo run dev --parallel`)
- Run backend only: `npm run dev:backend`
- Run mobile only: `npm run dev:mobile`

## Testing

- Per-app tests: use each app's `jest` config (e.g., run from its workspace)

## Build

- Use app-specific build scripts; Turborepo pipelines are defined in `turbo.json`.
