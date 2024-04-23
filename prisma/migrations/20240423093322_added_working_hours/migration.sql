/*
  Warnings:

  - You are about to drop the column `working_hours` on the `business_details` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "business_details" DROP COLUMN "working_hours";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" DROP NOT NULL;

-- CreateTable
CREATE TABLE "working_hours" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "working_hours_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "working_hours" ADD CONSTRAINT "working_hours_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
