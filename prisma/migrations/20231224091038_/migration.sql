/*
  Warnings:

  - Added the required column `downtimeAt` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "downtimeAt" TEXT NOT NULL;
