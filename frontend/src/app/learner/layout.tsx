import LearnerNavbar from "@/core/components/learner/navbar/LearnerNavbar";

export default function LearnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LearnerNavbar />
      <main className="min-h-[72vh]">{children}</main>
    </>
  );
}
