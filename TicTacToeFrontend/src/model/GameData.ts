export class GameData {

  static empty = new GameData(Game.emtpy, -1);

  game: Game;
  whoWon: number;
  constructor(game: Game, whoWon: number) {
    this.game = game;
    this.whoWon = whoWon;
  }

}


