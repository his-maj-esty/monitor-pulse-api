/*
  Warnings:

  - Added the required column `email` to the `Website` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Website" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "optedForNotification" BOOLEAN NOT NULL DEFAULT true;
