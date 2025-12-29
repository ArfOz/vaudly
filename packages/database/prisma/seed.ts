import { PrismaClient, CategoryType } from "../generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding categories...");

  const categories = [
    { type: CategoryType.FARM, name: "Farm" },
    { type: CategoryType.GARDEN, name: "Garden" },
    { type: CategoryType.RESTAURANT, name: "Restaurant" },
    { type: CategoryType.CAFE, name: "Cafe" },
    { type: CategoryType.BAR, name: "Bar" },
    { type: CategoryType.MARKET, name: "Market" },
    { type: CategoryType.SPORTS, name: "Sports" },
    { type: CategoryType.CULTURE, name: "Culture" },
    { type: CategoryType.NATURE, name: "Nature" },
    { type: CategoryType.ENTERTAINMENT, name: "Entertainment" },
    { type: CategoryType.EDUCATION, name: "Education" },
    { type: CategoryType.WELLNESS, name: "Wellness" },
    { type: CategoryType.FAMILY, name: "Family" },
    { type: CategoryType.ADVENTURE, name: "Adventure" },
    { type: CategoryType.MUSIC, name: "Music" },
    { type: CategoryType.ART, name: "Art" },
    { type: CategoryType.FESTIVAL, name: "Festival" },
    { type: CategoryType.SHOPPING, name: "Shopping" },
    { type: CategoryType.NIGHTLIFE, name: "Nightlife" },
    { type: CategoryType.OTHER, name: "Other" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        type_name: {
          type: category.type,
          name: category.name,
        },
      },
      update: {},
      create: category,
    });
  }

  console.log("✅ Categories seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
