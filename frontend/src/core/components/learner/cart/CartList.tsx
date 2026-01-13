import React from "react";
import { CartCourse } from "./CartContext";
import { CartItem } from "./CartItem";

export interface CartListProps {
  courses: CartCourse[];
  selected: string[];
  onCheck: (id: string, checked: boolean) => void;
  onRemove: (id: string) => void;
  onEnroll: (id: string) => void;
}

export const CartList: React.FC<CartListProps> = ({ courses, selected, onCheck, onRemove, onEnroll }) => {
  return (
    <div className="divide-y divide-slate-800 rounded-2xl bg-white/5 shadow-lg">
      {courses.map((course) => (
        <CartItem
          key={course.id}
          course={course}
          checked={selected.includes(course.id)}
          onCheck={(checked) => onCheck(course.id, checked)}
          onRemove={() => onRemove(course.id)}
          onEnroll={() => onEnroll(course.id)}
        />
      ))}
    </div>
  );
};
