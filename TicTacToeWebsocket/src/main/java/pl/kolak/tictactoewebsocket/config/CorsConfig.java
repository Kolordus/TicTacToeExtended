package pl.kolak.tictactoewebsocket.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import pl.kolak.tictactoewebsocket.util.Constants;


@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                registry.addMapping("**")
                        .allowCredentials(false)
                        .allowedOrigins(Constants.CORS_URL)
                        .allowedMethods("POST", "DELETE", "PATCH");
            }
        };
    }
}
