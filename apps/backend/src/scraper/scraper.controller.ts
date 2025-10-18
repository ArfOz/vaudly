import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ScraperService } from './scraper.service';

class ScrapeDto {
  url?: string;
  urls?: string[];
}

@Controller('scrape')
export class ScraperController {
  constructor(private readonly scraper: ScraperService) {}

  @Post()
  async scrape(@Body() body: ScrapeDto) {
    if (Array.isArray(body.urls) && body.urls.length > 0) {
      return this.scraper.scrapeMany(body.urls);
    }

    if (typeof body.url === 'string' && body.url.length > 0) {
      return this.scraper.scrape(body.url);
    }

    throw new BadRequestException(
      'Provide either "url" or non-empty "urls" array in request body'
    );
  }
}
