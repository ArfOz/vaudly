import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ScraperFactory } from './factories/scraper.factory';
import { EventData } from './interfaces/scraper.interface';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly scraperFactory: ScraperFactory
  ) {}

  /**
   * Scrape a single URL using the appropriate scraper
   */
  async scrape(url: string, typeCode?: string): Promise<EventData[]> {
    this.logger.log(`🔍 Scraping started for: ${url}`);

    try {
      // Fetch HTML
      const { data: html } = await axios.get(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });

      // Get the appropriate scraper
      const scraper = typeCode
        ? this.scraperFactory.getScraper(typeCode)
        : this.scraperFactory.getScraperByUrl(url);

      this.logger.log(`Using scraper: ${scraper.getType()}`);

      // Extract events using the specific scraper
      const events = await scraper.scrapeEvents(html, url);

      // Save events to database
      await this.saveEvents(events);

      return events;
    } catch (error) {
      this.logger.error(`🔥 Failed to scrape ${url}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Scrape all active configured URLs
   */
  async scrapeAll(): Promise<EventData[]> {
    this.logger.log('🔍 Starting batch scrape for all active URLs');

    const configs = await this.prisma.scraperConfig.findMany({
      where: { isActive: true },
    });

    this.logger.log(`Found ${configs.length} active scraper configs`);

    const allEvents: EventData[] = [];
    for (const config of configs) {
      try {
        const events = await this.scrape(config.url, config.typeCode);
        allEvents.push(...events);

        // Update last scraped timestamp
        await this.prisma.scraperConfig.update({
          where: { id: config.id },
          data: { lastScraped: new Date() },
        });
      } catch (error) {
        this.logger.error(`Failed to scrape ${config.url}: ${error.message}`);
      }
    }

    this.logger.log(
      `✅ Batch scrape completed. Total events: ${allEvents.length}`
    );
    return allEvents;
  }

  /**
   * Add a new scraper configuration
   */
  async addScraperConfig(
    url: string,
    name: string,
    typeName: string,
    typeCode: string,
    selectors?: Prisma.InputJsonValue
  ) {
    return this.prisma.scraperConfig.create({
      data: {
        url,
        name,
        typeName,
        typeCode,
        selectors: selectors || null,
      },
    });
  }

  /**
   * Get all scraper configurations
   */
  async getScraperConfigs() {
    return this.prisma.scraperConfig.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Update scraper configuration
   */
  async updateScraperConfig(
    id: string,
    data: {
      name?: string;
      typeName?: string;
      typeCode?: string;
      isActive?: boolean;
      selectors?: Prisma.InputJsonValue;
    }
  ) {
    return this.prisma.scraperConfig.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete scraper configuration
   */
  async deleteScraperConfig(id: string) {
    return this.prisma.scraperConfig.delete({
      where: { id },
    });
  }

  /**
   * Save events to database with location deduplication
   */
  private async saveEvents(events: EventData[]): Promise<void> {
    for (const event of events) {
      try {
        let locationRelation:
          | Prisma.ActivityCreateInput['location']
          | Prisma.ActivityUpdateInput['location'];

        if (event.address) {
          // Find or create location
          let loc = await this.prisma.location.findFirst({
            where: { address: event.address },
          });

          if (!loc) {
            try {
              loc = await this.prisma.location.create({
                data: {
                  name: event.address || 'Default Location',
                  address: event.address,
                  latitude: event.latitude,
                  longitude: event.longitude,
                },
              });
            } catch (err) {
              // Handle P2002 race condition
              if (
                err instanceof Prisma.PrismaClientKnownRequestError &&
                err.code === 'P2002'
              ) {
                loc = await this.prisma.location.findFirst({
                  where: { address: event.address },
                });
              } else {
                throw err;
              }
            }
          } else {
            // Update coordinates if changed
            const needUpdate =
              (event.latitude != null && loc.latitude !== event.latitude) ||
              (event.longitude != null && loc.longitude !== event.longitude);
            if (needUpdate) {
              await this.prisma.location.update({
                where: { id: loc.id },
                data: {
                  ...(event.latitude != null
                    ? { latitude: event.latitude }
                    : {}),
                  ...(event.longitude != null
                    ? { longitude: event.longitude }
                    : {}),
                },
              });
            }
          }

          if (!loc) {
            const created = await this.prisma.location.create({
              data: {
                name: event.address || 'Default Location',
                address: event.address,
              },
            });
            locationRelation = { connect: { id: created.id } };
          } else {
            locationRelation = { connect: { id: loc.id } };
          }
        } else {
          locationRelation = { create: { name: 'Default Location' } };
        }

        await this.prisma.activity.upsert({
          where: { name: event.title },
          update: {
            description: event.description,
            category: event.category,
            date: event.date,
            price: event.price,
            startTime: event.startTime ? new Date(event.startTime) : null,
            endTime: event.endTime ? new Date(event.endTime) : null,
            location: locationRelation,
          },
          create: {
            name: event.title,
            description: event.description,
            category: event.category,
            date: event.date,
            price: event.price,
            startTime: event.startTime ? new Date(event.startTime) : null,
            endTime: event.endTime ? new Date(event.endTime) : null,
            location: locationRelation,
          },
        });

        this.logger.log(`💾 Saved event: ${event.title}`);
      } catch (error) {
        this.logger.error(
          `❌ Failed to save event: ${event.title}`,
          error?.message || error
        );
      }
    }
  }
}
