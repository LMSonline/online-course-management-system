import Image from "next/image";


type Props = {
    title: string;
    teacher: string;
    price: string;
    rating: number;
};


export default function CourseCard({ title, teacher, price, rating }: Props) {
    return (
        <a className="card group" href="/course/sample-course">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl2">
                <Image src="https://picsum.photos/600/338" alt="thumb" fill className="object-cover transition group-hover:scale-105" />
                <div className="absolute inset-0 ring-1 ring-white/10 group-hover:ring-brand/40 transition" />
            </div>
            <div className="mt-3 space-y-1">
                <h3 className="font-semibold leading-snug line-clamp-2">{title}</h3>
                <p className="text-sm text-slate-400">{teacher}</p>
                <div className="flex items-center justify-between pt-1">
                    <span className="text-brand font-bold">{price}</span>
                    <span className="text-xs text-slate-400">⭐ {rating.toFixed(1)}</span>
                </div>
            </div>
        </a>
    );
}