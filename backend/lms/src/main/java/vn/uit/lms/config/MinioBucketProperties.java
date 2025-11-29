package vn.uit.lms.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import lombok.*;

@Component
@ConfigurationProperties(prefix = "minio.buckets")
@Getter
@Setter
public class MinioBucketProperties {

    private String videos;
    private String images;
    private String documents;
}