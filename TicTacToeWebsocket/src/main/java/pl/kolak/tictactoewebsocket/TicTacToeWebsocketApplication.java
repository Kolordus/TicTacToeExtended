package pl.kolak.tictactoewebsocket;

import core.VictoryChecker;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TicTacToeWebsocketApplication {

    public static void main(String[] args) {

        SpringApplication.run(TicTacToeWebsocketApplication.class, args);
    }


    @Bean
    public VictoryChecker getVictoryChecker() {
        return new VictoryChecker();
    }

}
