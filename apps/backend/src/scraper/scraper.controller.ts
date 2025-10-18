import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import { ScraperService } from './scraper.service';

class ScrapeDto {
  url?: string;
  urls?: string[];
}

@Controller('scrape')
export class ScraperController {
  constructor(private readonly scraper: ScraperService) {}

  /**
   * POST /api/scrape - Tek URL scrape et (eski yöntem)
   */
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

  /**
   * POST /api/scrape/all - Tüm aktif config'leri scrape et
   */
  @Post('all')
  async scrapeAll() {
    return this.scraper.scrapeAll();
  }

  /**
   * POST /api/scrape/config/:id - Belirli config'i scrape et
   */
  @Post('config/:id')
  async scrapeConfig(@Param('id') id: string) {
    return this.scraper.scrapeWithConfig(id);
  }
}
