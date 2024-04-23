-- DropForeignKey
ALTER TABLE "working_hours" DROP CONSTRAINT "working_hours_business_id_fkey";

-- AddForeignKey
ALTER TABLE "working_hours" ADD CONSTRAINT "working_hours_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;
