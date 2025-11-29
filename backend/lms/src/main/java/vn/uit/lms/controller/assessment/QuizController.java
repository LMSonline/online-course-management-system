package vn.uit.lms.controller.assessment;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.assessment.QuizService;
import vn.uit.lms.shared.dto.request.assessment.AddQuestionsRequest;
import vn.uit.lms.shared.dto.request.assessment.QuizRequest;
import vn.uit.lms.shared.util.annotation.AdminOnly;
import vn.uit.lms.shared.util.annotation.TeacherOnly;

@RestController
@RequiredArgsConstructor
public class QuizController {
    private final QuizService quizService;

    @PostMapping("/lessons/{lessonId}/quizzes")
    @AdminOnly
    @TeacherOnly
    public ResponseEntity<?> createQuiz(@PathVariable Long lessonId, @RequestBody @Valid QuizRequest request) {
        return ResponseEntity.ok(quizService.createQuiz(lessonId, request));
    }

    @GetMapping("/lessons/{lessonId}/quizzes")
    public ResponseEntity<?> getAllQuizzes(@PathVariable Long lessonId) {
        return ResponseEntity.ok(quizService.getQuizzesByLesson(lessonId));
    }

    @GetMapping("/quizzes/{id}")
    public ResponseEntity<?> getQuiz(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuizById(id));
    }

    @PutMapping("/quizzes/{id}")
    @AdminOnly
    @TeacherOnly
    public ResponseEntity<?> updateQuiz(@PathVariable Long id, @RequestBody @Valid QuizRequest request) {
        return ResponseEntity.ok(quizService.updateQuiz(id, request));
    }

    @DeleteMapping("/quizzes/{id}")
    @AdminOnly
    @TeacherOnly
    public ResponseEntity<?> deleteQuiz(@PathVariable Long id) {
        quizService.deleteQuiz(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/quizzes/{id}/add-questions")
    @AdminOnly
    @TeacherOnly
    public ResponseEntity<?> addQuestionsToQuiz(@PathVariable Long id, @RequestBody @Valid AddQuestionsRequest request) {
        return ResponseEntity.ok(quizService.addQuestionsToQuiz(id, request));
    }

    @DeleteMapping("/quizzes/{id}/questions/{questionId}")
    @AdminOnly
    @TeacherOnly
    public ResponseEntity<?> removeQuestionFromQuiz(@PathVariable Long id, @PathVariable Long questionId) {
        quizService.removeQuestionFromQuiz(id, questionId);
        return ResponseEntity.noContent().build();
    }
}
