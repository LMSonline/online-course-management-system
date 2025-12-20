import Image from "next/image";
import Link from "next/link";

const categories = [
  { title: "Development", img: "/images/categories/dev.png" },
  { title: "Design", img: "/images/categories/design.png" },
  { title: "Business", img: "/images/categories/business.png" },
  { title: "AI & Data", img: "/images/categories/ai.png" },
  { title: "Marketing", img: "/images/categories/marketing.png" },
  { title: "Photography", img: "/images/categories/photo.png" },
];

export default function ExploreCategories() {
  return (
    <section className="px-4 sm:px-6 md:px-10 xl:px-16 mt-10">
      <h2 className="text-[28px] md:text-[36px] font-extrabold mb-6">
        Browse Categories
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((c) => (
          <Link
            key={c.title}
            href={`/explore?category=${c.title.toLowerCase()}`}
            className="
              group relative overflow-hidden
              rounded-2xl border border-white/10 bg-white/[0.03]
              shadow-[0_4px_20px_rgba(0,0,0,0.3)]
              hover:shadow-[0_8px_30px_rgba(0,0,0,0.45)]
              transition-all
            "
          >
            <div className="relative w-full aspect-[4/5]">
              <Image
                src={c.img}
                alt={c.title}
                fill
                className="object-cover group-hover:scale-105 transition duration-300 opacity-90"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

              <div className="absolute bottom-4 left-4">
                <h3 className="text-lg font-semibold text-white drop-shadow">
                  {c.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
