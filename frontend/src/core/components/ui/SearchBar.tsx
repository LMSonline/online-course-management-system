"use client";
import { Search } from "lucide-react";


export default function SearchBar() {
return (
<div className="relative">
<Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} />
<input
placeholder="Tìm kiếm khoá học, chủ đề, giảng viên…"
className="w-full bg-white/10 border border-white/15 focus:border-brand/60 outline-none rounded-2xl py-3 pl-10 pr-4 placeholder:text-slate-400"
/>
</div>
);
}