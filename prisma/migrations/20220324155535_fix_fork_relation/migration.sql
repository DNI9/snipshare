/*
  Warnings:

  - You are about to drop the `forks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "forks" DROP CONSTRAINT "forks_forkerId_fkey";

-- DropForeignKey
ALTER TABLE "forks" DROP CONSTRAINT "forks_snippetId_fkey";

-- AlterTable
ALTER TABLE "snippets" ADD COLUMN     "source_snippet_id" TEXT;

-- DropTable
DROP TABLE "forks";

-- AddForeignKey
ALTER TABLE "snippets" ADD CONSTRAINT "snippets_source_snippet_id_fkey" FOREIGN KEY ("source_snippet_id") REFERENCES "snippets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
