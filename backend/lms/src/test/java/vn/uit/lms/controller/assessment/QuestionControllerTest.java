package vn.uit.lms.controller.assessment;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import vn.uit.lms.service.assessment.QuestionService;
import vn.uit.lms.shared.constant.QuestionType;
import vn.uit.lms.shared.dto.request.assessment.AnswerOptionRequest;
import vn.uit.lms.shared.dto.request.assessment.QuestionRequest;
import vn.uit.lms.shared.dto.response.assessment.QuestionResponse;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Test class for QuestionController
 * Covers UC-17 (Quản lý kho câu hỏi - Question Management)
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("QuestionController Tests - Question Management")
class QuestionControllerTest {

    @Mock
    private QuestionService questionService;

    @InjectMocks
    private QuestionController questionController;

    private QuestionRequest questionRequest;
    private QuestionResponse questionResponse;
    private Long bankId;
    private Long questionId;

    @BeforeEach
    void setUp() {
        bankId = 1L;
        questionId = 1L;

        // Setup question request
        questionRequest = new QuestionRequest();
        questionRequest.setContent("What is polymorphism in Java?");
        questionRequest.setType(QuestionType.MULTIPLE_CHOICE);
        questionRequest.setMetadata("{\"explanation\": \"Polymorphism allows objects to take many forms\"}");
        questionRequest.setMaxPoints(10.0);

        // Setup question response
        questionResponse = QuestionResponse.builder()
                .id(questionId)
                .questionBankId(bankId)
                .content("What is polymorphism in Java?")
                .type(QuestionType.MULTIPLE_CHOICE)
                .metadata("{\"explanation\": \"Polymorphism allows objects to take many forms\"}")
                .maxPoints(10.0)
                .build();
    }

    // ==================== UC-17: QUẢN LÝ CÂU HỎI ====================

    @Nested
    @DisplayName("UC-17: Question Management Tests")
    class QuestionManagementTests {

        @Test
        @DisplayName("UC-17.1: Tạo câu hỏi thành công")
        void testCreateQuestion_Success() {
            // Arrange
            when(questionService.createQuestion(eq(bankId), any(QuestionRequest.class)))
                    .thenReturn(questionResponse);

            // Act
            ResponseEntity<QuestionResponse> response =
                    questionController.createQuestion(bankId, questionRequest);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals("What is polymorphism in Java?", response.getBody().getContent());
            assertEquals(QuestionType.MULTIPLE_CHOICE, response.getBody().getType());
            verify(questionService, times(1)).createQuestion(eq(bankId), any(QuestionRequest.class));
        }

        @Test
        @DisplayName("UC-17.2: Tạo câu hỏi thất bại do thiếu nội dung")
        void testCreateQuestion_MissingContent() {
            // Arrange
            QuestionRequest invalidRequest = new QuestionRequest();
            invalidRequest.setType(QuestionType.MULTIPLE_CHOICE);

            when(questionService.createQuestion(eq(bankId), any(QuestionRequest.class)))
                    .thenThrow(new InvalidRequestException("Question content is required"));

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> questionController.createQuestion(bankId, invalidRequest)
            );

            assertEquals("Question content is required", exception.getMessage());
        }

        @Test
        @DisplayName("UC-17.3: Tạo câu hỏi trắc nghiệm với answer options")
        void testCreateQuestion_WithAnswerOptions() {
            // Arrange
            List<AnswerOptionRequest> answerOptions = Arrays.asList(
                    createAnswerOption("Inheritance only", false),
                    createAnswerOption("Method overloading and overriding", true),
                    createAnswerOption("Encapsulation", false),
                    createAnswerOption("Abstraction", false)
            );

            questionRequest.setAnswerOptions(answerOptions);

            when(questionService.createQuestion(eq(bankId), any(QuestionRequest.class)))
                    .thenReturn(questionResponse);

            // Act
            ResponseEntity<QuestionResponse> response =
                    questionController.createQuestion(bankId, questionRequest);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            verify(questionService, times(1)).createQuestion(eq(bankId), any(QuestionRequest.class));
        }

        @Test
        @DisplayName("UC-17.4: Lấy tất cả câu hỏi trong kho")
        void testGetAllQuestions_Success() {
            // Arrange
            QuestionResponse question2 = QuestionResponse.builder()
                    .id(2L)
                    .questionBankId(bankId)
                    .content("What is encapsulation?")
                    .type(QuestionType.TRUE_FALSE)
                    .build();

            List<QuestionResponse> questions = Arrays.asList(questionResponse, question2);

            when(questionService.getQuestionsByBank(bankId)).thenReturn(questions);

            // Act
            ResponseEntity<List<QuestionResponse>> response =
                    questionController.getAllQuestions(bankId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(2, response.getBody().size());
            verify(questionService, times(1)).getQuestionsByBank(bankId);
        }

        @Test
        @DisplayName("UC-17.5: Lấy chi tiết câu hỏi theo ID")
        void testGetQuestionById_Success() {
            // Arrange
            when(questionService.getQuestionById(questionId)).thenReturn(questionResponse);

            // Act
            ResponseEntity<QuestionResponse> response =
                    questionController.getQuestion(questionId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(questionId, response.getBody().getId());
            verify(questionService, times(1)).getQuestionById(questionId);
        }

        @Test
        @DisplayName("UC-17.6: Cập nhật câu hỏi thành công")
        void testUpdateQuestion_Success() {
            // Arrange
            QuestionRequest updateRequest = new QuestionRequest();
            updateRequest.setContent("Updated: What is polymorphism?");
            updateRequest.setType(QuestionType.MULTIPLE_CHOICE);
            updateRequest.setMaxPoints(15.0);

            QuestionResponse updatedQuestion = QuestionResponse.builder()
                    .id(questionId)
                    .content("Updated: What is polymorphism?")
                    .maxPoints(15.0)
                    .build();

            when(questionService.updateQuestion(eq(questionId), any(QuestionRequest.class)))
                    .thenReturn(updatedQuestion);

            // Act
            ResponseEntity<QuestionResponse> response =
                    questionController.updateQuestion(questionId, updateRequest);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals("Updated: What is polymorphism?", response.getBody().getContent());
            verify(questionService, times(1)).updateQuestion(eq(questionId), any(QuestionRequest.class));
        }

        @Test
        @DisplayName("UC-17.7: Xóa câu hỏi thành công")
        void testDeleteQuestion_Success() {
            // Arrange
            doNothing().when(questionService).deleteQuestion(questionId);

            // Act
            ResponseEntity<Void> response = questionController.deleteQuestion(questionId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
            verify(questionService, times(1)).deleteQuestion(questionId);
        }

        @Test
        @DisplayName("UC-17.8: Xóa câu hỏi thất bại khi đang được sử dụng trong quiz")
        void testDeleteQuestion_InUse() {
            // Arrange
            doThrow(new InvalidRequestException("Cannot delete question that is in use"))
                    .when(questionService).deleteQuestion(questionId);

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> questionController.deleteQuestion(questionId)
            );

            assertEquals("Cannot delete question that is in use", exception.getMessage());
        }

        @Test
        @DisplayName("UC-17.9: Quản lý answer options cho câu hỏi")
        void testManageAnswerOptions_Success() {
            // Arrange
            List<AnswerOptionRequest> answerOptions = Arrays.asList(
                    createAnswerOption("Option A", false),
                    createAnswerOption("Option B", true),
                    createAnswerOption("Option C", false)
            );

            when(questionService.manageAnswerOptions(eq(questionId), anyList()))
                    .thenReturn(questionResponse);

            // Act
            ResponseEntity<QuestionResponse> response =
                    questionController.manageAnswerOptions(questionId, answerOptions);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            verify(questionService, times(1)).manageAnswerOptions(eq(questionId), anyList());
        }

        @Test
        @DisplayName("UC-17.10: Tìm kiếm câu hỏi theo từ khóa")
        void testSearchQuestions_Success() {
            // Arrange
            String keyword = "polymorphism";
            List<QuestionResponse> searchResults = List.of(questionResponse);

            when(questionService.searchQuestions(bankId, keyword)).thenReturn(searchResults);

            // Act
            ResponseEntity<List<QuestionResponse>> response =
                    questionController.searchQuestions(bankId, keyword);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(1, response.getBody().size());
            verify(questionService, times(1)).searchQuestions(bankId, keyword);
        }
    }

    // ==================== ADDITIONAL QUESTION TESTS ====================

    @Nested
    @DisplayName("Additional Question Management Tests")
    class AdditionalQuestionTests {

        @Test
        @DisplayName("Lấy câu hỏi theo loại (Question Type)")
        void testGetQuestionsByType_Success() {
            // Arrange
            List<QuestionResponse> mcQuestions = List.of(questionResponse);

            when(questionService.getQuestionsByType(bankId, QuestionType.MULTIPLE_CHOICE))
                    .thenReturn(mcQuestions);

            // Act
            ResponseEntity<List<QuestionResponse>> response =
                    questionController.getQuestionsByType(bankId, QuestionType.MULTIPLE_CHOICE);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(1, response.getBody().size());
            verify(questionService, times(1)).getQuestionsByType(bankId, QuestionType.MULTIPLE_CHOICE);
        }

        @Test
        @DisplayName("Clone câu hỏi sang kho khác")
        void testCloneQuestion_Success() {
            // Arrange
            Long targetBankId = 2L;
            QuestionResponse clonedQuestion = QuestionResponse.builder()
                    .id(3L)
                    .questionBankId(targetBankId)
                    .content("What is polymorphism in Java?")
                    .type(QuestionType.MULTIPLE_CHOICE)
                    .build();

            when(questionService.cloneQuestion(questionId, targetBankId))
                    .thenReturn(clonedQuestion);

            // Act
            ResponseEntity<QuestionResponse> response =
                    questionController.cloneQuestion(questionId, targetBankId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(targetBankId, response.getBody().getQuestionBankId());
            verify(questionService, times(1)).cloneQuestion(questionId, targetBankId);
        }

        @Test
        @DisplayName("Xóa nhiều câu hỏi cùng lúc (Bulk delete)")
        void testBulkDeleteQuestions_Success() {
            // Arrange
            List<Long> questionIds = Arrays.asList(1L, 2L, 3L);
            doNothing().when(questionService).bulkDeleteQuestions(questionIds);

            // Act
            ResponseEntity<Void> response = questionController.bulkDeleteQuestions(questionIds);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            verify(questionService, times(1)).bulkDeleteQuestions(questionIds);
        }

        @Test
        @DisplayName("Cập nhật điểm tối đa cho câu hỏi")
        void testUpdateMaxPoints_Success() {
            // Arrange
            Double newMaxPoints = 20.0;
            QuestionResponse updatedQuestion = QuestionResponse.builder()
                    .id(questionId)
                    .maxPoints(newMaxPoints)
                    .build();

            when(questionService.updateMaxPoints(questionId, newMaxPoints))
                    .thenReturn(updatedQuestion);

            // Act
            ResponseEntity<QuestionResponse> response =
                    questionController.updateMaxPoints(questionId, newMaxPoints);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(newMaxPoints, response.getBody().getMaxPoints());
            verify(questionService, times(1)).updateMaxPoints(questionId, newMaxPoints);
        }

        @Test
        @DisplayName("Lấy số lượng câu hỏi trong kho")
        void testGetQuestionCount_Success() {
            // Arrange
            when(questionService.getQuestionCount(bankId)).thenReturn(25);

            // Act
            ResponseEntity<Map<String, Integer>> response =
                    questionController.getQuestionCount(bankId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(25, response.getBody().get("count"));
            verify(questionService, times(1)).getQuestionCount(bankId);
        }

        @Test
        @DisplayName("Kiểm tra câu hỏi có đang được sử dụng không")
        void testCheckQuestionInUse_True() {
            // Arrange
            when(questionService.isQuestionInUse(questionId)).thenReturn(true);

            // Act
            ResponseEntity<Map<String, Boolean>> response =
                    questionController.checkQuestionInUse(questionId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertTrue(response.getBody().get("inUse"));
            verify(questionService, times(1)).isQuestionInUse(questionId);
        }

        @Test
        @DisplayName("Lấy danh sách quiz đang sử dụng câu hỏi")
        void testGetQuizzesUsingQuestion_Success() {
            // Arrange
            List<Long> quizIds = Arrays.asList(10L, 20L, 30L);
            when(questionService.getQuizzesUsingQuestion(questionId)).thenReturn(quizIds);

            // Act
            ResponseEntity<Map<String, List<Long>>> response =
                    questionController.getQuizzesUsingQuestion(questionId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertNotNull(response.getBody().get("quizIds"));
            assertEquals(3, response.getBody().get("quizIds").size());
            verify(questionService, times(1)).getQuizzesUsingQuestion(questionId);
        }

        @Test
        @DisplayName("Câu hỏi không tồn tại")
        void testGetQuestion_NotFound() {
            // Arrange
            Long nonExistentId = 999L;
            when(questionService.getQuestionById(nonExistentId))
                    .thenThrow(new ResourceNotFoundException("Question not found"));

            // Act & Assert
            ResourceNotFoundException exception = assertThrows(
                    ResourceNotFoundException.class,
                    () -> questionController.getQuestion(nonExistentId)
            );

            assertEquals("Question not found", exception.getMessage());
        }

        @Test
        @DisplayName("Tạo câu hỏi với kho không tồn tại")
        void testCreateQuestion_BankNotFound() {
            // Arrange
            Long nonExistentBankId = 999L;
            when(questionService.createQuestion(eq(nonExistentBankId), any(QuestionRequest.class)))
                    .thenThrow(new ResourceNotFoundException("Question bank not found"));

            // Act & Assert
            ResourceNotFoundException exception = assertThrows(
                    ResourceNotFoundException.class,
                    () -> questionController.createQuestion(nonExistentBankId, questionRequest)
            );

            assertEquals("Question bank not found", exception.getMessage());
        }

        @Test
        @DisplayName("Tạo câu hỏi trắc nghiệm không có đáp án đúng")
        void testCreateQuestion_NoCorrectAnswer() {
            // Arrange
            when(questionService.createQuestion(eq(bankId), any(QuestionRequest.class)))
                    .thenThrow(new InvalidRequestException("Multiple choice question must have at least one correct answer"));

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> questionController.createQuestion(bankId, questionRequest)
            );

            assertEquals("Multiple choice question must have at least one correct answer", exception.getMessage());
        }

        @Test
        @DisplayName("Cập nhật max points với giá trị âm")
        void testUpdateMaxPoints_NegativeValue() {
            // Arrange
            Double negativePoints = -5.0;
            when(questionService.updateMaxPoints(questionId, negativePoints))
                    .thenThrow(new InvalidRequestException("Max points must be positive"));

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> questionController.updateMaxPoints(questionId, negativePoints)
            );

            assertEquals("Max points must be positive", exception.getMessage());
        }

        @Test
        @DisplayName("Tìm kiếm câu hỏi không có kết quả")
        void testSearchQuestions_NoResults() {
            // Arrange
            String keyword = "NonExistentTopic";
            when(questionService.searchQuestions(bankId, keyword))
                    .thenReturn(List.of());

            // Act
            ResponseEntity<List<QuestionResponse>> response =
                    questionController.searchQuestions(bankId, keyword);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertTrue(response.getBody().isEmpty());
            verify(questionService, times(1)).searchQuestions(bankId, keyword);
        }
    }

    // ==================== HELPER METHODS ====================

    private AnswerOptionRequest createAnswerOption(String content, boolean isCorrect) {
        AnswerOptionRequest option = new AnswerOptionRequest();
        option.setContent(content);
        option.setIsCorrect(isCorrect);
        return option;
    }
}

