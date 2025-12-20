import HeroExplore from "@/core/components/public/explore/ExploreHero";
import ExploreCategoriesNew from "@/core/components/public/explore/ExploreCategories";
import TrendingTopics from "@/core/components/public/explore/ExploreTopics";
import FeaturedCollections from "@/core/components/public/explore/ExploreRecommended";
import PopularCoursesSection from "@/core/components/public/explore/ExplorePopular";

export default function ExplorePage() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      <HeroExplore />
      <TrendingTopics />
      <ExploreCategoriesNew />
      <FeaturedCollections />
      <PopularCoursesSection />
    </div>
  );
}
