package vn.uit.lms.service.assessment;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.assessment.Quiz;
import vn.uit.lms.core.repository.assessment.QuizRepository;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("Quiz Date Validation Tests")
class QuizDateValidationTest {

    @Autowired
    private QuizRepository quizRepository;

    @Nested
    @DisplayName("Quiz Date Field Tests")
    class QuizDateFieldTests {

        @Test
        @DisplayName("Should create quiz with start and end dates")
        void shouldCreateQuizWithDates() {
            // Arrange
            Instant startDate = Instant.now().plus(1, ChronoUnit.DAYS);
            Instant endDate = Instant.now().plus(7, ChronoUnit.DAYS);

            Quiz quiz = Quiz.builder()
                    .title("Timed Quiz")
                    .description("Quiz with time window")
                    .totalPoints(100.0)
                    .startDate(startDate)
                    .endDate(endDate)
                    .build();

            // Act
            quiz.validate();
            Quiz savedQuiz = quizRepository.save(quiz);

            // Assert
            assertThat(savedQuiz.getId()).isNotNull();
            assertThat(savedQuiz.getStartDate()).isEqualTo(startDate);
            assertThat(savedQuiz.getEndDate()).isEqualTo(endDate);
            assertThat(savedQuiz.hasStartDate()).isTrue();
            assertThat(savedQuiz.hasEndDate()).isTrue();
        }

        @Test
        @DisplayName("Should create quiz without dates (always available)")
        void shouldCreateQuizWithoutDates() {
            // Arrange
            Quiz quiz = Quiz.builder()
                    .title("Always Available Quiz")
                    .description("Quiz without time restrictions")
                    .totalPoints(100.0)
                    .build();

            // Act
            quiz.validate();
            Quiz savedQuiz = quizRepository.save(quiz);

            // Assert
            assertThat(savedQuiz.getId()).isNotNull();
            assertThat(savedQuiz.getStartDate()).isNull();
            assertThat(savedQuiz.getEndDate()).isNull();
            assertThat(savedQuiz.hasStartDate()).isFalse();
            assertThat(savedQuiz.hasEndDate()).isFalse();
            assertThat(savedQuiz.isAvailable()).isTrue();
        }

        @Test
        @DisplayName("Should fail validation when start date is after end date")
        void shouldFailValidationWhenStartDateAfterEndDate() {
            // Arrange
            Instant startDate = Instant.now().plus(7, ChronoUnit.DAYS);
            Instant endDate = Instant.now().plus(1, ChronoUnit.DAYS);

            Quiz quiz = Quiz.builder()
                    .title("Invalid Date Quiz")
                    .totalPoints(100.0)
                    .startDate(startDate)
                    .endDate(endDate)
                    .build();

            // Act & Assert
            assertThatThrownBy(quiz::validate)
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("Start date must be before end date");
        }
    }

    @Nested
    @DisplayName("Quiz Availability Tests")
    class QuizAvailabilityTests {

        @Test
        @DisplayName("Should return available when no dates are set")
        void shouldBeAvailableWithoutDates() {
            // Arrange
            Quiz quiz = Quiz.builder()
                    .title("Always Available Quiz")
                    .totalPoints(100.0)
                    .build();

            // Act & Assert
            assertThat(quiz.isAvailable()).isTrue();
            assertThat(quiz.isNotStarted()).isFalse();
            assertThat(quiz.isEnded()).isFalse();
            assertThat(quiz.isInProgress()).isTrue();
        }

        @Test
        @DisplayName("Should return not available when before start date")
        void shouldBeNotAvailableBeforeStartDate() {
            // Arrange
            Instant startDate = Instant.now().plus(1, ChronoUnit.DAYS);
            Instant endDate = Instant.now().plus(7, ChronoUnit.DAYS);

            Quiz quiz = Quiz.builder()
                    .title("Future Quiz")
                    .totalPoints(100.0)
                    .startDate(startDate)
                    .endDate(endDate)
                    .build();

            // Act & Assert
            assertThat(quiz.isAvailable()).isFalse();
            assertThat(quiz.isNotStarted()).isTrue();
            assertThat(quiz.isEnded()).isFalse();
            assertThat(quiz.getAvailabilityMessage()).contains("will be available");
        }

        @Test
        @DisplayName("Should return not available when after end date")
        void shouldBeNotAvailableAfterEndDate() {
            // Arrange
            Instant startDate = Instant.now().minus(7, ChronoUnit.DAYS);
            Instant endDate = Instant.now().minus(1, ChronoUnit.DAYS);

            Quiz quiz = Quiz.builder()
                    .title("Past Quiz")
                    .totalPoints(100.0)
                    .startDate(startDate)
                    .endDate(endDate)
                    .build();

            // Act & Assert
            assertThat(quiz.isAvailable()).isFalse();
            assertThat(quiz.isNotStarted()).isFalse();
            assertThat(quiz.isEnded()).isTrue();
            assertThat(quiz.getAvailabilityMessage()).contains("ended on");
        }

        @Test
        @DisplayName("Should return available when between start and end dates")
        void shouldBeAvailableBetweenDates() {
            // Arrange
            Instant startDate = Instant.now().minus(1, ChronoUnit.DAYS);
            Instant endDate = Instant.now().plus(7, ChronoUnit.DAYS);

            Quiz quiz = Quiz.builder()
                    .title("Current Quiz")
                    .totalPoints(100.0)
                    .startDate(startDate)
                    .endDate(endDate)
                    .build();

            // Act & Assert
            assertThat(quiz.isAvailable()).isTrue();
            assertThat(quiz.isNotStarted()).isFalse();
            assertThat(quiz.isEnded()).isFalse();
            assertThat(quiz.isInProgress()).isTrue();
            assertThat(quiz.getAvailabilityMessage()).contains("available until");
        }

        @Test
        @DisplayName("Should return available with only start date (no end date)")
        void shouldBeAvailableWithOnlyStartDate() {
            // Arrange
            Instant startDate = Instant.now().minus(1, ChronoUnit.DAYS);

            Quiz quiz = Quiz.builder()
                    .title("Open-ended Quiz")
                    .totalPoints(100.0)
                    .startDate(startDate)
                    .build();

            // Act & Assert
            assertThat(quiz.isAvailable()).isTrue();
            assertThat(quiz.isNotStarted()).isFalse();
            assertThat(quiz.isEnded()).isFalse();
        }

        @Test
        @DisplayName("Should return available with only end date (no start date)")
        void shouldBeAvailableWithOnlyEndDate() {
            // Arrange
            Instant endDate = Instant.now().plus(7, ChronoUnit.DAYS);

            Quiz quiz = Quiz.builder()
                    .title("Quiz with Deadline")
                    .totalPoints(100.0)
                    .endDate(endDate)
                    .build();

            // Act & Assert
            assertThat(quiz.isAvailable()).isTrue();
            assertThat(quiz.isNotStarted()).isFalse();
            assertThat(quiz.isEnded()).isFalse();
        }
    }

    @Nested
    @DisplayName("Quiz Availability Message Tests")
    class QuizAvailabilityMessageTests {

        @Test
        @DisplayName("Should return correct message for not started quiz")
        void shouldReturnNotStartedMessage() {
            // Arrange
            Instant startDate = Instant.now().plus(1, ChronoUnit.DAYS);

            Quiz quiz = Quiz.builder()
                    .title("Future Quiz")
                    .totalPoints(100.0)
                    .startDate(startDate)
                    .build();

            // Act
            String message = quiz.getAvailabilityMessage();

            // Assert
            assertThat(message).contains("will be available starting from");
        }

        @Test
        @DisplayName("Should return correct message for ended quiz")
        void shouldReturnEndedMessage() {
            // Arrange
            Instant endDate = Instant.now().minus(1, ChronoUnit.DAYS);

            Quiz quiz = Quiz.builder()
                    .title("Past Quiz")
                    .totalPoints(100.0)
                    .endDate(endDate)
                    .build();

            // Act
            String message = quiz.getAvailabilityMessage();

            // Assert
            assertThat(message).contains("ended on");
        }

        @Test
        @DisplayName("Should return correct message for available quiz with end date")
        void shouldReturnAvailableUntilMessage() {
            // Arrange
            Instant endDate = Instant.now().plus(7, ChronoUnit.DAYS);

            Quiz quiz = Quiz.builder()
                    .title("Current Quiz")
                    .totalPoints(100.0)
                    .endDate(endDate)
                    .build();

            // Act
            String message = quiz.getAvailabilityMessage();

            // Assert
            assertThat(message).contains("available until");
        }

        @Test
        @DisplayName("Should return correct message for always available quiz")
        void shouldReturnAlwaysAvailableMessage() {
            // Arrange
            Quiz quiz = Quiz.builder()
                    .title("Always Available Quiz")
                    .totalPoints(100.0)
                    .build();

            // Act
            String message = quiz.getAvailabilityMessage();

            // Assert
            assertThat(message).isEqualTo("Quiz is available");
        }
    }
}

