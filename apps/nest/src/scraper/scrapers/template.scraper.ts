import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

import { PrismaService } from '../../database/prisma';
import { BaseScraper, ScrapedActivity, ScrapeResult } from './base-scraper';
import { ActivitiesDatabaseService } from 'src/database/activities';

/**
 * Template scraper - copy this file to create a new scraper
 *
 * Steps to create a new scraper:
 * 1. Copy this file and rename it (e.g., example-site.scraper.ts)
 * 2. Rename the class (e.g., ExampleSiteScraper)
 * 3. Update the URL and logger name in constructor
 * 4. Implement the scrape() method
 * 5. Add specific parsing methods as needed
 * 6. Export in index.ts
 * 7. Register in ScraperService
 * 8. Add endpoint in ScraperController
 */
@Injectable()
export class TemplateScraper extends BaseScraper {
  private readonly url = 'https://example.com';

  constructor(activitiesDb: ActivitiesDatabaseService, prisma: PrismaService) {
    super(activitiesDb, prisma, 'TemplateScraper');
  }

  async scrape(): Promise<ScrapeResult> {
    try {
      this.logger.log('Starting scraping...');

      // 1. Fetch the webpage
      const { data } = await axios.get(this.url);
      const $ = cheerio.load(data);

      // 2. Extract activities (implement your parsing logic)
      const activities = this.parseActivities($);

      // 3. Optional: Extract coordinates from JavaScript or API
      // const coordinatesMap = this.extractCoordinates($);
      // this.enrichWithCoordinates(activities, coordinatesMap);

      // 4. Geocode missing coordinates (optional, uses Nominatim)
      await this.geocodeActivities(activities);

      // 5. Save to database
      const { created, updated } = await this.saveActivities(activities);

      const withCoordinates = activities.filter(
        (a) => a.latitude && a.longitude,
      ).length;

      this.logger.log(
        `Scraping complete: ${created} created, ${updated} updated, ${withCoordinates}/${activities.length} with coordinates`,
      );

      return {
        success: true,
        scraped: activities.length,
        created,
        updated,
        withCoordinates,
        activities,
      };
    } catch (error) {
      this.logger.error('Scraping failed:', error.message);
      throw error;
    }
  }

  /**
   * Parse activities from HTML
   * Implement your custom parsing logic here
   */
  private parseActivities($: cheerio.CheerioAPI): ScrapedActivity[] {
    const activities: ScrapedActivity[] = [];

    // Example: Find all activity containers
    $('.activity-item').each((i, element) => {
      const $item = $(element);

      // Extract data
      const name = $item.find('.name').text().trim();
      const description = $item.find('.description').text().trim();
      const address = $item.find('.address').text().trim();
      const city = $item.find('.city').text().trim();

      // Optional: Extract coordinates if available in HTML
      const lat = parseFloat($item.attr('data-lat') || '');
      const lng = parseFloat($item.attr('data-lng') || '');

      if (name) {
        activities.push({
          name,
          description,
          address,
          city,
          categoryNames: ['YourCategory'], // Set appropriate category
          latitude: !isNaN(lat) ? lat : undefined,
          longitude: !isNaN(lng) ? lng : undefined,
        });
      }
    });

    this.logger.log(`Parsed ${activities.length} activities`);
    return activities;
  }

  /**
   * Optional: Extract coordinates from JavaScript embedded in the page
   */
  private extractCoordinates(
    $: cheerio.CheerioAPI,
  ): Map<string, { lat: number; lng: number }> {
    const coordinatesMap = new Map<string, { lat: number; lng: number }>();

    // Example: Look for coordinates in script tags
    const scripts = $('script').toArray();
    for (const script of scripts) {
      const content = $(script).html() || '';

      // Implement your coordinate extraction logic
      // Example regex pattern (adjust based on your data format):
      // const pattern = /name:"([^"]+)",lat:([\d.]+),lng:([\d.]+)/g;
      // let match;
      // while ((match = pattern.exec(content)) !== null) {
      //   coordinatesMap.set(match[1], {
      //     lat: parseFloat(match[2]),
      //     lng: parseFloat(match[3])
      //   });
      // }
    }

    return coordinatesMap;
  }

  /**
   * Optional: Enrich activities with extracted coordinates
   */
  private enrichWithCoordinates(
    activities: ScrapedActivity[],
    coordinatesMap: Map<string, { lat: number; lng: number }>,
  ): void {
    for (const activity of activities) {
      const coords = coordinatesMap.get(activity.name);
      if (coords && !activity.latitude && !activity.longitude) {
        activity.latitude = coords.lat;
        activity.longitude = coords.lng;
      }
    }
  }
}
