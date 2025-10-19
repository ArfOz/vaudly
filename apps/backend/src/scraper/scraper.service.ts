import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { parse, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EventData {
  title: string;
  category?: string;
  description?: string;
  date?: string;
  price?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  startTime?: string | null;
  endTime?: string | null;
}

interface ScraperSelectors {
  eventCard?: string;
  title?: string;
  category?: string;
  description?: string;
  date?: string;
  price?: string;
  mapLink?: string;
}

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Tüm aktif scraper config'leri çalıştır
   */
  async scrapeAll(): Promise<EventData[]> {
    this.logger.log('🚀 Starting scrapeAll from database configs...');

    const configs = await this.prisma.scraperConfig.findMany({
      where: { isActive: true },
    });

    this.logger.log(`📋 Found ${configs.length} active scraper configs`);

    const allEvents: EventData[] = [];
    for (const config of configs) {
      try {
        this.logger.log(`🔄 Processing config: ${config.name} (${config.url})`);
        const events = await this.scrapeWithConfig(config.id);
        allEvents.push(...events);

        // LastScraped güncelle
        await this.prisma.scraperConfig.update({
          where: { id: config.id },
          data: { lastScraped: new Date() },
        });
      } catch (error) {
        this.logger.error(
          `❌ Failed to scrape config ${config.name}: ${error.message}`
        );
      }
    }

    this.logger.log(`✅ Total events scraped: ${allEvents.length}`);
    return allEvents;
  }

  /**
   * Belirli bir config ID'sine göre scrape et
   */
  async scrapeWithConfig(configId: string): Promise<EventData[]> {
    const config = await this.prisma.scraperConfig.findUnique({
      where: { id: configId },
    });

    if (!config) {
      throw new Error(`ScraperConfig with id ${configId} not found`);
    }

    if (!config.isActive) {
      this.logger.warn(`⚠️ Config ${config.name} is not active, skipping`);
      return [];
    }

    // Selectors'ı parse et (JSON olarak saklanıyor)
    const selectorsData = (config.selectors || {}) as Record<string, unknown>;
    const usePuppeteer = selectorsData.usePuppeteer === true;

    // usePuppeteer'ı selectors'tan çıkar
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { usePuppeteer: _unused, ...selectors } = selectorsData;

    return this.scrape(config.url, selectors as ScraperSelectors, usePuppeteer);
  }
  async scrape(
    url: string,
    customSelectors?: ScraperSelectors,
    usePuppeteer = false
  ): Promise<EventData[]> {
    this.logger.log(`🔍 Scraping started for: ${url}`);

    try {
      let html: string;

      // 🎭 Puppeteer ile JavaScript render'lı siteler için
      if (usePuppeteer) {
        this.logger.log('🎭 Using Puppeteer for JavaScript-rendered content');
        const browser = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        await page.setUserAgent(
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        );

        this.logger.log(`📄 Loading ${url}...`);
        await page.goto(url, {
          waitUntil: 'networkidle0',
          timeout: 90000,
        });

        // Wait for event cards to appear
        const eventSelector =
          customSelectors?.eventCard || '.lt-agenda-event-card';
        this.logger.log(`⏳ Waiting for selector: ${eventSelector}`);

        try {
          // Wait longer and check multiple times
          await page.waitForSelector(eventSelector, { timeout: 30000 });
          this.logger.log(`✅ Event cards found!`);

          // Count how many
          const count = await page.$$eval(eventSelector, (els) => els.length);
          this.logger.log(`📊 Found ${count} event cards`);
        } catch {
          this.logger.warn(
            `⚠️ Selector ${eventSelector} not found after 30s, checking page content...`
          );

          // Debug: Check what's actually on the page
          const bodyText = await page.evaluate(() =>
            document.body.textContent?.substring(0, 500)
          );
          this.logger.debug(`Page content sample: ${bodyText}`);
        }

        // Extra wait for any lazy loading
        await new Promise((resolve) => setTimeout(resolve, 3000));

        html = await page.content();

        // Debug: Log HTML length
        this.logger.log(`📄 HTML content length: ${html.length} characters`);
        const hasEventCards = html.includes('lt-agenda-event-card');
        this.logger.log(`🔍 Contains event cards in HTML: ${hasEventCards}`);

        await browser.close();
        this.logger.log('✅ Puppeteer browser closed');
      } else {
        // 🌐 Axios ile statik HTML siteleri için
        const { data } = await axios.get(url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
        });
        html = data;
      }

      const $ = cheerio.load(html);
      const events: EventData[] = [];

      // Default selectors (Culture Vevey için) - customSelectors ile override edilebilir
      const selectors: ScraperSelectors = {
        eventCard: '.col-event',
        title: 'h2',
        category: 'h3',
        description: '.event-description, .description',
        date: '.event-dates, .date',
        price: '.event-price, .price',
        mapLink: '.fal.fa-map-marker-alt',
        ...customSelectors, // Custom selectors override defaults
      };

      // 💡 Her etkinlik kartını scrape et
      $(selectors.eventCard || '.col-event').each((_, el) => {
        const title = $(el)
          .find(selectors.title || 'h2')
          .text()
          .trim();
        if (!title) return; // boş başlık varsa atla

        const category =
          $(el)
            .find(selectors.category || 'h3')
            .text()
            .trim() || null;
        const description =
          $(el)
            .find(selectors.description || '.event-description, .description')
            .text()
            .trim() || null;

        const dateText =
          $(el)
            .find(selectors.date || '.event-dates, .date')
            .text()
            .trim() || '';
        const price =
          $(el)
            .find(selectors.price || '.event-price, .price')
            .text()
            .trim() || null;

        // 📍 Address + Coordinates
        const mapLink = $(el)
          .find(selectors.mapLink || '.fal.fa-map-marker-alt')
          .closest('a')
          .attr('href');

        let address = '';
        let latitude: number | null = null;
        let longitude: number | null = null;

        if (mapLink) {
          address = $(el)
            .find(selectors.mapLink || '.fal.fa-map-marker-alt')
            .parent()
            .text()
            .replace(/\s+/g, ' ')
            .trim();

          const match = mapLink.match(/query=([\d.]+)%2C([\d.]+)/);
          if (match) {
            latitude = parseFloat(match[1]);
            longitude = parseFloat(match[2]);
          }
        }

        // 🕒 Tarih & Saat İşleme — more tolerant parsing (FR + EN)
        let startTime: string | null = null;
        let endTime: string | null = null;

        try {
          const raw = (dateText || '').replace(/\u00A0/g, ' ').trim();
          const norm = raw.replace(/\s+/g, ' ');
          this.logger.debug(
            `dateText raw="${raw}" normalized="${norm}" for title="${title}"`
          );

          let startDate: Date | null = null;
          let endDate: Date | null = null;

          // 🇬🇧 English format: "From 27.06.24 - to 04.01.26" or "From 01.01.25 - to 31.12.25"
          const englishDateRangeRegex =
            /from\s+(\d{2}\.\d{2}\.\d{2,4})\s*[-–—]\s*to\s+(\d{2}\.\d{2}\.\d{2,4})/i;
          let m = norm.match(englishDateRangeRegex);

          if (m) {
            // English date format: dd.MM.yy or dd.MM.yyyy
            const parseEnglishDate = (dateStr: string) => {
              const parts = dateStr.split('.');
              if (parts.length === 3) {
                let year = parseInt(parts[2], 10);
                // Convert 2-digit year to 4-digit
                if (year < 100) {
                  year = year >= 50 ? 1900 + year : 2000 + year;
                }
                const month = parseInt(parts[1], 10) - 1; // 0-indexed
                const day = parseInt(parts[0], 10);
                return new Date(year, month, day);
              }
              return null;
            };

            startDate = parseEnglishDate(m[1]);
            endDate = parseEnglishDate(m[2]);
            this.logger.debug(
              `EN rangeMatch start="${m[1]}" end="${m[2]}" => ${startDate} - ${endDate}`
            );
          } else {
            // 🇫🇷 French format: "du 15 novembre 2025 au 20 novembre 2025"
            const dateRangeRegex =
              /du\s+(\d{1,2}\s+\w+(?:\s+\d{4})?)\s*(?:au|à|jusqu(?:'| )?au|[-–—])\s*(\d{1,2}\s+\w+(?:\s+\d{4})?)/i;
            const dateRangeNoDuRegex =
              /(\d{1,2}\s+\w+(?:\s+\d{4})?)\s*(?:[-–—]|au|à)\s*(\d{1,2}\s+\w+(?:\s+\d{4})?)/i;
            const singleDateRegex = /le\s+(\d{1,2}\s+\w+(?:\s+\d{4})?)/i;

            m = norm.match(dateRangeRegex) || norm.match(dateRangeNoDuRegex);
            if (m) {
              let s = m[1];
              let e = m[2];
              const yearRe = /\d{4}$/;
              if (!yearRe.test(s)) s = `${s} ${new Date().getFullYear()}`;
              if (!yearRe.test(e)) {
                const sy = s.match(yearRe);
                e = `${e} ${sy ? sy[0] : new Date().getFullYear()}`;
              }

              const pStart = parse(s, 'd MMMM yyyy', new Date(), {
                locale: fr,
              });
              const pEnd = parse(e, 'd MMMM yyyy', new Date(), { locale: fr });
              if (isValid(pStart)) startDate = pStart;
              if (isValid(pEnd)) endDate = pEnd;
              this.logger.debug(
                `FR rangeMatch s="${s}" e="${e}" => start=${startDate} end=${endDate}`
              );
            } else {
              m = norm.match(singleDateRegex);
              if (m) {
                let s = m[1];
                if (!/\d{4}$/.test(s)) s = `${s} ${new Date().getFullYear()}`;
                const p = parse(s, 'd MMMM yyyy', new Date(), { locale: fr });
                if (isValid(p)) {
                  startDate = p;
                  endDate = p;
                }
                this.logger.debug(
                  `FR singleMatch s="${s}" => start=${startDate}`
                );
              }
            }
          }

          const timeTokens = Array.from(
            norm.matchAll(/(\d{1,2}(?::\d{2}|h\d{1,2})?)/g)
          ).map((x) => x[1]);
          this.logger.debug(`timeTokens=${JSON.stringify(timeTokens)}`);

          const normalizeTime = (tok: string) => {
            let t = tok.replace('h', ':');
            if (!t.includes(':')) t = `${t}:00`;
            const parts = t.split(':');
            const hh = parts[0].padStart(2, '0');
            const mm = (parts[1] || '00').padStart(2, '0');
            return `${hh}:${mm}`;
          };

          if (startDate) {
            if (timeTokens.length >= 1) {
              const startTok = normalizeTime(timeTokens[0]);
              const endTok = normalizeTime(timeTokens[1] || timeTokens[0]);

              const startISODate = startDate.toISOString().split('T')[0];
              const endISODate = (endDate || startDate)
                .toISOString()
                .split('T')[0];

              startTime = new Date(
                `${startISODate}T${startTok}:00`
              ).toISOString();
              endTime = new Date(`${endISODate}T${endTok}:00`).toISOString();
            } else {
              startTime = startDate.toISOString();
              endTime = (endDate || startDate).toISOString();
            }
          }
        } catch (err) {
          this.logger.warn(
            `⚠️ Failed to parse date/time for ${title}: ${err?.message || err}`
          );
        }

        // 📦 Event objesini oluştur
        const event: EventData = {
          title,
          category,
          description,
          date: dateText,
          price,
          address,
          latitude,
          longitude,
          startTime,
          endTime,
        };

        events.push(event);
      });

      this.logger.log(`✅ Extracted ${events.length} events from ${url}`);

      // 💾 Kaydet (Prisma upsert) — find-or-create Location by address to avoid unique constraint
      for (const event of events) {
        try {
          // build location relation payload: either connect to existing or create new
          let locationRelation:
            | Prisma.ActivityCreateInput['location']
            | Prisma.ActivityUpdateInput['location'];

          if (event.address) {
            // Try to find existing location by address
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
                // Handle race where another process created the same address
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
              // update coordinates if provided and changed
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

            // At this point loc should exist
            if (!loc) {
              // Fallback: if something went wrong, create a minimal connected location
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
            // no address provided — create a default location record
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
          // Coordinates updated at creation/find time above (no post-upsert update needed)

          this.logger.log(`💾 Saved event: ${event.title}`);
        } catch (error) {
          this.logger.error(
            `❌ Failed to save event: ${event.title}`,
            error?.message || error
          );
        }
      }

      return events;
    } catch (error) {
      this.logger.error(`🔥 Failed to scrape ${url}: ${error.message}`);
      throw error;
    }
  }

  // Çoklu URL desteği (deprecated - artık scrapeAll kullanın)
  async scrapeMany(urls: string[]): Promise<EventData[]> {
    const allEvents: EventData[] = [];
    for (const url of urls) {
      const events = await this.scrape(url);
      allEvents.push(...events);
    }
    return allEvents;
  }
}
