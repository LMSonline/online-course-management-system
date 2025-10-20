import Link from "next/link";
import { Github, Twitter, Youtube } from "lucide-react";


export default function Footer() {
    return (
        <footer className="mt-16 border-t border-white/10">
            <div className="container mx-auto px-4 py-10 text-sm text-slate-400">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <div className="font-extrabold tracking-widest text-white">LMS<span className="text-[color:var(--brand-primary)]">•NEON</span></div>
                        <p className="mt-2 text-slate-400">Nơi học nhanh hơn với giao diện neon theo phong cách Udemy.</p>
                        <div className="flex gap-3 mt-3">
                            <Link className="pill" href="#"><Github size={16} /></Link>
                            <Link className="pill" href="#"><Twitter size={16} /></Link>
                            <Link className="pill" href="#"><Youtube size={16} /></Link>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-3">Danh mục</h4>
                        <ul className="space-y-2">
                            {['Web Development', 'Data Science', 'Design', 'Mobile', 'AI/ML', 'Marketing'].map(i => (
                                <li key={i}><Link className="hover:text-white" href={`#/c/${encodeURIComponent(i)}`}>{i}</Link></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-3">Về chúng tôi</h4>
                        <ul className="space-y-2">
                            {['Giới thiệu', 'Tuyển dụng', 'Blog', 'Liên hệ'].map(i => (
                                <li key={i}><Link className="hover:text-white" href="#">{i}</Link></li>
                            ))}
                        </ul>
                    </div>


                    <div>
                        <h4 className="text-white font-semibold mb-3">Hỗ trợ</h4>
                        <ul className="space-y-2">
                            {['Trung tâm trợ giúp', 'Điều khoản', 'Chính sách bảo mật', 'Báo cáo vấn đề'].map(i => (
                                <li key={i}><Link className="hover:text-white" href="#">{i}</Link></li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="mt-10 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                    <p>© {new Date().getFullYear()} LMS Neon. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link className="pill" href="#">Điều khoản</Link>
                        <Link className="pill" href="#">Chính sách</Link>
                        <Link className="pill" href="#">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}