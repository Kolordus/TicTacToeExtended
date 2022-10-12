package pl.kolak.tictactoewebsocket;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Controller
@CrossOrigin(value = "*")
public class SSEController {

    private final ExecutorService nonBlockingService = Executors
            .newCachedThreadPool();

    private final Map<String, SseEmitter> emiters = new HashMap<>();

    @GetMapping("/sse/{name}")
    public ResponseEntity<SseEmitter> streamSseMvc(@PathVariable String name) {
        SseEmitter emitter = new SseEmitter();
        emiters.put(name, emitter);

        return new ResponseEntity<>(emitter, HttpStatus.OK);
    }

    @PostMapping("/sse/{name}")
    public ResponseEntity<?> method(@PathVariable String name) {
        if (!emiters.containsKey(name)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        SseEmitter emitter = emiters.get(name);
        nonBlockingService.execute(() -> {
            try {
                emitter.send(name);
            } catch (Exception ex) {
                emitter.completeWithError(ex);
            }
        });
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
