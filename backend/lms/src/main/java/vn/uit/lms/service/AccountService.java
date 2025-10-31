package vn.uit.lms.service;

import org.springframework.stereotype.Service;
import vn.uit.lms.core.entity.Account;
import vn.uit.lms.core.entity.Student;
import vn.uit.lms.core.entity.Teacher;
import vn.uit.lms.core.repository.AccountRepository;
import vn.uit.lms.core.repository.StudentRepository;
import vn.uit.lms.core.repository.TeacherRepository;
import vn.uit.lms.shared.constant.SecurityConstants;
import vn.uit.lms.shared.dto.response.account.AccountProfileResponse;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.exception.UnauthorizedException;
import vn.uit.lms.shared.mapper.StudentMapper;
import vn.uit.lms.shared.mapper.TeacherMapper;
import vn.uit.lms.shared.util.SecurityUtils;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;

    public AccountService(AccountRepository accountRepository,
                          StudentRepository studentRepository,
                          TeacherRepository teacherRepository) {
        this.accountRepository = accountRepository;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
    }

    public AccountProfileResponse getProfile() {

        String email = SecurityUtils.getCurrentUserLogin()
                .filter(e -> !SecurityConstants.ANONYMOUS_USER.equals(e))
                .orElseThrow(() -> new UnauthorizedException("User not authenticated") {
                });

        Account account = accountRepository.findOneByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        AccountProfileResponse accountProfileResponse = new AccountProfileResponse();
        accountProfileResponse.setAccountId(account.getId());
        accountProfileResponse.setUsername(account.getUsername());
        accountProfileResponse.setEmail(account.getEmail());
        accountProfileResponse.setLastLoginAt(account.getLastLoginAt());
        accountProfileResponse.setRole(account.getRole());
        accountProfileResponse.setStatus(account.getStatus());

        AccountProfileResponse.Profile profile  = new AccountProfileResponse.Profile();

        profile = switch (account.getRole()) {
            case STUDENT -> {
                Student student = studentRepository.findByAccount(account)
                        .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
                yield StudentMapper.toProfileResponse(student);
            }
            case TEACHER -> {
                Teacher teacher = teacherRepository.findByAccount(account)
                        .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
                yield TeacherMapper.toProfileResponse(teacher);
            }
            case ADMIN -> null;
        };

        accountProfileResponse.setProfile(profile);
        return accountProfileResponse;
    }

}
