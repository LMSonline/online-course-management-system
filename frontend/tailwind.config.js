/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/**/*.{css,scss}",
  ],
  darkMode: ["class"], // thêm để sau dùng dark theme
  theme: {
    extend: {
      colors: {
        // Semantic colors mapped to CSS variables
        brand: {
          900: "var(--brand-900)",
          600: "var(--brand-600)",
          200: "var(--brand-200)",
          primary: "var(--brand-primary)",
          secondary: "var(--brand-secondary)",
          accent: "var(--brand-accent)",
        },
        background: {
          app: "var(--bg)",
          surface: "var(--surface)",
          surface2: "var(--surface-2)",
        },
        text: {
          body: "var(--text)",
          heading: "var(--text-heading)",
          link: "var(--text-link)",
          muted: "var(--muted)",
        },
        border: {
          default: "var(--border)",
          strong: "var(--border-strong)",
        },
        state: {
          success: "var(--success)",
          error: "var(--error)",
          warning: "var(--warning)",
          info: "var(--info)",
        },
        ring: {
          default: "var(--ring)",
        },
        shadow: {
          default: "var(--shadow)",
          glow: "var(--shadow-glow)",
        },
      },
      boxShadow: {
        glow: "var(--shadow-glow)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
