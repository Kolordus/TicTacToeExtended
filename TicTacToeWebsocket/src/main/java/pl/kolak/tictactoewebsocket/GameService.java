package pl.kolak.tictactoewebsocket;

import core.Game;
import core.VictoryChecker;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class GameService {

    private final Map<String, Game> games;

    private final VictoryChecker victoryChecker;

    public GameService(VictoryChecker victoryChecker) {
        this.victoryChecker = victoryChecker;
        games = new HashMap<>(64);
    }

    public GameData createGame() {
        Game game = new Game();

//        if (games.values().size() > 64)
//            return

        games.put(game.getGameId(), game);

        return new GameData(game, VictoryChecker.NO_ONE);
    }

    public GameData getGame(String gameId) {
        return new GameData(this.games.get(gameId), VictoryChecker.NO_ONE);
    }

    public GameData updateGameAndCheckVictory(String gameId, int fieldNo, int nominal) {
        GameData result;

        Game game = updateGame(gameId, fieldNo, nominal);

        result = checkVictory(gameId, game);

        return result;
    }

    private Game updateGame(String gameId, int fieldNo, int nominal) {
        Game game = games.get(gameId);
        game.newInput(fieldNo, nominal);
        return game;
    }

    public Map<String, Game> getGamesForStats() {
        return games;
    }

    private GameData checkVictory(String gameId, Game game) {
        GameData result;
        int winner = victoryChecker.checkForWinner(game);
        if (winner == VictoryChecker.NO_ONE) {
            games.put(gameId, game);
            result = new GameData(game, winner);
        }
        else {
            result = new GameData(games.remove(gameId), winner);
        }
        return result;
    }



}
