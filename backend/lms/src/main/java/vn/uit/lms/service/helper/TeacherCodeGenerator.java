package vn.uit.lms.service.helper;

import org.springframework.stereotype.Service;

import java.time.Year;
import java.util.UUID;

@Service("teacherCodeGenerator")
public class TeacherCodeGenerator implements CodeGenerator {

    @Override
    public String generate() {

        String year = String.valueOf(Year.now().getValue()).substring(2);
        String random = UUID.randomUUID().toString()
                .replace("-", "")
                .substring(0, 6)
                .toUpperCase();
        return String.format("TEA%s%s", year, random);
    }
}
