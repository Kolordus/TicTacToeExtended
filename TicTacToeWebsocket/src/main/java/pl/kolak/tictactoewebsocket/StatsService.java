package pl.kolak.tictactoewebsocket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class StatsService {

    private final Logger logger = LoggerFactory.getLogger(StatsService.class);
    private final Controller controller;
    private final GameService gameService;

    public StatsService(Controller controller, GameService gameService) {
        this.controller = controller;
        this.gameService = gameService;
    }

    @Scheduled(cron = "*/10 * * * * *")
    public void showStats() {
        Map<String, Integer> games = controller.getGames();

        games.forEach((key, integer) -> logger.info("from Controller: At game {} there is {} players", key, integer));

        int size = gameService.getGamesForStats().keySet().size();

        if (size > 0)
            logger.info("from gameservice: {} games", gameService.getGamesForStats().keySet().size());

    }
}
