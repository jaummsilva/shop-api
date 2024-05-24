/*
  Warnings:

  - You are about to drop the column `name` on the `product_images` table. All the data in the column will be lost.
  - You are about to drop the column `path` on the `product_images` table. All the data in the column will be lost.
  - Added the required column `image_fake_name` to the `product_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_original_name` to the `product_images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_images" DROP COLUMN "name",
DROP COLUMN "path",
ADD COLUMN     "image_fake_name" TEXT NOT NULL,
ADD COLUMN     "image_original_name" TEXT NOT NULL,
ADD COLUMN     "image_type" TEXT NOT NULL DEFAULT '';
