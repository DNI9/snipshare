/*
  Warnings:

  - You are about to drop the column `likes` on the `snippets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "snippets" DROP COLUMN "likes";

-- CreateTable
CREATE TABLE "Like" (
    "id" SERIAL NOT NULL,
    "snippetId" INTEGER NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LikeToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LikeToUser_AB_unique" ON "_LikeToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_LikeToUser_B_index" ON "_LikeToUser"("B");

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_snippetId_fkey" FOREIGN KEY ("snippetId") REFERENCES "snippets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikeToUser" ADD FOREIGN KEY ("A") REFERENCES "Like"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikeToUser" ADD FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
