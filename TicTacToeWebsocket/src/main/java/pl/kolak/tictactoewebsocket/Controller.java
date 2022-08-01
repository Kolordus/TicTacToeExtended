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

    private Map<String, Integer> playersAtGame;

    private final GameService gameService;

    private static int playersNo = 0;

    public Controller(GameService gameService) {
        this.gameService = gameService;
        playersAtGame = new HashMap<>(64);
    }

    @GetMapping("/create")
    public Game createGame() {
        Game game = gameService.createGame();

        playersAtGame.put(game.getGameId(), 1);

        return game;
    }

    // send()
    @MessageMapping("/dupa/{gameId}")
    @SendTo("/topic/room/{gameId}")
    public Game method(@DestinationVariable String gameId, GameData gameData) {
        return gameService.updateGame(gameId, Integer.parseInt(gameData.fieldNo), Integer.parseInt(gameData.nominal));
    }

    // todo -> a gdyby tak z ustawień wyjebać prefix "/app" ?????????
    @SubscribeMapping("/dupa/{gameId}")
    public boolean subscribe(@DestinationVariable String gameId) {
        Integer playersInGame = playersAtGame.getOrDefault(gameId, 0);
        if (playersInGame < 2) {
            playersAtGame.merge(gameId, 1, Integer::sum);
        }

        return playersInGame < 2;
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