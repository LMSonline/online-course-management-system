package vn.uit.lms.service;

import org.springframework.stereotype.Service;
import vn.uit.lms.core.repository.TeacherRepository;

@Service
public class TeacherService {

    private final TeacherRepository teacherRepository;

    public TeacherService(TeacherRepository teacherRepository) {
        this.teacherRepository = teacherRepository;
    }
}
