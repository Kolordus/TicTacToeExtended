package pl.kolak.tictactoewebsocket.services;

import core.Game;
import core.VictoryChecker;
import org.springframework.stereotype.Service;
import pl.kolak.tictactoewebsocket.model.GameData;
import pl.kolak.tictactoewebsocket.model.GameDataInput;

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

    public void removeGame(String gameId) {
        this.games.remove(gameId);
    }

    public GameData getGame(String gameId) {
        return new GameData(this.games.get(gameId), VictoryChecker.NO_ONE);
    }

    public GameData updateGameAndCache(String gameId, GameDataInput gameDataInput) {
        Game game = updateGame(gameId,
                Integer.parseInt(gameDataInput.fieldNo()),
                Integer.parseInt(gameDataInput.nominal()));

        int winner = victoryChecker.checkForWinner(game);

        return winner == VictoryChecker.NO_ONE ?
                updateCacheAndReturnUpdatedGame(gameId, game, winner) :
                endGameAndReturnResult(gameId, winner);
    }

    public Map<String, Game> getGamesForStats() {
        return games;
    }

    private GameData endGameAndReturnResult(String gameId, int winner) {
        Game endedGame = games.remove(gameId);
        return new GameData(endedGame, winner);
    }

    private GameData updateCacheAndReturnUpdatedGame(String gameId, Game game, int winner) {
        games.put(gameId, game);
        return new GameData(game, winner);
    }

    private Game updateGame(String gameId, int fieldNo, int nominal) {
        Game game = games.get(gameId);
        game.newInput(fieldNo, nominal);
        return game;
    }
}
