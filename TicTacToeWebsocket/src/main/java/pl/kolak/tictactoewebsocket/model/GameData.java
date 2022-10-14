package pl.kolak.tictactoewebsocket.model;

import core.Game;

public record GameData(Game game, int whoWon) {
    public static final GameData EMPTY = new GameData(null, -1);
}
