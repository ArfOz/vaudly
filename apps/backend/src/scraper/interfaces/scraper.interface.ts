export interface EventData {
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

export interface IEventScraper {
  /**
   * Scrapes events from the given HTML content
   * @param html - The HTML content to parse
   * @param url - The source URL
   * @returns Array of scraped event data
   */
  scrapeEvents(html: string, url: string): Promise<EventData[]>;

  /**
   * Returns the scraper type identifier
   */
  getType(): string;
}
