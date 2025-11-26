/*
  Warnings:

  - You are about to drop the column `categoryNames` on the `Activity` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Activity_categoryNames_idx";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "categoryNames",
ADD COLUMN     "category" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE INDEX "Activity_category_idx" ON "Activity"("category");
