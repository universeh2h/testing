/*
  Warnings:

  - A unique constraint covering the columns `[deposit_id]` on the table `deposits` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[no_pembayaran]` on the table `deposits` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `deposits` ADD COLUMN `deposit_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `deposits_deposit_id_key` ON `deposits`(`deposit_id`);

-- CreateIndex
CREATE UNIQUE INDEX `deposits_no_pembayaran_key` ON `deposits`(`no_pembayaran`);
