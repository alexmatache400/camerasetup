"use client";

import { Cookie } from "lucide-react";

export default function CookiesPage() {
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
          <Cookie size={32} color="white" />
        </div>
        <h1
          className="text-fluid-4xl md:text-5xl font-bold mb-4"
          style={{
            fontFamily: "var(--font-montserrat)",
            color: "var(--text-primary)",
          }}
        >
          Cookie Policy
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
            1. What Are Cookies?
          </h2>
          <p
            className="text-fluid-base leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Cookies are small text files that are placed on your device
            (computer, tablet, or mobile) when you visit a website. They are
            widely used to make websites work more efficiently, provide a better
            user experience, and provide information to website owners.
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
            2. How We Use Cookies
          </h2>
          <p
            className="text-fluid-base leading-relaxed mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            CameraSetup uses cookies for the following purposes:
          </p>
          <ul
            className="list-disc pl-6 space-y-2 text-fluid-base"
            style={{ color: "var(--text-secondary)" }}
          >
            <li>
              <strong>Essential Cookies:</strong> These cookies are necessary
              for the website to function and cannot be switched off. They
              include cookies that remember your cookie consent choice.
            </li>
            <li>
              <strong>Performance Cookies:</strong> These cookies collect
              information about how visitors use our website, such as which
              pages are visited most often and if error messages are received
              from web pages.
            </li>
            <li>
              <strong>Functionality Cookies:</strong> These cookies allow the
              website to remember choices you make (such as theme preferences)
              and provide enhanced, more personalized features.
            </li>
            <li>
              <strong>Targeting Cookies:</strong> These cookies are used to
              deliver relevant advertisements and measure the effectiveness of
              advertising campaigns.
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
            3. Types of Cookies We Use
          </h2>
          <div className="space-y-4">
            <div>
              <h3
                className="text-fluid-xl font-semibold mb-2"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  color: "var(--text-primary)",
                }}
              >
                Session Cookies
              </h3>
              <p
                className="text-fluid-base leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                These are temporary cookies that expire when you close your
                browser. They help us maintain your session as you navigate
                through different pages.
              </p>
            </div>
            <div>
              <h3
                className="text-fluid-xl font-semibold mb-2"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  color: "var(--text-primary)",
                }}
              >
                Persistent Cookies
              </h3>
              <p
                className="text-fluid-base leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                These cookies remain on your device after you close your browser
                and are used to remember your preferences and settings for
                future visits.
              </p>
            </div>
            <div>
              <h3
                className="text-fluid-xl font-semibold mb-2"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  color: "var(--text-primary)",
                }}
              >
                First-Party Cookies
              </h3>
              <p
                className="text-fluid-base leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                These are cookies set by CameraSetup directly.
              </p>
            </div>
            <div>
              <h3
                className="text-fluid-xl font-semibold mb-2"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  color: "var(--text-primary)",
                }}
              >
                Third-Party Cookies
              </h3>
              <p
                className="text-fluid-base leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                These are cookies set by external services we use, such as
                analytics providers and advertising networks. This includes
                cookies from our affiliate partners.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2
            className="text-fluid-2xl md:text-3xl font-bold mb-4"
            style={{
              fontFamily: "var(--font-montserrat)",
              color: "var(--text-primary)",
            }}
          >
            4. Affiliate Marketing Cookies
          </h2>
          <p
            className="text-fluid-base leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            As an affiliate website, we use cookies to track when visitors click
            on affiliate links and make purchases. These cookies help us receive
            credit for referrals and earn commissions. This information is used
            solely for affiliate tracking purposes and does not personally
            identify you.
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
            5. Managing Cookies
          </h2>
          <p
            className="text-fluid-base leading-relaxed mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            You can control and manage cookies in several ways:
          </p>
          <ul
            className="list-disc pl-6 space-y-2 text-fluid-base mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            <li>
              <strong>Browser Settings:</strong> Most browsers allow you to
              refuse or accept cookies through their settings. Consult your
              browser&apos;s help section for instructions.
            </li>
            <li>
              <strong>Cookie Consent Banner:</strong> When you first visit our
              site, you can choose to accept or decline cookies through our
              consent banner.
            </li>
            <li>
              <strong>Third-Party Opt-Out:</strong> You can opt out of
              third-party cookies through industry opt-out platforms.
            </li>
          </ul>
          <p
            className="text-fluid-base leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Please note that disabling cookies may affect the functionality of
            our website and your user experience.
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
            6. Updates to This Policy
          </h2>
          <p
            className="text-fluid-base leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            We may update this Cookie Policy from time to time to reflect
            changes in technology, legislation, or our business operations. We
            encourage you to review this page periodically for the latest
            information.
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
            7. Contact Us
          </h2>
          <p
            className="text-fluid-base leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            If you have any questions about our use of cookies, please contact
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
