# Scraper Security Setup

## 🔒 Private Scraper Files

For security reasons, the following files are **NOT** included in git:

### Scrapers
- `apps/backend/src/scraper/scrapers/*.ts` - Site-specific scraper implementations
- `apps/backend/src/scraper/factories/*.ts` - Scraper factory patterns

### Seed Data
- `prisma/seed.ts` - Database seed with scraper configurations
- `prisma/seed-scraper-configs.sql` - SQL seed file

## 📝 Local Setup Instructions

1. **Create your scrapers** in `apps/backend/src/scraper/scrapers/`
   ```typescript
   // Example: culture-vevey.scraper.ts
   import { Injectable } from '@nestjs/common';
   import { IEventScraper, EventData } from '../interfaces/scraper.interface';
   
   @Injectable()
   export class CultureVeveyScraper implements IEventScraper {
     getType(): string {
       return 'CULTURE_VEVEY';
     }
     
     async scrapeEvents(html: string, url: string): Promise<EventData[]> {
       // Your private scraping logic here
     }
   }
   ```

2. **Create scraper factory** in `apps/backend/src/scraper/factories/`
   ```typescript
   // scraper.factory.ts
   import { Injectable } from '@nestjs/common';
   import { CultureVeveyScraper } from '../scrapers/culture-vevey.scraper';
   
   @Injectable()
   export class ScraperFactory {
     constructor(
       private readonly cultureVeveyScraper: CultureVeveyScraper,
     ) {
       this.registerScrapers();
     }
     // ... factory logic
   }
   ```

3. **Create seed file** in `prisma/seed.ts`
   ```typescript
   import { PrismaClient } from '@prisma/client';
   
   const prisma = new PrismaClient();
   
   async function main() {
     await prisma.scraperConfig.upsert({
       where: { url: 'https://your-site.com' },
       update: { /* config */ },
       create: {
         id: 'your-scraper',
         url: 'https://your-site.com',
         name: 'Your Site',
         typeName: 'Your Type',
         typeCode: 'YOUR_CODE',
         isActive: true,
         selectors: {
           eventCard: '.your-selector',
           // ... your selectors
         },
       },
   });
   }
   
   main()
     .catch((e) => {
       console.error(e);
       process.exit(1);
     })
     .finally(async () => {
       await prisma.$disconnect();
     });
   ```

4. **Run seed**
   ```bash
   npm run prisma:seed
   ```

## 🔑 Environment Variables

Store sensitive URLs and keys in `.env` (already gitignored):
```env
SCRAPER_TARGET_URL=https://your-secret-site.com
SCRAPER_API_KEY=your-secret-key
```

## 📤 Deployment

For production:
1. Store scraper files securely (private repo, encrypted storage)
2. Deploy scrapers separately from public code
3. Use environment variables for all sensitive data
4. Consider using Azure Key Vault for secrets

## 🤝 Team Collaboration

For team members:
1. Share scraper files through secure channels (encrypted zip, private repo)
2. Use different scraper configs per environment (dev/staging/prod)
3. Document scraper logic in team wiki (not in code)
