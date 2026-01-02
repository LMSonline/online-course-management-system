package vn.uit.lms.controller.assessment;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.assessment.QuizService;
import vn.uit.lms.service.assessment.QuizStatisticsService;
import vn.uit.lms.shared.dto.request.assessment.AddQuestionsRequest;
import vn.uit.lms.shared.dto.request.assessment.QuizRequest;
import vn.uit.lms.shared.dto.response.assessment.QuizEligibilityResponse;
import vn.uit.lms.shared.dto.response.assessment.QuizResponse;
import vn.uit.lms.shared.dto.response.assessment.QuizStatisticsResponse;
import vn.uit.lms.shared.util.annotation.StudentOnly;
import vn.uit.lms.shared.util.annotation.TeacherOnly;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class QuizController {
    private final QuizService quizService;
    private final QuizStatisticsService quizStatisticsService;

    @PostMapping("/lessons/{lessonId}/quizzes")
    @TeacherOnly
    public ResponseEntity<QuizResponse> createQuiz(@PathVariable Long lessonId, @RequestBody @Valid QuizRequest request) {
        return ResponseEntity.ok(quizService.createQuiz(lessonId, request));
    }

    @GetMapping("/lessons/{lessonId}/quizzes")
    public ResponseEntity<List<QuizResponse>> getAllQuizzes(@PathVariable Long lessonId) {
        return ResponseEntity.ok(quizService.getQuizzesByLesson(lessonId));
    }

    @GetMapping("/quizzes/{id}")
    public ResponseEntity<QuizResponse> getQuiz(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuizById(id));
    }

    @PutMapping("/quizzes/{id}")
    @TeacherOnly
    public ResponseEntity<QuizResponse> updateQuiz(@PathVariable Long id, @RequestBody @Valid QuizRequest request) {
        return ResponseEntity.ok(quizService.updateQuiz(id, request));
    }

    @DeleteMapping("/quizzes/{id}")
    @TeacherOnly
    public ResponseEntity<QuizResponse> deleteQuiz(@PathVariable Long id) {
        quizService.deleteQuiz(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/quizzes/{id}/add-questions")
    @TeacherOnly
    public ResponseEntity<QuizResponse> addQuestionsToQuiz(@PathVariable Long id, @RequestBody @Valid AddQuestionsRequest request) {
        return ResponseEntity.ok(quizService.addQuestionsToQuiz(id, request));
    }

    @DeleteMapping("/quizzes/{id}/questions/{questionId}")
    @TeacherOnly
    public ResponseEntity<Void> removeQuestionFromQuiz(@PathVariable Long id, @PathVariable Long questionId) {
        quizService.removeQuestionFromQuiz(id, questionId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/quizzes/{id}/eligibility")
    @StudentOnly
    public ResponseEntity<QuizEligibilityResponse> checkEligibility(@PathVariable Long id) {
        return ResponseEntity.ok(quizStatisticsService.checkEligibility(id));
    }

    @GetMapping("/quizzes/{id}/statistics")
    @TeacherOnly
    public ResponseEntity<QuizStatisticsResponse> getQuizStatistics(@PathVariable Long id) {
        return ResponseEntity.ok(quizStatisticsService.getQuizStatistics(id));
    }

    @GetMapping("/quizzes/{id}/for-taking")
    @StudentOnly
    public ResponseEntity<QuizResponse> getQuizForTaking(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuizForTaking(id));
    }

    @PostMapping("/quizzes/{id}/clone")
    @TeacherOnly
    public ResponseEntity<QuizResponse> cloneQuiz(@PathVariable Long id, @RequestParam Long targetLessonId) {
        return ResponseEntity.ok(quizService.cloneQuiz(id, targetLessonId));
    }

    @PutMapping("/quizzes/{id}/reorder-questions")
    @TeacherOnly
    public ResponseEntity<Void> reorderQuestions(@PathVariable Long id, @RequestBody List<Long> questionIdsInOrder) {
        quizService.reorderQuestions(id, questionIdsInOrder);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/quizzes/{id}/question-count")
    public ResponseEntity<Integer> getQuestionCount(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuestionCount(id));
    }

    @PutMapping("/quizzes/{id}/time-limit")
    @TeacherOnly
    public ResponseEntity<QuizResponse> updateTimeLimit(@PathVariable Long id, @RequestParam Integer timeLimitMinutes) {
        return ResponseEntity.ok(quizService.updateTimeLimit(id, timeLimitMinutes));
    }

    @PutMapping("/quizzes/{id}/passing-score")
    @TeacherOnly
    public ResponseEntity<QuizResponse> updatePassingScore(@PathVariable Long id, @RequestParam Double passingScore) {
        return ResponseEntity.ok(quizService.updatePassingScore(id, passingScore));
    }

    @PostMapping("/quizzes/{id}/add-from-bank")
    @TeacherOnly
    public ResponseEntity<QuizResponse> addQuestionsFromBank(
            @PathVariable Long id,
            @RequestParam Long questionBankId,
            @RequestParam(required = false) Integer count) {
        return ResponseEntity.ok(quizService.addQuestionsFromBank(id, questionBankId, count));
    }

    @DeleteMapping("/quizzes/{id}/questions")
    @TeacherOnly
    public ResponseEntity<Void> removeAllQuestions(@PathVariable Long id) {
        quizService.removeAllQuestions(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/quizzes/{id}/max-attempts")
    @TeacherOnly
    public ResponseEntity<QuizResponse> updateMaxAttempts(@PathVariable Long id, @RequestParam Integer maxAttempts) {
        return ResponseEntity.ok(quizService.updateMaxAttempts(id, maxAttempts));
    }
}
