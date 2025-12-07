<<<<<<< HEAD
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
=======
# Nx Monorepo - Expo & NestJS

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

Bu proje, Expo (React Native) mobil uygulaması ve NestJS backend API'sini içeren bir Nx monorepo'sudur.

## Proje Yapısı

- `apps/mobile` - Expo React Native mobil uygulaması
- `apps/backend` - NestJS backend API
- `libs/` - Paylaşılan kütüphaneler

## Geliştirme

### Mobil Uygulamayı Çalıştırma

```sh
npx nx serve mobile
```

### API'yi Çalıştırma

```sh
npx nx serve backend
```

### Production Build

Mobil uygulama için:
```sh
npx nx build mobile
```

API için:
```sh
npx nx build backend
```

### Test Çalıştırma

```sh
npx nx test mobile
npx nx test backend
```

### Tüm Projeleri Görüntüleme

```sh
npx nx show projects
```

### Proje Detaylarını Görüntüleme

```sh
npx nx show project mobile
npx nx show project backend
```

## Yeni Proje Ekleme

### Yeni Uygulama Oluşturma

Expo uygulaması:
```sh
npx nx g @nx/expo:app yeni-uygulama
```

NestJS API:
```sh
npx nx g @nx/nest:application yeni-api
```

### Yeni Kütüphane Oluşturma

React kütüphanesi:
```sh
npx nx g @nx/react:lib paylasilmis-lib
```

TypeScript kütüphanesi:
```sh
npx nx g @nx/js:lib util-lib
```

### Plugin'leri Görüntüleme

```sh
npx nx list
```

Belirli bir plugin hakkında detay:
```sh
npx nx list @nx/expo
npx nx list @nx/nest
```

## Faydalı Komutlar

### Bağımlılık Grafiğini Görüntüleme

```sh
npx nx graph
```

### Etkilenen Projeleri Test Etme

```sh
npx nx affected -t test
```

### Cache'i Temizleme

```sh
npx nx reset
```

## Daha Fazla Bilgi

- [Nx Dokümantasyonu](https://nx.dev)
- [Expo Dokümantasyonu](https://docs.expo.dev)
- [NestJS Dokümantasyonu](https://docs.nestjs.com)
Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/nx-api/expo?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:
- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
>>>>>>> 083c5b8 (Initial monorepo with Nx, Expo, NestJS, Prisma setup)
