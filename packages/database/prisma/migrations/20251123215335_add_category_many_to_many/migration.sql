/*
  Warnings:

  - You are about to drop the column `category` on the `Activity` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('FARM', 'GARDEN', 'RESTAURANT', 'CAFE', 'BAR', 'MARKET', 'SPORTS', 'CULTURE', 'NATURE', 'ENTERTAINMENT', 'EDUCATION', 'WELLNESS', 'FAMILY', 'ADVENTURE', 'MUSIC', 'ART', 'FESTIVAL', 'SHOPPING', 'NIGHTLIFE', 'OTHER');

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "category";

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "type" "CategoryType" NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityCategory" (
    "activityId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "ActivityCategory_pkey" PRIMARY KEY ("activityId","categoryId")
);

-- CreateIndex
CREATE INDEX "Category_type_idx" ON "Category"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Category_type_name_key" ON "Category"("type", "name");

-- CreateIndex
CREATE INDEX "ActivityCategory_activityId_idx" ON "ActivityCategory"("activityId");

-- CreateIndex
CREATE INDEX "ActivityCategory_categoryId_idx" ON "ActivityCategory"("categoryId");

-- AddForeignKey
ALTER TABLE "ActivityCategory" ADD CONSTRAINT "ActivityCategory_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityCategory" ADD CONSTRAINT "ActivityCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
