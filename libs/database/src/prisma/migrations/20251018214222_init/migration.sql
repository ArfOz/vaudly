-- CreateTable
CREATE TABLE "ScraperConfig" (
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

-- CreateIndex
CREATE UNIQUE INDEX "ScraperConfig_url_key" ON "ScraperConfig"("url");

-- CreateIndex
CREATE INDEX "ScraperConfig_isActive_idx" ON "ScraperConfig"("isActive");

-- CreateIndex
CREATE INDEX "ScraperConfig_typeCode_idx" ON "ScraperConfig"("typeCode");
