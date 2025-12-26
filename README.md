# Vaudly

Monorepo powered by Turborepo, containing an Expo (React Native) mobile app and a NestJS backend, plus shared packages (TypeScript and Prisma).

## Project Structure

```
vaudly/
├── apps/
│   ├── backend/          # NestJS API server
│   └── mobile/           # Expo React Native mobile app
├── packages/
│   ├── shared/           # Shared TypeScript DTOs/utilities
│   └── database/         # Prisma schema, client, seeds
```

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL
- npm

### Install

```powershell
git clone https://github.com/ArfOz/vaudly.git; cd vaudly
npm install
```

### Environment

Create `.env` files as needed (e.g., backend):

```env
DATABASE_URL="postgresql://username:password@localhost:5432/vaudly?schema=public"
PORT=3000
```

### Database

```powershell
cd packages/database
npx prisma migrate dev
npx prisma generate
```

### Run

```powershell
# Run backend and mobile in parallel
npm run dev

# Backend only
npm run dev:backend

# Mobile only
npm run dev:mobile
```

## Testing

- Use per-app Jest configs (run from each workspace).

## Build

- Use app-specific build scripts; pipelines are defined in `turbo.json`.

## Tech Stack

- NestJS, Prisma, TypeScript, Expo, React Native

## Contributing

PRs welcome. Please run lint and tests per app before submitting.
