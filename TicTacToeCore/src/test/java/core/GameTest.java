package core;

import org.junit.jupiter.api.Test;

import static core.VictoryChecker.*;
import static org.junit.jupiter.api.Assertions.*;


class GameTest {

    @Test
    public void diagonalTopRight() {
        Game game = new Game();
        VictoryChecker victoryChecker = new VictoryChecker();

        // PLAYER_1
        game.newInput(5, PLAYER_1);
        game.getStats();
        assertEquals(NO_ONE, victoryChecker.checkForWinner(game));

        //2
        game.newInput(PLAYER_1, 2);
        game.getStats();
        assertEquals(NO_ONE, victoryChecker.checkForWinner(game));

        //1
        game.newInput(3, 3);
        game.getStats();
        assertEquals(NO_ONE, victoryChecker.checkForWinner(game));

        //2
        game.newInput(4, 1);
        game.getStats();
        assertEquals(NO_ONE, victoryChecker.checkForWinner(game));

        //1
        game.newInput(7, 2);
        game.getStats();
        assertEquals(PLAYER_1, victoryChecker.checkForWinner(game));
    }

    @Test
    public void diagonalTopLeft() {
        Game game = new Game();
        VictoryChecker victoryChecker = new VictoryChecker();

        // 1
        game.newInput(1, 1);
        game.getStats();
        assertEquals(NO_ONE, victoryChecker.checkForWinner(game));

        //2
        game.newInput(2, 2);
        game.getStats();
        assertEquals(NO_ONE, victoryChecker.checkForWinner(game));

        //1
        game.newInput(5, 3);
        game.getStats();
        assertEquals(NO_ONE, victoryChecker.checkForWinner(game));

        //2
        game.newInput(4, 1);
        game.getStats();
        assertEquals(NO_ONE, victoryChecker.checkForWinner(game));

        //1
        game.newInput(9, 2);
        game.getStats();
        assertEquals(PLAYER_1, victoryChecker.checkForWinner(game));
    }

    @Test
    public void rows() {
        Game game = new Game();
        VictoryChecker victoryChecker = new VictoryChecker();

        // 1
        game.newInput(1, 1);
        game.getStats();
        assertEquals(NO_ONE, victoryChecker.checkForWinner(game));

        //2
        game.newInput(4, 2);
        game.getStats();
        assertEquals(NO_ONE, victoryChecker.checkForWinner(game));

        //1
        game.newInput(2, 3);
        game.getStats();
        assertEquals(NO_ONE, victoryChecker.checkForWinner(game));

        //2
        game.newInput(6, 1);
        game.getStats();
        assertEquals(NO_ONE, victoryChecker.checkForWinner(game));

        //1
        game.newInput(3, 2);
        game.getStats();
        assertEquals(PLAYER_1, victoryChecker.checkForWinner(game));

        game = new Game();


        game.newInput(1,1); //1
        game.newInput(2,1); //2
        game.newInput(3,2); //1
        game.newInput(5,2); //2
        game.newInput(9,3); //1
        game.newInput(8,3); //2
        game.newInput(7,4); //1

        assertEquals(PLAYER_2, victoryChecker.checkForWinner(game));

    }

    @Test
    public void draw() {
        Game game = new Game();

        game.newInput(1,1); //1
        game.newInput(1,2); //2
        game.newInput(1,3); //1
        game.newInput(1,4); //2
        game.newInput(1,5); //1
        game.newInput(2,1); //2
        game.newInput(2,2); //1
        game.newInput(2,3); //2
        game.newInput(2,4); //1
        game.newInput(2,5); //2

        assertEquals(DRAW, new VictoryChecker().checkForWinner(game));
    }

    @Test
    public void testValidation() {
        Game game = new Game();
        VictoryChecker victoryChecker = new VictoryChecker();

        // 1
        game.newInput(1, 1);
        game.getStats();
        assertEquals(NO_ONE,
                victoryChecker.checkForWinner(game));

        //2
        assertThrows(IllegalArgumentException.class,
                () -> game.newInput(1, 1));

        assertThrows(IllegalArgumentException.class,
                () -> Field.createNewField(0));

        assertThrows(IllegalArgumentException.class,
                () -> Field.createNewField(11));

        assertThrows(IllegalArgumentException.class,
                () -> game.newInput(5, 10));
    }

}