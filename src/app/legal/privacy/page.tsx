"use client";

import { Shield } from "lucide-react";

export default function PrivacyPage() {
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
          <Shield size={32} color="white" />
        </div>
        <h1
          className="text-fluid-4xl md:text-5xl font-bold mb-4"
          style={{
            fontFamily: "var(--font-montserrat)",
            color: "var(--text-primary)",
          }}
        >
          Privacy Policy
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
            1. Introduction
          </h2>
          <p
            className="text-fluid-base leading-relaxed mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            Welcome to CameraSetup. We respect your privacy and are committed to
            protecting your personal data. This privacy policy will inform you
            about how we look after your personal data when you visit our
            website and tell you about your privacy rights.
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
            2. Information We Collect
          </h2>
          <p
            className="text-fluid-base leading-relaxed mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            We may collect, use, store and transfer different kinds of personal
            data about you:
          </p>
          <ul
            className="list-disc pl-6 space-y-2 text-fluid-base mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            <li>
              <strong>Technical Data:</strong> IP address, browser type and
              version, time zone setting, browser plug-in types, operating
              system and platform
            </li>
            <li>
              <strong>Usage Data:</strong> Information about how you use our
              website, products and services
            </li>
            <li>
              <strong>Marketing Data:</strong> Your preferences in receiving
              marketing from us and your communication preferences
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
            3. How We Use Your Information
          </h2>
          <p
            className="text-fluid-base leading-relaxed mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            We use your personal data for the following purposes:
          </p>
          <ul
            className="list-disc pl-6 space-y-2 text-fluid-base"
            style={{ color: "var(--text-secondary)" }}
          >
            <li>To provide and maintain our service</li>
            <li>To improve, personalize and expand our service</li>
            <li>To understand and analyze how you use our service</li>
            <li>To develop new products, services, features, and functionality</li>
            <li>
              To communicate with you for customer service and support purposes
            </li>
            <li>To send you marketing communications (with your consent)</li>
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
            4. Cookies
          </h2>
          <p
            className="text-fluid-base leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            We use cookies and similar tracking technologies to track activity
            on our service and hold certain information. You can instruct your
            browser to refuse all cookies or to indicate when a cookie is being
            sent. For more information about our use of cookies, please see our{" "}
            <a
              href="/legal/cookies"
              className="underline transition-colors duration-200"
              style={{ color: "var(--accent)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--accent-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--accent)";
              }}
            >
              Cookie Policy
            </a>
            .
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
            5. Affiliate Disclosure
          </h2>
          <p
            className="text-fluid-base leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            CameraSetup participates in affiliate marketing programs. When you
            click on affiliate links and make a purchase, we may receive a
            commission at no extra cost to you. This helps us maintain the site
            and continue providing free content. We only recommend products we
            genuinely believe in.
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
            6. Data Security
          </h2>
          <p
            className="text-fluid-base leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            We have implemented appropriate security measures to prevent your
            personal data from being accidentally lost, used, accessed,
            altered, or disclosed in an unauthorized way. However, no method of
            transmission over the Internet is 100% secure, and we cannot
            guarantee absolute security.
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
            7. Your Rights
          </h2>
          <p
            className="text-fluid-base leading-relaxed mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            Under data protection laws, you have rights including:
          </p>
          <ul
            className="list-disc pl-6 space-y-2 text-fluid-base"
            style={{ color: "var(--text-secondary)" }}
          >
            <li>Request access to your personal data</li>
            <li>Request correction of your personal data</li>
            <li>Request erasure of your personal data</li>
            <li>Object to processing of your personal data</li>
            <li>Request restriction of processing your personal data</li>
            <li>Request transfer of your personal data</li>
            <li>Right to withdraw consent</li>
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
            8. Third-Party Links
          </h2>
          <p
            className="text-fluid-base leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Our website may contain links to third-party websites. We have no
            control over and assume no responsibility for the content, privacy
            policies, or practices of any third-party sites or services.
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
            9. Changes to This Policy
          </h2>
          <p
            className="text-fluid-base leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the &quot;Last updated&quot; date.
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
            10. Contact Us
          </h2>
          <p
            className="text-fluid-base leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            If you have any questions about this Privacy Policy, please contact
            us at{" "}
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
