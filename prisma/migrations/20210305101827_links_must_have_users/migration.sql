/*
  Warnings:

  - Made the column `postedById` on table `Link` required. The migration will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Link" ALTER COLUMN "postedById" SET NOT NULL;
