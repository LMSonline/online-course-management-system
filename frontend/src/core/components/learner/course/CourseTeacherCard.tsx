// src/components/learner/course/CourseTeacherCard.tsx
import { UserCircle2, GraduationCap } from "lucide-react";

export function CourseTeacherCard() {
  const inst = {
    name: "TS. Trần Thị Hương",
    title: "Giảng viên Khoa Luật · Đại học Quốc gia Hà Nội",
    about:
      "TS. Trần Thị Hương là giảng viên giàu kinh nghiệm trong lĩnh vực pháp luật, từng tham gia nhiều dự án nghiên cứu và giảng dạy tại các trường đại học lớn. Cô có phương pháp giảng dạy hiện đại, gần gũi với sinh viên và luôn cập nhật kiến thức pháp lý mới nhất.",
    avatarUrl: "", // optional
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-950 to-slate-900 p-5 md:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
      {/* subtle accent */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.08),transparent_60%)]" />

      <div className="relative">
        {/* Header */}
        <div className="mb-4 flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-sky-400" />
          <h2 className="text-base md:text-lg font-semibold text-white">
            Giảng viên phụ trách
          </h2>
        </div>

        {/* Main content */}
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {inst.avatarUrl ? (
              <img
                src={inst.avatarUrl}
                alt={inst.name}
                className="h-14 w-14 md:h-16 md:w-16 rounded-full object-cover border border-white/10"
              />
            ) : (
              <div className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                <UserCircle2 className="h-8 w-8 text-slate-300" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="min-w-0">
            <p className="text-sm md:text-base font-semibold text-white">
              {inst.name}
            </p>

            <p className="mt-0.5 text-xs md:text-sm font-medium text-sky-300">
              {inst.title}
            </p>

            <p className="mt-3 text-xs md:text-sm text-slate-300 leading-relaxed">
              {inst.about}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
