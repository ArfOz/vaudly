# Turborepo ile Vaudly

Artık Nx ve Turborepo birlikte çalışıyor. Turborepo task orchestration için, Nx build tooling için.

## Komutlar

```bash
# Development - tüm uygulamaları başlat
npm run dev

# Sadece backend
cd apps/backend && npm run dev

# Build - tüm projeleri build et
npm run build

# Prisma işlemleri
npm run prisma:generate
npm run prisma:db-push
npm run prisma:migrate

# Lint & Test
npm run lint
npm run test
```

## Yeni Mobile App Eklemek İçin

```bash
# apps/ klasörüne yeni expo app ekle
cd apps
npx create-expo-app mobile --template blank-typescript

# package.json'a script ekle
cd mobile
# package.json içine:
{
  "scripts": {
    "dev": "expo start",
    "build": "expo export",
    "lint": "expo lint"
  },
  "dependencies": {
    "@libs/database": "*"  // types için
  }
}
```

Turborepo artık hazır, istediğin zaman mobile app ekleyebilirsin!
