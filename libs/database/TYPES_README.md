# Shared Types Package

This package can be published separately and used in your React Native app.

## Installation in React Native

1. Copy the types file to your React Native project:
   ```bash
   cp libs/database/src/activites/types/activity-response.types.ts mobile-app/src/types/
   ```

OR

2. Publish as npm package and install:
   ```bash
   # In this repo
   cd libs/database
   npm publish
   
   # In React Native repo
   npm install @libs/database
   ```

## Usage in React Native

```typescript
import { ActivityResponse, CreateActivityInput } from './types/activity-response.types';

// Fetch activities
const response = await fetch('http://localhost:3000/activities');
const activities: ActivityResponse[] = await response.json();

// Create activity
const newActivity: CreateActivityInput = {
  name: 'New Event',
  description: 'Event description',
  address: 'Rue de Lausanne 1',
  city: 'Lausanne',
  latitude: 46.5197,
  longitude: 6.6323,
  startTime: new Date().toISOString(),
};

const response = await fetch('http://localhost:3000/activities', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newActivity),
});
const created: ActivityResponse = await response.json();
```

## Type Definitions

- `ActivityResponse` - Full activity with location
- `LocationResponse` - Location details
- `CreateActivityInput` - Input for creating activity
- `UpdateActivityInput` - Input for updating activity
- `ActivityListResponse` - Array of activities
