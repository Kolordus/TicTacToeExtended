package pl.kolak.tictactoewebsocket;

import core.Game;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.messaging.support.GenericMessage;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/")
@CrossOrigin(value = "http://localhost:4200")
public class Controller {

    // tutaj trzymamy gry z ilością graczy

    private Map<String, Integer> playersAtGame;

    private final GameService gameService;

    private static int playersNo = 0;

    public Controller(GameService gameService) {
        this.gameService = gameService;
        playersAtGame = new HashMap<>(64);
    }

    @GetMapping("/create")
    public GameWithId createGame() {
        String gameId = UUID.randomUUID().toString();

        playersAtGame.putIfAbsent(gameId, 1);

        return new GameWithId(gameId, gameService.createGame(gameId));
    }

    @EventListener
    public void handleSessionSubscribeEvent(SessionSubscribeEvent event) {
        System.out.println("SessionSubscribeEvent");

        GenericMessage message = (GenericMessage) event.getMessage();
        String simpDestination = (String) message.getHeaders().get("simpDestination");
        MessageHeaders headers = message.getHeaders();
        headers.forEach((s, o) -> System.out.println(s + " " + o.toString()));

        if (simpDestination.startsWith("/topic/room/")) {
            System.out.println("o chuj");
        }
    }

    @EventListener
    public String connect(SessionConnectEvent event) {
        System.out.println("SessionConnectEvent");

        GenericMessage message = (GenericMessage) event.getMessage();
        String simpDestination = (String) message.getHeaders().get("simpDestination");
        MessageHeaders headers = message.getHeaders();
        headers.forEach((s, o) -> System.out.println(s + " " + o.toString()));

        return "HEEEEEELo";
    }

    @EventListener
    public String connected(SessionConnectedEvent event) {
        System.out.println("SessionConnectEvent");

        GenericMessage message = (GenericMessage) event.getMessage();
        String simpDestination = (String) message.getHeaders().get("simpDestination");
        MessageHeaders headers = message.getHeaders();
        headers.forEach((s, o) -> System.out.println(s + " " + o.toString()));

        return "HALO";
    }

    @EventListener
    public void another(SessionDisconnectEvent event) {
        System.out.println("SessionDisconnectEvent");

        GenericMessage message = (GenericMessage) event.getMessage();
        String simpDestination = (String) message.getHeaders().get("simpDestination");
        MessageHeaders headers = message.getHeaders();
        headers.forEach((s, o) -> System.out.println(s + " " + o.toString()));

        throw new IllegalArgumentException();
    }

    @MessageMapping("/dupa/{gameId}")
    @SendTo("/topic/room/{gameId}")
//    @SendTo("/app/dupa/{gameId}")
    public Game method(@DestinationVariable String gameId, GameData gameData) {
        System.out.println(gameId);
        System.out.println(gameData);

        playersAtGame.put(gameId, playersAtGame.get(gameId) + 1);

        return gameService.updateGame(gameData.gameId, Integer.parseInt(gameData.fieldNo), Integer.parseInt(gameData.nominal));
    }

    @SubscribeMapping("/dupa")
    @SendTo("/topic/room/{gameId}")
    public String method(@DestinationVariable String gameId) {
        System.out.println(gameId);
        System.out.println("jest kurwa!!!");

        return "ja pierdolle";
    }

    record GameWithId(String gameId, Game game) { }
    record GameData(String gameId, String fieldNo, String nominal) { }

}
