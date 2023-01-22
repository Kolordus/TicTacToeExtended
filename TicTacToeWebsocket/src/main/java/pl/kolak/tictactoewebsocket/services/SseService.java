package pl.kolak.tictactoewebsocket.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import pl.kolak.tictactoewebsocket.repositories.SseRepo;

import java.io.IOException;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class SseService {

    private final SseRepo sseRepo;

    @Autowired
    public SseService(SseRepo sseRepo) {
        this.sseRepo = sseRepo;
    }

    private final ExecutorService nonBlockingService =
            Executors.newFixedThreadPool(1);

    public SseEmitter createEmitter() {
        SseEmitter sseEmitter = new SseEmitter();
        this.sseRepo.save(sseEmitter);
        return sseEmitter;
    }

    public void updateAvailableGames(String msgContent) throws RuntimeException {
        sseRepo.getAll().forEach(emitter -> CompletableFuture.runAsync(() -> {
            try {
                emitter.send(msgContent);
            } catch (IOException e) {
                // todo - nothing for now - it doesnt stop working anyway so...
            }
        }, nonBlockingService));
    }

    public void deleteEmitter(int id) {
        sseRepo.deleteById(id);
    }
}
