<!-- # Scrapers

Bu klasör web scraping yapıları içerir. Her scraper, belirli bir websiteden aktivite verilerini toplar ve veritabanına kaydeder.

## Yapı

```
scrapers/
├── base-scraper.ts          # Tüm scraper'ların extend edeceği base class
├── swissmilk-farm.scraper.ts # SwissMilk çiftlik scraper'ı
├── template.scraper.ts      # Yeni scraper oluşturmak için template
└── index.ts                 # Exports
```

## Mevcut Scraper'lar

### SwissMilkFarmScraper
- **URL**: https://www.swissmilk.ch/fr/durabilite/de-la-ferme/magasins-a-la-ferme-dans-la-region-de-lausanne/
- **Kategori**: Farm
- **Özellikler**:
  - JavaScript'ten koordinat extraction (Unicode decode ile)
  - HTML parsing ile çiftlik bilgileri
  - Fallback geocoding (Nominatim API)
- **Endpoint**: `POST /api/scraper/farms`

## Yeni Scraper Ekleme

### 1. Scraper Class Oluştur

`template.scraper.ts` dosyasını kopyala ve yeniden adlandır:

```bash
cp template.scraper.ts my-site.scraper.ts
```

### 2. Class'ı Güncelle

```typescript
@Injectable()
export class MySiteScraper extends BaseScraper {
  private readonly url = 'https://mysite.com';

  constructor(
    activitiesDb: ActivitiesDatabaseService,
    prisma: PrismaService,
  ) {
    super(activitiesDb, prisma, 'MySiteScraper');
  }

  async scrape(): Promise<ScrapeResult> {
    // Scraping logic burada
  }
}
```

### 3. Export Et

`index.ts` dosyasına ekle:

```typescript
export { MySiteScraper } from './my-site.scraper';
```

### 4. Service'e Kaydet

`scraper.service.ts` içinde:

```typescript
import { MySiteScraper } from './scrapers';

export class ScraperService {
  private readonly mySiteScraper: MySiteScraper;

  constructor(
    private readonly activitiesDb: ActivitiesDatabaseService,
    private readonly prisma: PrismaService,
  ) {
    this.mySiteScraper = new MySiteScraper(activitiesDb, prisma);
  }

  async scrapeMyActivities() {
    return await this.mySiteScraper.scrape();
  }
}
```

### 5. Controller'a Ekle

`scraper.controller.ts` içinde:

```typescript
@Post('my-activities')
async scrapeMyActivities() {
  return await this.scraperService.scrapeMyActivities();
}
```

`getAvailableScrapers()` metoduna da ekle:

```typescript
{
  name: 'My Site Activities',
  endpoint: '/scraper/my-activities',
  description: 'Description of what this scraper does',
  category: 'MyCategory',
}
```

## BaseScraper Metodları

### Protected Methods (Scraper'larda kullanılabilir)

#### `geocodeAddress(address: string)`
Bir adresi geocode eder (Nominatim API kullanarak).

```typescript
const coords = await this.geocodeAddress('Chemin de Chincuz 2, Grandvaux, Switzerland');
// Returns: { lat: 46.5106, lng: 6.7243 } or null
```

#### `geocodeActivities(activities: ScrapedActivity[])`
Koordinatı olmayan tüm aktiviteleri geocode eder.

```typescript
await this.geocodeActivities(activities);
// Otomatik olarak 1 saniye bekler (rate limit)
```

#### `saveActivities(activities: ScrapedActivity[])`
Aktiviteleri veritabanına kaydeder (create veya update).

```typescript
const { created, updated } = await this.saveActivities(activities);
```

#### `logger`
Logging için NestJS Logger instance.

```typescript
this.logger.log('Starting scraping...');
this.logger.warn('Warning message');
this.logger.error('Error message');
```

## Örnekler

### Basit HTML Parsing

```typescript
private parseActivities($: cheerio.CheerioAPI): ScrapedActivity[] {
  const activities: ScrapedActivity[] = [];

  $('.item').each((i, element) => {
    const $item = $(element);
    activities.push({
      name: $item.find('.title').text().trim(),
      address: $item.find('.address').text().trim(),
      city: $item.find('.city').text().trim(),
      categoryNames: ['Restaurant'],
    });
  });

  return activities;
}
```

### JavaScript'ten Koordinat Extraction

```typescript
private extractCoordinates($: cheerio.CheerioAPI): Map<string, {lat: number, lng: number}> {
  const map = new Map();
  
  $('script').each((i, script) => {
    let content = $(script).html() || '';
    
    // Unicode decode gerekiyorsa
    content = content.replace(/\\u([0-9a-fA-F]{4})/g, (match, code) => {
      return String.fromCharCode(parseInt(code, 16));
    });
    
    // Regex pattern ile extraction
    const pattern = /name:"([^"]+)",lat:([\d.]+),lng:([\d.]+)/g;
    let match;
    
    while ((match = pattern.exec(content)) !== null) {
      map.set(match[1], {
        lat: parseFloat(match[2]),
        lng: parseFloat(match[3])
      });
    }
  });
  
  return map;
}
```

### API'den Veri Çekme

```typescript
async scrape(): Promise<ScrapeResult> {
  // JSON API'den veri çek
  const { data } = await axios.get('https://api.example.com/activities');
  
  const activities: ScrapedActivity[] = data.items.map(item => ({
    name: item.title,
    description: item.desc,
    address: item.location.street,
    city: item.location.city,
    latitude: item.location.lat,
    longitude: item.location.lng,
    categoryNames: ['Restaurant'],
  }));
  
  const { created, updated } = await this.saveActivities(activities);
  
  return {
    success: true,
    scraped: activities.length,
    created,
    updated,
    withCoordinates: activities.length,
    activities,
  };
}
```

## Testing

Scraper'ı test etmek için endpoint'e POST request at:

```bash
# PowerShell
Invoke-WebRequest -Uri "http://localhost:3000/api/scraper/farms" -Method POST

# curl
curl -X POST http://localhost:3000/api/scraper/farms
```

Mevcut scraper'ları listele:

```bash
# PowerShell
Invoke-WebRequest -Uri "http://localhost:3000/api/scraper/available"

# curl
curl http://localhost:3000/api/scraper/available
```

## Best Practices

1. **Rate Limiting**: Websitelere karşı nazik ol, request'ler arası bekle
   ```typescript
   await new Promise(resolve => setTimeout(resolve, 1000));
   ```

2. **Error Handling**: Her scraper kendi try-catch'ini handle etmeli
   ```typescript
   try {
     const { data } = await axios.get(url);
   } catch (error) {
     this.logger.error(`Failed to fetch: ${error.message}`);
     throw error;
   }
   ```

3. **Logging**: İlerlemeyi log'la
   ```typescript
   this.logger.log(`Parsed ${activities.length} activities`);
   this.logger.log(`${withCoords} have coordinates`);
   ```

4. **Geocoding**: Önce JavaScript/API'den koordinat almayı dene, sadece gerekirse geocode et

5. **Categories**: Her aktiviteye uygun kategori ata
   ```typescript
   categoryNames: ['Farm', 'DirectSale']
   ```

6. **Validation**: Data'yı kaydetmeden önce validate et
   ```typescript
   if (name && address) {
     activities.push({ name, address, ... });
   }
   ``` -->
