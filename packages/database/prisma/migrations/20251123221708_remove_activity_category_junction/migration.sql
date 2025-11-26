/*
  Warnings:

  - You are about to drop the `ActivityCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ActivityCategory" DROP CONSTRAINT "ActivityCategory_activityId_fkey";

-- DropForeignKey
ALTER TABLE "ActivityCategory" DROP CONSTRAINT "ActivityCategory_categoryId_fkey";

-- DropTable
DROP TABLE "ActivityCategory";
