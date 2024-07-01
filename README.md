## Description


## Run in dev

1. Clone the repository
2. Install the dependencies with ```npm i```
3. Deploy the database with ```docker compose up -d```
4. Create a copy of env.template file named .env and fill it with the correct values
5. Run prisma migrations ```npx prisma migrate dev```
6. Run the command ```npm run dev```