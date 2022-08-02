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

    public Game createGame() {
        Game game = new Game();

//        if (games.values().size() > 64)
//            return

        games.put(game.getGameId(), game);

        return game;
    }

    public Game getGame(String gameId) {
        return this.games.get(gameId);
    }

    public Game updateGame(String gameId, int fieldNo, int nominal) {
        Game game = games.get(gameId);

        game.newInput(fieldNo, nominal);

        return someoneWon(game) ?
                games.remove(gameId)
                : games.put(gameId, game);
    }

    public Map<String, Game> getGamesForStats() {
        return games;
    }

    private boolean someoneWon(Game game) {
        return victoryChecker.checkForWinner(game) != VictoryChecker.NO_ONE;
    }
}
