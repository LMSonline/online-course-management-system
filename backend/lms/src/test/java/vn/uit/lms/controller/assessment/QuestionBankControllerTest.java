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
import vn.uit.lms.service.assessment.QuestionBankService;
import vn.uit.lms.shared.dto.request.assessment.QuestionBankRequest;
import vn.uit.lms.shared.dto.response.assessment.QuestionBankResponse;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Test class for QuestionBankController
 * Covers UC-17 (Quản lý kho câu hỏi)
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("QuestionBankController Tests - Question Bank Management")
class QuestionBankControllerTest {

    @Mock
    private QuestionBankService questionBankService;

    @InjectMocks
    private QuestionBankController questionBankController;

    private QuestionBankRequest questionBankRequest;
    private QuestionBankResponse questionBankResponse;
    private Long teacherId;
    private Long bankId;

    @BeforeEach
    void setUp() {
        teacherId = 1L;
        bankId = 1L;

        // Setup question bank request
        questionBankRequest = new QuestionBankRequest();
        questionBankRequest.setName("Java Programming Questions");
        questionBankRequest.setDescription("Collection of Java questions");

        // Setup question bank response using builder
        questionBankResponse = QuestionBankResponse.builder()
                .id(bankId)
                .name("Java Programming Questions")
                .description("Collection of Java questions")
                .teacherId(teacherId)
                .build();
    }

    // ==================== UC-17: QUẢN LÝ KHO CÂU HỎI ====================

    @Nested
    @DisplayName("UC-17: Question Bank Management Tests")
    class QuestionBankManagementTests {

        @Test
        @DisplayName("UC-17.1: Tạo kho câu hỏi thành công")
        void testCreateQuestionBank_Success() {
            // Arrange
            when(questionBankService.createQuestionBank(eq(teacherId), any(QuestionBankRequest.class)))
                    .thenReturn(questionBankResponse);

            // Act
            ResponseEntity<QuestionBankResponse> response =
                    questionBankController.createQuestionBank(teacherId, questionBankRequest);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals("Java Programming Questions", response.getBody().getName());
            assertEquals(teacherId, response.getBody().getTeacherId());
            verify(questionBankService, times(1)).createQuestionBank(eq(teacherId), any(QuestionBankRequest.class));
        }

        @Test
        @DisplayName("UC-17.2: Tạo kho câu hỏi thất bại do thiếu tên")
        void testCreateQuestionBank_MissingName() {
            // Arrange
            QuestionBankRequest invalidRequest = new QuestionBankRequest();
            invalidRequest.setDescription("Description only");

            when(questionBankService.createQuestionBank(eq(teacherId), any(QuestionBankRequest.class)))
                    .thenThrow(new InvalidRequestException("Question bank name is required"));

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> questionBankController.createQuestionBank(teacherId, invalidRequest)
            );

            assertEquals("Question bank name is required", exception.getMessage());
        }

        @Test
        @DisplayName("UC-17.3: Lấy tất cả kho câu hỏi của giảng viên")
        void testGetAllQuestionBanksByTeacher_Success() {
            // Arrange
            QuestionBankResponse bank2 = QuestionBankResponse.builder()
                    .id(2L)
                    .name("Python Questions")
                    .teacherId(teacherId)
                    .build();

            List<QuestionBankResponse> banks = Arrays.asList(questionBankResponse, bank2);

            when(questionBankService.getQuestionBanksByTeacher(teacherId)).thenReturn(banks);

            // Act
            ResponseEntity<List<QuestionBankResponse>> response =
                    questionBankController.getAllQuestionBanks(teacherId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(2, response.getBody().size());
            assertEquals("Java Programming Questions", response.getBody().get(0).getName());
            assertEquals("Python Questions", response.getBody().get(1).getName());
            verify(questionBankService, times(1)).getQuestionBanksByTeacher(teacherId);
        }

        @Test
        @DisplayName("UC-17.4: Lấy chi tiết kho câu hỏi theo ID")
        void testGetQuestionBankById_Success() {
            // Arrange
            when(questionBankService.getQuestionBankById(bankId)).thenReturn(questionBankResponse);

            // Act
            ResponseEntity<QuestionBankResponse> response =
                    questionBankController.getQuestionBank(bankId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(bankId, response.getBody().getId());
            verify(questionBankService, times(1)).getQuestionBankById(bankId);
        }

        @Test
        @DisplayName("UC-17.5: Cập nhật kho câu hỏi thành công")
        void testUpdateQuestionBank_Success() {
            // Arrange
            QuestionBankRequest updateRequest = new QuestionBankRequest();
            updateRequest.setName("Updated Java Questions");
            updateRequest.setDescription("Updated description");

            QuestionBankResponse updatedBank = QuestionBankResponse.builder()
                    .id(bankId)
                    .name("Updated Java Questions")
                    .description("Updated description")
                    .build();

            when(questionBankService.updateQuestionBank(eq(bankId), any(QuestionBankRequest.class)))
                    .thenReturn(updatedBank);

            // Act
            ResponseEntity<QuestionBankResponse> response =
                    questionBankController.updateQuestionBank(bankId, updateRequest);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals("Updated Java Questions", response.getBody().getName());
            verify(questionBankService, times(1)).updateQuestionBank(eq(bankId), any(QuestionBankRequest.class));
        }

        @Test
        @DisplayName("UC-17.6: Xóa kho câu hỏi thành công")
        void testDeleteQuestionBank_Success() {
            // Arrange
            doNothing().when(questionBankService).deleteQuestionBank(bankId);

            // Act
            ResponseEntity<Void> response = questionBankController.deleteQuestionBank(bankId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
            verify(questionBankService, times(1)).deleteQuestionBank(bankId);
        }

        @Test
        @DisplayName("UC-17.7: Xóa kho câu hỏi thất bại khi có quiz đang sử dụng")
        void testDeleteQuestionBank_InUse() {
            // Arrange
            doThrow(new InvalidRequestException("Cannot delete question bank that is in use"))
                    .when(questionBankService).deleteQuestionBank(bankId);

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> questionBankController.deleteQuestionBank(bankId)
            );

            assertEquals("Cannot delete question bank that is in use", exception.getMessage());
        }

        @Test
        @DisplayName("UC-17.8: Tìm kiếm kho câu hỏi theo từ khóa")
        void testSearchQuestionBanks_Success() {
            // Arrange
            String keyword = "Java";
            List<QuestionBankResponse> searchResults = List.of(questionBankResponse);

            when(questionBankService.searchQuestionBanks(keyword)).thenReturn(searchResults);

            // Act
            ResponseEntity<List<QuestionBankResponse>> response =
                    questionBankController.searchQuestionBanks(keyword);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(1, response.getBody().size());
            assertTrue(response.getBody().get(0).getName().contains("Java"));
            verify(questionBankService, times(1)).searchQuestionBanks(keyword);
        }

        @Test
        @DisplayName("UC-17.9: Clone kho câu hỏi cho giảng viên khác")
        void testCloneQuestionBank_Success() {
            // Arrange
            Long targetTeacherId = 2L;
            QuestionBankResponse clonedBank = QuestionBankResponse.builder()
                    .id(3L)
                    .name("Java Programming Questions (Copy)")
                    .teacherId(targetTeacherId)
                    .build();

            when(questionBankService.cloneQuestionBank(bankId, targetTeacherId))
                    .thenReturn(clonedBank);

            // Act
            ResponseEntity<QuestionBankResponse> response =
                    questionBankController.cloneQuestionBank(bankId, targetTeacherId);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(targetTeacherId, response.getBody().getTeacherId());
            assertTrue(response.getBody().getName().contains("Copy"));
            verify(questionBankService, times(1)).cloneQuestionBank(bankId, targetTeacherId);
        }

        @Test
        @DisplayName("UC-17.10: Lấy tất cả kho câu hỏi trong hệ thống")
        void testGetAllQuestionBanks_Success() {
            // Arrange
            List<QuestionBankResponse> allBanks = Arrays.asList(
                    questionBankResponse,
                    QuestionBankResponse.builder()
                            .id(2L)
                            .name("Another Bank")
                            .build()
            );

            when(questionBankService.getAllQuestionBanks()).thenReturn(allBanks);

            // Act
            ResponseEntity<List<QuestionBankResponse>> response =
                    questionBankController.getAllQuestionBanks();

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(2, response.getBody().size());
            verify(questionBankService, times(1)).getAllQuestionBanks();
        }

        @Test
        @DisplayName("UC-17: Kho câu hỏi không tồn tại")
        void testGetQuestionBank_NotFound() {
            // Arrange
            Long nonExistentId = 999L;
            when(questionBankService.getQuestionBankById(nonExistentId))
                    .thenThrow(new ResourceNotFoundException("Question bank not found"));

            // Act & Assert
            ResourceNotFoundException exception = assertThrows(
                    ResourceNotFoundException.class,
                    () -> questionBankController.getQuestionBank(nonExistentId)
            );

            assertEquals("Question bank not found", exception.getMessage());
        }

        @Test
        @DisplayName("UC-17: Cập nhật kho câu hỏi không thuộc về giảng viên")
        void testUpdateQuestionBank_Unauthorized() {
            // Arrange
            when(questionBankService.updateQuestionBank(eq(bankId), any(QuestionBankRequest.class)))
                    .thenThrow(new InvalidRequestException("You don't have permission to update this question bank"));

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> questionBankController.updateQuestionBank(bankId, questionBankRequest)
            );

            assertEquals("You don't have permission to update this question bank", exception.getMessage());
        }

        @Test
        @DisplayName("UC-17: Tìm kiếm không có kết quả")
        void testSearchQuestionBanks_NoResults() {
            // Arrange
            String keyword = "NonExistentKeyword";
            when(questionBankService.searchQuestionBanks(keyword)).thenReturn(List.of());

            // Act
            ResponseEntity<List<QuestionBankResponse>> response =
                    questionBankController.searchQuestionBanks(keyword);

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertTrue(response.getBody().isEmpty());
            verify(questionBankService, times(1)).searchQuestionBanks(keyword);
        }

        @Test
        @DisplayName("UC-17: Clone kho câu hỏi với target teacher không tồn tại")
        void testCloneQuestionBank_TargetTeacherNotFound() {
            // Arrange
            Long invalidTeacherId = 999L;
            when(questionBankService.cloneQuestionBank(bankId, invalidTeacherId))
                    .thenThrow(new ResourceNotFoundException("Target teacher not found"));

            // Act & Assert
            ResourceNotFoundException exception = assertThrows(
                    ResourceNotFoundException.class,
                    () -> questionBankController.cloneQuestionBank(bankId, invalidTeacherId)
            );

            assertEquals("Target teacher not found", exception.getMessage());
        }

        @Test
        @DisplayName("UC-17: Tạo kho câu hỏi với tên trùng lặp")
        void testCreateQuestionBank_DuplicateName() {
            // Arrange
            when(questionBankService.createQuestionBank(eq(teacherId), any(QuestionBankRequest.class)))
                    .thenThrow(new InvalidRequestException("Question bank with this name already exists"));

            // Act & Assert
            InvalidRequestException exception = assertThrows(
                    InvalidRequestException.class,
                    () -> questionBankController.createQuestionBank(teacherId, questionBankRequest)
            );

            assertEquals("Question bank with this name already exists", exception.getMessage());
        }
    }
}

