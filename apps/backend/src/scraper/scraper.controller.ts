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
