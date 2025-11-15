const cats = ["Lập trình", "Thiết kế", "Marketing", "Data", "AI/ML", "Ngoại ngữ", "Âm nhạc", "Product"];
export default function CategoryPills() {
    return (
        <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
                <a key={c} className="pill" href={`#/c/${encodeURIComponent(c)}`}>{c}</a>
            ))}
        </div>
    );
}