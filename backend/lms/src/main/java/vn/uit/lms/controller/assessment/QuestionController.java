package vn.uit.lms.controller.assessment;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.assessment.QuestionService;
import vn.uit.lms.shared.dto.request.assessment.AnswerOptionRequest;
import vn.uit.lms.shared.dto.request.assessment.QuestionRequest;
import vn.uit.lms.shared.dto.response.assessment.QuestionResponse;
import vn.uit.lms.shared.annotation.TeacherOnly;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class QuestionController {
    private final QuestionService questionService;

    @PostMapping("/question-banks/{bankId}/questions")
    @TeacherOnly
    public ResponseEntity<QuestionResponse> createQuestion(@PathVariable Long bankId, @RequestBody @Valid QuestionRequest request) {
        return ResponseEntity.ok(questionService.createQuestion(bankId, request));
    }

    @GetMapping("/question-banks/{bankId}/questions")
    @TeacherOnly
    public ResponseEntity<List<QuestionResponse>> getAllQuestions(@PathVariable Long bankId) {
        return ResponseEntity.ok(questionService.getQuestionsByBank(bankId));
    }

    @GetMapping("/questions/{id}")
    @TeacherOnly
    public ResponseEntity<QuestionResponse> getQuestion(@PathVariable Long id) {
        return ResponseEntity.ok(questionService.getQuestionById(id));
    }

    @PutMapping("/questions/{id}")
    @TeacherOnly
    public ResponseEntity<QuestionResponse> updateQuestion(@PathVariable Long id, @RequestBody @Valid QuestionRequest request) {
        return ResponseEntity.ok(questionService.updateQuestion(id, request));
    }

    @DeleteMapping("/questions/{id}")
    @TeacherOnly
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/questions/{id}/answer-options")
    @TeacherOnly
    public ResponseEntity<QuestionResponse> manageAnswerOptions(@PathVariable Long id, @RequestBody @Valid List<AnswerOptionRequest> request) {
        return ResponseEntity.ok(questionService.manageAnswerOptions(id, request));
    }

    @GetMapping("/question-banks/{bankId}/questions/search")
    @TeacherOnly
    public ResponseEntity<List<QuestionResponse>> searchQuestions(@PathVariable Long bankId, @RequestParam String keyword) {
        return ResponseEntity.ok(questionService.searchQuestions(bankId, keyword));
    }

    @GetMapping("/question-banks/{bankId}/questions/by-type")
    @TeacherOnly
    public ResponseEntity<List<QuestionResponse>> getQuestionsByType(
            @PathVariable Long bankId,
            @RequestParam vn.uit.lms.shared.constant.QuestionType type) {
        return ResponseEntity.ok(questionService.getQuestionsByType(bankId, type));
    }

    @PostMapping("/questions/{id}/clone")
    @TeacherOnly
    public ResponseEntity<QuestionResponse> cloneQuestion(@PathVariable Long id, @RequestParam Long targetBankId) {
        return ResponseEntity.ok(questionService.cloneQuestion(id, targetBankId));
    }

    @DeleteMapping("/questions/bulk")
    @TeacherOnly
    public ResponseEntity<Void> bulkDeleteQuestions(@RequestBody List<Long> questionIds) {
        questionService.bulkDeleteQuestions(questionIds);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/questions/{id}/max-points")
    @TeacherOnly
    public ResponseEntity<QuestionResponse> updateMaxPoints(@PathVariable Long id, @RequestParam Double maxPoints) {
        return ResponseEntity.ok(questionService.updateMaxPoints(id, maxPoints));
    }

    @GetMapping("/question-banks/{bankId}/questions/count")
    @TeacherOnly
    public ResponseEntity<Map<String, Integer>> getQuestionCount(@PathVariable Long bankId) {
        return ResponseEntity.ok(Map.of("count", questionService.getQuestionCount(bankId)));
    }

    @GetMapping("/questions/{id}/in-use")
    @TeacherOnly
    public ResponseEntity<Map<String, Boolean>> checkQuestionInUse(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("inUse", questionService.isQuestionInUse(id)));
    }

    @GetMapping("/questions/{id}/quizzes")
    @TeacherOnly
    public ResponseEntity<Map<String, List<Long>>> getQuizzesUsingQuestion(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("quizIds", questionService.getQuizzesUsingQuestion(id)));
    }
}
