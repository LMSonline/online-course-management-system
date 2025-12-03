package vn.uit.lms.shared.constant;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Supported languages in the LMS
 */
@Schema(description = "Supported languages")
public enum Language {
    @Schema(description = "English")
    EN("en", "English"),

    @Schema(description = "Vietnamese")
    VI("vi", "Vietnamese"),

    @Schema(description = "Japanese")
    JA("ja", "Japanese");

    private final String code;
    private final String displayName;

    Language(String code, String displayName) {
        this.code = code;
        this.displayName = displayName;
    }

    @Schema(description = "Language code (ISO 639-1)", example = "en")
    public String getCode() {
        return code;
    }

    @Schema(description = "Display name of the language", example = "English")
    public String getDisplayName() {
        return displayName;
    }

    /**
     * Get Language enum from code
     * @param code Language code (e.g., "en", "vi")
     * @return Language enum
     * @throws IllegalArgumentException if code is invalid
     */
    public static Language fromCode(String code) {
        for (Language lang : values()) {
            if (lang.code.equalsIgnoreCase(code)) {
                return lang;
            }
        }
        throw new IllegalArgumentException("Invalid language code: " + code);
    }
}


