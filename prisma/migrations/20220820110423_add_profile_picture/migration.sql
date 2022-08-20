/*
  Warnings:

  - Added the required column `profilePicture` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `profilePicture` VARCHAR(191) NOT NULL,
    MODIFY `name` VARCHAR(191) NOT NULL;
