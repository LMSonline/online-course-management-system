package vn.uit.lms.service.helper;

public interface CodeGenerator {
    /**
     * Sinh mã duy nhất cho loại entity cụ thể (Student, Teacher,...)
     */
    public String generate();
}
