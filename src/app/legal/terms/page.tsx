"use client";

import { Scale } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div
          className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, var(--accent), var(--accent-hover))",
          }}
        >
          <Scale size={32} color="white" />
        </div>
        <h1
          className="text-fluid-4xl md:text-5xl font-bold mb-4"
          style={{
            fontFamily: "var(--font-montserrat)",
            color: "var(--text-primary)",
          }}
        >
          Terms of Service
        </h1>
        <p
          className="text-sm"
          style={{ color: "var(--text-tertiary)" }}
        >
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Content */}
      <div
        className="glass rounded-2xl p-8 md:p-12 space-y-8"
        style={{
          background: "color-mix(in srgb, var(--surface) 85%, transparent)",
          backdropFilter: "blur(12px)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <section>
          <h2
            className="text-fluid-2xl md:text-3xl font-bold mb-4"
            style={{
              fontFamily: "var(--font-montserrat)",
              color: "var(--text-primary)",
            }}
          >
            1. Acceptance of Terms
          </h2>
          <p
            className="text-fluid-base leading-relaxed mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            By accessing and using CameraSetup (&quot;the Website&quot;), you
            accept and agree to be bound by the terms and provisions of this
            agreement. If you do not agree to these Terms of Service, please do
            not use the Website.
          </p>
        </section>

        <section>
          <h2
            className="text-fluid-2xl md:text-3xl font-bold mb-4"
            style={{
              fontFamily: "var(--font-montserrat)",
              color: "var(--text-primary)",
            }}
          >
            2. Use License
          </h2>
          <p
            className="text-fluid-base leading-relaxed mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            Permission is granted to temporarily download one copy of the
            materials on CameraSetup for personal, non-commercial transitory
            viewing only. This is the grant of a license, not a transfer of
            title, and under this license you may not:
          </p>
          <ul
            className="list-disc pl-6 space-y-2 text-fluid-base"
            style={{ color: "var(--text-secondary)" }}
          >
            <li>Modify or copy the materials</li>
            <li>
              Use the materials for any commercial purpose or for any public
              display
            </li>
            <li>
              Attempt to reverse engineer any software contained on the Website
            </li>
            <li>
              Remove any copyright or other proprietary notations from the
              materials
            </li>
            <li>
              Transfer the materials to another person or &quot;mirror&quot; the
              materials on any other server
            </li>
          </ul>
        </section>

        <section>
          <h2
            className="text-fluid-2xl md:text-3xl font-bold mb-4"
            style={{
              fontFamily: "var(--font-montserrat)",
              color: "var(--text-primary)",
            }}
          >
            3. Affiliate Disclaimer
          </h2>
          <p
            className="text-fluid-base leading-relaxed mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            CameraSetup is an affiliate website. We may earn a commission when
            you purchase products through our affiliate links at no extra cost
            to you. Our recommendations are based on genuine research and
            expertise, and affiliate partnerships do not influence our editorial
            content.
          </p>
        </section>

        <section>
          <h2
            className="text-fluid-2xl md:text-3xl font-bold mb-4"
            style={{
              fontFamily: "var(--font-montserrat)",
              color: "var(--text-primary)",
            }}
          >
            4. Disclaimer
          </h2>
          <p
            className="text-fluid-base leading-relaxed mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            The materials on CameraSetup are provided on an &apos;as is&apos;
            basis. CameraSetup makes no warranties, expressed or implied, and
            hereby disclaims and negates all other warranties including, without
            limitation, implied warranties or conditions of merchantability,
            fitness for a particular purpose, or non-infringement of
            intellectual property or other violation of rights.
          </p>
          <p
            className="text-fluid-base leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            CameraSetup does not warrant or make any representations concerning
            the accuracy, likely results, or reliability of the use of the
            materials on its website or otherwise relating to such materials or
            on any sites linked to this site.
          </p>
        </section>

        <section>
          <h2
            className="text-fluid-2xl md:text-3xl font-bold mb-4"
            style={{
              fontFamily: "var(--font-montserrat)",
              color: "var(--text-primary)",
            }}
          >
            5. Limitations
          </h2>
          <p
            className="text-fluid-base leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            In no event shall CameraSetup or its suppliers be liable for any
            damages (including, without limitation, damages for loss of data or
            profit, or due to business interruption) arising out of the use or
            inability to use the materials on CameraSetup, even if CameraSetup
            or an authorized representative has been notified orally or in
            writing of the possibility of such damage.
          </p>
        </section>

        <section>
          <h2
            className="text-fluid-2xl md:text-3xl font-bold mb-4"
            style={{
              fontFamily: "var(--font-montserrat)",
              color: "var(--text-primary)",
            }}
          >
            6. Revisions
          </h2>
          <p
            className="text-fluid-base leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            CameraSetup may revise these Terms of Service at any time without
            notice. By using this Website, you are agreeing to be bound by the
            then current version of these Terms of Service.
          </p>
        </section>

        <section>
          <h2
            className="text-fluid-2xl md:text-3xl font-bold mb-4"
            style={{
              fontFamily: "var(--font-montserrat)",
              color: "var(--text-primary)",
            }}
          >
            7. Contact Information
          </h2>
          <p
            className="text-fluid-base leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            If you have any questions about these Terms of Service, please
            contact us at{" "}
            <a
              href="mailto:contact@camerasetup.com"
              className="underline transition-colors duration-200"
              style={{ color: "var(--accent)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--accent-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--accent)";
              }}
            >
              contact@camerasetup.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
