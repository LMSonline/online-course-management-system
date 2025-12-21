package vn.uit.lms.shared.constant;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Video processing status for lessons
 * Represents the lifecycle of video content processing
 *
 * Used to track video encoding/transcoding status in LMS systems
 * like Udemy, Coursera where videos need processing before playback
 */
@Schema(description = "Video processing status")
public enum  VideoStatus {

    @Schema(description = "Video uploaded but not yet processed")
    UPLOADED,

    @Schema(description = "Video is being transcoded/processed")
    PROCESSING,

    @Schema(description = "Video is ready for streaming")
    READY,

    @Schema(description = "Video processing failed")
    FAILED;

    /**
     * Check if video is available for playback
     */
    public boolean isPlayable() {
        return this == READY;
    }

    /**
     * Check if video is in progress (uploaded or processing)
     */
    public boolean isInProgress() {
        return this == UPLOADED || this == PROCESSING;
    }

    /**
     * Check if video processing completed (success or failure)
     */
    public boolean isTerminal() {
        return this == READY || this == FAILED;
    }
}

