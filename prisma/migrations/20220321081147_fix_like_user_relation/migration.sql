/*
  Warnings:

  - You are about to drop the `_LikeToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `likes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_LikeToUser" DROP CONSTRAINT "_LikeToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_LikeToUser" DROP CONSTRAINT "_LikeToUser_B_fkey";

-- AlterTable
ALTER TABLE "likes" ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_LikeToUser";

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
