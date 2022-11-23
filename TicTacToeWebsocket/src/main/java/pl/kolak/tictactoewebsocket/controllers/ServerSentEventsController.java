package pl.kolak.tictactoewebsocket.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import pl.kolak.tictactoewebsocket.util.Constants;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Controller
@CrossOrigin(value = Constants.CORS_URL)
public class ServerSentEventsController {

    private final ExecutorService nonBlockingService =
            Executors.newCachedThreadPool();

    private final SseEmitter emitter = new SseEmitter();

    @GetMapping("/sse/lobby")
    public ResponseEntity<SseEmitter> getSse() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(emitter);
    }

    @PostMapping("/sse/lobby")
    public ResponseEntity<?> sendToSseTopic(@RequestBody String body) {
        nonBlockingService.execute(() -> {
            try {
                emitter.send(body);
            } catch (Exception ex) {
                emitter.completeWithError(ex);
            }
        });
        return new ResponseEntity<>(HttpStatus.OK);
    }
}


/* tu jest ciekawostka jak to rozbić na poszczególne pokoje
@GetMapping("/sse/{name}")
    public ResponseEntity<SseEmitter> createSseTopic(@PathVariable String name) {
        SseEmitter emitter = new SseEmitter();
        emitters.put(name, emitter);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(emitter);
    }

    @PostMapping("/sse/{name}")
    public ResponseEntity<?> sendToSseTopic(@PathVariable String name, @RequestBody String body) {
        if (noSuchTopic(name)) {
            return ResponseEntity
                    .status(HttpStatus.NO_CONTENT)
                    .body("No topic with name: " + name);
        }

        SseEmitter emitter = emitters.get(name);
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
        return !emitters.containsKey(name);
    }

 */