/*
  Warnings:

  - Added the required column `provider` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('LOCAL', 'GOOGLE');

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "provider" "Provider" NOT NULL;
