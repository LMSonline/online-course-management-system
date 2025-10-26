package vn.uit.lms.service.helper;

import org.springframework.stereotype.Service;

import java.time.Year;
import java.util.UUID;

@Service("studentCodeGenerator")
public class StudentCodeGenerator implements CodeGenerator {

    @Override
    public String generate() {
        String year = String.valueOf(Year.now().getValue()).substring(2);
        String random = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        return String.format("STU%s%s", year, random);
    }
}

