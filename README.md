# Fresh project

Your new Fresh project is ready to go. You can follow the Fresh "Getting
Started" guide here: https://fresh.deno.dev/docs/getting-started

## Usage

Make sure to install Deno:
https://docs.deno.com/runtime/getting_started/installation

Then start the project in development mode:

```
deno task dev
```

This will watch the project directory and restart as necessary.

## Game

- Client and server live in the same repo
- since the API lives in the same place the client is served from, connection logic is already segmented per player
- you either create a room, or give a room code to join a game
- once joined, the code is stored for easily joining back
- each player chooses their name
- upon joining the session, each player can add an entry to the pool
