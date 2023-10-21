package pl.kolak.tictactoewebsocket.repositories;


import org.springframework.stereotype.Repository;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Collection;
import java.util.Map;
import java.util.WeakHashMap;

@Repository
public class SseRepo {

    private final Map<String, SseEmitter> emitters = new WeakHashMap<>(64);

    public Collection<SseEmitter> getAll() {
        return emitters.values();
    }

    public void save(SseEmitter emitter) {
        this.emitters.put(emitter.toString(), emitter);
    }

    public void deleteById(SseEmitter emitter) {
        this.emitters.remove(emitter);
    }
}
