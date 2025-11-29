package vn.uit.lms.controller.assessment;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.assessment.QuestionBankService;
import vn.uit.lms.shared.dto.request.assessment.QuestionBankRequest;
import vn.uit.lms.shared.util.annotation.AdminOnly;
import vn.uit.lms.shared.util.annotation.TeacherOnly;

@RestController
@RequiredArgsConstructor
public class QuestionBankController {
    private final QuestionBankService questionBankService;

    @PostMapping("/teachers/{teacherId}/question-banks")
    @AdminOnly
    @TeacherOnly
    public ResponseEntity<?> createQuestionBank(@PathVariable Long teacherId, @RequestBody @Valid QuestionBankRequest request) {
        return ResponseEntity.ok(questionBankService.createQuestionBank(teacherId, request));
    }

    @GetMapping("/teachers/{teacherId}/question-banks")
    @AdminOnly
    @TeacherOnly
    public ResponseEntity<?> getAllQuestionBanks(@PathVariable Long teacherId) {
        return ResponseEntity.ok(questionBankService.getQuestionBanksByTeacher(teacherId));
    }

    @GetMapping("/question-banks/{id}")
    @AdminOnly
    @TeacherOnly
    public ResponseEntity<?> getQuestionBank(@PathVariable Long id) {
        return ResponseEntity.ok(questionBankService.getQuestionBankById(id));
    }

    @PutMapping("/question-banks/{id}")
    @AdminOnly
    @TeacherOnly
    public ResponseEntity<?> updateQuestionBank(@PathVariable Long id, @RequestBody @Valid QuestionBankRequest request) {
        return ResponseEntity.ok(questionBankService.updateQuestionBank(id, request));
    }

    @DeleteMapping("/question-banks/{id}")
    @AdminOnly
    @TeacherOnly
    public ResponseEntity<?> deleteQuestionBank(@PathVariable Long id) {
        questionBankService.deleteQuestionBank(id);
        return ResponseEntity.noContent().build();
    }
}
