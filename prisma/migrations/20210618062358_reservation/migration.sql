/*
  Warnings:

  - You are about to drop the column `endHour` on the `Reservation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "endHour",
ADD COLUMN     "confirmed" BOOLEAN NOT NULL DEFAULT false;
