-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('USER', 'ADMIN');

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
CREATE TABLE "Meetups" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "organizerId" INTEGER NOT NULL,

    CONSTRAINT "Meetups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tags" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetupsToTags" (
    "id" SERIAL NOT NULL,
    "meetupId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "MeetupsToTags_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "Meetups_id_key" ON "Meetups"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Tags_id_key" ON "Tags"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Tags_title_key" ON "Tags"("title");

-- CreateIndex
CREATE UNIQUE INDEX "MeetupsToTags_id_key" ON "MeetupsToTags"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MeetupsToUsers_id_key" ON "MeetupsToUsers"("id");

-- AddForeignKey
ALTER TABLE "Meetups" ADD CONSTRAINT "Meetups_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetupsToTags" ADD CONSTRAINT "MeetupsToTags_meetupId_fkey" FOREIGN KEY ("meetupId") REFERENCES "Meetups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetupsToTags" ADD CONSTRAINT "MeetupsToTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetupsToUsers" ADD CONSTRAINT "MeetupsToUsers_meetupId_fkey" FOREIGN KEY ("meetupId") REFERENCES "Meetups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetupsToUsers" ADD CONSTRAINT "MeetupsToUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
