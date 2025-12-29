import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

import { PrismaService } from '../../database/prisma';
import { BaseScraper, ScrapedActivity, ScrapeResult } from './base-scraper';
import { ActivitiesDatabaseService } from 'src/database/activities';

/**
 * IllustreFarmScraper - 90 vaud çiftliğini çeker
 */
@Injectable()
export class IllustreFarmScraper extends BaseScraper {
  private readonly url =
    'https://www.illustre.ch/magazine/90-adresses-vaudoises-pour-faire-ses-courses-a-la-ferme';

  constructor(activitiesDb: ActivitiesDatabaseService, prisma: PrismaService) {
    super(activitiesDb, prisma, 'IllustreFarmScraper');
  }

  async scrape(): Promise<ScrapeResult> {
    this.logger.log('Starting Illustre farm scraping...');

    const { data } = await axios.get<string>(this.url);
    const $ = cheerio.load(data);

    // 1. Çiftlikleri parse et
    const activities = this.parseFarms($);

    // 2. Eksik koordinatları geocode et (çok aşamalı deneme)
    for (const activity of activities) {
      if (
        (!activity.latitude || !activity.longitude) &&
        (activity.address || activity.city)
      ) {
        let geocoded = false;
        const tried: string[] = [];
        // 1. Tam adresle dene
        if (activity.address && activity.address.length > 10 && !geocoded) {
          const query = `${activity.address}, ${activity.city || ''}, Switzerland`;
          tried.push(query);
          const coords = await this.geocodeAddress(query);
          if (coords) {
            activity.latitude = coords.lat;
            activity.longitude = coords.lng;
            geocoded = true;
            this.logger.log(
              `Geocoded (address) ${activity.name}: ${coords.lat}, ${coords.lng}`,
            );
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        // 2. Name + city ile dene
        if (!geocoded && activity.name && activity.city) {
          const query = `${activity.name}, ${activity.city}, Switzerland`;
          tried.push(query);
          const coords = await this.geocodeAddress(query);
          if (coords) {
            activity.latitude = coords.lat;
            activity.longitude = coords.lng;
            geocoded = true;
            this.logger.log(
              `Geocoded (name+city) ${activity.name}: ${coords.lat}, ${coords.lng}`,
            );
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        // 3. Sadece şehir ile dene
        if (!geocoded && activity.city) {
          const query = `${activity.city}, Switzerland`;
          tried.push(query);
          const coords = await this.geocodeAddress(query);
          if (coords) {
            activity.latitude = coords.lat;
            activity.longitude = coords.lng;
            geocoded = true;
            this.logger.log(
              `Geocoded (city) ${activity.name}: ${coords.lat}, ${coords.lng}`,
            );
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        if (!geocoded) {
          this.logger.warn(
            `Could not geocode ${activity.name}. Tried: ${tried.join(' | ')}`,
          );
        }
      }
    }

    // 3. Veritabanına kaydet
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
  }

  /**
   * HTML'den çiftlikleri parse et
   */
  private parseFarms($: cheerio.CheerioAPI): ScrapedActivity[] {
    const activities: ScrapedActivity[] = [];
    let currentCity = '';
    const cityBlacklist = [
      'Un système solidaire, sain et vertueux',
      '90 adresses vaudoises',
      'Publié le',
      'Guide marché à la ferme',
    ];
    $('h3, h4, h5, h6').each((i, el) => {
      const city = $(el).text().trim();
      if (
        city.length > 0 &&
        city.length < 40 &&
        !cityBlacklist.includes(city)
      ) {
        currentCity = city;
        let next = $(el).next();
        while (next.length && !/h[3-6]/i.test(next[0].tagName)) {
          if (next.is('p') || next.is('li')) {
            const lines = next
              .text()
              .split(/\n|\r|\d+\./)
              .map((l) => l.trim())
              .filter(Boolean);
            lines.forEach((line) => {
              // Esnek: iki nokta üst üste zorunlu değil, satırda şehir veya adres varsa da ekle
              let name = '';
              let description = '';
              let address = '';
              // let addressSource = '';
              // 1. Standart: "isim: açıklama" varsa
              const match = line.match(/^([^:]+):\s*(.+)$/);
              if (match && match[1].length > 2 && match[2].length > 5) {
                name = match[1].trim();
                description = match[2].trim();
              } else {
                // 2. Nokta yoksa, satırın başı isim, geri kalanı açıklama gibi dene
                const altMatch = line.match(
                  /^([A-ZÇĞİÖŞÜÂÊÎÔÛ][^,\d]{2,})(.+)$/,
                );
                if (altMatch) {
                  name = altMatch[1].trim();
                  description = altMatch[2].trim();
                } else {
                  // 3. Sadece açıklama gibi ise, ismi city olarak ata
                  name = city;
                  description = line;
                }
              }
              // Adres yakalamaya çalış
              // 1. Doğrudan adres formatı var mı?
              const addressMatch = line.match(
                /([\w\s'’,-]+,\s*\d{4,5}\s+[\w\s'’,-]+)/,
              );
              if (addressMatch) {
                address = addressMatch[1].trim();
                // addressSource = 'direct';
              } else {
                // 2. Description'dan şehir ve posta kodu ile tahmin
                const cityMatch = description.match(/(\d{4,5})\s+[\w\s'’,-]+/);
                if (cityMatch) {
                  address = cityMatch[0].trim();
                  // addressSource = 'desc-city';
                } else if (currentCity) {
                  // 3. Sadece şehir adı ile
                  address = currentCity;
                  // addressSource = 'city';
                }
              }
              // Adres, city ve description'ın hepsi boşsa logla
              if (!address && !currentCity && !description) {
                this.logger.warn('Eksik adres ve şehir:', name);
              }
              // Adresin başında/sonunda gereksiz karakterleri temizle
              address = address.replace(/^[-,\s]+|[-,\s]+$/g, '');
              // Satırda anlamlı bir isim veya açıklama varsa ekle
              if (name.length > 2 && description.length > 5) {
                activities.push({
                  name,
                  description,
                  address,
                  city: currentCity,
                  category: ['FARM'],
                });
              } else {
                // Kaçan satırları logla
                this.logger.warn('Satır atlandı:', { city: currentCity, line });
              }
            });
          }
          next = next.next();
        }
      }
    });
    this.logger.log(`Toplam bulunan satır: ${activities.length}`);
    return activities;
  }
}
