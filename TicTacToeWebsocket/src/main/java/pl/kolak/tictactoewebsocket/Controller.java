package pl.kolak.tictactoewebsocket;

import core.VictoryChecker;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.messaging.support.GenericMessage;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import org.springframework.web.socket.messaging.SessionUnsubscribeEvent;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/")
@CrossOrigin(value = "http://localhost:4200")
public class Controller {

    private final Map<String, Integer> playersAtGame;

    private final GameService gameService;

//    private static int playersNo = 0;

    public Controller(GameService gameService) {
        this.gameService = gameService;
        playersAtGame = new HashMap<>(64);
    }

    @GetMapping("/games/create")
    public GameData createGame() {
        return gameService.createGame();
    }

    @GetMapping("/games/{gameId}")
    public GameData joinGame(@PathVariable String gameId) {
        return gameService.getGame(gameId);
    }

    @GetMapping("/games")
    public Map<String, Integer> showAvailableGames() {
        return playersAtGame.entrySet()
                .stream()
                .filter(gamePlayersNo -> gamePlayersNo.getValue() <= 1)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    @MessageMapping("/room/{gameId}")
    @SendTo("/room/{gameId}")
    public GameData updateGame(@DestinationVariable String gameId, GameDataInput gameDataInput) {
        GameData gameData = gameService.updateGameAndCheckVictory(gameId,
                Integer.parseInt(gameDataInput.fieldNo),
                Integer.parseInt(gameDataInput.nominal));

        deleteGameIfOver(gameData);

        return gameData;
    }

    @SubscribeMapping("/room/{gameId}")
    public int subscribe(@DestinationVariable String gameId, SimpMessageHeaderAccessor headerAccessor) {

        // todo : prawdopodobnie dojdzie całkowita zmiana by podporządkować gry do tych id :|
        System.out.println("jedziemy z headerami:");
        headerAccessor.getMessageHeaders().entrySet()
                .stream()
                .forEach(keyval -> System.out.println(keyval.getKey() + " " + keyval.getValue()));

        this.gameService.getGame(gameId);
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

    @EventListener
    public void catchDisconnectEvent(SessionDisconnectEvent event) {
        System.out.println("===SessionDisconnectEvent===");

        GenericMessage message = (GenericMessage) event.getMessage();
//        String simpDestination = (String) message.getHeaders().get("simpDestination");
//        System.out.println(simpDestination);
        System.out.println(message.getPayload());
        MessageHeaders headers = message.getHeaders();
        headers.forEach((s, o) -> System.out.println(s + " " + o.toString()));

        System.out.println("===SessionDisconnectEvent===");
    }

    @EventListener
    public void catchUnsubscribeEvent(SessionUnsubscribeEvent event) {
        System.out.println("===SessionUnsubscribeEvent===");

        GenericMessage message = (GenericMessage) event.getMessage();
        String simpDestination = (String) message.getHeaders().get("simpDestination");
        System.out.println(simpDestination);
        MessageHeaders headers = message.getHeaders();
        headers.forEach((s, o) -> System.out.println(s + " " + o.toString()));

        System.out.println("===SessionUnsubscribeEvent===");
    }

    @EventListener
    public void catchSubscribeEvent(SessionSubscribeEvent event) {
        System.out.println("===SessionSubscribeEvent===");

        GenericMessage message = (GenericMessage) event.getMessage();
        String simpDestination = (String) message.getHeaders().get("simpDestination");
        MessageHeaders headers = message.getHeaders();
        headers.forEach((s, o) -> System.out.println(s + " " + o.toString()));

        if (simpDestination.startsWith("/topic/room/")) {
            System.out.println("o chuj");
        }
        System.out.println("===SessionSubscribeEvent===");
    }


    public Map<String, Integer> getGames() {
        return playersAtGame;
    }

    record GameDataInput(String gameId, String fieldNo, String nominal) { }

}


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
