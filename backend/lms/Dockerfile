# Multi-stage build để tối ưu kích thước image

# Stage 1: Build application
FROM gradle:8.5-jdk17-alpine AS builder

WORKDIR /app

# Copy Gradle files
COPY build.gradle.kts settings.gradle.kts ./
COPY gradle ./gradle

# Download dependencies (cached layer)
RUN gradle dependencies --no-daemon || true

# Copy source code
COPY src ./src

# Build application (skip tests for faster build)
RUN gradle bootJar --no-daemon -x test

# Stage 2: Runtime image
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Install a lightweight HTTP client for healthcheck
RUN apk add --no-cache curl \
 && addgroup -S spring && adduser -S spring -G spring

# Copy JAR from builder stage (do this as root, then set ownership)
COPY --from=builder /app/build/libs/*.jar app.jar
RUN chown spring:spring app.jar || true
USER spring:spring

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# JVM options for containerized environment
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+UseG1GC"

# Run application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]