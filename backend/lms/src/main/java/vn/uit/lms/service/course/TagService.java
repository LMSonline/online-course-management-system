package vn.uit.lms.service.course;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.entity.course.Tag;
import vn.uit.lms.core.repository.course.TagRepository;
import vn.uit.lms.shared.dto.PageResponse;
import vn.uit.lms.shared.dto.request.course.TagRequest;
import vn.uit.lms.shared.exception.DuplicateResourceException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.util.annotation.EnableSoftDeleteFilter;

import java.util.List;

@Service
public class TagService {

    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }


    public boolean isDuplicatedTagName(Tag tag){
        String name = tag.getName();
        if (name == null || name.isBlank()) return false;

        if (tag.getId() == null) {
            return tagRepository.existsByNameIgnoreCaseAndDeletedAtIsNull(name);
        } else {
            return tagRepository.existsByNameIgnoreCaseAndIdNotAndDeletedAtIsNull(name, tag.getId());
        }
    }

    @Transactional
    public Tag createTag(TagRequest tagRequest) {

        Tag tag = new Tag();
        tag.setName(tagRequest.getName());

        if(isDuplicatedTagName(tag)) {
            throw new DuplicateResourceException("Tag with name " + tagRequest.getName() + " already exists");
        }

        return tagRepository.save(tag);
    }

    @EnableSoftDeleteFilter
    public PageResponse<Tag> getTagsActive(Pageable pageable) {
        Page<Tag> page = tagRepository.findAll(pageable);
        List<Tag> items = page.getContent();

        return  new PageResponse<>(
                items,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.hasNext(),
                page.hasPrevious()
        );
    }

    @Transactional
    @EnableSoftDeleteFilter
    public Tag updateTag(Long id, TagRequest tagRequest) {

        Tag tagDB = tagRepository.findByIdAndDeletedAtIsNull(id).orElseThrow(
            () -> new ResourceNotFoundException("Tag with id " + id + " not found")
        );

        tagDB.setName(tagRequest.getName());

        if(isDuplicatedTagName(tagDB)) {
            throw new DuplicateResourceException("Tag with name " + tagRequest.getName() + " already exists");
        }


        return tagRepository.save(tagDB);

    }

    @Transactional
    public void deleteTag(Long id) {
        Tag tagDB = tagRepository.findById(id).orElseThrow(
            () -> new ResourceNotFoundException("Tag with id " + id + " not found")
        );

        tagRepository.delete(tagDB);
    }

    public PageResponse<Tag> getAllIncludingDeleted(Pageable pageable) {
        Page<Tag> page = tagRepository.findAll(pageable);
        List<Tag> items = page.getContent();

        return  new PageResponse<>(
                items,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.hasNext(),
                page.hasPrevious()
        );
    }

    @Transactional
    public Tag restoreTag(Long id) {
        Tag tagDB = tagRepository.findByIdAndDeletedAtIsNotNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag with id " + id + " not found or not deleted"));

        if (isDuplicatedTagName(tagDB)) {
            throw new DuplicateResourceException("Cannot restore tag. Duplicate name exists: " + tagDB.getName());
        }

        tagDB.setDeletedAt(null);

        return tagRepository.save(tagDB);
    }





}
