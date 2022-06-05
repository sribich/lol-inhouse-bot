/*
  Warnings:

  - You are about to drop the `Placeholder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Placeholder";

-- CreateTable
CREATE TABLE "config" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(32) NOT NULL,
    "type" VARCHAR(16) NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "name_index" ON "config"("name");
