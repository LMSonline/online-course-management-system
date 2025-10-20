import CourseCard from "./CourseCard";


const sample = Array.from({ length: 8 }).map((_, i) => ({
    title: `Khoá học mẫu #${i + 1}: Next.js + Tailwind`,
    teacher: "Nguyễn Trương Ngọc Hân",
    price: "₫199,000",
    rating: 4.6,
}));


export default function CourseGrid() {
    return (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {sample.map((c, i) => (
                <CourseCard key={i} {...c} />
            ))}
        </div>
    );
}