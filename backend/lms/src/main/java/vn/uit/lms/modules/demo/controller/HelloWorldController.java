package vn.uit.lms.modules.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.uit.lms.core.repository.TestRepository;
import vn.uit.lms.shared.entity.TestEntity;

@RestController
public class HelloWorldController {

    private final TestRepository testRepository;
    public HelloWorldController(TestRepository testRepository) {
        this.testRepository = testRepository;
    }

    @GetMapping("/")
    public ResponseEntity<String> hello() {
        return ResponseEntity.ok("Hello World");
    }

    @GetMapping("/ping")
    public ResponseEntity<TestEntity> ping() {
        TestEntity testEntity = new TestEntity();
        testEntity.setName("Test Entity");
        testEntity.setAge(10);
        return ResponseEntity.ok( this.testRepository.save(testEntity));
    }
}
