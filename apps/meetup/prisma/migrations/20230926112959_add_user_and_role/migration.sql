/*
  Warnings:

  - Added the required column `organizerId` to the `Meetups` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "Meetups" ADD COLUMN     "organizerId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "role" "Roles" NOT NULL DEFAULT 'USER',

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetupsToUsers" (
    "id" SERIAL NOT NULL,
    "meetupId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "MeetupsToUsers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_id_key" ON "Users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MeetupsToUsers_id_key" ON "MeetupsToUsers"("id");

-- AddForeignKey
ALTER TABLE "Meetups" ADD CONSTRAINT "Meetups_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetupsToUsers" ADD CONSTRAINT "MeetupsToUsers_meetupId_fkey" FOREIGN KEY ("meetupId") REFERENCES "Meetups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetupsToUsers" ADD CONSTRAINT "MeetupsToUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
