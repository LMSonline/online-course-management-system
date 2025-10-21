import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Youtube, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-white/10 bg-white/[0.02] backdrop-blur-sm">
      <div className="container mx-auto px-4 py-10">
        {/* ======= Top Section ======= */}
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand + Social */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/lms_logo.png"
                alt="LMS"
                width={28}
                height={28}
                priority
              />
              <span className="font-extrabold tracking-tight text-[color:var(--brand-primary)] drop-shadow-[0_0_12px_rgba(163,230,53,.35)]">
                LMS
              </span>
            </Link>

            <p className="text-sm text-muted-foreground">
              Empowering learners to master in-demand skills with a clean,
              fast, and learner-first experience.
            </p>

            <div className="flex items-center gap-3 pt-1">
              {[Twitter, Instagram, Linkedin, Youtube, Github].map(
                (Icon, i) => (
                  <Link
                    key={i}
                    href="#"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground hover:text-lime-300 hover:border-lime-300/30 transition"
                    aria-label="social"
                  >
                    <Icon size={16} />
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Columns */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="text-white font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {["Features", "Pricing", "Integrations", "Changelog"].map((i) => (
                  <li key={i}>
                    <Link className="hover:text-white transition-colors" href="#">
                      {i}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {["Documentation", "Tutorials", "Blog", "Support"].map((i) => (
                  <li key={i}>
                    <Link className="hover:text-white transition-colors" href="#">
                      {i}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {["About", "Careers", "Contact", "Partners"].map((i) => (
                  <li key={i}>
                    <Link className="hover:text-white transition-colors" href="#">
                      {i}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 h-px bg-white/10" />

        {/* ======= Bottom ======= */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
          <p className="text-sm text-muted-foreground">
            © {year} LMS. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-5 text-sm">
            <Link href="#" className="text-muted-foreground hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-white">
              Terms of Service
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-white">
              Cookies Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
