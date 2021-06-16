/*
  Warnings:

  - A unique constraint covering the columns `[reservationId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reservationId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `waiterId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reservationId" INTEGER NOT NULL,
ADD COLUMN     "waiterId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Notification_reservationId_unique" ON "Notification"("reservationId");

-- AddForeignKey
ALTER TABLE "Notification" ADD FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD FOREIGN KEY ("waiterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
