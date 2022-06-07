/*
  Warnings:

  - You are about to drop the `config` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TeamId" AS ENUM ('BLUE', 'RED');

-- CreateEnum
CREATE TYPE "GameState" AS ENUM ('IN_PROGRESS', 'ENDED', 'EXCEPTION');

-- DropTable
DROP TABLE "config";

-- CreateTable
CREATE TABLE "Config" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(32) NOT NULL,
    "type" VARCHAR(16) NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "discord_id" VARCHAR(32) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Summoner" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "summoner_id" TEXT NOT NULL,
    "puuid" TEXT NOT NULL,

    CONSTRAINT "Summoner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameUser" (
    "game_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "team" "TeamId" NOT NULL,
    "won" BOOLEAN,

    CONSTRAINT "GameUser_pkey" PRIMARY KEY ("game_id","user_id")
);

-- CreateTable
CREATE TABLE "Tournament" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3) NOT NULL,
    "tournament_id" INTEGER NOT NULL,
    "tournament_code" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "state" "GameState" NOT NULL,
    "winningTeam" "TeamId" NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStat" (
    "user_id" INTEGER NOT NULL,
    "tournament_id" INTEGER NOT NULL,
    "elo" DOUBLE PRECISION NOT NULL,
    "wins" INTEGER NOT NULL,
    "losses" INTEGER NOT NULL,
    "kills" INTEGER NOT NULL,
    "deaths" INTEGER NOT NULL,
    "assists" INTEGER NOT NULL,

    CONSTRAINT "UserStat_pkey" PRIMARY KEY ("user_id","tournament_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "name_index" ON "Config"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Summoner_summoner_id_puuid_key" ON "Summoner"("summoner_id", "puuid");

-- AddForeignKey
ALTER TABLE "Summoner" ADD CONSTRAINT "Summoner_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameUser" ADD CONSTRAINT "GameUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameUser" ADD CONSTRAINT "GameUser_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStat" ADD CONSTRAINT "UserStat_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStat" ADD CONSTRAINT "UserStat_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
