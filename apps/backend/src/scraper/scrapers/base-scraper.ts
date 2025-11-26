import { Logger } from '@nestjs/common';
import axios from 'axios';
import { ActivitiesDatabaseService } from '../../database/activites';
import { PrismaService } from '../../database/prisma';

export interface ScrapedActivity {
  name: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  city?: string;
  categoryNames?: string[];
}

export interface ScrapeResult {
  success: boolean;
  scraped: number;
  created: number;
  updated: number;
  withCoordinates: number;
  activities: ScrapedActivity[];
}

export abstract class BaseScraper {
  protected readonly logger: Logger;

  constructor(
    protected readonly activitiesDb: ActivitiesDatabaseService,
    protected readonly prisma: PrismaService,
    protected readonly scraperName: string,
  ) {
    this.logger = new Logger(scraperName);
  }

  /**
   * Main scraping method - must be implemented by each scraper
   */
  abstract scrape(): Promise<ScrapeResult>;

  /**
   * Geocode an address using Nominatim
   */
  protected async geocodeAddress(
    address: string,
  ): Promise<{ lat: number; lng: number } | null> {
    try {
      const response = await axios.get(
        'https://nominatim.openstreetmap.org/search',
        {
          params: {
            q: address,
            format: 'json',
            limit: 1,
          },
          headers: {
            'User-Agent': 'VaudlyApp/1.0',
          },
        },
      );

      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        return {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
        };
      }
      return null;
    } catch (error) {
      this.logger.error(`Geocoding error: ${error.message}`);
      return null;
    }
  }

  /**
   * Geocode multiple activities (fallback for missing coordinates)
   */
  protected async geocodeActivities(
    activities: ScrapedActivity[],
  ): Promise<void> {
    const needsGeocoding = activities.filter(
      (a) => !a.latitude || !a.longitude,
    );

    if (needsGeocoding.length === 0) {
      return;
    }

    this.logger.log(`Geocoding ${needsGeocoding.length} activities...`);

    for (const activity of needsGeocoding) {
      if (activity.address && activity.city) {
        try {
          const coords = await this.geocodeAddress(
            `${activity.address}, ${activity.city}, Switzerland`,
          );
          if (coords) {
            activity.latitude = coords.lat;
            activity.longitude = coords.lng;
            this.logger.log(
              `Geocoded ${activity.name}: ${coords.lat}, ${coords.lng}`,
            );
          }
          // Respect Nominatim rate limit (1 req/sec)
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          this.logger.warn(
            `Failed to geocode ${activity.name}: ${error.message}`,
          );
        }
      }
    }
  }

  /**
   * Save scraped activities to database
   */
  protected async saveActivities(
    activities: ScrapedActivity[],
  ): Promise<{ created: number; updated: number }> {
    let created = 0;
    let updated = 0;

    for (const activity of activities) {
      try {
        const existing = await this.prisma.activity.findFirst({
          where: { name: activity.name },
        });

        if (existing) {
          await this.activitiesDb.update(existing.id, {
            description: activity.description,
            categoryNames: activity.categoryNames || [],
            address: activity.address,
            city: activity.city,
            latitude: activity.latitude,
            longitude: activity.longitude,
          });
          updated++;
          this.logger.log(`Updated: ${activity.name}`);
        } else {
          await this.activitiesDb.create({
            name: activity.name,
            description: activity.description,
            categoryNames: activity.categoryNames || [],
            address: activity.address,
            city: activity.city,
            latitude: activity.latitude,
            longitude: activity.longitude,
          });
          created++;
          this.logger.log(`Created: ${activity.name}`);
        }
      } catch (error) {
        this.logger.error(`Failed to save ${activity.name}:`, error.message);
      }
    }

    return { created, updated };
  }
}
