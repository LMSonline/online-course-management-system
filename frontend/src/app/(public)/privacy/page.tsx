export default function PrivacyPage() {
  return (
    <main className="min-h-[72vh] px-4 sm:px-6 md:px-8 xl:px-12 py-10 md:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 px-6 sm:px-8 md:px-10 py-8 md:py-10 shadow-[0_0_45px_rgba(132,204,22,0.22)]">
          {/* Glow background */}
          <div className="pointer-events-none absolute -top-32 -right-32 h-72 w-72 rounded-full bg-[var(--brand-600)]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[var(--brand-900)]/25 blur-3xl" />

          <div className="relative space-y-8">
            {/* Chip + Title */}
            <div>
              <span className="inline-flex items-center rounded-full border border-[var(--brand-600)]/40 bg-[var(--brand-600)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-300)]">
                Legal · Privacy Policy
              </span>
              <h1 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">
                Privacy Policy
              </h1>
              <p className="mt-3 text-[15px] md:text-base text-slate-300 max-w-2xl">
                This Privacy Policy explains how LMS collects, uses, and protects
                your personal information when you use our platform.
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-8 text-[15px] md:text-base leading-relaxed text-slate-100">
              {/* 1. Information We Collect */}
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2">
                  1. Information We Collect
                </h2>
                <p className="mb-3 text-slate-300">
                  We collect information to provide better learning experiences for all
                  users. The types of data we collect include:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-200">
                  <li>
                    <strong>Personal Information:</strong> Full name, email address,
                    profile details, account settings.
                  </li>
                  <li>
                    <strong>Learning Data:</strong> Courses you enroll in, progress,
                    quiz results, certificates, completion status.
                  </li>
                  <li>
                    <strong>Payment Data:</strong> Billing information (processed
                    securely by third-party payment providers).
                  </li>
                  <li>
                    <strong>Technical Data:</strong> IP address, browser type, device
                    info, logs, cookie identifiers.
                  </li>
                  <li>
                    <strong>Instructor Content:</strong> Videos, course descriptions,
                    assignments, uploaded files.
                  </li>
                </ul>
              </section>

              {/* 2. How We Use Your Information */}
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2">
                  2. How We Use Your Information
                </h2>
                <p className="mb-3 text-slate-300">We use your information to:</p>
                <ul className="list-disc list-inside space-y-2 text-slate-200">
                  <li>Provide and maintain the LMS learning platform.</li>
                  <li>Enable account authentication and secure access.</li>
                  <li>
                    Deliver course content, quizzes, and personalized recommendations.
                  </li>
                  <li>Issue certificates and track learning progress.</li>
                  <li>Process payments and verify transactions.</li>
                  <li>Improve user experience, UI/UX, and platform performance.</li>
                  <li>
                    Contact you about updates, promotions, and notifications (only if
                    you opt-in).
                  </li>
                </ul>
              </section>

              {/* 3. Cookies */}
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2">
                  3. Cookies & Tracking Technologies
                </h2>
                <p className="mb-3 text-slate-300">
                  We use cookies and similar technologies to enhance functionality,
                  remember your preferences, and analyze usage patterns.
                </p>
                <p className="text-slate-300">
                  You may disable cookies in your browser settings, but some platform
                  features may not function correctly.
                </p>
              </section>

              {/* 4. Data Sharing */}
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2">
                  4. Data Sharing & Third Parties
                </h2>
                <p className="mb-3 text-slate-300">
                  We may share your data with trusted partners:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-200">
                  <li>
                    <strong>Payment Processors</strong> (e.g., Stripe, PayPal) — for
                    secure payments.
                  </li>
                  <li>
                    <strong>Analytics Providers</strong> (e.g., Google Analytics) — to
                    understand usage trends.
                  </li>
                  <li>
                    <strong>Cloud Services</strong> — to store videos, images, and
                    course resources.
                  </li>
                </ul>
                <p className="mt-3 text-slate-300">
                  LMS never sells your personal information to advertisers or
                  unaffiliated third parties.
                </p>
              </section>

              {/* 5. Security */}
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2">
                  5. Data Protection & Security
                </h2>
                <p className="mb-3 text-slate-300">
                  We take strong security measures to protect your personal information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-200">
                  <li>Encrypted databases & secure connections (HTTPS/TLS).</li>
                  <li>Regular security audits and vulnerability scanning.</li>
                  <li>Strict access control for instructors and administrators.</li>
                </ul>
                <p className="mt-3 text-slate-300">
                  Despite our efforts, no system is completely secure. Please keep your
                  password confidential and avoid sharing your account.
                </p>
              </section>

              {/* 6. Your Rights */}
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2">
                  6. Your Privacy Rights
                </h2>
                <p className="mb-3 text-slate-300">
                  Depending on your region, you may have the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-200">
                  <li>Request access to your personal data.</li>
                  <li>Request correction or deletion of your data.</li>
                  <li>Opt-out of marketing emails at any time.</li>
                  <li>Download your learning history or certificates.</li>
                </ul>
              </section>

              {/* 7. Instructor responsibilities */}
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2">
                  7. Instructor Data Responsibilities
                </h2>
                <p className="mb-3 text-slate-300">
                  Instructors are responsible for ensuring their uploaded materials:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-200">
                  <li>Do not violate copyright laws.</li>
                  <li>
                    Do not include personal data of other individuals without consent.
                  </li>
                  <li>Follow LMS community and content guidelines.</li>
                </ul>
              </section>

              {/* 8. Retention */}
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2">
                  8. Data Retention
                </h2>
                <p className="text-slate-300">
                  LMS retains your data for as long as your account remains active. If
                  you delete your account, certain information may be retained for
                  legal, security, or auditing purposes.
                </p>
              </section>

              {/* 9. Changes */}
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2">
                  9. Changes to This Policy
                </h2>
                <p className="text-slate-300">
                  We may update this Privacy Policy to reflect changes in laws or
                  platform improvements. The updated version will always be available on
                  this page.
                </p>
              </section>

              {/* 10. Contact */}
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2">
                  10. Contact Us
                </h2>
                <p className="text-slate-300">
                  If you have any questions, concerns, or data requests, please contact
                  us:
                </p>
                <ul className="mt-2 space-y-1 text-slate-200">
                  <li>
                    Email: <strong>privacy@lms.com</strong>
                  </li>
                  <li>
                    Support: <strong>support@lms.com</strong>
                  </li>
                  <li>Address: 123 Learning Avenue, Ho Chi Minh City, Vietnam</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
