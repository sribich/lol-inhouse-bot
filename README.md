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
pnpm exec -- prisma migrate dev --name=<NAME>
```

## Configuring The Bot

1. Create an inhouse category  
   a. Inhouse rooms will be automatically generated and deleted on game start and end.  
2. Register the category by configuring the bot:  
   a. `/inhouse-set-category <ID>`  
3. Create an inhouse mod role  
4. Register the role by configuring the bot:  
   a. `/inhouse-set-mod-role <ID>`  

## Preparing for inhouses (1 time thing)  

1. Users that want to join must register their summoner ids via `/inhouse-register <name>`  
   a. Users will verify that their account belongs to them by us requesting that they change their icon to one of the default icons.  
      i. We'll have to make sure that the icon we select is not already in use by the account.  
   b. Once their icon is changed, they can react to the command and we will verify.  
   c. If a player registeres an account while a tournament room is active, we need to update the room via https://developer.riotgames.com/apis#tournament-v4/PUT_updateCode  

## Starting an inhouse  
  
1. An inhouse moderator can start an inhouse via `/inhouse-start <type> <forfun/serious>`  
   a. Valid types are:  
      1. autobalance <default> (PHASE 2)    
      2. draft: 1-2-2-2-2-1 (PHASE 1)
   b. Only one lobby can be going at a time  
   c. Spawn an embedded message showing the
5. A player can join an inhouse by reacting to the message    
   a. A player can leave before the inhouse starts by removing their reaction
   b. Make sure that the person joining as at least one summoner id registered
      i. If they don't we'll remove their reaction (and name from list) and we'll send a DM saying they need to register a summoner.  
6. When 10 players have joined, a ready check will begin in which all 10 players must click the ready reaction.  
   a. An organizer can override the check by typing `/inhouse-forcestart`  
   b. The ready check will be part of the same embedded message.  
   note: Tournament codes should be DMed to players  
7. A new embedded message will be sent  