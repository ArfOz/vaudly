import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Culture Vevey Scraper Config
  const cultureVevey = await prisma.scraperConfig.upsert({
    where: { url: 'https://www.culturevevey.ch/agenda/' },
    update: {
      name: 'Culture Vevey - Agenda',
      typeName: 'Culture Vevey',
      typeCode: 'CULTURE_VEVEY',
      isActive: true,
      selectors: {
        eventCard: '.col-event',
        title: 'h2',
        category: 'h3',
        description: '.event-description',
        date: '.event-dates',
        price: '.event-price',
        mapLink: '.fal.fa-map-marker-alt',
      },
    },
    create: {
      id: 'culturevevey-agenda',
      url: 'https://www.culturevevey.ch/agenda/',
      name: 'Culture Vevey - Agenda',
      typeName: 'Culture Vevey',
      typeCode: 'CULTURE_VEVEY',
      isActive: true,
      selectors: {
        eventCard: '.col-event',
        title: 'h2',
        category: 'h3',
        description: '.event-description',
        date: '.event-dates',
        price: '.event-price',
        mapLink: '.fal.fa-map-marker-alt',
      },
    },
  });

  console.log('✅ Created/Updated Culture Vevey config:', cultureVevey.id);

  // Lausanne Tourism Scraper Config (JavaScript-rendered site)
  const lausanneTourism = await prisma.scraperConfig.upsert({
    where: { url: 'https://www.lausanne-tourisme.ch/en/events/' },
    update: {
      name: 'Lausanne Tourism - Events',
      typeName: 'Lausanne Tourism',
      typeCode: 'LAUSANNE_TOURISM',
      isActive: true,
      selectors: {
        usePuppeteer: true, // JavaScript ile render ediliyor
        eventCard: '.lt-agenda-event-card',
        title: '.lt-agenda-title',
        category: 'button[title]',
        description: '.lt-agenda-description',
        date: '.lt-agenda-date p',
        price: '.lt-agenda-price',
        mapLink: '.lt-agenda-location p', // Sadece text, koordinat yok
      },
    },
    create: {
      id: 'lausanne-tourism-events',
      url: 'https://www.lausanne-tourisme.ch/en/events/',
      name: 'Lausanne Tourism - Events',
      typeName: 'Lausanne Tourism',
      typeCode: 'LAUSANNE_TOURISM',
      isActive: true,
      selectors: {
        usePuppeteer: true, // JavaScript ile render ediliyor
        eventCard: '.lt-agenda-event-card',
        title: '.lt-agenda-title',
        category: 'button[title]',
        description: '.lt-agenda-description',
        date: '.lt-agenda-date p',
        price: '.lt-agenda-price',
        mapLink: '.lt-agenda-location p', // Sadece text, koordinat yok
      },
    },
  });

  console.log(
    '✅ Created/Updated Lausanne Tourism config:',
    lausanneTourism.id
  );

  console.log('✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
