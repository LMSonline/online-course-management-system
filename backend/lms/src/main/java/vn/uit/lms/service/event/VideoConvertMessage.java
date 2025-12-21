package vn.uit.lms.service.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VideoConvertMessage {
    private String objectKey;
    private String bucket;
    private Long lessonId;  // Lesson ID to update after processing
}
