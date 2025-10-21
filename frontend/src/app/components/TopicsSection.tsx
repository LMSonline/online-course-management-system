"use client";

import { motion } from "framer-motion";
import TopicCard from "./TopicCard";
import {
  Code2, Database, PenTool, Smartphone, Brain, Megaphone, Boxes, Globe2,
} from "lucide-react";

const topics = [
  { title: "Web Development", Icon: Code2 },
  { title: "Data Science", Icon: Database },
  { title: "Design", Icon: PenTool },
  { title: "Mobile Development", Icon: Smartphone },
  { title: "Artificial Intelligence", Icon: Brain },
  { title: "Marketing", Icon: Megaphone },
  { title: "Product Management", Icon: Boxes },
  { title: "Languages", Icon: Globe2 },
];

export default function TopicsSection() {
  return (
    <section className="container mx-auto px-4 mt-6">
      <div className="mb-4 md:mb-6">
        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-body">
            Explore by Topics
          </h2>
        
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {topics.map(({ title, Icon }) => (
          <TopicCard
            key={title}
            title={title}
            Icon={Icon}
            href={`#/topic/${encodeURIComponent(title)}`}
            description="Hundreds of high-quality courses available."
          />
        ))}
      </motion.div>
    </section>
  );
}
