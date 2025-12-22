// import { Injectable } from '@nestjs/common';
// import axios from 'axios';
// import * as cheerio from 'cheerio';
// import { ActivitiesDatabaseService } from '../../database/activites';
// import { PrismaService } from '../../database/prisma';
// import { BaseScraper, ScrapedActivity, ScrapeResult } from './base-scraper';

// @Injectable()
// export class SwissMilkFarmScraper extends BaseScraper {
//   private readonly url =
//     'https://www.swissmilk.ch/fr/durabilite/de-la-ferme/magasins-a-la-ferme-dans-la-region-de-lausanne/';

//   constructor(activitiesDb: ActivitiesDatabaseService, prisma: PrismaService) {
//     super(activitiesDb, prisma, 'SwissMilkFarmScraper');
//   }

//   async scrape(): Promise<ScrapeResult> {
//     try {
//       this.logger.log('Starting SwissMilk farm scraping...');
//       const { data } = await axios.get(this.url);
//       const $ = cheerio.load(data);

//       // Extract coordinates from embedded JavaScript
//       const coordinatesMap = this.extractCoordinatesFromJS($);

//       // Parse farm data from HTML
//       const activities = this.parseFarmData($, coordinatesMap);

//       // Geocode missing coordinates
//       await this.geocodeActivities(activities);

//       // Save to database
//       const { created, updated } = await this.saveActivities(activities);

//       const withCoordinates = activities.filter(
//         (a) => a.latitude && a.longitude,
//       ).length;

//       this.logger.log(
//         `Scraping complete: ${created} created, ${updated} updated, ${withCoordinates}/${activities.length} with coordinates`,
//       );

//       return {
//         success: true,
//         scraped: activities.length,
//         created,
//         updated,
//         withCoordinates,
//         activities,
//       };
//     } catch (error) {
//       this.logger.error('Scraping failed:', error.message);
//       throw error;
//     }
//   }

//   /**
//    * Extract farm coordinates from JavaScript embedded in the page
//    */
//   private extractCoordinatesFromJS(
//     $: cheerio.CheerioAPI,
//   ): Map<string, { lat: number; lng: number }> {
//     const coordinatesMap = new Map<string, { lat: number; lng: number }>();

//     const scripts = $('script').toArray();
//     for (const script of scripts) {
//       let content = $(script).html() || '';

//       if (content.includes('lat:') && content.includes('title:')) {
//         // Decode Unicode escapes (e.g., \u002F becomes /)
//         content = content.replace(/\\u([0-9a-fA-F]{4})/g, (match, code) => {
//           return String.fromCharCode(parseInt(code, 16));
//         });

//         // Extract farm objects with coordinates
//         // Pattern: title:"Vente directe chez NAME"...location:{lat:NUMBER,lng:NUMBER}
//         // Using [\s\S]*? to match any character including newlines
//         const farmPattern =
//           /title:"Vente directe chez ([^"]+)"[\s\S]*?location:\{lat:([\d.]+),lng:([\d.]+)\}/g;

//         let match;
//         while ((match = farmPattern.exec(content)) !== null) {
//           const farmName = match[1];
//           const lat = parseFloat(match[2]);
//           const lng = parseFloat(match[3]);

//           if (farmName && !isNaN(lat) && !isNaN(lng)) {
//             coordinatesMap.set(farmName, { lat, lng });
//           }
//         }

//         if (coordinatesMap.size > 0) {
//           this.logger.log(
//             `Extracted ${coordinatesMap.size} coordinate pairs from JavaScript`,
//           );
//           break;
//         }
//       }
//     }

//     return coordinatesMap;
//   }

//   /**
//    * Parse farm data from HTML
//    */
//   private parseFarmData(
//     $: cheerio.CheerioAPI,
//     coordinatesMap: Map<string, { lat: number; lng: number }>,
//   ): ScrapedActivity[] {
//     const activities: ScrapedActivity[] = [];

//     // Find all farm entries by H2 tags containing "Vente directe"
//     const farmH2s = $('h2').filter((i, el) =>
//       $(el).text().includes('Vente directe'),
//     );

//     this.logger.log(`Found ${farmH2s.length} potential farms`);

//     farmH2s.each((i, element) => {
//       const $h2 = $(element);
//       const fullName = $h2.text().trim();
//       const name = fullName.replace('Vente directe chez ', '');

//       // Find the content container
//       const $content = $h2.parent().parent();

//       // Extract address
//       const $address = $content.find('[class*="address"]');
//       const addressText = $address.text().trim();

//       // Parse address
//       const addressParts = addressText.split(',');
//       const street = addressParts[0]?.trim();
//       const cityPart = addressParts[1]?.trim() || '';
//       const cityMatch = cityPart.match(/\d+\s+(.+)/);
//       const city = cityMatch ? cityMatch[1] : 'Lausanne';

//       // Get coordinates from extracted JavaScript data
//       const coords = coordinatesMap.get(name);

//       if (name && addressText) {
//         activities.push({
//           name: `Ferme ${name}`,
//           address: street,
//           city,
//           description: 'Vente directe - Magasin a la ferme',
//           category: ['FARM'],
//           latitude: coords?.lat,
//           longitude: coords?.lng,
//         });
//       }
//     });

//     this.logger.log(`Parsed ${activities.length} farms`);

//     const withCoords = activities.filter(
//       (a) => a.latitude && a.longitude,
//     ).length;
//     this.logger.log(`${withCoords} farms have coordinates from JavaScript`);

//     return activities;
//   }
// }
