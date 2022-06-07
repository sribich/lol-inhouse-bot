/*
  Warnings:

  - A unique constraint covering the columns `[puuid]` on the table `Summoner` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[summoner_id]` on the table `Summoner` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Summoner_summoner_id_puuid_key";

-- CreateIndex
CREATE UNIQUE INDEX "Summoner_puuid_key" ON "Summoner"("puuid");

-- CreateIndex
CREATE UNIQUE INDEX "Summoner_summoner_id_key" ON "Summoner"("summoner_id");

-- RenameIndex
ALTER INDEX "Game_tournament_code_key" RENAME TO "tournament_code_index";

-- RenameIndex
ALTER INDEX "User_discord_id_key" RENAME TO "discord_id_index";
