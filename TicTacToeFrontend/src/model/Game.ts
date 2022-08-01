class Game {
  gameId: String;
  board: Array<Field>;
  player1: Player;
  player2: Player;
  currentPlayer: Player;


  constructor(gameId: String, board: Array<Field>, player1: Player, player2: Player, currentPlayer: Player) {
    this.gameId = gameId;
    this.board = board;
    this.player1 = player1;
    this.player2 = player2;
    this.currentPlayer = currentPlayer;
  }
}

