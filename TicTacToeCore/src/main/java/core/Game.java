package core;

import java.util.LinkedList;
import java.util.List;
import java.util.UUID;
import java.util.stream.IntStream;

public class Game {

    private final String gameId;
    private final List<Field> board;
    private final Player player1;
    private final Player player2;
    private Player currentPlayer;

    private static LinkedList<Field> prepareBoard() {
        LinkedList<Field> newBoard = new LinkedList<>();
        IntStream.range(1, 10)
                .forEach(i -> newBoard.add(Field.createNewField(i)));

        return newBoard;
    }

    public Game() {
        this.gameId = UUID.randomUUID().toString();
        this.board = prepareBoard();
        this.player1 = new Player(1);
        this.player2 = new Player(2);
        this.currentPlayer = player1;
    }

    public void newInput(int fieldNo, int nominal) {
        validInput(fieldNo, nominal);

        for (Field field : board) {
            if (field.fieldNo() == fieldNo) {
                int indexToChange = board.indexOf(field);
                board.set(indexToChange, Field.updateField(field, currentPlayer, nominal));
            }
        }

        currentPlayer.discardNominal(nominal);

        changeTurn();
    }

    private void validInput(int fieldNo, int nominal) {
        Validator.validateFiledNo(fieldNo);
        Validator.validateNominalRange(nominal);
    }

    public Player getCurrentPlayer() {
        return currentPlayer;
    }

    public void getStats() {
        int counter = 0;
        for (Field field : board) {
            counter++;
            System.out.print("| " + field.playerNo());
            if (counter % 3 == 0) {
                System.out.println();
            }
        }

        System.out.println("+++++");
    }

    public List<Field> getBoard() {
        return board;
    }

    public Player getPlayer1() {
        return player1;
    }

    public Player getPlayer2() {
        return player2;
    }

    public void changeTurn() {
        currentPlayer = currentPlayer == player1 ? player2 : player1;
    }

    public String getGameId() {
        return gameId;
    }
}


