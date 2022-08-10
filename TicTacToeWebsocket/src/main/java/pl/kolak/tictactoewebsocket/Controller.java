package pl.kolak.tictactoewebsocket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import core.VictoryChecker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/")
@CrossOrigin(value = "http://localhost:4200")
public class Controller {

    record GameDataInput(String gameId, String fieldNo, String nominal) {
    }

    private final Logger logger = LoggerFactory.getLogger(Controller.class);

    private final GameService gameService;

    private final ObjectMapper objectMapper;

    private final Map<String, Integer> playersAtGame;

    public Controller(GameService gameService) {
        this.gameService = gameService;
        playersAtGame = new HashMap<>(64);
        objectMapper = new ObjectMapper();
    }

    @PostMapping("/games")
    public GameData createGame() {
        return gameService.createGame();
    }

    @GetMapping("/games/{gameId}")
    public GameData joinGame(@PathVariable String gameId) {
        return gameService.getGame(gameId);
    }

    @PutMapping("/games/{gameId}")
    public void disconnectFromGame(@PathVariable String gameId) {
        gameService.removeGame(gameId);
        playersAtGame.remove(gameId);
    }

    @GetMapping("/games")
    public List<String> showAvailableGames() {
        return playersAtGame.entrySet()
                .stream()
                .filter(gamePlayersNo -> gamePlayersNo.getValue() <= 1)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    /**
     * @return WebSocket client doesn't respond to null so null is returnable.
     */
    @MessageMapping("/room/{gameId}")
    @SendTo("/room/{gameId}")
    public GameData updateGame(@DestinationVariable String gameId, @Payload String payload) {

        if (playerDisconnected(payload)) {
            logEvent(gameId, payload);
            return GameData.EMPTY;
        }

        GameDataInput gameDataInput = getGameDataInput(payload, gameId);

        return updateGame(gameId, gameDataInput);
    }

    @SubscribeMapping("/room/{gameId}")
    public int subscribe(@DestinationVariable String gameId, SimpMessageHeaderAccessor headerAccessor) {
        int result = 0;

        if (gameExist(gameId)) {
            playersAtGame.merge(gameId, 1, Integer::sum);
            result = 2;
        }

        if (gameDoesntExist(gameId)) {
            playersAtGame.put(gameId, 1);
            result = 1;
        }

        return result;
    }

    private GameDataInput getGameDataInput(String payload, String gameId) {
        GameDataInput gameDataInput = null;
        try {
            gameDataInput = objectMapper.readValue(payload, GameDataInput.class);
        } catch (JsonProcessingException e) {
            logger.info("Unknown error. Data gathered: gameId: {}, payload: {}", gameId, payload);
        }

        return gameDataInput;
    }

    private boolean playerDisconnected(String payload) {
        return payload.contains("surrender");
    }

    private GameData updateGame(String gameId, GameDataInput gameDataInput) {
        GameData gameData;
        gameData = gameService.updateGameAndCheckVictory(gameId,
                Integer.parseInt(gameDataInput.fieldNo),
                Integer.parseInt(gameDataInput.nominal));

        deleteGameIfOver(gameData);
        return gameData;
    }

    private void logEvent(String gameId, String payload) {
        String disconnectedPlayerId = payload.substring(payload.lastIndexOf(":") + 1, payload.length() - 1);
        logger.info("Player {} disconnected the game {}", disconnectedPlayerId, gameId);
    }

    private void deleteGameIfOver(GameData gameData) {
        if (gameData.whoWon() != VictoryChecker.NO_ONE) {
            this.playersAtGame.remove(gameData.game().getGameId());
        }
    }

    private boolean gameExist(String gameId) {
        if (playersAtGame.get(gameId) != null)
            return playersAtGame.get(gameId) == 1;
        return false;
    }

    private boolean gameDoesntExist(String gameId) {
        return playersAtGame.get(gameId) == null;
    }

    public Map<String, Integer> getGames() {
        return playersAtGame;
    }

    private boolean isNotValid(GameDataInput gameDataInput) {
        return gameDataInput.gameId == null || gameDataInput.fieldNo == null || gameDataInput.nominal == null;
    }

}
