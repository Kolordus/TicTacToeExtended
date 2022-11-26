package pl.kolak.tictactoewebsocket.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import pl.kolak.tictactoewebsocket.services.SseService;
import pl.kolak.tictactoewebsocket.util.Constants;

@Controller
@CrossOrigin(value = Constants.CORS_URL)
public class ServerSentEventsController {

    private final SseService sseService;

    @Autowired
    public ServerSentEventsController(SseService sseService) {
        this.sseService = sseService;
    }

    @GetMapping("/sse/lobby")
    public ResponseEntity<SseEmitter> getLobby() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(sseService.createEmitter());
    }

    @PostMapping("/sse/lobby")
    public ResponseEntity<?> sendUpdate(@RequestBody String body) {
        try {
            this.sseService.updateAvailableGames(body);
            return new ResponseEntity<>(HttpStatus.ACCEPTED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}