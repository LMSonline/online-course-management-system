"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

type CertItem = {
  title: string;
  subtitle: string;
  image: string;     // 120x120–200x200 works well
  href: string;
};

const items: CertItem[] = [
  {
    title: "CompTIA",
    subtitle: "Cloud, Networking, Cybersecurity",
    image: "/images/certs/comptia.png",
    href: "/certifications/comptia",
  },
  {
    title: "AWS",
    subtitle: "Cloud, AI, Coding, Networking",
    image: "/images/certs/aws.png",
    href: "/certifications/aws",
  },
  {
    title: "PMI",
    subtitle: "Project & Program Management",
    image: "/images/certs/pmi.png",
    href: "/certifications/pmi",
  },
];

export default function CertificatesSection() {
  return (
    <section className="w-full mt-6 px-4 sm:px-6 md:px-10 xl:px-16">
      <div
        className="
          rounded-3xl border border-white/10 bg-secondary/40 backdrop-blur-sm
          p-6 md:p-8 lg:p-10
        "
      >
        <div className="grid gap-8 md:grid-cols-12 items-start">
          {/* Left copy */}
          <div className="md:col-span-6 lg:col-span-5">
            <h3 className="text-2xl md:text-3xl font-extrabold leading-tight text-white">
              Get certified and get ahead in your career
            </h3>
            <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-prose">
              Prep for certifications with comprehensive courses, practice tests, and
              special offers on exam vouchers.
            </p>

            <Link
              href="/certifications"
              className="
                mt-5 inline-flex items-center gap-1.5 rounded-full border border-white/10
                bg-white/5 px-4 py-1.5 text-sm font-medium text-muted-foreground
                hover:text-lime-300 hover:border-lime-300/30 hover:bg-lime-400/5
                transition-all
              "
            >
              Explore certifications and vouchers
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Right cards */}
          <motion.ul
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.08 }}
            className="md:col-span-6 lg:col-span-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {items.map((item) => (
              <motion.li
                key={item.title}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.18 }}
                className="
                  rounded-2xl border border-white/10 bg-white/[0.06]
                  p-3 md:p-4
                "
              >
                <Link href={item.href} className="block">
                  <div className="relative rounded-xl overflow-hidden bg-black/20 aspect-[16/11]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width:768px) 50vw, 240px"
                      className="object-cover"
                    />
                  </div>

                  <div className="mt-3">
                    <h4 className="font-semibold text-white">{item.title}</h4>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {item.subtitle}
                    </p>
                  </div>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
