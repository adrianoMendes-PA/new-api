/*
  Warnings:

  - You are about to drop the `tanque` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tanque" DROP CONSTRAINT "tanque_userId_fkey";

-- DropTable
DROP TABLE "tanque";
