/*
  Warnings:

  - You are about to drop the `_Friend` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_Friend" DROP CONSTRAINT "_Friend_A_fkey";

-- DropForeignKey
ALTER TABLE "_Friend" DROP CONSTRAINT "_Friend_B_fkey";

-- DropTable
DROP TABLE "_Friend";
