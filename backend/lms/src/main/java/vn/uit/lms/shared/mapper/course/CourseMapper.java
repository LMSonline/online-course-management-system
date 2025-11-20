package vn.uit.lms.shared.mapper.course;

import vn.uit.lms.core.entity.course.Course;
import vn.uit.lms.core.entity.course.CourseTag;
import vn.uit.lms.core.entity.course.CourseVersion;
import vn.uit.lms.shared.dto.response.course.CourseDetailResponse;
import vn.uit.lms.shared.dto.response.course.CourseResponse;

import java.util.List;
import java.util.stream.Collectors;

public class CourseMapper {

    public static CourseDetailResponse toCourseDetailResponse(Course course) {
        if (course == null) return null;

        CourseDetailResponse response = new CourseDetailResponse();

        response.setId(course.getId());
        response.setTitle(course.getTitle());
        response.setShortDescription(course.getShortDescription());
        response.setDifficulty(course.getDifficulty());
        response.setThumbnailUrl(course.getThumbnailUrl());
        response.setSlug(course.getSlug());
        response.setCanonicalUrl(course.getCanonicalUrl());
        response.setIsClosed(course.getIsClosed());

        // SEO
        response.setMetaTitle(course.getMetaTitle());
        response.setMetaDescription(course.getMetaDescription());
        response.setSeoKeywords(course.getSeoKeywords());
        response.setIndexed(course.isIndexed());

        // Category
        if (course.getCategory() != null) {
            CourseDetailResponse.CategoryDto categoryDto = new CourseDetailResponse.CategoryDto();
            categoryDto.setId(course.getCategory().getId());
            categoryDto.setName(course.getCategory().getName());
            categoryDto.setDescription(course.getCategory().getDescription());
            categoryDto.setCode(course.getCategory().getCode());
            response.setCategory(categoryDto);
        }

        // Teacher
        response.setTeacherId(course.getTeacher().getId());

        // Tags
        List<String> tagNames = course.getCourseTags().stream()
                .map(CourseTag::getTag)
                .map(tag -> tag.getName())
                .collect(Collectors.toList());
        response.setTags(tagNames);

        //add last version id and version number
        CourseVersion lastVersion = course.getLastVersion();
        if (lastVersion != null) {
            response.setLastVersionId(lastVersion.getId());
            response.setVersionNumber(lastVersion.getVersionNumber());
        }
        return response;
    }

    public static CourseResponse toCourseResponse(Course course) {
        if (course == null) return null;

        CourseResponse response = new CourseResponse();
        response.setId(course.getId());
        response.setTitle(course.getTitle());
        response.setShortDescription(course.getShortDescription());
        response.setDifficulty(course.getDifficulty());
        response.setThumbnailUrl(course.getThumbnailUrl());
        response.setSlug(course.getSlug());
        response.setIsClosed(course.getIsClosed());

        if (course.getCategory() != null) {
            response.setCategoryId(course.getCategory().getId());
            response.setCategoryName(course.getCategory().getName());
        }

        if (course.getTeacher() != null) {
            response.setTeacherId(course.getTeacher().getId());
            response.setTeacherName(course.getTeacher().getFullName());
        }

        CourseVersion lastVersion = course.getLastVersion();
        if (lastVersion != null) {
            response.setLastVersionId(lastVersion.getId());
            response.setVersionNumber(lastVersion.getVersionNumber());
        }

        return response;


    }
}
