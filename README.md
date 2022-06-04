# InhouseBot

## Running

### Install PNPM

```
npm --global install pnpm
pnpm install
```

### Start Server

```
docker-compose up -d
pnpm exec -- nx run-many --target=serve --all --parallel
```

### Run Prisma Migrations

```
pnpm exec -- prisma migrate dev --name=<NAME> --schema=libs/database/prisma/schema.prisma
```

## Setup

1. Create 3 voice channels
   a. Staging Room
   b. Inhouse A
   c. Inhouse B
2. Register the rooms by configuring the bot:
   a. `/inhouse config staging <ID>`
   b. `/inhouse config inhouse-a <ID>`
   c. `/inhouse config inhouse-b <ID>`
3. Players that want to join must register their summoner ids via `/inhouse register <name>`
4. An inhouse moderator can start an inhouse via `/inhouse start <type>` Valid types are:
   a. autobalance <default>
   b. draft: 1-2-2-2-2-1
   c. draft-<?>: Alternate picks (1-1-1-1-1-1-1-1-1-1)
5. A player can join an inhouse via `/inhouse join`
   a. A player can leave before the inhouse starts by `/inhouse leave`
6. When 10 players have joined, a ready check will begin in which all 10 players must click the ready reaction.
   a. An organizer can override the check by typing `/inhouse forcestart`# lol-inhouse-bot
