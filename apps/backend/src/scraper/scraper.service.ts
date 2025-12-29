<<<<<<< HEAD
import { Injectable, Logger } from '@nestjs/common';
import { ActivitiesDatabaseService } from '../database/activites';
import { PrismaService } from '../database/prisma';
import { SwissMilkFarmScraper } from './scrapers';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);
  private readonly swissMilkFarmScraper: SwissMilkFarmScraper;

  constructor(
    private readonly activitiesDb: ActivitiesDatabaseService,
    private readonly prisma: PrismaService,
  ) {
    this.swissMilkFarmScraper = new SwissMilkFarmScraper(activitiesDb, prisma);
  }

  /**
   * Scrape SwissMilk farms
   */
  async scrapeFarms() {
    this.logger.log('Starting SwissMilk farm scraping...');
    return await this.swissMilkFarmScraper.scrape();
  }

  async updateActivityCoordinates(
    activityId: string,
    latitude: number,
    longitude: number,
  ) {
    const activity = await this.prisma.activity.findUnique({
      where: { id: activityId },
      include: { location: true },
    });

    if (!activity) {
      throw new Error('Activity not found');
    }

    // Update location coordinates
    await this.prisma.location.update({
      where: { id: activity.locationId },
      data: {
        latitude,
        longitude,
      },
    });

    this.logger.log(
      `Updated coordinates for ${activity.name}: ${latitude}, ${longitude}`,
    );

    return {
      success: true,
      activityId,
      name: activity.name,
      latitude,
      longitude,
    };
  }
}
=======
// import { Injectable, Logger } from '@nestjs/common';
// import { ActivitiesDatabaseService } from '../database/activites';
// import { PrismaService } from '../database/prisma';
// import { SwissMilkFarmScraper, IllustreFarmScraper } from './scrapers';

// @Injectable()
// export class ScraperService {
//   private readonly logger = new Logger(ScraperService.name);
//   private readonly swissMilkFarmScraper: SwissMilkFarmScraper;
//   private readonly illustreFarmScraper: IllustreFarmScraper;

//   constructor(
//     private readonly activitiesDb: ActivitiesDatabaseService,
//     private readonly prisma: PrismaService,
//   ) {
//     this.swissMilkFarmScraper = new SwissMilkFarmScraper(activitiesDb, prisma);
//     this.illustreFarmScraper = new IllustreFarmScraper(activitiesDb, prisma);
//   }

//   async scrapeIllustreFarms() {
//     this.logger.log('Starting Illustre farm scraping...');
//     return await this.illustreFarmScraper.scrape();
//   }

//   async scrapeFarms() {
//     this.logger.log('Starting SwissMilk farm scraping...');
//     return await this.swissMilkFarmScraper.scrape();
//   }

//   async updateActivityCoordinates(
//     activityId: string,
//     latitude: number,
//     longitude: number,
//   ) {
//     const activity = await this.prisma.activity.findUnique({
//       where: { id: activityId },
//       include: { location: true },
//     });

//     if (!activity) {
//       throw new Error('Activity not found');
//     }

//     // Update location coordinates
//     await this.prisma.location.update({
//       where: { id: activity.locationId },
//       data: {
//         latitude,
//         longitude,
//       },
//     });

//     this.logger.log(
//       `Updated coordinates for ${activity.name}: ${latitude}, ${longitude}`,
//     );

//     return {
//       success: true,
//       activityId,
//       name: activity.name,
//       latitude,
//       longitude,
//     };
//   }
// }
>>>>>>> 083c5b8 (Initial monorepo with Nx, Expo, NestJS, Prisma setup)
