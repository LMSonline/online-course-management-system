package vn.uit.lms.controller.assessment;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.assessment.QuestionService;
import vn.uit.lms.shared.dto.request.assessment.AnswerOptionRequest;
import vn.uit.lms.shared.dto.request.assessment.QuestionRequest;
import vn.uit.lms.shared.util.annotation.TeacherOnly;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class QuestionController {
    private final QuestionService questionService;

    @PostMapping("/question-banks/{bankId}/questions")
    @TeacherOnly
    public ResponseEntity<?> createQuestion(@PathVariable Long bankId, @RequestBody @Valid QuestionRequest request) {
        return ResponseEntity.ok(questionService.createQuestion(bankId, request));
    }

    @GetMapping("/question-banks/{bankId}/questions")
    @TeacherOnly
    public ResponseEntity<?> getAllQuestions(@PathVariable Long bankId) {
        return ResponseEntity.ok(questionService.getQuestionsByBank(bankId));
    }

    @GetMapping("/questions/{id}")
    @TeacherOnly
    public ResponseEntity<?> getQuestion(@PathVariable Long id) {
        return ResponseEntity.ok(questionService.getQuestionById(id));
    }

    @PutMapping("/questions/{id}")
    @TeacherOnly
    public ResponseEntity<?> updateQuestion(@PathVariable Long id, @RequestBody @Valid QuestionRequest request) {
        return ResponseEntity.ok(questionService.updateQuestion(id, request));
    }

    @DeleteMapping("/questions/{id}")
    @TeacherOnly
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/questions/{id}/answer-options")
    @TeacherOnly
    public ResponseEntity<?> manageAnswerOptions(@PathVariable Long id, @RequestBody @Valid List<AnswerOptionRequest> request) {
        return ResponseEntity.ok(questionService.manageAnswerOptions(id, request));
    }
}
