package pl.kolak.tictactoewebsocket.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Controller
@CrossOrigin(value = "*")
public class ServerSentEventsController {

    private final ExecutorService nonBlockingService = Executors
            .newCachedThreadPool();

    private final Map<String, SseEmitter> emiters = new HashMap<>();

    @GetMapping("/sse/{name}")
    public ResponseEntity<SseEmitter> createSseTopic(@PathVariable String name) {
        SseEmitter emitter = new SseEmitter();
        emiters.put(name, emitter);

        return new ResponseEntity<>(emitter, HttpStatus.OK);
    }

    @PostMapping("/sse/{name}")
    public ResponseEntity<?> sendToSseTopic(@PathVariable String name, @RequestBody String body) {
        if (noSuchTopic(name)) {
            return new ResponseEntity<>("No topic with name: " + name, HttpStatus.NO_CONTENT);
        }

        SseEmitter emitter = emiters.get(name);
        nonBlockingService.execute(() -> {
            try {
                emitter.send(body);
            } catch (Exception ex) {
                emitter.completeWithError(ex);
            }
        });
        return new ResponseEntity<>(HttpStatus.OK);
    }

    private boolean noSuchTopic(String name) {
        return !emiters.containsKey(name);
    }
}
