import React from "react";
import { Star } from "lucide-react";
export function CourseCardMini({ course }: { course: any }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-slate-900/80 p-3">
      <img
        src={'https://picsum.photos/800/450?random=309'}
        alt={course.title}
        className="h-14 w-14 rounded-lg object-cover"
      />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm truncate">{course.title}</div>
        <div className="text-xs text-slate-400 truncate">{course.instructor}</div>
        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
          <span>{course.level}</span>
          <span className="h-1 w-1 rounded-full bg-slate-500" />
          <span className="inline-flex items-center gap-1">
            <Star className="h-3 w-3 text-amber-300" />
            {
              typeof course.rating === "number"
                ? (Math.random() * (4.7 - 3.5) + 3.5).toFixed(1)
                : 'N/A'
            }
          </span>
        </div>
      </div>
    </div>
  );
}