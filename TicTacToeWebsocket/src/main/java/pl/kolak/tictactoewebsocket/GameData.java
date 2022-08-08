package pl.kolak.tictactoewebsocket;

import core.Game;

public record GameData(Game game, int whoWon) { }
