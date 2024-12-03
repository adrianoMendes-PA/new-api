/*
  Warnings:

  - Added the required column `quantPeixe` to the `tanque` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tanque" DROP COLUMN "quantPeixe",
ADD COLUMN     "quantPeixe" INTEGER NOT NULL;
