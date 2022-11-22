package pl.kolak.tictactoewebsocket.services;


import core.VictoryChecker;
import org.springframework.stereotype.Service;
import pl.kolak.tictactoewebsocket.model.GameData;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PlayersService {

    private final Map<String, Integer> playersAtGame;

    public PlayersService() {
        this.playersAtGame = new HashMap<>(64);
    }

    public void removeGame(String gameId) {
        playersAtGame.remove(gameId);
    }

    public List<String> getAvailableGames() {
        return playersAtGame.entrySet()
                .stream()
                .filter(gamePlayersNo -> gamePlayersNo.getValue() <= 1)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    public void addPlayerToGame(String gameId) {
        playersAtGame.merge(gameId, 1, Integer::sum);
    }

    public void setHostPlayer(String gameId) {
        playersAtGame.put(gameId, 1);
    }

    public void deleteGameIfOver(GameData gameData) {
        int result = gameData.whoWon();

        if (result != VictoryChecker.NO_ONE) {
            this.playersAtGame.remove(gameData.game().getGameId());
        }
    }

    public boolean gameExist(String gameId) {
        if (playersAtGame.containsKey(gameId))
            return playersAtGame.get(gameId) == 1;
        return false;
    }

    public boolean gameDoesntExist(String gameId) {
        return playersAtGame.get(gameId) == null;
    }

    public Map<String, Integer> getGames() {
        return playersAtGame;
    }
}
