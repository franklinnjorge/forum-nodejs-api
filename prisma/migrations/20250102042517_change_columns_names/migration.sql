/*
  Warnings:

  - You are about to drop the column `userId` on the `answers` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `questions` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `answers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `questions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_userId_fkey";

-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_userId_fkey";

-- AlterTable
ALTER TABLE "answers" DROP COLUMN "userId",
ADD COLUMN     "authorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "questions" DROP COLUMN "userId",
ADD COLUMN     "authorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
