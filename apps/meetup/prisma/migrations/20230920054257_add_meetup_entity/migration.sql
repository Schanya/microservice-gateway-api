-- CreateTable
CREATE TABLE "Meetups" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "place" TEXT NOT NULL,

    CONSTRAINT "Meetups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetupsToTags" (
    "id" SERIAL NOT NULL,
    "meetupId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "MeetupsToTags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Meetups_id_key" ON "Meetups"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MeetupsToTags_id_key" ON "MeetupsToTags"("id");

-- AddForeignKey
ALTER TABLE "MeetupsToTags" ADD CONSTRAINT "MeetupsToTags_meetupId_fkey" FOREIGN KEY ("meetupId") REFERENCES "Meetups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetupsToTags" ADD CONSTRAINT "MeetupsToTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
