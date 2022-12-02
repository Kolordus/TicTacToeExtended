import {Field} from "./Field";
import {Player} from "./Player";

export class Game {

  static EMPTY = new Game('', [
    new Field(0, 0,0),
    new Field(1, 0,0),
    new Field(2, 0,0),
    new Field(3, 0,0),
    new Field(4, 0,0),
    new Field(5, 0,0),
    new Field(6, 0,0),
    new Field(7, 0,0),
    new Field(8, 0,0),
  ], new Player(0, []), new Player(0, []), new Player(0, []));

  gameId: string;
  board: Array<Field>;
  player1: Player;
  player2: Player;
  currentPlayer: Player;

  constructor(gameId: string, board: Array<Field>, player1: Player, player2: Player, currentPlayer: Player) {
    this.gameId = gameId;
    this.board = board;
    this.player1 = player1;
    this.player2 = player2;
    this.currentPlayer = currentPlayer;
  }
}


