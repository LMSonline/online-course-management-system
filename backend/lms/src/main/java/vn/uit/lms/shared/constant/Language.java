package vn.uit.lms.shared.constant;

public enum Language {
    EN("en", "English"),
    VI("vi", "Vietnamese"),
    JA("ja", "Japanese");

    private final String code;
    private final String displayName;

    Language(String code, String displayName) {
        this.code = code;
        this.displayName = displayName;
    }

    public String getCode() {
        return code;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static Language fromCode(String code) {
        for (Language lang : values()) {
            if (lang.code.equalsIgnoreCase(code)) {
                return lang;
            }
        }
        throw new IllegalArgumentException("Invalid language code: " + code);
    }
}

