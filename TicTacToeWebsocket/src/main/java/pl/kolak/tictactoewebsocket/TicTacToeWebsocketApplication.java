package pl.kolak.tictactoewebsocket;


import core.VictoryChecker;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

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


