package core;

import java.util.LinkedList;
import java.util.List;

public class VictoryChecker {

    public static final int NO_ONE = -1;
    public static final int PLAYER_1 = 1;
    public static final int PLAYER_2 = 2;
    private static final List<Integer> ROW_1 = List.of(1, 2, 3);
    private static final List<Integer> ROW_2 = List.of(4, 5, 6);
    private static final List<Integer> ROW_3 = List.of(7, 8, 9);

    private static final List<Integer> COLUMN_1 = List.of(1, 4, 7);
    private static final List<Integer> COLUMN_2 = List.of(2, 5, 8);
    private static final List<Integer> COLUMN_3 = List.of(3, 6, 9);

    private static final List<Integer> DIAGONAL_1 = List.of(1, 5, 9);
    private static final List<Integer> DIAGONAL_2 = List.of(3, 5, 7);

    private final
    List<List<Integer>> cartesian = List.of(ROW_1, ROW_2, ROW_3, COLUMN_1, COLUMN_2, COLUMN_3, DIAGONAL_1, DIAGONAL_2);

    private List<Field> board;

    public int checkForWinner(Game game) {
        this.board = game.getBoard();

        for (List<Integer> rowOrColumn : cartesian) {
            int winner = checkRowOrColumnForVictory(rowOrColumn);
            if (winner > 0)
                return winner;
        }
        return -1;
    }

    private int checkRowOrColumnForVictory(List<Integer> rowOrColumn) {
        int counter = 0;
        int placeTakenByPlayer = 0;
        for (Field field : getRowOrColumn(rowOrColumn)) {
            if (field.playerNo() == 0)
                break;
            if (counter == 0)
                placeTakenByPlayer = field.playerNo();
            if (field.playerNo() == placeTakenByPlayer)
                counter++;
        }

        if (counter == 3)
            return placeTakenByPlayer;

        return -1;
    }

    private List<Field> getRowOrColumn(List<Integer> rowOrColumn) {
        List<Field> list = new LinkedList<>();
        for (Field field : board) {
            if (rowOrColumn.contains(field.fieldNo()))
                list.add(field);
        }
        return list;
    }
}
