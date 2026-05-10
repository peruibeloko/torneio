import { useGameInternalStore } from '@/client/stores/internal.ts';
import { useVoteStore } from '@/client/stores/votes.ts';
import {
  ClientEvents,
  Handlers,
  EventType
} from '@/game/events/ClientEvents.ts';
import { EventBus } from '@/game/events/EventBus.ts';
import type { ServerMessage } from '@/game/server/ServerMessages.ts';
import { decode, encode } from 'msgpack';
import { ClientMessage } from '@/game/client/ClientMessages.ts';

export class GameClient {
  #socket: WebSocket;
  #game = useGameInternalStore();
  #votes = useVoteStore();

  #bus: EventBus<ClientEvents> = new EventBus(this);

  constructor() {
    this.#socket = new WebSocket('/game');
    this.#socket.addEventListener('open', e => {
      console.log(
        'connected successfully -- url is %s, status is %d',
        this.#socket.url,
        this.#socket.readyState
      );
    });
    this.#socket.addEventListener('message', e => {
      (e.data as Blob)
        .bytes()
        .then(b => this.#handleMsg(decode(b) as ServerMessage));
    });

    this.#game.client = this;

    this.#bus.subscribe(
      'createLobbyResponse',
      lobbyCode => (this.#game.lobbyCode = lobbyCode)
    );
    this.#bus.subscribe('joinLobbyResponse', info => {
      if (!info) return;
      this.#game.playerName = info.uniqueName;
    });

    this.#bus.subscribe('allPlayers', players => {
      this.#game.players = players;
    });
    this.#bus.subscribe('allVotes', this.#setVotes);
    this.#bus.subscribe('allSuggestions', things => {
      this.#game.things = things;
    });
    this.#bus.subscribe('playerJoined', name =>
      this.#game.players.push({ name, ready: false })
    );
    this.#bus.subscribe('playerReady', this.#playerReady);
    this.#bus.subscribe('playerLeft', this.#playerLeft);
    this.#bus.subscribe('newVote', ({ player, thing }) =>
      this.#votes.vote(thing, player)
    );
    this.#bus.subscribe('newSuggestion', thing =>
      this.#game.things.unshift(thing)
    );
    this.#bus.subscribe('roundStart', this.#startRound);
    this.#bus.subscribe('roundEnd', this.#endRound);
  }

  subscribe<T extends EventType>(topic: T, handler: Handlers[T]) {
    this.#bus.subscribe(topic, handler);
  }

  unsubscribe<T extends EventType>(topic: T, handler: Handlers[T]) {
    this.#bus.unsubscribe(topic, handler);
  }

  publish<T extends EventType>(type: T, data: ClientEvents[T]) {
    this.#bus.publish(type, data);
  }

  sendMsg(msg: ClientMessage) {
    this.#socket.send(encode(msg));
  }

  createLobby() {
    this.sendMsg({
      type: 'create',
      data: null
    });
  }

  joinLobby(plainName: string, lobbyCode: string) {
    this.sendMsg({
      type: 'join',
      data: { lobbyCode, player: plainName }
    });
  }

  leaveLobby() {
    this.sendMsg({
      type: 'leave',
      data: { lobbyCode: this.#game.lobbyCode, player: this.#game.playerName }
    });
  }

  suggest(thing: string) {
    this.sendMsg({
      type: 'suggest',
      data: { thing, lobbyCode: this.#game.lobbyCode }
    });
  }

  ready() {
    this.sendMsg({
      type: 'ready',
      data: {
        lobbyCode: this.#game.lobbyCode,
        player: this.#game.playerName
      }
    });
  }

  vote(thing: string) {
    this.#votes.vote(thing, this.#game.playerName);
    this.sendMsg({
      type: 'vote',
      data: {
        player: this.#game.playerName,
        thing,
        lobbyCode: this.#game.lobbyCode
      }
    });
  }

  #startRound({ things, round }: ClientEvents['roundStart']) {
    this.#game.round = round;

    this.#votes.reset();
    this.#votes.setThings(things);
  }

  #endRound({ winner, gameEnd }: ClientEvents['roundEnd']) {
    this.#game.winner = winner;
    this.#game.isGameEnd = gameEnd;
  }

  #playerReady(name: string) {
    const idx = this.#game.players.findIndex(p => p.name === name);
    this.#game.players[idx]!.ready = true;
  }

  #playerLeft(name: string) {
    const idx = this.#game.players.findIndex(p => p.name === name);
    this.#game.players.splice(idx, 1);
    this.#votes.removePlayer(name);
  }

  #setVotes({ things, votes }: ClientEvents['allVotes']) {
    this.#votes.setThings(things);
    this.#votes.setVotes(votes);
  }

  #handleMsg(msg: ServerMessage) {
    console.log('got message', msg);
    this.#bus.publish(
      msg.type as keyof ClientEvents,
      msg.data as ClientEvents[typeof msg.type]
    );
  }
}
