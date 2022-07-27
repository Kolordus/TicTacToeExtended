package core;

public class Validator {

    public static void validateFiledNo(int fieldNo) {
        if (fieldNo < 1 || fieldNo > 9)
            throw new IllegalArgumentException("fieldNo must be in range 1 to 9.");
    }

    public static void validateNominalRange(int nominal) {
        if (nominal < 1 || nominal > 5)
            throw new IllegalArgumentException("nominal must be in range 1 to 5.");
    }

    public static void validateNominalAllowed(int previuos, int current) {
        if (previuos >= current)
            throw new IllegalArgumentException("Nominal must be higher than previous one");
    }
}
