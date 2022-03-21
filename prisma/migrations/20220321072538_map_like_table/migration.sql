/*
  Warnings:

  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_snippetId_fkey";

-- DropForeignKey
ALTER TABLE "_LikeToUser" DROP CONSTRAINT "_LikeToUser_A_fkey";

-- DropTable
DROP TABLE "Like";

-- CreateTable
CREATE TABLE "likes" (
    "id" SERIAL NOT NULL,
    "snippetId" INTEGER NOT NULL,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_snippetId_fkey" FOREIGN KEY ("snippetId") REFERENCES "snippets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikeToUser" ADD FOREIGN KEY ("A") REFERENCES "likes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
