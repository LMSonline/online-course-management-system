package vn.uit.lms.service.system;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.uit.lms.core.entity.system.SystemSetting;
import vn.uit.lms.core.repository.system.SystemSettingRepository;
import vn.uit.lms.shared.dto.request.system.SystemSettingRequest;
import vn.uit.lms.shared.dto.response.system.SystemSettingResponse;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.system.SystemSettingMapper;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SystemSettingService {

    private final SystemSettingRepository repo;
    private final SystemSettingMapper mapper;

    public List<SystemSettingResponse> getAll() {
        return repo.findAll().stream().map(mapper::toDto).toList();
    }

    public SystemSettingResponse create(SystemSettingRequest req) {
        SystemSetting s = new SystemSetting();
        s.setKeyName(req.getKeyName());
        s.setValue(req.getValue());
        s.setDescription(req.getDescription());
        return mapper.toDto(repo.save(s));
    }

    public SystemSettingResponse update(Long id, SystemSettingRequest req) {
        SystemSetting s = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Setting not found"));

        s.setKeyName(req.getKeyName());
        s.setValue(req.getValue());
        s.setDescription(req.getDescription());

        return mapper.toDto(repo.save(s));
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
