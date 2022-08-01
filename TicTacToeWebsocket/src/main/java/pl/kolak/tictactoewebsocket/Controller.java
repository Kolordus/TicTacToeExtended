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
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionUnsubscribeEvent;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/")
@CrossOrigin(value = "http://localhost:4200")
public class Controller {

    private Map<String, Integer> playersAtGame;

    private final GameService gameService;

    private static int playersNo = 0;

    public Controller(GameService gameService) {
        this.gameService = gameService;
        playersAtGame = new HashMap<>(64);
    }

    @GetMapping("/create")
    public Game createGame() {
        return gameService.createGame();
    }

    // send()
    @MessageMapping("/dupa/{gameId}")
    @SendTo("/dupa/{gameId}")
    public Game method(@DestinationVariable String gameId, GameData gameData) {
        return gameService.updateGame(gameId, Integer.parseInt(gameData.fieldNo), Integer.parseInt(gameData.nominal));
    }

    @SubscribeMapping("/dupa/{gameId}")
    public boolean subscribe(@DestinationVariable String gameId) {
        if (playersAtGame.get(gameId) == null) {
            playersAtGame.put(gameId, 1);
            return true;
        }

        if (playersAtGame.get(gameId) == 1) {
            playersAtGame.merge(gameId, 1, Integer::sum);
            return true;
        }

        return false;
    }

    @EventListener
    public void another(SessionDisconnectEvent event) {
        System.out.println("===SessionDisconnectEvent===");

        GenericMessage message = (GenericMessage) event.getMessage();
        String simpDestination = (String) message.getHeaders().get("simpDestination");
        MessageHeaders headers = message.getHeaders();
        headers.forEach((s, o) -> System.out.println(s + " " + o.toString()));

        System.out.println("===SessionDisconnectEvent===");
    }

    @EventListener
    public void another(SessionUnsubscribeEvent event) {
        System.out.println("===SessionUnsubscribeEvent===");

        GenericMessage message = (GenericMessage) event.getMessage();
        String simpDestination = (String) message.getHeaders().get("simpDestination");
        MessageHeaders headers = message.getHeaders();
        headers.forEach((s, o) -> System.out.println(s + " " + o.toString()));

        System.out.println("===SessionUnsubscribeEvent===");
    }


    public Map<String, Integer> getGames() {
        return playersAtGame;
    }

    record GameData(String gameId, String fieldNo, String nominal) { }

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
