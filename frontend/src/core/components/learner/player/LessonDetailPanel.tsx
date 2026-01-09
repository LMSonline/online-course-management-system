import React from "react";
import { QuizPlayerShell } from "@/core/components/learner/quiz/QuizPlayerShell";
import { AssignmentResponse } from "@/services/assignment/assignment.types";
import { LessonResponse } from "@/services/courses/content/lesson.types";
import { assignmentService } from "@/services/assignment/assignment.service";
import { quizService } from "@/services/assessment/assessment.service";

interface LessonDetailPanelProps {
  lesson: LessonResponse;
}

export const LessonDetailPanel: React.FC<LessonDetailPanelProps> = ({ lesson }) => {
  // TODO: fetch quiz, assignment, resource by lesson.id
  // For now, just mock UI
  return (
    <div className="space-y-4">
      {/* Quiz */}
      <div>
        <h3 className="font-semibold text-base mb-2">Quiz</h3>
        {/* <QuizPlayerShell quizId={...} /> */}
        <div className="text-xs text-slate-400">Quiz content here...</div>
      </div>
      {/* Assignment */}
      <div>
        <h3 className="font-semibold text-base mb-2">Assignment</h3>
        <div className="text-xs text-slate-400">Assignment content here...</div>
      </div>
      {/* Resources */}
      <div>
        <h3 className="font-semibold text-base mb-2">Resources</h3>
        <div className="text-xs text-slate-400">Resource list here...</div>
      </div>
    </div>
  );
};
