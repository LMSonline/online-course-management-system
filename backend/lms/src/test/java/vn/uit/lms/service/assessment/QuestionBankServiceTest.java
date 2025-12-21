package vn.uit.lms.service.assessment;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import vn.uit.lms.core.domain.Teacher;
import vn.uit.lms.core.domain.assessment.QuestionBank;
import vn.uit.lms.core.repository.TeacherRepository;
import vn.uit.lms.core.repository.assessment.QuestionBankRepository;
import vn.uit.lms.shared.dto.request.assessment.QuestionBankRequest;
import vn.uit.lms.shared.dto.response.assessment.QuestionBankResponse;
import vn.uit.lms.shared.exception.ResourceNotFoundException;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("QuestionBankService Tests")
class QuestionBankServiceTest {

    @Mock
    private QuestionBankRepository questionBankRepository;

    @Mock
    private TeacherRepository teacherRepository;

    @InjectMocks
    private QuestionBankService questionBankService;

    private Teacher teacher;
    private QuestionBank questionBank;
    private QuestionBankRequest questionBankRequest;

    @BeforeEach
    void setUp() {
        teacher = Teacher.builder()
                .id(1L)
                .teacherCode("TCH001")
                .build();

        questionBank = QuestionBank.builder()
                .id(1L)
                .name("Data Structures Question Bank")
                .description("Questions for Data Structures course")
                .teacher(teacher)
                .build();

        questionBankRequest = new QuestionBankRequest();
        questionBankRequest.setName("Data Structures Question Bank");
        questionBankRequest.setDescription("Questions for Data Structures course");
    }

    @Test
    @DisplayName("Should create question bank successfully")
    void testCreateQuestionBank_Success() {
        // Arrange
        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacher));
        when(questionBankRepository.save(any(QuestionBank.class))).thenReturn(questionBank);

        // Act
        QuestionBankResponse response = questionBankService.createQuestionBank(1L, questionBankRequest);

        // Assert
        assertNotNull(response);
        assertEquals("Data Structures Question Bank", response.getName());
        assertEquals("Questions for Data Structures course", response.getDescription());
        verify(teacherRepository, times(1)).findById(1L);
        verify(questionBankRepository, times(1)).save(any(QuestionBank.class));
    }

    @Test
    @DisplayName("Should throw exception when teacher not found during creation")
    void testCreateQuestionBank_TeacherNotFound() {
        // Arrange
        when(teacherRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> questionBankService.createQuestionBank(1L, questionBankRequest));

        assertEquals("Teacher not found", exception.getMessage());
        verify(teacherRepository, times(1)).findById(1L);
        verify(questionBankRepository, never()).save(any(QuestionBank.class));
    }

    @Test
    @DisplayName("Should get question banks by teacher successfully")
    void testGetQuestionBanksByTeacher_Success() {
        // Arrange
        QuestionBank questionBank2 = QuestionBank.builder()
                .id(2L)
                .name("Algorithms Question Bank")
                .description("Questions for Algorithms course")
                .teacher(teacher)
                .build();

        List<QuestionBank> questionBanks = Arrays.asList(questionBank, questionBank2);
        when(questionBankRepository.findByTeacherId(1L)).thenReturn(questionBanks);

        // Act
        List<QuestionBankResponse> responses = questionBankService.getQuestionBanksByTeacher(1L);

        // Assert
        assertNotNull(responses);
        assertEquals(2, responses.size());
        assertEquals("Data Structures Question Bank", responses.get(0).getName());
        assertEquals("Algorithms Question Bank", responses.get(1).getName());
        verify(questionBankRepository, times(1)).findByTeacherId(1L);
    }

    @Test
    @DisplayName("Should return empty list when teacher has no question banks")
    void testGetQuestionBanksByTeacher_EmptyList() {
        // Arrange
        when(questionBankRepository.findByTeacherId(1L)).thenReturn(List.of());

        // Act
        List<QuestionBankResponse> responses = questionBankService.getQuestionBanksByTeacher(1L);

        // Assert
        assertNotNull(responses);
        assertTrue(responses.isEmpty());
        verify(questionBankRepository, times(1)).findByTeacherId(1L);
    }

    @Test
    @DisplayName("Should get question bank by id successfully")
    void testGetQuestionBankById_Success() {
        // Arrange
        when(questionBankRepository.findById(1L)).thenReturn(Optional.of(questionBank));

        // Act
        QuestionBankResponse response = questionBankService.getQuestionBankById(1L);

        // Assert
        assertNotNull(response);
        assertEquals("Data Structures Question Bank", response.getName());
        assertEquals("Questions for Data Structures course", response.getDescription());
        verify(questionBankRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should throw exception when question bank not found by id")
    void testGetQuestionBankById_NotFound() {
        // Arrange
        when(questionBankRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> questionBankService.getQuestionBankById(1L));

        assertEquals("Question bank not found", exception.getMessage());
        verify(questionBankRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should update question bank successfully")
    void testUpdateQuestionBank_Success() {
        // Arrange
        QuestionBankRequest updateRequest = new QuestionBankRequest();
        updateRequest.setName("Updated Question Bank");
        updateRequest.setDescription("Updated description");

        QuestionBank updatedQuestionBank = QuestionBank.builder()
                .id(1L)
                .name("Updated Question Bank")
                .description("Updated description")
                .teacher(teacher)
                .build();

        when(questionBankRepository.findById(1L)).thenReturn(Optional.of(questionBank));
        when(questionBankRepository.save(any(QuestionBank.class))).thenReturn(updatedQuestionBank);

        // Act
        QuestionBankResponse response = questionBankService.updateQuestionBank(1L, updateRequest);

        // Assert
        assertNotNull(response);
        assertEquals("Updated Question Bank", response.getName());
        assertEquals("Updated description", response.getDescription());
        verify(questionBankRepository, times(1)).findById(1L);
        verify(questionBankRepository, times(1)).save(any(QuestionBank.class));
    }

    @Test
    @DisplayName("Should throw exception when updating non-existent question bank")
    void testUpdateQuestionBank_NotFound() {
        // Arrange
        when(questionBankRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> questionBankService.updateQuestionBank(1L, questionBankRequest));

        assertEquals("Question bank not found", exception.getMessage());
        verify(questionBankRepository, times(1)).findById(1L);
        verify(questionBankRepository, never()).save(any(QuestionBank.class));
    }

    @Test
    @DisplayName("Should delete question bank successfully")
    void testDeleteQuestionBank_Success() {
        // Arrange
        when(questionBankRepository.existsById(1L)).thenReturn(true);
        doNothing().when(questionBankRepository).deleteById(1L);

        // Act
        assertDoesNotThrow(() -> questionBankService.deleteQuestionBank(1L));

        // Assert
        verify(questionBankRepository, times(1)).existsById(1L);
        verify(questionBankRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Should throw exception when deleting non-existent question bank")
    void testDeleteQuestionBank_NotFound() {
        // Arrange
        when(questionBankRepository.existsById(anyLong())).thenReturn(false);

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> questionBankService.deleteQuestionBank(1L));

        assertEquals("Question bank not found", exception.getMessage());
        verify(questionBankRepository, times(1)).existsById(1L);
        verify(questionBankRepository, never()).deleteById(anyLong());
    }
}
