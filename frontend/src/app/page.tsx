import Hero from "@/app/components/Hero";
import CategoryPills from "@/app/components/CategoryPills";
import CourseGrid from "@/app/components/CourseGrid";


export default function Home() {
    return (
        <div className="space-y-12">
            <Hero />
            <section className="container mx-auto px-4 space-y-6">
                <h2 className="text-2xl font-semibold">Khám phá danh mục</h2>
                <CategoryPills />
            </section>


            <section className="container mx-auto px-4 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Khoá học nổi bật</h2>
                    <a href="/courses" className="pill">Xem tất cả</a>
                </div>
                <CourseGrid />
            </section>
        </div>
    );
}