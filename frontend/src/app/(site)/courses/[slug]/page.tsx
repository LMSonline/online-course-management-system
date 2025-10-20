export default function CourseDetail() {
    return (
        <div className="container mx-auto px-4 py-10">
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-3">
                    <h1 className="text-3xl font-bold">Next.js từ A‑Z</h1>
                    <p className="text-slate-300">Build LMS Neon theo phong cách Udemy.</p>
                    <div className="card h-64" />
                    <div className="card h-40" />
                </div>
                <aside className="space-y-3">
                    <div className="card">
                        <div className="text-2xl font-bold text-brand mb-2">₫199,000</div>
                        <a className="btn btn-primary w-full">Thêm vào giỏ</a>
                        <a className="btn btn-outline w-full mt-2">Mua ngay</a>
                    </div>
                    <div className="card h-56" />
                </aside>
            </div>
        </div>
    );
}