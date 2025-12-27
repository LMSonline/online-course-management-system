// src/core/components/teacher/course-management/CourseManagementShell.tsx
"use client";

import { useState } from "react";
import type {
  TeacherCourseManage,
  CurriculumItem,
  CurriculumSection,
} from "@/lib/teacher/course-management/types";
import { VersionSwitcher } from "./VersionSwitcher";
import { CurriculumEditor } from "./CurriculumEditor";
import { ItemInspector } from "./ItemInspector";

type Props = {
  course: TeacherCourseManage;
};

export function CourseManagementShell({ course }: Props) {
  const [selectedVersionId, setSelectedVersionId] = useState(
    course.versions.find((v) => v.isCurrent)?.id ?? course.versions[0]?.id
  );

  const [selectedItem, setSelectedItem] = useState<{
    item: CurriculumItem;
    section: CurriculumSection;
  }>();

  const handleSelectItem = (item: CurriculumItem, sectionId: string) => {
    const section = course.sections.find((s) => s.id === sectionId);
    if (!section) return;
    setSelectedItem({ item, section });
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
      <div className="space-y-4">
        <VersionSwitcher
          versions={course.versions}
          selectedId={selectedVersionId}
          onChange={setSelectedVersionId}
        />
        <CurriculumEditor
          sections={course.sections}
          selectedItemId={selectedItem?.item.id}
          onSelectItem={handleSelectItem}
        />
      </div>

      <ItemInspector item={selectedItem?.item} section={selectedItem?.section} />
    </div>
  );
}
