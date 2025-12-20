export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="bg-lms absolute inset-0" />

      <div className="grid-overlay absolute inset-0 opacity-40" />

      <div className="blob absolute top-24 left-20 w-[22rem] h-[22rem] rounded-full bg-[rgba(63,163,55,0.35)] float-slow" />
      <div className="blob absolute bottom-24 right-28 w-[18rem] h-[18rem] rounded-full bg-[rgba(217,242,199,0.65)] float-slower" />
    </div>
  );
}
