/*
  Warnings:

  - The `quantPeixe` column on the `tanque` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "tanque" DROP COLUMN "quantPeixe",
ADD COLUMN     "quantPeixe" INTEGER;
