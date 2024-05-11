-- DropForeignKey
ALTER TABLE "business_details" DROP CONSTRAINT "business_details_user_id_fkey";

-- DropForeignKey
ALTER TABLE "customer_details" DROP CONSTRAINT "customer_details_user_id_fkey";

-- AlterTable
ALTER TABLE "business_details" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "customer_details" ADD CONSTRAINT "customer_details_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_details" ADD CONSTRAINT "business_details_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS cube;
CREATE EXTENSION IF NOT EXISTS earthdistance;

