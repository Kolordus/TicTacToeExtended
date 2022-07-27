package core;

record Field(int fieldNo, int playerNo, int currentNominal) {

    public static Field createNewField(int fieldNo) {
        Validator.validateFiledNo(fieldNo);
        return new Field(fieldNo, 0, 0);
    }

    public static Field updateField(Field previuos, Player currentPlayer, int newNominal) {
        Validator.validateNominalAllowed(previuos.currentNominal, newNominal);
        return new Field(previuos.fieldNo(), currentPlayer.getNo(), newNominal);
    }

}
