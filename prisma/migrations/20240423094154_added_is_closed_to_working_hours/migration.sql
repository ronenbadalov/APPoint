-- AlterTable
ALTER TABLE "working_hours" ADD COLUMN     "is_closed" BOOLEAN,
ALTER COLUMN "start_time" DROP NOT NULL,
ALTER COLUMN "end_time" DROP NOT NULL;
