-- CreateEnum
CREATE TYPE "StatusUser" AS ENUM ('S', 'N');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "status" "StatusUser" NOT NULL DEFAULT 'S';
