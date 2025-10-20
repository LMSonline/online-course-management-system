import ExploreSearch from "@/app/components/explore/ExploreSearch";
import CategoryRow from "@/app/components/explore/CategoryRow";
import CourseCarousel from "@/app/components/explore/CourseCarousel";


const featured = Array.from({ length: 10 }).map((_, i) => ({
    title: `Next.js & Tailwind Pro #${i + 1}`,
    teacher: "Hanna Nguyen",
    price: "₫199,000",
    rating: 4.6,
}));


const hot = Array.from({ length: 12 }).map((_, i) => ({
    title: `TypeScript Fundamentals #${i + 1}`,
    teacher: "UIT Go",
    price: "₫159,000",
    rating: 4.7,
}));


export default function ExplorePage() {
    return (
        <div className="min-h-screen">
            {/* Hero search */}
            <div className="border-b border-white/10 bg-gradient-to-b from-brand/10 to-transparent">
                <div className="container mx-auto px-4 py-8 md:py-12">
                    <ExploreSearch />
                </div>
            </div>


            {/* Category row */}
            <div className="container mx-auto px-4 py-8">
                <CategoryRow />
            </div>


            {/* Featured */}
            <section className="container mx-auto px-4 py-8 space-y-4">
                <div className="flex items-end justify-between">
                    <h2 className="text-2xl font-semibold">Khoá học nổi bật</h2>
                    <a className="pill" href="#">Xem tất cả</a>
                </div>
                <CourseCarousel items={featured} />
            </section>


            {/* Hot & trending */}
            <section className="container mx-auto px-4 py-8 space-y-4">
                <div className="flex items-end justify-between">
                    <h2 className="text-2xl font-semibold">Đang thịnh hành</h2>
                    <a className="pill" href="#">Xem tất cả</a>
                </div>
                <CourseCarousel items={hot} />
            </section>


            {/* Topics grid */}
            <section className="container mx-auto px-4 py-12 space-y-6">
                <h2 className="text-2xl font-semibold">Khám phá theo chủ đề</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {["Web Development", "Data Science", "Design", "Mobile", "AI/ML", "Marketing", "Product", "Languages"].map(t => (
                        <a key={t} className="card p-6 group" href={`#/topic/${encodeURIComponent(t)}`}>
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold">{t}</h3>
                                <span className="pill">Khám phá</span>
                            </div>
                            <p className="mt-2 text-sm text-slate-400">Hàng trăm khoá học chất lượng.</p>
                        </a>
                    ))}
                </div>
            </section>
        </div>
    );
}