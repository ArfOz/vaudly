-- CreateEnum
CREATE TYPE "public"."Canton" AS ENUM ('VD');

-- CreateEnum
CREATE TYPE "public"."CategoryType" AS ENUM ('FARM', 'MUSEUM', 'GARDEN', 'RESTAURANT', 'CAFE', 'BAR', 'MARKET', 'SPORTS', 'CULTURE', 'NATURE', 'ENTERTAINMENT', 'EDUCATION', 'WELLNESS', 'FAMILY', 'ADVENTURE', 'MUSIC', 'ART', 'FESTIVAL', 'SHOPPING', 'NIGHTLIFE', 'OTHER');

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" TEXT NOT NULL,
    "type" "public"."CategoryType" NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ScraperConfig" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "typeName" TEXT NOT NULL,
    "typeCode" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastScraped" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "selectors" JSONB,

    CONSTRAINT "ScraperConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Location" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "address" TEXT,
    "city" TEXT,
    "canton" "public"."Canton" NOT NULL DEFAULT 'VD',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Activity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "subtitle" TEXT,
    "date" TEXT,
    "price" TEXT,
    "category" "public"."CategoryType"[] DEFAULT ARRAY[]::"public"."CategoryType"[],
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "locationId" TEXT NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Category_type_idx" ON "public"."Category"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Category_type_name_key" ON "public"."Category"("type", "name");

-- CreateIndex
CREATE UNIQUE INDEX "ScraperConfig_url_key" ON "public"."ScraperConfig"("url");

-- CreateIndex
CREATE INDEX "ScraperConfig_isActive_idx" ON "public"."ScraperConfig"("isActive");

-- CreateIndex
CREATE INDEX "ScraperConfig_typeCode_idx" ON "public"."ScraperConfig"("typeCode");

-- CreateIndex
CREATE INDEX "Location_city_idx" ON "public"."Location"("city");

-- CreateIndex
CREATE UNIQUE INDEX "Location_address_key" ON "public"."Location"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_name_key" ON "public"."Activity"("name");

-- CreateIndex
CREATE INDEX "Activity_startTime_idx" ON "public"."Activity"("startTime");

-- CreateIndex
CREATE INDEX "Activity_locationId_idx" ON "public"."Activity"("locationId");

-- CreateIndex
CREATE INDEX "Activity_category_idx" ON "public"."Activity"("category");

-- AddForeignKey
ALTER TABLE "public"."Activity" ADD CONSTRAINT "Activity_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;
