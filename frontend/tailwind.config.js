/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/**/*.{css,scss}",
  ],
  // darkMode: ["class"], // thêm để sau dùng dark theme
  theme: {
    extend: {
      colors: {
        // Giữ nguyên 3 màu cũ để code cũ không lỗi
        brand: {
          900: "#2d5a27", // xanh đậm
          600: "#3fa337", // xanh trung
          200: "#d9f2c7", // xanh nhạt
        },

        // 🎨 Thêm mới 3 màu chính theo logo hiện tại
        "brand-primary": "#65D830", // neon lime chủ đạo
        "brand-secondary": "#2B3A4A", // xanh than đậm
        "brand-accent": "#CFF6B2", // xanh nhạt sáng viền

        // Một số màu nền và chữ mở rộng
        panel: "#0B1220",
        ink: "#0F172A",
      },
      boxShadow: {
        glow: "0 0 24px rgba(134,239,74,0.35)", // hiệu ứng neon
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  darkMode: 'selector',
  plugins: [],
};
