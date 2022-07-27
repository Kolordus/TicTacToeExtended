package pl.kolak.tictactoewebsocket;

import core.Game;
import core.VictoryChecker;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class TicTacToeWebsocketApplication {

    public static void main(String[] args) {

        SpringApplication.run(TicTacToeWebsocketApplication.class, args);
    }


    @Bean
    public VictoryChecker getVictoryChecker() {
        return new VictoryChecker();
    }

}
