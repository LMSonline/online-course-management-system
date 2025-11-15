import CourseGrid from "@/core/components/course/CourseGrid"


export default function CoursesPage() {
    return (
        <div className="container mx-auto px-4 py-10 space-y-6">
            <h1 className="text-3xl font-bold">Tất cả khoá học</h1>
            <CourseGrid />
        </div>
    );
}