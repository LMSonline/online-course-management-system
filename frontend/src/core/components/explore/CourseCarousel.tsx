import CourseCard from "@/core/components/course/CourseGrid";


type Item = { title: string; teacher: string; price: string; rating: number };


export default function CourseCarousel({ items }: { items: Item[] }) {
    return (
        <div className="relative">
            <div className="grid grid-flow-col auto-cols-[minmax(240px,1fr)] gap-4 overflow-x-auto no-scrollbar pr-2">
                {items.map((c, i) => (
                    <CourseCard key={i} {...c} />
                ))}
            </div>
        </div>
    );
}