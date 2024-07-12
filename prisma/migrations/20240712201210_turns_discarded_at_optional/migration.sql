-- AlterTable
ALTER TABLE "Place" ALTER COLUMN "discarded_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "discarded_at" DROP NOT NULL;
