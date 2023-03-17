package pl.kolak.tictactoewebsocket.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.boot.test.context.SpringBootTest;
import pl.kolak.tictactoewebsocket.repositories.PlayersRepo;

import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
class PlayersServiceTest {

    PlayersRepo playersRepo = new PlayersRepo();

    PlayersService serviceUnderTest = new PlayersService(playersRepo);

    @BeforeEach
    public void populate() {
        playersRepo.addFirstPlayerToGame("test");
        playersRepo.addFirstPlayerToGame("test1");
        playersRepo.addFirstPlayerToGame("test2");
    }

    @ParameterizedTest
    @CsvSource(textBlock = """
            test, true,
            test1, true,
            test2, true,
            test3, false
            """
    )
    @DisplayName("Game Exist should return correct values")
    public void test1(String gameId, boolean result) {
        boolean test = serviceUnderTest.gameExist(gameId);

        assertEquals(test, result);
    }

    private static Stream<Arguments> testExistingGames() {
        return Stream.of(
                Arguments.of("test", true),
                Arguments.of("test1", true),
                Arguments.of("test2", true),
                Arguments.of("test3", false)
        );
    }
}