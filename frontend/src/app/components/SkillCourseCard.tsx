import Image from "next/image";

export type SkillCourse = {
    id?: string | number;
    title: string;
    teacher: string;
    rating: number;
    price: string;
    image: string;
    bestSeller?: boolean;
    href?: string; // optional: đường dẫn course thực (nếu có)
};

type Props = SkillCourse & {
    onClick?: () => void; // optional: handle click custom, mặc định không làm gì
};

export default function SkillCourseCard({
    title,
    teacher,
    rating,
    price,
    image,
    bestSeller,
    href,
    onClick,
}: Props) {
    // KHÔNG trỏ đến ảnh => KHÔNG có <a href={image}>
    // Nếu cần điều hướng, truyền props href (vd: /course/xyz) hoặc onClick custom
    const Wrapper: React.ElementType = href ? "a" : "div";
    const wrapperProps = href
        ? { href, role: "link", tabIndex: 0 }
        : { role: "button", tabIndex: 0 };

    return (
        <Wrapper
            {...wrapperProps}
            onClick={(e: React.MouseEvent<HTMLElement>) => {
                if (onClick) onClick();
                (e.currentTarget as HTMLElement).blur();
            }}

            onKeyDown={(e: React.KeyboardEvent) => {
                if ((e.key === "Enter" || e.key === " ") && onClick) {
                    e.preventDefault();
                    onClick();
                }
            }}
            className="
        group block rounded-xl overflow-hidden
        border border-white/10 bg-white/5
        hover:border-lime-400/40 hover:bg-lime-400/5
        transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-300/60
      "
        >
            <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    draggable={false}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
                    priority={false}
                />
            </div>

            <div className="p-3">
                {/* 2 dòng cố định */}
                <h3 className="text-sm font-semibold leading-tight line-clamp-2 min-h-[40px]">
                    {title}
                </h3>

                {/* 1 dòng cố định */}
                <p className="text-xs text-muted-foreground mt-0.5 min-h-[16px]">
                    {teacher}
                </p>

                <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-lime-300 font-bold">{price}</span>
                    <span className="text-slate-400">⭐ {rating.toFixed(1)}</span>
                </div>

                {/* Badge slot luôn chiếm chỗ để không lệch chiều cao */}
                <div className="mt-2 h-5">
                    {bestSeller ? (
                        <span className="inline-block text-[10px] font-medium bg-lime-400/20 text-lime-300 px-2 py-0.5 rounded">
                            Bestseller
                        </span>
                    ) : (
                        <span className="invisible inline-block text-[10px] px-2 py-0.5 rounded">
                            Bestseller
                        </span>
                    )}
                </div>
            </div>
        </Wrapper>
    );
}
