/*
  Warnings:

  - You are about to drop the column `fromAccountId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `toAccountId` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `fromAccountNo` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toAccountNo` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_fromAccountId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_toAccountId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "fromAccountId",
DROP COLUMN "toAccountId",
ADD COLUMN     "fromAccountNo" TEXT NOT NULL,
ADD COLUMN     "toAccountNo" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fromAccountNo_fkey" FOREIGN KEY ("fromAccountNo") REFERENCES "Account"("acnumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toAccountNo_fkey" FOREIGN KEY ("toAccountNo") REFERENCES "Account"("acnumber") ON DELETE RESTRICT ON UPDATE CASCADE;
