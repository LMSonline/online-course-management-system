export default function TermsPage() {
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
                Legal · Terms of Service
              </span>
              <h1 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">
                Terms of Service
              </h1>
              <p className="mt-3 text-[15px] md:text-base text-slate-300 max-w-2xl">
                These Terms of Service govern your use of the LMS online learning
                platform. By accessing LMS, you agree to these terms.
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-8 text-[15px] md:text-base leading-relaxed text-slate-100">
              {/* 1. Intro */}
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2">
                  1. Introduction
                </h2>
                <p className="text-slate-300">
                  LMS (&quot;we&quot;, &quot;our&quot;, &quot;the Platform&quot;) provides
                  an online environment where learners and instructors can access and
                  deliver educational content. By creating an account or using our
                  services, you confirm that you have read and agree to these Terms of
                  Service.
                </p>
              </section>

              {/* 2. Accounts */}
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2">
                  2. Accounts & Eligibility
                </h2>
                <p className="mb-3 text-slate-300">
                  To use core features such as enrolling in or creating courses, you must
                  create an account and:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-200">
                  <li>Provide accurate and up-to-date registration information.</li>
                  <li>Keep your password secure and confidential.</li>
                  <li>Be at least 13 years old (or the minimum legal age in your region).</li>
                </ul>
                <p className="mt-3 text-slate-300">
                  You are fully responsible for activities that occur under your account.
                  If you suspect unauthorized use, please contact us immediately.
                </p>
              </section>

              {/* 3. Roles */}
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2">
                  3. User Roles: Learner & Instructor
                </h2>
                <p className="mb-3 text-slate-300">
                  LMS supports two primary roles:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-200">
                  <li>
                    <strong>Learner:</strong> enrolls in courses, views content, takes
                    quizzes, and receives certificates where applicable.
                  </li>
                  <li>
                    <strong>Instructor:</strong> creates courses, uploads content, manages
                    learning materials, and interacts with learners.
                  </li>
                </ul>
                <p className="mt-3 text-slate-300">
                  You may change your role or hold both roles, subject to LMS policies.
                </p>
              </section>

              {/* 4. Content & IP */}
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2">
                  4. Courses, Content & Intellectual Property
                </h2>
                <p className="mb-3 text-slate-300">
                  Unless otherwise stated, all course materials—including videos,
                  documents, quizzes, assignments, and other resources—are protected by
                  intellectual property laws.
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-200">
                  <li>
                    Learners are granted a personal, non-transferable license to access
                    purchased courses.
                  </li>
                  <li>
                    You may not reproduce, resell, share, or publicly distribute course
                    content without explicit permission.
                  </li>
                  <li>
                    Instructors retain ownership of their content but grant LMS a license
                    to host, display, and deliver it to learners.
                  </li>
                </ul>
              </section>

              {/* 5. Payments & Refunds */}
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2">
                  5. Payments & Refund Policy
                </h2>
                <p className="mb-3 text-slate-300">
                  When you purchase a course, you agree to pay all applicable fees and
                  taxes. Payments are processed securely by third-party providers.
                </p>
                <p className="mb-3 text-slate-300">
                  LMS may offer a limited refund window (for example, within 7 days of
                  purchase and below a certain level of course consumption). Specific
                  refund conditions are published on the checkout or help pages and may
                  vary by region or promotion.
                </p>
                <p className="text-slate-300">
                  Fraudulent activities such as chargebacks without cause, using stolen
                  payment methods, or abusing refund policies may result in account
                  suspension or termination.
                </p>
              </section>

              {/* 6. Acceptable Use */}
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2">
                  6. Acceptable Use & Prohibited Conduct
                </h2>
                <p className="mb-3 text-slate-300">
                  You agree not to use LMS to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-200">
                  <li>Upload or share illegal, harmful, or abusive content.</li>
                  <li>Harass, threaten, or discriminate against other users.</li>
                  <li>Distribute spam, advertisements, or unsolicited messages.</li>
                  <li>
                    Reverse engineer, hack, or attempt to gain unauthorized access to
                    systems or data.
                  </li>
                  <li>
                    Upload viruses, malware, or any code intended to disrupt services.
                  </li>
                </ul>
                <p className="mt-3 text-slate-300">
                  LMS may suspend or permanently terminate accounts that violate these
                  rules.
                </p>
              </section>

              {/* 7. Reviews */}
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2">
                  7. Reviews & Feedback
                </h2>
                <p className="mb-3 text-slate-300">
                  Learners may leave ratings and reviews for courses they have taken.
                  When doing so, you agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-200">
                  <li>Provide honest and respectful feedback.</li>
                  <li>Not post defamatory, hateful, or misleading content.</li>
                  <li>Not accept payment or incentives to manipulate reviews.</li>
                </ul>
                <p className="mt-3 text-slate-300">
                  LMS may remove reviews that violate these guidelines or applicable law.
                </p>
              </section>

              {/* 8. Service Availability */}
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2">
                  8. Service Availability & Maintenance
                </h2>
                <p className="text-slate-300">
                  We strive to keep LMS available at all times, but we may temporarily
                  suspend or limit access for maintenance, upgrades, or unforeseen
                  technical issues. We are not liable for any loss resulting from such
                  interruptions, provided we act with reasonable care.
                </p>
              </section>

              {/* 9. LMS Rights */}
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2">
                  9. LMS Rights
                </h2>
                <p className="mb-3 text-slate-300">
                  LMS reserves the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-200">
                  <li>Refuse or cancel registrations at our discretion.</li>
                  <li>
                    Remove courses or content that violate policies, laws, or third-party
                    rights.
                  </li>
                  <li>
                    Modify platform features, pricing, or policies with prior notice where
                    required.
                  </li>
                </ul>
              </section>

              {/* 10. Liability */}
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2">
                  10. Limitation of Liability
                </h2>
                <p className="text-slate-300">
                  To the maximum extent permitted by law, LMS is not liable for indirect,
                  incidental, or consequential damages—such as loss of data, revenue, or
                  expected profits—arising from your use of the platform. You are
                  responsible for how you apply the knowledge acquired through courses.
                </p>
              </section>

              {/* 11. Privacy */}
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2">
                  11. Privacy & Data Protection
                </h2>
                <p className="text-slate-300">
                  Your use of LMS is also governed by our{" "}
                  <span className="text-[var(--brand-300)] font-semibold">
                    Privacy Policy
                  </span>
                  , which describes how we collect, use, and protect personal data.
                </p>
              </section>

              {/* 12. Contact & Disputes */}
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2">
                  12. Contact & Dispute Resolution
                </h2>
                <p className="mb-3 text-slate-300">
                  If you have questions or concerns regarding these Terms, please contact
                  us:
                </p>
                <ul className="mt-1 space-y-1 text-slate-200">
                  <li>
                    Email: <strong>support@lms.com</strong>
                  </li>
                  <li>Address: 123 Learning Avenue, Ho Chi Minh City, Vietnam</li>
                </ul>
                <p className="mt-3 text-slate-300">
                  These Terms are governed by the laws of Vietnam. Any disputes will be
                  resolved by the competent courts in Ho Chi Minh City, unless otherwise
                  required by law.
                </p>
              </section>

              {/* 13. Changes */}
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-2">
                  13. Changes to These Terms
                </h2>
                <p className="text-slate-300">
                  We may update these Terms from time to time to reflect changes in our
                  services or legal requirements. The latest version will always be
                  available on this page. Your continued use of LMS after changes become
                  effective constitutes acceptance of the updated Terms.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
