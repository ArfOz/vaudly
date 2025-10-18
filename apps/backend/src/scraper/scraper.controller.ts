import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { PrismaService } from '../prisma/prisma.service';

class ScrapeDto {
  url?: string;
  urls?: string[];
}

@Controller('scrape')
export class ScraperController {
  constructor(
    private readonly scraper: ScraperService,
    private readonly prisma: PrismaService
  ) {}

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

  /**
   * GET /api/scrape/configs - Tüm scraper config'leri listele
   */
  @Get('configs')
  async getConfigs() {
    return this.prisma.scraperConfig.findMany({
      select: {
        id: true,
        url: true,
        name: true,
        typeName: true,
        typeCode: true,
        isActive: true,
        lastScraped: true,
        // selectors'ı gizle (güvenlik için)
      },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * GET /api/scrape/configs/:id - Belirli bir config'i getir
   */
  @Get('configs/:id')
  async getConfig(@Param('id') id: string) {
    const config = await this.prisma.scraperConfig.findUnique({
      where: { id },
      select: {
        id: true,
        url: true,
        name: true,
        typeName: true,
        typeCode: true,
        isActive: true,
        lastScraped: true,
        selectors: true, // Admin için selectors göster
      },
    });

    if (!config) {
      throw new BadRequestException(`Config with id ${id} not found`);
    }

    return config;
  }
}
