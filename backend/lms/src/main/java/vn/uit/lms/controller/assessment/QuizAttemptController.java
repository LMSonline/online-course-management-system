package vn.uit.lms.controller.assessment;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.assessment.QuizAttemptService;
import vn.uit.lms.shared.dto.request.assessment.SubmitAnswerRequest;

@RestController
@RequiredArgsConstructor
public class QuizAttemptController {
    private final QuizAttemptService quizAttemptService;

    @PostMapping("/quizzes/{id}/start")
    public ResponseEntity<?> startQuiz(@PathVariable Long id) {
        return ResponseEntity.ok(quizAttemptService.startQuiz(id));
    }

    @GetMapping("/quizzes/{quizId}/attempts/{attemptId}")
    public ResponseEntity<?> getQuizAttempt(@PathVariable Long quizId, @PathVariable Long attemptId) {
        return ResponseEntity.ok(quizAttemptService.getQuizAttempt(quizId, attemptId));
    }

    @PostMapping("/quizzes/{quizId}/attempts/{attemptId}/submit-answer")
    public ResponseEntity<?> submitAnswer(@PathVariable Long quizId, @PathVariable Long attemptId, @RequestBody @Valid SubmitAnswerRequest request) {
        quizAttemptService.submitAnswer(quizId, attemptId, request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/quizzes/{quizId}/attempts/{attemptId}/finish")
    public ResponseEntity<?> finishQuiz(@PathVariable Long quizId, @PathVariable Long attemptId) {
        return ResponseEntity.ok(quizAttemptService.finishQuiz(quizId, attemptId));
    }

    @GetMapping("/students/{studentId}/quiz-attempts")
    public ResponseEntity<?> getStudentQuizAttempts(@PathVariable Long studentId) {
        return ResponseEntity.ok(quizAttemptService.getStudentQuizAttempts(studentId));
    }

    @GetMapping("/quizzes/{id}/results")
    public ResponseEntity<?> getQuizResults(@PathVariable Long id) {
        return ResponseEntity.ok(quizAttemptService.getQuizResults(id));
    }
}
