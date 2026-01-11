import CourseGrid from "@/core/components/course/CourseGrid"
import BannerCarousel, {
  type BannerSlide,
} from "@/core/components/public/landingpage/BannerCarousel";
import FeaturedSkills from "@/core/components/public/landingpage/FeaturedSkills";
import IntroWithStats from "@/core/components/public/landingpage/IntroWithStats";
import TopicsSection from "@/core/components/course/TopicsSection";
import ReviewsSection from "@/core/components/public/landingpage/ReviewsSection";
import CertificatesSection from "@/core/components/public/landingpage/CertificatesSection";
import SkillsTabCarouselSection from "@/core/components/public/landingpage/SkillsTabCarouselSection";
import PlansSection from "@/core/components/public/landingpage/PlansSection";

const slides: BannerSlide[] = [
  {
    title: "Master Tomorrow’s Skills",
    subtitle:
      "Advance your career with up-to-date courses and experienced instructors.",
    ctaPrimary: { label: "Get Started", href: "/explore" },
    ctaSecondary: { label: "Explore AI", href: "/explore?q=AI" },
    image: "/images/banners/slide1.png",
  },
  {
    title: "Learn with a Clear Path",
    subtitle:
      "Frontend, Backend, Data… choose your path and move forward step by step.",
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
      <BannerCarousel slides={slides} autoPlayMs={7000} />
      <IntroWithStats />
      <TopicsSection />
      <FeaturedSkills />
      <SkillsTabCarouselSection />
      <ReviewsSection />
      <CertificatesSection />
      <section className="w-full mt-6 px-4 sm:px-6 md:px-10 xl:px-16">
        <div className="flex items-center justify-between">
          <h2 className="text-[28px] md:text-[36px] font-extrabold leading-tight tracking-tight max-w-[1100px]">
            Featured Courses
          </h2>
          <a
            href="/courses"
            className="
              inline-flex items-center gap-1.5 rounded-full border border-white/10 
              bg-white/5 px-4 py-1.5 text-sm font-medium text-muted-foreground 
              hover:text-lime-300 hover:border-lime-300/30 hover:bg-lime-400/5 
              transition-all duration-200
            "
          >
            View all
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        <CourseGrid />
      </section>
      <PlansSection />
    </div>
  );
}
