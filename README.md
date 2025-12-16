# Last - Full Stack Monorepo

A modern full-stack application built with NestJS backend, Expo mobile app, and shared packages.

## 📁 Project Structure

```
.
├── backend/          # NestJS REST API
├── mobile/           # Expo/React Native mobile app
└── packages/
    ├── database/     # Prisma database schema and services
    └── shared/       # Shared types, DTOs, and enums
```

## 🚀 Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe development
- **Prisma** - Database ORM

### Mobile
- **Expo** - React Native framework
- **React Native** - Cross-platform mobile development
- **NativeWind** - Tailwind CSS for React Native
- **TypeScript** - Type-safe development

### Shared Packages
- **Prisma** - Database schema and generated client
- **Shared Types** - Common TypeScript types and DTOs

## 📦 Prerequisites

- Node.js (v18 or higher)
- npm or yarn or pnpm
- Expo CLI (for mobile development)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd last
```

2. Install dependencies for all packages:

```bash
# Install backend dependencies
cd backend
npm install

# Install mobile dependencies
cd ../mobile
npm install

# Install database package dependencies
cd ../packages/database
npm install

cd ../..
```

## 🏃 Running the Project

### Backend

```bash
cd backend
npm run start:dev
```

The API will be available at `http://localhost:3000`

### Mobile App

```bash
cd mobile
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app for physical device

### Database

```bash
cd packages/database

# Generate Prisma client
npx prisma generate

# Run migrations (development)
npx prisma migrate dev

# Open Prisma Studio
npx prisma studio
```

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 Environment Variables

Create `.env` files in the respective directories:

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
PORT=3000
```

### Database (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

## 🏗️ Build

### Backend
```bash
cd backend
npm run build
```

### Mobile
```bash
cd mobile
npm run build
```

## 📱 Mobile App Structure

- `app/` - Expo Router pages and screens
- `components/` - Reusable React components
- `constants/` - App constants and theme
- `hooks/` - Custom React hooks
- `assets/` - Images and other static assets

## 🗄️ Database Structure

The database package contains:
- Prisma schema definitions
- Generated Prisma client
- Database modules and services for NestJS
- Database-related utilities

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [NestJS Documentation](https://docs.nestjs.com/)
- [Expo Documentation](https://docs.expo.dev/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [React Native Documentation](https://reactnative.dev/)

## 👥 Authors

Your Name - Initial work

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- Expo team for simplifying mobile development
- Prisma team for the excellent ORM
