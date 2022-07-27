package pl.kolak.tictactoewebsocket;

import core.Game;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/")
@CrossOrigin(value = "http://localhost:4200")
public class Controller {

    private final GameService gameService;

    public Controller(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping("/create")
    public GameWithId createGame() {
        String gameId = UUID.randomUUID().toString();

        return new GameWithId(gameId, gameService.createGame(gameId));
    }

    @MessageMapping("/dupa/{gameId}")
    @SendTo("/topic/room/{gameId}")
//    public Game method(@DestinationVariable String gameId, int fieldNo, int nominal) {
    public Game method(@DestinationVariable String gameId, GameData aa) {
        System.out.println(gameId);
        System.out.println(aa);
        return gameService.updateGame(aa.gameId, Integer.parseInt(aa.fieldNo), Integer.parseInt(aa.nominal));
    }

    record GameWithId(String gameId, Game game) { }
    record GameData(String gameId, String fieldNo, String nominal) { }

}
