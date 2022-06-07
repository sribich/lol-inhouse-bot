/*
  Warnings:

  - A unique constraint covering the columns `[tournament_code]` on the table `Game` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[discord_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "endedAt" DROP NOT NULL,
ALTER COLUMN "data" DROP NOT NULL,
ALTER COLUMN "winningTeam" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Game_tournament_code_key" ON "Game"("tournament_code");

-- CreateIndex
CREATE UNIQUE INDEX "User_discord_id_key" ON "User"("discord_id");
