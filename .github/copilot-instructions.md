# Nx Monorepo with Expo and NestJS

This is an Nx monorepo containing:

- Expo React Native mobile application
- NestJS backend API
- Shared libraries for code reuse

## Project Structure

- `apps/mobile` - Expo React Native app
- `apps/backend` - NestJS backend API
- `libs/` - Shared libraries

## Development

Run mobile app: `nx serve mobile`
Run API: `nx serve api`
Run tests: `nx test <project-name>`
Build: `nx build <project-name>`
