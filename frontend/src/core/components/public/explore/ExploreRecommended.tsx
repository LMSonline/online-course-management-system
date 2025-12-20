import CourseCard from "@/core/components/course/CourseCard";

const sample = [
  {
    title: "Mastering React",
    teacher: "John Doe",
    image: "/images/courses/react.png",
    rating: 4.8,
    price: "$19.99"
  },
  {
    title: "UI/UX Design Bootcamp",
    teacher: "Sarah Lee",
    image: "/images/courses/uiux.png",
    rating: 4.7,
    price: "$14.99"
  }
];

export default function ExploreRecommended() {
  return (
    <section className="px-4 sm:px-6 md:px-10 xl:px-16 mt-16">
      <h2 className="text-[28px] md:text-[36px] font-extrabold mb-6">
        Recommended For You
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sample.map((c, i) => (
          <CourseCard key={i} {...c} />
        ))}
      </div>
    </section>
  );
}
