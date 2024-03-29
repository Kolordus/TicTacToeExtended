package pl.kolak.tictactoewebsocket.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.web.socket.messaging.SessionUnsubscribeEvent;
import pl.kolak.tictactoewebsocket.model.GameData;
import pl.kolak.tictactoewebsocket.model.GameDataInput;
import pl.kolak.tictactoewebsocket.services.GameService;
import pl.kolak.tictactoewebsocket.services.PlayersService;
import pl.kolak.tictactoewebsocket.services.SseService;
import pl.kolak.tictactoewebsocket.util.Constants;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/")
@CrossOrigin(value = Constants.CORS_URL)
public class WebSocketController {

    private final Logger logger = LoggerFactory.getLogger(WebSocketController.class);
    private final GameService gameService;
    private final PlayersService playersService;
    private final SseService sseService;
    private final ObjectMapper objectMapper;

    public WebSocketController(GameService gameService, PlayersService playersService, SseService sseService) {
        this.gameService = gameService;
        this.playersService = playersService;
        this.sseService = sseService;

        objectMapper = new ObjectMapper();
    }

    @PostMapping("/games")
    public GameData createGame() {
        GameData game = gameService.createGame();
        this.sseService.updateAvailableGames("create " + game.game().getGameId());
        return game;
    }

    @GetMapping("/games/{gameId}")
    public GameData joinGame(@PathVariable String gameId) {
        this.sseService.updateAvailableGames("delete " + gameId);
        return gameService.getGame(gameId);
    }

    @PutMapping("/games/{gameId}")
    public void disconnectFromGame(@PathVariable String gameId) {
        this.sseService.updateAvailableGames("delete " + gameId);
        gameService.removeGame(gameId);
        playersService.removeGame(gameId);
    }

    @GetMapping("/games")
    public List<String> showAvailableGames() {
        return playersService.getAvailableGames();
    }

    /**
     * @return WebSocket client doesn't respond to null so null is returnable.
     */
    @MessageMapping("/room/{gameId}")
    @SendTo("/room/{gameId}")
    public GameData updateGame(@DestinationVariable String gameId, @Payload String payload) {
        if (playerDisconnected(payload)) {
            logEventDisconnect(gameId, payload);
            return GameData.EMPTY;
        }

        GameData gameData =
                gameService.updateGame(gameId, getGameDataInputFromPayload(payload, gameId));
        playersService.deleteGameIfOver(gameData);

        return gameData;
    }

    @SubscribeMapping("/room/{gameId}")
    public int subscribe(@DestinationVariable String gameId, SimpMessageHeaderAccessor headerAccessor) {

        /*
        zapisać sessionID()
        jeśli ktoś wbija w hashmapie oraz w localStorage

        zwrócić
         */
        int playersAtGame = 0;

        if (playersService.gameExist(gameId)) {
            playersService.addPlayerToGame(gameId);
            playersAtGame = 2;
        }

        if (playersService.gameDoesntExist(gameId)) {
            playersService.setHostPlayer(gameId);
            playersAtGame = 1;
        }

        return playersAtGame;
    }

    private GameDataInput getGameDataInputFromPayload(String payload, String gameId) {
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

    private void logEventDisconnect(String gameId, String payload) {
        String disconnectedPlayerId = payload.substring(payload.lastIndexOf(":") + 1, payload.length() - 1);
        logger.info("Player {} disconnected the game {}", disconnectedPlayerId, gameId);
    }

    @EventListener
    public void catchEvent(SessionUnsubscribeEvent event) {
        System.out.println(event);
    }

}
