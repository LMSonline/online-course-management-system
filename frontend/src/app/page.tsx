import Hero from "@/app/components/Hero";
import CategoryPills from "@/app/components/CategoryPills";
import CourseGrid from "@/app/components/CourseGrid";

import BannerCarousel, { type BannerSlide } from "@/app/components/BannerCarousel";

const slides: BannerSlide[] = [
  {
    title: "Làm chủ kỹ năng ngày mai",
    subtitle: "Nâng cấp sự nghiệp với các khóa học cập nhật, giảng viên giàu kinh nghiệm.",
    ctaPrimary: { label: "Bắt đầu ngay", href: "/explore" },
    ctaSecondary: { label: "Khám phá AI", href: "/explore?q=AI" },
    image: "/images/banners/slide1.png",
  },
  {
    title: "Học theo lộ trình rõ ràng",
    subtitle: "Frontend, Backend, Data… chọn con đường phù hợp và tiến lên từng bước.",
    ctaPrimary: { label: "Xem lộ trình", href: "/paths" },
    image: "/images/banners/slide2.png",
  },
  {
    title: "Nâng cấp mỗi ngày",
    subtitle: "Bài học ngắn gọn, bài tập thực hành và chứng nhận hoàn thành.",
    ctaPrimary: { label: "Tìm khóa học", href: "/explore" },
    ctaSecondary: { label: "Ưu đãi hôm nay", href: "/deals" },
    image: "/images/banners/slide3.png",
  },
];




export default function Home() {
    return (
        <div className="space-y-12">
<BannerCarousel slides={slides} autoPlayMs={7000} />            <section className="container mx-auto px-4 space-y-6">
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