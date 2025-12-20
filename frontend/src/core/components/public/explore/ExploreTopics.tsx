const topics = [
  "JavaScript", "Python", "UI/UX", "Data Science", "AI", "React", "Cloud", "Business Strategy"
];

export default function ExploreTopics() {
  return (
    <section className="px-4 sm:px-6 md:px-10 xl:px-16 mt-12">
      <h2 className="text-[22px] md:text-[28px] font-bold mb-4">Trending Topics</h2>

      <div className="flex gap-3 flex-wrap">
        {topics.map(t => (
          <a
            key={t}
            href={`/explore?q=${encodeURIComponent(t)}`}
            className="
              px-4 py-1.5 rounded-full text-sm font-medium
              bg-white/5 border border-white/10 text-muted-foreground
              hover:text-lime-300 hover:border-lime-300/30 hover:bg-lime-300/5
              transition-all
            "
          >
            {t}
          </a>
        ))}
      </div>
    </section>
  );
}
