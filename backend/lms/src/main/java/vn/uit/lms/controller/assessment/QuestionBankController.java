package vn.uit.lms.controller.assessment;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.assessment.QuestionBankService;
import vn.uit.lms.shared.dto.request.assessment.QuestionBankRequest;
import vn.uit.lms.shared.dto.response.assessment.QuestionBankResponse;
import vn.uit.lms.shared.util.annotation.TeacherOnly;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class QuestionBankController {
    private final QuestionBankService questionBankService;

    @PostMapping("/teachers/{teacherId}/question-banks")
    @TeacherOnly
    public ResponseEntity<QuestionBankResponse> createQuestionBank(@PathVariable Long teacherId, @RequestBody @Valid QuestionBankRequest request) {
        return ResponseEntity.ok(questionBankService.createQuestionBank(teacherId, request));
    }

    @GetMapping("/teachers/{teacherId}/question-banks")
    @TeacherOnly
    public ResponseEntity<List<QuestionBankResponse>> getAllQuestionBanks(@PathVariable Long teacherId) {
        return ResponseEntity.ok(questionBankService.getQuestionBanksByTeacher(teacherId));
    }

    @GetMapping("/question-banks/{id}")
    @TeacherOnly
    public ResponseEntity<QuestionBankResponse> getQuestionBank(@PathVariable Long id) {
        return ResponseEntity.ok(questionBankService.getQuestionBankById(id));
    }

    @PutMapping("/question-banks/{id}")
    @TeacherOnly
    public ResponseEntity<QuestionBankResponse> updateQuestionBank(@PathVariable Long id, @RequestBody @Valid QuestionBankRequest request) {
        return ResponseEntity.ok(questionBankService.updateQuestionBank(id, request));
    }

    @DeleteMapping("/question-banks/{id}")
    @TeacherOnly
    public ResponseEntity<Void> deleteQuestionBank(@PathVariable Long id) {
        questionBankService.deleteQuestionBank(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/question-banks")
    @TeacherOnly
    public ResponseEntity<List<QuestionBankResponse>> getAllQuestionBanks() {
        return ResponseEntity.ok(questionBankService.getAllQuestionBanks());
    }

    @GetMapping("/question-banks/search")
    @TeacherOnly
    public ResponseEntity<List<QuestionBankResponse>> searchQuestionBanks(@RequestParam String keyword) {
        return ResponseEntity.ok(questionBankService.searchQuestionBanks(keyword));
    }

    @PostMapping("/question-banks/{id}/clone")
    @TeacherOnly
    public ResponseEntity<QuestionBankResponse> cloneQuestionBank(@PathVariable Long id, @RequestParam Long targetTeacherId) {
        return ResponseEntity.ok(questionBankService.cloneQuestionBank(id, targetTeacherId));
    }
}
