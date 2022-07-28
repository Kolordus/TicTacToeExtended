package pl.kolak.tictactoewebsocket;

import core.Game;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

        return new GameWithId(gameId, gameService.createGame(gameId));
    }

//    @EventListener
//    public void handleSessionSubscribeEvent(SessionSubscribeEvent event) {
//        System.out.println("===SessionSubscribeEvent===");
//
//        GenericMessage message = (GenericMessage) event.getMessage();
//        String simpDestination = (String) message.getHeaders().get("simpDestination");
//        MessageHeaders headers = message.getHeaders();
//        headers.forEach((s, o) -> System.out.println(s + " " + o.toString()));
//
//        if (simpDestination.startsWith("/topic/room/")) {
//            System.out.println("o chuj");
//        }
//        System.out.println("===SessionSubscribeEvent===");
//    }
//
//    @EventListener
//    public void connect(SessionConnectEvent event) {
//        System.out.println("===SessionConnectEvent===");
//
//        GenericMessage message = (GenericMessage) event.getMessage();
//        String simpDestination = (String) message.getHeaders().get("simpDestination");
//        MessageHeaders headers = message.getHeaders();
//        headers.forEach((s, o) -> System.out.println(s + " " + o.toString()));
//
//        System.out.println("===SessionConnectEvent===");
//    }
//
//    @EventListener
//    public void connected(SessionConnectedEvent event) {
//        System.out.println("===SessionConnectEvent===");
//
//        GenericMessage message = (GenericMessage) event.getMessage();
//        String simpDestination = (String) message.getHeaders().get("simpDestination");
//        MessageHeaders headers = message.getHeaders();
//        headers.forEach((s, o) -> System.out.println(s + " " + o.toString()));
//
//        System.out.println("===SessionConnectEvent===");
//    }
//
//    @EventListener
//    public void another(SessionDisconnectEvent event) {
//        System.out.println("===SessionDisconnectEvent===");
//
//        GenericMessage message = (GenericMessage) event.getMessage();
//        String simpDestination = (String) message.getHeaders().get("simpDestination");
//        MessageHeaders headers = message.getHeaders();
//        headers.forEach((s, o) -> System.out.println(s + " " + o.toString()));
//
//        System.out.println("===SessionDisconnectEvent===");
//    }

    // send()
    @MessageMapping("/dupa/{gameId}")
    @SendTo("/topic/room/{gameId}")
    public Game method(@DestinationVariable String gameId, GameData gameData) {

        return gameService.updateGame(gameData.gameId, Integer.parseInt(gameData.fieldNo), Integer.parseInt(gameData.nominal));
    }

    @SubscribeMapping("/dupa/{gameId}")
    public String method(@DestinationVariable String gameId) {
        System.out.println(gameId);
        System.out.println("jest kurwa!!!");

        return gameId.equals("s") ? "1" : "0";

    }

    record GameWithId(String gameId, Game game) { }
    record GameData(String gameId, String fieldNo, String nominal) { }

}
