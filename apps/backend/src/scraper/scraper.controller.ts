<<<<<<< HEAD
import { Controller, Post, Get } from '@nestjs/common';
import { ScraperService } from './scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Get('available')
  getAvailableScrapers() {
    return {
      scrapers: [
        {
          name: 'SwissMilk Farms',
          endpoint: '/scraper/farms',
          description:
            'Scrape farm direct sales locations from SwissMilk website',
          category: 'Farm',
        },
      ],
    };
  }

  @Post('farms')
  async scrapeFarms() {
    return await this.scraperService.scrapeFarms();
  }
}
=======
// import { Controller, Post, Get } from '@nestjs/common';
// import { ScraperService } from './scraper.service';

// @Controller('scraper')
// export class ScraperController {
//   constructor(private readonly scraperService: ScraperService) {}

//   @Get('available')
//   getAvailableScrapers() {
//     return {
//       scrapers: [
//         {
//           name: 'SwissMilk Farms',
//           endpoint: '/scraper/farms',
//           description:
//             'Scrape farm direct sales locations from SwissMilk website',
//           category: 'Farm',
//         },
//         {
//           name: 'Illustre Farms',
//           endpoint: '/scraper/illustre-farms',
//           description: 'Scrape 90 vaud farms from Illustre magazine',
//           category: 'Farm',
//         },
//       ],
//     };
//   }

//   @Post('illustre-farms')
//   async scrapeIllustreFarms() {
//     return await this.scraperService.scrapeIllustreFarms();
//   }

//   @Post('farms')
//   async scrapeFarms() {
//     return await this.scraperService.scrapeFarms();
//   }
// }
>>>>>>> 083c5b8 (Initial monorepo with Nx, Expo, NestJS, Prisma setup)
