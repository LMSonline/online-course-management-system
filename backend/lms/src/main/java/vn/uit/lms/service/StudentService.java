package vn.uit.lms.service;

import org.springframework.stereotype.Service;
import vn.uit.lms.core.repository.StudentRepository;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

}
