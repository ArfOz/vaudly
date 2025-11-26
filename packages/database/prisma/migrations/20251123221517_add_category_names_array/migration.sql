-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "categoryNames" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE INDEX "Activity_categoryNames_idx" ON "Activity"("categoryNames");
