package pl.kolak.tictactoewebsocket.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import pl.kolak.tictactoewebsocket.repositories.PlayersRepo;
import pl.kolak.tictactoewebsocket.repositories.SseRepo;

@Service
public class StatsService {

    private final Logger logger = LoggerFactory.getLogger(StatsService.class);
    private final PlayersRepo playersRepo;
    private final GameService gameService;

    private final SseRepo sseRepo;

    public StatsService(PlayersRepo playersRepo, GameService gameService, SseRepo sseRepo) {
        this.playersRepo = playersRepo;
        this.gameService = gameService;
        this.sseRepo = sseRepo;
    }

    @Scheduled(cron = "*/20 * * * * *")
    public void showStats() {
        playersRepo.getAllGames()
                .forEach((entry) -> logger.info("from Controller: At game {} there is {} players", entry.getKey(), entry.getValue()));

        int size = gameService.getGamesForStats().keySet().size();

        if (size > 0)
            logger.info("from gameservice: {} games", gameService.getGamesForStats().keySet().size());
    }

    @Scheduled(cron = "*/10 * * * * *")
    public void method() {

        logger.info("Ilość emitterów: {}", sseRepo.getAll().size());
    }
}
