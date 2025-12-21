package vn.uit.lms.service.assessment;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.core.domain.Student;
import vn.uit.lms.core.domain.assessment.*;
import vn.uit.lms.core.repository.StudentRepository;
import vn.uit.lms.core.repository.assessment.*;
import vn.uit.lms.service.AccountService;
import vn.uit.lms.shared.constant.QuestionType;
import vn.uit.lms.shared.constant.QuizAttemptStatus;
import vn.uit.lms.shared.dto.request.assessment.SubmitAnswerRequest;
import vn.uit.lms.shared.dto.response.assessment.QuizAttemptResponse;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;

import java.time.Instant;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("QuizAttemptService Tests")
class QuizAttemptServiceTest {

    @Mock
    private QuizAttemptRepository quizAttemptRepository;

    @Mock
    private QuizRepository quizRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private AccountService accountService;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private AnswerOptionRepository answerOptionRepository;

    @Mock
    private QuizAttemptAnswerRepository quizAttemptAnswerRepository;

    @InjectMocks
    private QuizAttemptService quizAttemptService;

    private Account account;
    private Student student;
    private Quiz quiz;
    private QuizAttempt quizAttempt;
    private Question question;
    private AnswerOption correctOption;
    private AnswerOption wrongOption;
    private QuizQuestion quizQuestion;

    @BeforeEach
    void setUp() {
        account = Account.builder()
                .id(1L)
                .email("student@example.com")
                .build();

        student = Student.builder()
                .id(1L)
                .studentCode("STU001")
                .account(account)
                .build();

        quiz = Quiz.builder()
                .id(1L)
                .title("Java Quiz")
                .totalPoints(10.0)
                .timeLimitMinutes(30)
                .maxAttempts(3)
                .build();

        quizAttempt = QuizAttempt.builder()
                .id(1L)
                .quiz(quiz)
                .student(student)
                .attemptNumber(1)
                .startedAt(Instant.now())
                .status(QuizAttemptStatus.IN_PROGRESS)
                .build();

        question = Question.builder()
                .id(1L)
                .content("What is Java?")
                .type(QuestionType.MULTIPLE_CHOICE)
                .maxPoints(1.0)
                .build();

        correctOption = AnswerOption.builder()
                .id(1L)
                .content("A programming language")
                .isCorrect(true)
                .question(question)
                .build();

        wrongOption = AnswerOption.builder()
                .id(2L)
                .content("A coffee brand")
                .isCorrect(false)
                .question(question)
                .build();

        quizQuestion = QuizQuestion.builder()
                .id(1L)
                .quiz(quiz)
                .question(question)
                .orderIndex(1)
                .build();

        quiz.setQuizQuestions(Collections.singletonList(quizQuestion));
    }

    @Test
    @DisplayName("Should start quiz successfully")
    void testStartQuiz_Success() {
        // Arrange
        when(accountService.verifyCurrentAccount()).thenReturn(account);
        when(studentRepository.findByAccount(account)).thenReturn(Optional.of(student));
        when(quizRepository.findById(1L)).thenReturn(Optional.of(quiz));
        when(quizAttemptRepository.findByStudentId(1L)).thenReturn(Collections.emptyList());
        when(quizAttemptRepository.save(any(QuizAttempt.class))).thenReturn(quizAttempt);

        // Act
        QuizAttemptResponse response = quizAttemptService.startQuiz(1L);

        // Assert
        assertNotNull(response);
        assertEquals(1, response.getAttemptNumber());
        assertEquals(QuizAttemptStatus.IN_PROGRESS, response.getStatus());
        verify(accountService, times(1)).verifyCurrentAccount();
        verify(studentRepository, times(1)).findByAccount(account);
        verify(quizRepository, times(1)).findById(1L);
        verify(quizAttemptRepository, times(1)).save(any(QuizAttempt.class));
    }

    @Test
    @DisplayName("Should start quiz with correct attempt number")
    void testStartQuiz_WithExistingAttempts() {
        // Arrange
        QuizAttempt previousAttempt1 = QuizAttempt.builder()
                .id(2L)
                .quiz(quiz)
                .student(student)
                .attemptNumber(1)
                .status(QuizAttemptStatus.COMPLETED)
                .build();

        QuizAttempt previousAttempt2 = QuizAttempt.builder()
                .id(3L)
                .quiz(quiz)
                .student(student)
                .attemptNumber(2)
                .status(QuizAttemptStatus.COMPLETED)
                .build();

        QuizAttempt newAttempt = QuizAttempt.builder()
                .id(4L)
                .quiz(quiz)
                .student(student)
                .attemptNumber(3)
                .startedAt(Instant.now())
                .status(QuizAttemptStatus.IN_PROGRESS)
                .build();

        when(accountService.verifyCurrentAccount()).thenReturn(account);
        when(studentRepository.findByAccount(account)).thenReturn(Optional.of(student));
        when(quizRepository.findById(1L)).thenReturn(Optional.of(quiz));
        when(quizAttemptRepository.findByStudentId(1L)).thenReturn(Arrays.asList(previousAttempt1, previousAttempt2));
        when(quizAttemptRepository.save(any(QuizAttempt.class))).thenReturn(newAttempt);

        // Act
        QuizAttemptResponse response = quizAttemptService.startQuiz(1L);

        // Assert
        assertNotNull(response);
        assertEquals(3, response.getAttemptNumber());
        verify(quizAttemptRepository, times(1)).findByStudentId(1L);
    }

    @Test
    @DisplayName("Should throw exception when student not found during quiz start")
    void testStartQuiz_StudentNotFound() {
        // Arrange
        when(accountService.verifyCurrentAccount()).thenReturn(account);
        when(studentRepository.findByAccount(account)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> quizAttemptService.startQuiz(1L)
        );

        assertEquals("Student not found", exception.getMessage());
        verify(accountService, times(1)).verifyCurrentAccount();
        verify(studentRepository, times(1)).findByAccount(account);
        verify(quizRepository, never()).findById(anyLong());
    }

    @Test
    @DisplayName("Should throw exception when quiz not found during start")
    void testStartQuiz_QuizNotFound() {
        // Arrange
        when(accountService.verifyCurrentAccount()).thenReturn(account);
        when(studentRepository.findByAccount(account)).thenReturn(Optional.of(student));
        when(quizRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> quizAttemptService.startQuiz(1L)
        );

        assertEquals("Quiz not found", exception.getMessage());
        verify(quizRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should get quiz attempt successfully")
    void testGetQuizAttempt_Success() {
        // Arrange
        when(quizAttemptRepository.findById(1L)).thenReturn(Optional.of(quizAttempt));

        // Act
        QuizAttemptResponse response = quizAttemptService.getQuizAttempt(1L, 1L);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(QuizAttemptStatus.IN_PROGRESS, response.getStatus());
        verify(quizAttemptRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should throw exception when quiz attempt not found")
    void testGetQuizAttempt_NotFound() {
        // Arrange
        when(quizAttemptRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> quizAttemptService.getQuizAttempt(1L, 1L)
        );

        assertEquals("Quiz attempt not found", exception.getMessage());
        verify(quizAttemptRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should throw exception when attempt does not belong to quiz")
    void testGetQuizAttempt_WrongQuiz() {
        // Arrange
        when(quizAttemptRepository.findById(1L)).thenReturn(Optional.of(quizAttempt));

        // Act & Assert
        InvalidRequestException exception = assertThrows(
                InvalidRequestException.class,
                () -> quizAttemptService.getQuizAttempt(999L, 1L)
        );

        assertEquals("Attempt does not belong to this quiz", exception.getMessage());
        verify(quizAttemptRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should submit answer successfully")
    void testSubmitAnswer_Success() {
        // Arrange
        SubmitAnswerRequest request = new SubmitAnswerRequest();
        request.setQuestionId(1L);
        request.setSelectedOptionId(1L);

        when(quizAttemptRepository.findById(1L)).thenReturn(Optional.of(quizAttempt));
        when(questionRepository.findById(1L)).thenReturn(Optional.of(question));
        when(answerOptionRepository.findById(1L)).thenReturn(Optional.of(correctOption));
        when(quizAttemptAnswerRepository.findByQuizAttemptIdAndQuestionId(1L, 1L)).thenReturn(Optional.empty());
        when(quizAttemptAnswerRepository.save(any(QuizAttemptAnswer.class))).thenReturn(new QuizAttemptAnswer());

        // Act
        assertDoesNotThrow(() -> quizAttemptService.submitAnswer(1L, 1L, request));

        // Assert
        verify(quizAttemptRepository, times(1)).findById(1L);
        verify(questionRepository, times(1)).findById(1L);
        verify(answerOptionRepository, times(1)).findById(1L);
        verify(quizAttemptAnswerRepository, times(1)).save(any(QuizAttemptAnswer.class));
    }

    @Test
    @DisplayName("Should update existing answer when submitting again")
    void testSubmitAnswer_UpdateExisting() {
        // Arrange
        SubmitAnswerRequest request = new SubmitAnswerRequest();
        request.setQuestionId(1L);
        request.setSelectedOptionId(1L);

        QuizAttemptAnswer existingAnswer = QuizAttemptAnswer.builder()
                .id(1L)
                .quizAttempt(quizAttempt)
                .question(question)
                .selectedOption(wrongOption)
                .build();

        when(quizAttemptRepository.findById(1L)).thenReturn(Optional.of(quizAttempt));
        when(questionRepository.findById(1L)).thenReturn(Optional.of(question));
        when(answerOptionRepository.findById(1L)).thenReturn(Optional.of(correctOption));
        when(quizAttemptAnswerRepository.findByQuizAttemptIdAndQuestionId(1L, 1L)).thenReturn(Optional.of(existingAnswer));
        when(quizAttemptAnswerRepository.save(any(QuizAttemptAnswer.class))).thenReturn(existingAnswer);

        // Act
        assertDoesNotThrow(() -> quizAttemptService.submitAnswer(1L, 1L, request));

        // Assert
        verify(quizAttemptAnswerRepository, times(1)).findByQuizAttemptIdAndQuestionId(1L, 1L);
        verify(quizAttemptAnswerRepository, times(1)).save(existingAnswer);
    }

    @Test
    @DisplayName("Should throw exception when quiz attempt not found during submit answer")
    void testSubmitAnswer_AttemptNotFound() {
        // Arrange
        SubmitAnswerRequest request = new SubmitAnswerRequest();
        request.setQuestionId(1L);
        request.setSelectedOptionId(1L);

        when(quizAttemptRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> quizAttemptService.submitAnswer(1L, 1L, request)
        );

        assertEquals("Quiz attempt not found", exception.getMessage());
        verify(quizAttemptRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should throw exception when submitting to finished attempt")
    void testSubmitAnswer_AttemptFinished() {
        // Arrange
        SubmitAnswerRequest request = new SubmitAnswerRequest();
        request.setQuestionId(1L);
        request.setSelectedOptionId(1L);

        quizAttempt.setFinishedAt(Instant.now());

        when(quizAttemptRepository.findById(1L)).thenReturn(Optional.of(quizAttempt));

        // Act & Assert
        InvalidRequestException exception = assertThrows(
                InvalidRequestException.class,
                () -> quizAttemptService.submitAnswer(1L, 1L, request)
        );

        assertEquals("Quiz attempt is already finished", exception.getMessage());
        verify(quizAttemptRepository, times(1)).findById(1L);
        verify(quizAttemptAnswerRepository, never()).save(any(QuizAttemptAnswer.class));
    }

    @Test
    @DisplayName("Should throw exception when question not found during submit answer")
    void testSubmitAnswer_QuestionNotFound() {
        // Arrange
        SubmitAnswerRequest request = new SubmitAnswerRequest();
        request.setQuestionId(999L);
        request.setSelectedOptionId(1L);

        when(quizAttemptRepository.findById(1L)).thenReturn(Optional.of(quizAttempt));
        when(questionRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> quizAttemptService.submitAnswer(1L, 1L, request)
        );

        assertEquals("Question not found", exception.getMessage());
        verify(questionRepository, times(1)).findById(999L);
    }

    @Test
    @DisplayName("Should throw exception when answer option not found")
    void testSubmitAnswer_OptionNotFound() {
        // Arrange
        SubmitAnswerRequest request = new SubmitAnswerRequest();
        request.setQuestionId(1L);
        request.setSelectedOptionId(999L);

        when(quizAttemptRepository.findById(1L)).thenReturn(Optional.of(quizAttempt));
        when(questionRepository.findById(1L)).thenReturn(Optional.of(question));
        when(answerOptionRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> quizAttemptService.submitAnswer(1L, 1L, request)
        );

        assertEquals("Answer option not found", exception.getMessage());
        verify(answerOptionRepository, times(1)).findById(999L);
    }

    @Test
    @DisplayName("Should throw exception when option does not belong to question")
    void testSubmitAnswer_OptionMismatch() {
        // Arrange
        SubmitAnswerRequest request = new SubmitAnswerRequest();
        request.setQuestionId(1L);
        request.setSelectedOptionId(1L);

        Question differentQuestion = Question.builder()
                .id(2L)
                .content("Different question")
                .build();

        AnswerOption mismatchedOption = AnswerOption.builder()
                .id(1L)
                .content("Option")
                .question(differentQuestion)
                .build();

        when(quizAttemptRepository.findById(1L)).thenReturn(Optional.of(quizAttempt));
        when(questionRepository.findById(1L)).thenReturn(Optional.of(question));
        when(answerOptionRepository.findById(1L)).thenReturn(Optional.of(mismatchedOption));

        // Act & Assert
        InvalidRequestException exception = assertThrows(
                InvalidRequestException.class,
                () -> quizAttemptService.submitAnswer(1L, 1L, request)
        );

        assertEquals("Option does not belong to the question", exception.getMessage());
    }

    @Test
    @DisplayName("Should finish quiz and calculate score successfully")
    void testFinishQuiz_Success() {
        // Arrange
        QuizAttemptAnswer answer1 = QuizAttemptAnswer.builder()
                .quizAttempt(quizAttempt)
                .question(question)
                .selectedOption(correctOption)
                .build();

        quizAttempt.setAnswers(Collections.singletonList(answer1));

        when(quizAttemptRepository.findById(1L)).thenReturn(Optional.of(quizAttempt));
        when(quizAttemptRepository.save(any(QuizAttempt.class))).thenReturn(quizAttempt);

        // Act
        QuizAttemptResponse response = quizAttemptService.finishQuiz(1L, 1L);

        // Assert
        assertNotNull(response);
        assertEquals(QuizAttemptStatus.COMPLETED, response.getStatus());
        assertNotNull(response.getFinishedAt());
        verify(quizAttemptRepository, times(1)).findById(1L);
        verify(quizAttemptRepository, times(1)).save(any(QuizAttempt.class));
    }

    @Test
    @DisplayName("Should calculate score correctly when finishing quiz")
    void testFinishQuiz_ScoreCalculation() {
        // Arrange
        Question question2 = Question.builder()
                .id(2L)
                .content("What is OOP?")
                .build();

        QuizQuestion quizQuestion2 = QuizQuestion.builder()
                .id(2L)
                .quiz(quiz)
                .question(question2)
                .orderIndex(2)
                .build();

        quiz.setQuizQuestions(Arrays.asList(quizQuestion, quizQuestion2));

        QuizAttemptAnswer answer1 = QuizAttemptAnswer.builder()
                .quizAttempt(quizAttempt)
                .question(question)
                .selectedOption(correctOption)
                .build();

        QuizAttemptAnswer answer2 = QuizAttemptAnswer.builder()
                .quizAttempt(quizAttempt)
                .question(question2)
                .selectedOption(wrongOption) // Wrong answer
                .build();

        quizAttempt.setAnswers(Arrays.asList(answer1, answer2));

        when(quizAttemptRepository.findById(1L)).thenReturn(Optional.of(quizAttempt));
        when(quizAttemptRepository.save(any(QuizAttempt.class))).thenAnswer(invocation -> {
            QuizAttempt savedAttempt = invocation.getArgument(0);
            // Score should be 1 correct out of 2 questions = 50% = 5.0 on scale of 10
            assertEquals(5.0, savedAttempt.getTotalScore());
            return savedAttempt;
        });

        // Act
        QuizAttemptResponse response = quizAttemptService.finishQuiz(1L, 1L);

        // Assert
        assertNotNull(response);
        verify(quizAttemptRepository, times(1)).save(any(QuizAttempt.class));
    }

    @Test
    @DisplayName("Should return existing response when quiz already finished")
    void testFinishQuiz_AlreadyFinished() {
        // Arrange
        quizAttempt.setFinishedAt(Instant.now());
        quizAttempt.setStatus(QuizAttemptStatus.COMPLETED);
        quizAttempt.setTotalScore(8.0);

        when(quizAttemptRepository.findById(1L)).thenReturn(Optional.of(quizAttempt));

        // Act
        QuizAttemptResponse response = quizAttemptService.finishQuiz(1L, 1L);

        // Assert
        assertNotNull(response);
        assertEquals(QuizAttemptStatus.COMPLETED, response.getStatus());
        verify(quizAttemptRepository, times(1)).findById(1L);
        verify(quizAttemptRepository, never()).save(any(QuizAttempt.class));
    }

    @Test
    @DisplayName("Should throw exception when quiz not found during finish")
    void testFinishQuiz_QuizAttemptNotFound() {
        // Arrange
        when(quizAttemptRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> quizAttemptService.finishQuiz(1L, 1L)
        );

        assertEquals("Quiz attempt not found", exception.getMessage());
        verify(quizAttemptRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should throw exception when finishing attempt for wrong quiz")
    void testFinishQuiz_WrongQuiz() {
        // Arrange
        when(quizAttemptRepository.findById(1L)).thenReturn(Optional.of(quizAttempt));

        // Act & Assert
        InvalidRequestException exception = assertThrows(
                InvalidRequestException.class,
                () -> quizAttemptService.finishQuiz(999L, 1L)
        );

        assertEquals("Attempt does not belong to this quiz", exception.getMessage());
        verify(quizAttemptRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should get student quiz attempts successfully")
    void testGetStudentQuizAttempts_Success() {
        // Arrange
        QuizAttempt attempt2 = QuizAttempt.builder()
                .id(2L)
                .quiz(quiz)
                .student(student)
                .attemptNumber(2)
                .status(QuizAttemptStatus.COMPLETED)
                .build();

        List<QuizAttempt> attempts = Arrays.asList(quizAttempt, attempt2);
        when(quizAttemptRepository.findByStudentId(1L)).thenReturn(attempts);

        // Act
        List<QuizAttemptResponse> responses = quizAttemptService.getStudentQuizAttempts(1L);

        // Assert
        assertNotNull(responses);
        assertEquals(2, responses.size());
        assertEquals(1, responses.get(0).getAttemptNumber());
        assertEquals(2, responses.get(1).getAttemptNumber());
        verify(quizAttemptRepository, times(1)).findByStudentId(1L);
    }

    @Test
    @DisplayName("Should return empty list when student has no attempts")
    void testGetStudentQuizAttempts_EmptyList() {
        // Arrange
        when(quizAttemptRepository.findByStudentId(1L)).thenReturn(Collections.emptyList());

        // Act
        List<QuizAttemptResponse> responses = quizAttemptService.getStudentQuizAttempts(1L);

        // Assert
        assertNotNull(responses);
        assertTrue(responses.isEmpty());
        verify(quizAttemptRepository, times(1)).findByStudentId(1L);
    }
}

