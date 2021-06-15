/*
  Warnings:

  - You are about to drop the column `freeTable` on the `Pub` table. All the data in the column will be lost.
  - You are about to drop the column `maxDistance` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pub" DROP COLUMN "freeTable";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "maxDistance";
