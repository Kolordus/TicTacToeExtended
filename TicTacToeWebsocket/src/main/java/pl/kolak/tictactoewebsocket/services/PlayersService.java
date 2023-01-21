package pl.kolak.tictactoewebsocket.services;


import core.VictoryChecker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.kolak.tictactoewebsocket.model.GameData;
import pl.kolak.tictactoewebsocket.repositories.PlayersRepo;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PlayersService {

    private final PlayersRepo playersRepo;

    @Autowired
    public PlayersService(PlayersRepo playersRepo) {
        this.playersRepo = playersRepo;
    }

    public void removeGame(String gameId) {
        this.playersRepo.delete(gameId);
    }

    public List<String> getAvailableGames() {
        return this.playersRepo.getAllGames()
                .stream()
                .filter(gamePlayersNo -> gamePlayersNo.getValue() <= 1)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    public void addPlayerToGame(String gameId) {
        this.playersRepo.addPlayerToGame(gameId);
    }

    public void setHostPlayer(String gameId) {
        this.playersRepo.addFirstPlayerToGame(gameId);
    }

    public void deleteGameIfOver(GameData gameData) {
        int result = gameData.whoWon();

        if (result != VictoryChecker.NO_ONE) {
            this.playersRepo.delete(gameData.game().getGameId());
        }
    }

    public boolean gameExist(String gameId) {
        return this.playersRepo.getPlayersCount(gameId)
                .map(integer -> integer == 1)
                .orElse(false);
    }

    public boolean gameDoesntExist(String gameId) {
        return this.playersRepo.getPlayersCount(gameId).isEmpty();
    }
}
