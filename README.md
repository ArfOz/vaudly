# Vaudly

A monorepo project for managing activities in Vaud canton, Switzerland.

## 📦 Project Structure

```
monorepo/
├── apps/
│   ├── backend/          # NestJS API server
│   └── mobile/           # Expo React Native mobile app
├── packages/
│   └── shared/           # Shared Prisma schema and database utilities
```

## 🚀 Getting Started

### Prerequisites

- Node.js v24+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ArfOz/vaudly.git
cd vaudly
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/vaudly?schema=public"
PORT=3000
```

4. Run database migrations:
```bash
cd packages/shared
npx prisma migrate dev
npx prisma generate
```

5. Start the backend server:
```bash
npm run dev:backend
```

The API will be available at `http://localhost:3000/api`

## 🔧 Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **Prisma v7** - Next-generation ORM with PostgreSQL adapter
- **TypeScript** - Type-safe development
- **@nestjs/config** - Configuration management

### Database
- **PostgreSQL** - Primary database
- **Prisma** - Database ORM and migration tool

### Mobile
- **Expo** - React Native framework
- **React Native** - Mobile app development

## 📡 API Endpoints

### Activities
- `GET /api/activities` - List all activities
- `GET /api/activities/:id` - Get activity by ID
- `POST /api/activities` - Create new activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity

## 🗃️ Database Schema

### Activity
- Activity information with location
- Supports start/end times, pricing, categories
- Linked to Location model

### Location
- Location details with coordinates
- Canton-based (VD - Vaud)
- Unique address constraint

### ScraperConfig
- Configuration for web scraping activities
- Supports JSON selectors
- Active/inactive status tracking

## 🛠️ Development

### Backend Development
```bash
npm run dev:backend
```

### Database Operations
```bash
# Create migration
cd packages/shared
npx prisma migrate dev --name your_migration_name

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

### TypeScript Path Mapping
The project uses TypeScript path mappings:
- `@shared` - Points to `packages/shared`
- `@shared/*` - Points to `packages/shared/*`

## 📝 Features

- ✅ NestJS REST API with hot-reload
- ✅ Prisma v7 with adapter-based architecture
- ✅ TypeScript monorepo setup
- ✅ PostgreSQL database with migrations
- ✅ CRUD operations for activities
- ✅ Location management with geolocation
- ✅ Activity scraper configuration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**ArfOz**
- GitHub: [@ArfOz](https://github.com/ArfOz)
