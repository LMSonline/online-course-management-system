package vn.uit.lms.service.assessment;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import vn.uit.lms.core.domain.assessment.Question;
import vn.uit.lms.core.domain.assessment.Quiz;
import vn.uit.lms.core.domain.assessment.QuizQuestion;
import vn.uit.lms.core.domain.course.content.Lesson;
import vn.uit.lms.core.repository.assessment.QuestionRepository;
import vn.uit.lms.core.repository.assessment.QuizQuestionRepository;
import vn.uit.lms.core.repository.assessment.QuizRepository;
import vn.uit.lms.core.repository.course.content.LessonRepository;
import vn.uit.lms.shared.constant.QuestionType;
import vn.uit.lms.shared.dto.request.assessment.AddQuestionsRequest;
import vn.uit.lms.shared.dto.request.assessment.QuizRequest;
import vn.uit.lms.shared.dto.response.assessment.QuizResponse;
import vn.uit.lms.shared.exception.ResourceNotFoundException;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("QuizService Tests")
class QuizServiceTest {

    @Mock
    private QuizRepository quizRepository;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private QuizQuestionRepository quizQuestionRepository;

    @Mock
    private LessonRepository lessonRepository;

    @InjectMocks
    private QuizService quizService;

    private Lesson lesson;
    private Quiz quiz;
    private QuizRequest quizRequest;
    private Question question1;
    private Question question2;

    @BeforeEach
    void setUp() {
        lesson = Lesson.builder()
                .id(1L)
                .title("Introduction to Java")
                .build();

        quiz = Quiz.builder()
                .id(1L)
                .title("Java Basics Quiz")
                .description("Test your Java knowledge")
                .lesson(lesson)
                .totalPoints(10.0)
                .timeLimitMinutes(30)
                .maxAttempts(3)
                .randomizeQuestions(false)
                .randomizeOptions(false)
                .passingScore(70.0)
                .build();

        quizRequest = new QuizRequest();
        quizRequest.setTitle("Java Basics Quiz");
        quizRequest.setDescription("Test your Java knowledge");
        quizRequest.setTotalPoints(10.0);
        quizRequest.setTimeLimitMinutes(30);
        quizRequest.setMaxAttempts(3);
        quizRequest.setRandomizeQuestions(false);
        quizRequest.setRandomizeOptions(false);
        quizRequest.setPassingScore(70.0);

        question1 = Question.builder()
                .id(1L)
                .content("What is Java?")
                .type(QuestionType.MULTIPLE_CHOICE)
                .build();

        question2 = Question.builder()
                .id(2L)
                .content("What is OOP?")
                .type(QuestionType.MULTIPLE_CHOICE)
                .build();
    }

    @Test
    @DisplayName("Should create quiz successfully")
    void testCreateQuiz_Success() {
        // Arrange
        when(lessonRepository.findById(1L)).thenReturn(Optional.of(lesson));
        when(quizRepository.save(any(Quiz.class))).thenReturn(quiz);

        // Act
        QuizResponse response = quizService.createQuiz(1L, quizRequest);

        // Assert
        assertNotNull(response);
        assertEquals("Java Basics Quiz", response.getTitle());
        assertEquals("Test your Java knowledge", response.getDescription());
        assertEquals(10.0, response.getTotalPoints());
        assertEquals(30, response.getTimeLimitMinutes());
        assertEquals(3, response.getMaxAttempts());
        assertFalse(response.getRandomizeQuestions());
        assertFalse(response.getRandomizeOptions());
        assertEquals(70.0, response.getPassingScore());
        verify(lessonRepository, times(1)).findById(1L);
        verify(quizRepository, times(1)).save(any(Quiz.class));
    }

    @Test
    @DisplayName("Should throw exception when lesson not found during quiz creation")
    void testCreateQuiz_LessonNotFound() {
        // Arrange
        when(lessonRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> quizService.createQuiz(1L, quizRequest)
        );

        assertEquals("Lesson not found", exception.getMessage());
        verify(lessonRepository, times(1)).findById(1L);
        verify(quizRepository, never()).save(any(Quiz.class));
    }

    @Test
    @DisplayName("Should get quizzes by lesson successfully")
    void testGetQuizzesByLesson_Success() {
        // Arrange
        Quiz quiz2 = Quiz.builder()
                .id(2L)
                .title("Advanced Java Quiz")
                .description("Advanced topics")
                .lesson(lesson)
                .build();

        List<Quiz> quizzes = Arrays.asList(quiz, quiz2);
        when(quizRepository.findByLessonId(1L)).thenReturn(quizzes);

        // Act
        List<QuizResponse> responses = quizService.getQuizzesByLesson(1L);

        // Assert
        assertNotNull(responses);
        assertEquals(2, responses.size());
        assertEquals("Java Basics Quiz", responses.get(0).getTitle());
        assertEquals("Advanced Java Quiz", responses.get(1).getTitle());
        verify(quizRepository, times(1)).findByLessonId(1L);
    }

    @Test
    @DisplayName("Should return empty list when lesson has no quizzes")
    void testGetQuizzesByLesson_EmptyList() {
        // Arrange
        when(quizRepository.findByLessonId(1L)).thenReturn(Collections.emptyList());

        // Act
        List<QuizResponse> responses = quizService.getQuizzesByLesson(1L);

        // Assert
        assertNotNull(responses);
        assertTrue(responses.isEmpty());
        verify(quizRepository, times(1)).findByLessonId(1L);
    }

    @Test
    @DisplayName("Should get quiz by id successfully")
    void testGetQuizById_Success() {
        // Arrange
        when(quizRepository.findById(1L)).thenReturn(Optional.of(quiz));

        // Act
        QuizResponse response = quizService.getQuizById(1L);

        // Assert
        assertNotNull(response);
        assertEquals("Java Basics Quiz", response.getTitle());
        assertEquals("Test your Java knowledge", response.getDescription());
        verify(quizRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should throw exception when quiz not found by id")
    void testGetQuizById_NotFound() {
        // Arrange
        when(quizRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> quizService.getQuizById(1L)
        );

        assertEquals("Quiz not found", exception.getMessage());
        verify(quizRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should update quiz successfully")
    void testUpdateQuiz_Success() {
        // Arrange
        QuizRequest updateRequest = new QuizRequest();
        updateRequest.setTitle("Updated Quiz Title");
        updateRequest.setDescription("Updated description");
        updateRequest.setTotalPoints(15.0);
        updateRequest.setTimeLimitMinutes(45);
        updateRequest.setMaxAttempts(5);
        updateRequest.setRandomizeQuestions(true);
        updateRequest.setRandomizeOptions(true);
        updateRequest.setPassingScore(80.0);

        Quiz updatedQuiz = Quiz.builder()
                .id(1L)
                .title("Updated Quiz Title")
                .description("Updated description")
                .lesson(lesson)
                .totalPoints(15.0)
                .timeLimitMinutes(45)
                .maxAttempts(5)
                .randomizeQuestions(true)
                .randomizeOptions(true)
                .passingScore(80.0)
                .build();

        when(quizRepository.findById(1L)).thenReturn(Optional.of(quiz));
        when(quizRepository.save(any(Quiz.class))).thenReturn(updatedQuiz);

        // Act
        QuizResponse response = quizService.updateQuiz(1L, updateRequest);

        // Assert
        assertNotNull(response);
        assertEquals("Updated Quiz Title", response.getTitle());
        assertEquals("Updated description", response.getDescription());
        assertEquals(15.0, response.getTotalPoints());
        assertEquals(45, response.getTimeLimitMinutes());
        assertEquals(5, response.getMaxAttempts());
        assertTrue(response.getRandomizeQuestions());
        assertTrue(response.getRandomizeOptions());
        assertEquals(80.0, response.getPassingScore());
        verify(quizRepository, times(1)).findById(1L);
        verify(quizRepository, times(1)).save(any(Quiz.class));
    }

    @Test
    @DisplayName("Should throw exception when updating non-existent quiz")
    void testUpdateQuiz_NotFound() {
        // Arrange
        when(quizRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> quizService.updateQuiz(1L, quizRequest)
        );

        assertEquals("Quiz not found", exception.getMessage());
        verify(quizRepository, times(1)).findById(1L);
        verify(quizRepository, never()).save(any(Quiz.class));
    }

    @Test
    @DisplayName("Should delete quiz successfully")
    void testDeleteQuiz_Success() {
        // Arrange
        when(quizRepository.existsById(1L)).thenReturn(true);
        doNothing().when(quizRepository).deleteById(1L);

        // Act
        assertDoesNotThrow(() -> quizService.deleteQuiz(1L));

        // Assert
        verify(quizRepository, times(1)).existsById(1L);
        verify(quizRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Should throw exception when deleting non-existent quiz")
    void testDeleteQuiz_NotFound() {
        // Arrange
        when(quizRepository.existsById(anyLong())).thenReturn(false);

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> quizService.deleteQuiz(1L)
        );

        assertEquals("Quiz not found", exception.getMessage());
        verify(quizRepository, times(1)).existsById(1L);
        verify(quizRepository, never()).deleteById(anyLong());
    }

    @Test
    @DisplayName("Should add questions to quiz successfully")
    void testAddQuestionsToQuiz_Success() {
        // Arrange
        AddQuestionsRequest request = new AddQuestionsRequest();
        request.setQuestionIds(Arrays.asList(1L, 2L));

        when(quizRepository.findById(1L)).thenReturn(Optional.of(quiz));
        when(questionRepository.findById(1L)).thenReturn(Optional.of(question1));
        when(questionRepository.findById(2L)).thenReturn(Optional.of(question2));
        when(quizQuestionRepository.findByQuizIdAndQuestionId(1L, 1L)).thenReturn(Optional.empty());
        when(quizQuestionRepository.findByQuizIdAndQuestionId(1L, 2L)).thenReturn(Optional.empty());
        when(quizQuestionRepository.save(any(QuizQuestion.class))).thenReturn(new QuizQuestion());
        when(quizRepository.findById(1L)).thenReturn(Optional.of(quiz));

        // Act
        QuizResponse response = quizService.addQuestionsToQuiz(1L, request);

        // Assert
        assertNotNull(response);
        verify(quizRepository, times(2)).findById(1L);
        verify(questionRepository, times(1)).findById(1L);
        verify(questionRepository, times(1)).findById(2L);
        verify(quizQuestionRepository, times(2)).save(any(QuizQuestion.class));
    }

    @Test
    @DisplayName("Should skip duplicate questions when adding to quiz")
    void testAddQuestionsToQuiz_SkipDuplicate() {
        // Arrange
        AddQuestionsRequest request = new AddQuestionsRequest();
        request.setQuestionIds(Arrays.asList(1L, 2L));

        QuizQuestion existingQuizQuestion = QuizQuestion.builder()
                .quiz(quiz)
                .question(question1)
                .orderIndex(1)
                .build();

        when(quizRepository.findById(1L)).thenReturn(Optional.of(quiz));
        when(questionRepository.findById(1L)).thenReturn(Optional.of(question1));
        when(questionRepository.findById(2L)).thenReturn(Optional.of(question2));
        when(quizQuestionRepository.findByQuizIdAndQuestionId(1L, 1L)).thenReturn(Optional.of(existingQuizQuestion));
        when(quizQuestionRepository.findByQuizIdAndQuestionId(1L, 2L)).thenReturn(Optional.empty());
        when(quizQuestionRepository.save(any(QuizQuestion.class))).thenReturn(new QuizQuestion());

        // Act
        QuizResponse response = quizService.addQuestionsToQuiz(1L, request);

        // Assert
        assertNotNull(response);
        verify(quizRepository, times(2)).findById(1L);
        verify(quizQuestionRepository, times(1)).save(any(QuizQuestion.class)); // Only one save for question2
    }

    @Test
    @DisplayName("Should throw exception when quiz not found while adding questions")
    void testAddQuestionsToQuiz_QuizNotFound() {
        // Arrange
        AddQuestionsRequest request = new AddQuestionsRequest();
        request.setQuestionIds(Arrays.asList(1L, 2L));

        when(quizRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> quizService.addQuestionsToQuiz(1L, request)
        );

        assertEquals("Quiz not found", exception.getMessage());
        verify(quizRepository, times(1)).findById(1L);
        verify(questionRepository, never()).findById(anyLong());
    }

    @Test
    @DisplayName("Should throw exception when question not found while adding to quiz")
    void testAddQuestionsToQuiz_QuestionNotFound() {
        // Arrange
        AddQuestionsRequest request = new AddQuestionsRequest();
        request.setQuestionIds(Collections.singletonList(999L));

        when(quizRepository.findById(1L)).thenReturn(Optional.of(quiz));
        when(questionRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> quizService.addQuestionsToQuiz(1L, request)
        );

        assertTrue(exception.getMessage().contains("Question not found"));
        verify(quizRepository, times(1)).findById(1L);
        verify(questionRepository, times(1)).findById(999L);
        verify(quizQuestionRepository, never()).save(any(QuizQuestion.class));
    }

    @Test
    @DisplayName("Should remove question from quiz successfully")
    void testRemoveQuestionFromQuiz_Success() {
        // Arrange
        QuizQuestion quizQuestion = QuizQuestion.builder()
                .id(1L)
                .quiz(quiz)
                .question(question1)
                .orderIndex(1)
                .build();

        when(quizRepository.existsById(1L)).thenReturn(true);
        when(quizQuestionRepository.findByQuizIdAndQuestionId(1L, 1L)).thenReturn(Optional.of(quizQuestion));
        doNothing().when(quizQuestionRepository).delete(quizQuestion);

        // Act
        assertDoesNotThrow(() -> quizService.removeQuestionFromQuiz(1L, 1L));

        // Assert
        verify(quizRepository, times(1)).existsById(1L);
        verify(quizQuestionRepository, times(1)).findByQuizIdAndQuestionId(1L, 1L);
        verify(quizQuestionRepository, times(1)).delete(quizQuestion);
    }

    @Test
    @DisplayName("Should throw exception when quiz not found while removing question")
    void testRemoveQuestionFromQuiz_QuizNotFound() {
        // Arrange
        when(quizRepository.existsById(anyLong())).thenReturn(false);

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> quizService.removeQuestionFromQuiz(1L, 1L)
        );

        assertEquals("Quiz not found", exception.getMessage());
        verify(quizRepository, times(1)).existsById(1L);
        verify(quizQuestionRepository, never()).findByQuizIdAndQuestionId(anyLong(), anyLong());
    }

    @Test
    @DisplayName("Should throw exception when question not in quiz while removing")
    void testRemoveQuestionFromQuiz_QuestionNotInQuiz() {
        // Arrange
        when(quizRepository.existsById(1L)).thenReturn(true);
        when(quizQuestionRepository.findByQuizIdAndQuestionId(1L, 1L)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> quizService.removeQuestionFromQuiz(1L, 1L)
        );

        assertEquals("Question not found in this quiz", exception.getMessage());
        verify(quizRepository, times(1)).existsById(1L);
        verify(quizQuestionRepository, times(1)).findByQuizIdAndQuestionId(1L, 1L);
        verify(quizQuestionRepository, never()).delete(any(QuizQuestion.class));
    }
}

