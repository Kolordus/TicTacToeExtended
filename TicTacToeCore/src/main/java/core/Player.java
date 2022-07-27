package core;

import java.util.*;

class Player {
    private final int no;
    private final List<Integer> nominalsLeft;

    public Player(int no) {
        // validacja
        this.no = no;
        this.nominalsLeft = new ArrayList<>(List.of(1,2,3,4,5));
    }

    public void discardNominal(Integer nominal) {
        if (!nominalsLeft.contains(nominal))
            throw new NoSuchElementException("Nominal already used!");
        nominalsLeft.remove(nominal);
    }

    public int getNo() {
        return no;
    }

    public List<Integer> getNominalsLeft() {
        return nominalsLeft;
    }
}
