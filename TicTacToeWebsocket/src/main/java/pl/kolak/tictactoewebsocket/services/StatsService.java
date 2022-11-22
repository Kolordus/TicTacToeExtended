package pl.kolak.tictactoewebsocket.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class StatsService {

    private final Logger logger = LoggerFactory.getLogger(StatsService.class);
    private final PlayersService playersService;
    private final GameService gameService;

    public StatsService(PlayersService playersService, GameService gameService) {
        this.playersService = playersService;
        this.gameService = gameService;
    }

    @Scheduled(cron = "*/20 * * * * *")
    public void showStats() {
        playersService.getGames()
                .forEach((key, integer) -> logger.info("from Controller: At game {} there is {} players", key, integer));

        int size = gameService.getGamesForStats().keySet().size();

        if (size > 0)
            logger.info("from gameservice: {} games", gameService.getGamesForStats().keySet().size());
    }
}
