package pl.kolak.tictactoewebsocket.repositories;

import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Repository
public class PlayersRepo {

    private final Map<String, Integer> playersAtGame = new HashMap<>(32);

    public void delete(String gameId) {
        playersAtGame.remove(gameId);
    }

    public Set<Map.Entry<String, Integer>> getAllGames() {
        return playersAtGame.entrySet();
    }

    public void addPlayerToGame(String gameId) {
        playersAtGame.merge(gameId, 1, Integer::sum);
    }

    public void addFirstPlayerToGame(String gameId) {
        playersAtGame.put(gameId, 1);
    }

    public Optional<Integer> getPlayersCount(String gameId) {
        return Optional.ofNullable(playersAtGame.get(gameId));
    }

}
