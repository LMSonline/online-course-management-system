import Hero from "@/app/components/Hero";
import CategoryPills from "@/app/components/CategoryPills";
import CourseGrid from "@/app/components/CourseGrid";
import BannerCarousel, { type BannerSlide } from "@/app/components/BannerCarousel";
import FeaturedSkills from "@/app/components/FeaturedSkills";
import IntroWithStats from "@/app/components/IntroWithStats";

const slides: BannerSlide[] = [
  {
    title: "Master Tomorrow’s Skills",
    subtitle: "Advance your career with up-to-date courses and experienced instructors.",
    ctaPrimary: { label: "Get Started", href: "/explore" },
    ctaSecondary: { label: "Explore AI", href: "/explore?q=AI" },
    image: "/images/banners/slide1.png",
  },
  {
    title: "Learn with a Clear Path",
    subtitle: "Frontend, Backend, Data… choose your path and move forward step by step.",
    ctaPrimary: { label: "View Learning Paths", href: "/paths" },
    image: "/images/banners/slide2.png",
  },
  {
    title: "Grow Every Day",
    subtitle: "Short lessons, hands-on exercises, and completion certificates.",
    ctaPrimary: { label: "Find Courses", href: "/explore" },
    ctaSecondary: { label: "Today’s Deals", href: "/deals" },
    image: "/images/banners/slide3.png",
  },
];

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Banner */}
      <BannerCarousel slides={slides} autoPlayMs={7000} />

      {/* Category Pills */}
      <IntroWithStats />

      {/* 👇 NEW SECTION – giống Udemy homepage */}
      <FeaturedSkills />

      {/* Featured Courses */}
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
