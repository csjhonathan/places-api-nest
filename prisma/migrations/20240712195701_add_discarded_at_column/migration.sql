/*
  Warnings:

  - Added the required column `discarded_at` to the `Place` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discarded_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Place" ADD COLUMN     "discarded_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "discarded_at" TIMESTAMP(3) NOT NULL;
