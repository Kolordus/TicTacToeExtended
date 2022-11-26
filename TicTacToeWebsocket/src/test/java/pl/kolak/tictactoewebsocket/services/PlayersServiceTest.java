package pl.kolak.tictactoewebsocket.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import pl.kolak.tictactoewebsocket.repositories.PlayersRepo;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;


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


    @Test
    @DisplayName("Game Exist should return correct values")
    public void test1() {
        boolean test = serviceUnderTest.gameExist("test");
        boolean test1 = serviceUnderTest.gameExist("test1");
        boolean test2 = serviceUnderTest.gameExist("test2");
        boolean test3 = serviceUnderTest.gameExist("test3");

        assertTrue(test);
        assertTrue(test1);
        assertTrue(test2);
        assertFalse(test3);
    }


}