/*
  Warnings:

  - Added the required column `userId` to the `Website` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Website" ADD COLUMN     "userId" TEXT NOT NULL;
