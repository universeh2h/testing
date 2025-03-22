-- AlterTable
ALTER TABLE `setting_webs` ADD COLUMN `wa_paid` VARCHAR(191) NULL,
    ADD COLUMN `wa_pending` VARCHAR(191) NULL,
    ADD COLUMN `wa_process` VARCHAR(191) NULL,
    ADD COLUMN `wa_success` VARCHAR(191) NULL;
