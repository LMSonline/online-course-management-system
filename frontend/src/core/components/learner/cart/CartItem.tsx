import React from "react";
import { CartCourse } from "./CartContext";
import { Trash2, GraduationCap } from "lucide-react";

export type CartItemProps = {
  course: CartCourse;
  checked?: boolean;
  onCheck?: (checked: boolean) => void;
  onRemove?: () => void;
  onEnroll?: () => void;
};

export const CartItem: React.FC<CartItemProps> = ({ course, checked, onCheck, onRemove, onEnroll }) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-white/5 hover:bg-emerald-50/10 transition rounded-xl relative">
      <input type="checkbox" checked={checked} onChange={e => onCheck?.(e.target.checked)} className="accent-emerald-500 scale-125 md:mr-2" />
      <div className="relative">
        <img src={course.thumbnailUrl || "/images/lesson_thum.png"} alt={course.title} className="w-20 h-20 rounded-xl object-cover shadow-md" />
        {course.discountPercent && (
          <span className="absolute top-1 left-1 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">-{course.discountPercent}%</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-white text-base truncate mb-1">{course.title}</div>
        <div className="text-xs text-slate-400 mb-0.5">{course.level} • {course.studentsCount?.toLocaleString()} students</div>
        <div className="text-xs text-slate-400 mb-0.5">Rating: {course.rating?.toFixed(1) ?? "-"}</div>
      </div>
      <div className="flex flex-col items-end min-w-[90px]">
        <div className="text-lg font-bold text-white">{course.currency ?? "$"}{course.price.toLocaleString()}</div>
        {course.oldPrice && <div className="text-xs text-slate-400 line-through">{course.currency ?? "$"}{course.oldPrice.toLocaleString()}</div>}
      </div>
      <button
        className="ml-2 p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition"
        title="Remove from cart"
        onClick={onRemove}
      >
        <Trash2 className="w-4 h-4" />
      </button>
      <button
        className="ml-2 flex items-center gap-1 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow hover:from-emerald-600 hover:to-emerald-500 transition"
        onClick={onEnroll}
      >
        <GraduationCap className="w-4 h-4" /> Enroll now
      </button>
    </div>
  );
};
