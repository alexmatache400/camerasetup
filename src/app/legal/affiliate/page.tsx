"use client";

import { HandCoins } from "lucide-react";

export default function AffiliatePage() {
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
          <HandCoins size={32} color="white" />
        </div>
        <h1
          className="text-fluid-4xl md:text-5xl font-bold mb-4"
          style={{
            fontFamily: "var(--font-montserrat)",
            color: "var(--text-primary)",
          }}
        >
          Affiliate Disclosure
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
            1. Affiliate Relationship
          </h2>
          <p
            className="text-fluid-base leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            CameraSetup is a participant in various affiliate marketing programs
            designed to provide a means for sites to earn advertising fees by
            advertising and linking to products and services. This means that
            when you click on certain links on our site and make a purchase, we
            may receive a commission at no extra cost to you.
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
            2. How Affiliate Links Work
          </h2>
          <p
            className="text-fluid-base leading-relaxed mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            When you click on an affiliate link and make a purchase:
          </p>
          <ul
            className="list-disc pl-6 space-y-2 text-fluid-base"
            style={{ color: "var(--text-secondary)" }}
          >
            <li>
              You will be redirected to the retailer&apos;s website (e.g.,
              Amazon, B&H Photo, Adorama)
            </li>
            <li>The price you pay remains the same - you don&apos;t pay extra</li>
            <li>
              The retailer pays us a small commission for referring you to their
              site
            </li>
            <li>
              This commission helps us maintain and improve CameraSetup at no
              cost to you
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
            3. Affiliate Partners
          </h2>
          <p
            className="text-fluid-base leading-relaxed mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            We are affiliates of the following programs:
          </p>
          <ul
            className="list-disc pl-6 space-y-2 text-fluid-base"
            style={{ color: "var(--text-secondary)" }}
          >
            <li>Amazon Associates Program</li>
            <li>B&H Photo Video Affiliate Program</li>
            <li>Adorama Affiliate Program</li>
            <li>Other camera and photography equipment retailers</li>
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
            4. Our Commitment to Integrity
          </h2>
          <p
            className="text-fluid-base leading-relaxed mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            We maintain strict editorial independence:
          </p>
          <ul
            className="list-disc pl-6 space-y-2 text-fluid-base"
            style={{ color: "var(--text-secondary)" }}
          >
            <li>
              <strong>Honest Recommendations:</strong> We only recommend
              products we genuinely believe in and would use ourselves
            </li>
            <li>
              <strong>No Paid Rankings:</strong> Our product rankings and
              recommendations are based on merit, not commission rates
            </li>
            <li>
              <strong>Transparent Reviews:</strong> Our reviews are honest,
              balanced, and based on thorough research
            </li>
            <li>
              <strong>User-First Approach:</strong> Your needs and interests
              come before our potential earnings
            </li>
            <li>
              <strong>Regular Updates:</strong> We continuously update our
              recommendations to reflect the best current options
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
            5. Your Support Matters
          </h2>
          <p
            className="text-fluid-base leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            When you make a purchase through our affiliate links, you&apos;re
            supporting CameraSetup at no additional cost to you. This allows us
            to:
          </p>
          <ul
            className="list-disc pl-6 space-y-2 text-fluid-base mt-4"
            style={{ color: "var(--text-secondary)" }}
          >
            <li>Keep the website free for all users</li>
            <li>Create comprehensive camera guides and setup tutorials</li>
            <li>Regularly update our product recommendations</li>
            <li>Test and review new camera equipment</li>
            <li>Maintain and improve the website infrastructure</li>
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
            6. No Extra Cost to You
          </h2>
          <p
            className="text-fluid-base leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            It&apos;s important to note that using our affiliate links
            doesn&apos;t increase the price you pay. The commission comes from
            the retailer&apos;s marketing budget, not from your pocket. You
            would pay the exact same price whether you use our link or go
            directly to the retailer.
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
            7. FTC Compliance
          </h2>
          <p
            className="text-fluid-base leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            This disclosure is provided in accordance with the Federal Trade
            Commission&apos;s guidelines on endorsements and testimonials. We
            aim to be fully transparent about our affiliate relationships and
            ensure our users are informed about how we generate revenue.
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
            8. Questions or Concerns
          </h2>
          <p
            className="text-fluid-base leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            If you have any questions about our affiliate relationships or how
            we generate revenue, please don&apos;t hesitate to contact us at{" "}
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
            . We&apos;re committed to transparency and happy to answer any
            questions you may have.
          </p>
        </section>
      </div>
    </main>
  );
}
