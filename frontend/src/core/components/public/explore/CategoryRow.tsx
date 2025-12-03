const cats = [
    { key: "web", label: "Web Development" },
    { key: "data", label: "Data Science" },
    { key: "design", label: "Design" },
    { key: "mobile", label: "Mobile" },
    { key: "ai", label: "AI / ML" },
    { key: "lang", label: "Languages" },
    { key: "marketing", label: "Marketing" },
    { key: "product", label: "Product" },
];


export default function CategoryRow() {
    return (
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {cats.map((c) => (
                <a key={c.key} className="pill whitespace-nowrap" href={`#/c/${c.key}`}>{c.label}</a>
            ))}
        </div>
    );
}