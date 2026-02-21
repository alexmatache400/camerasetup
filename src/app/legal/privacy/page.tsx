"use client";

import { Shield } from "lucide-react";
import LegalPageLayout from "@/components/LegalPageLayout";
import { ContactEmailLink } from "@/components/ContactEmailLink";

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      icon={<Shield size={32} color="white" />}
      title="Privacy Policy"
      sections={[
        {
          heading: "1. Introduction",
          content: (
            <p className="text-fluid-base leading-relaxed text-text-secondary">
              Welcome to CameraSetup. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights.
            </p>
          ),
        },
        {
          heading: "2. Information We Collect",
          content: (
            <>
              <p className="text-fluid-base leading-relaxed mb-4 text-text-secondary">
                We may collect, use, store and transfer different kinds of personal data about you:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-fluid-base mb-4 text-text-secondary">
                <li><strong>Technical Data:</strong> IP address, browser type and version, time zone setting, browser plug-in types, operating system and platform</li>
                <li><strong>Usage Data:</strong> Information about how you use our website, products and services</li>
                <li><strong>Marketing Data:</strong> Your preferences in receiving marketing from us and your communication preferences</li>
              </ul>
            </>
          ),
        },
        {
          heading: "3. How We Use Your Information",
          content: (
            <>
              <p className="text-fluid-base leading-relaxed mb-4 text-text-secondary">
                We use your personal data for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-fluid-base text-text-secondary">
                <li>To provide and maintain our service</li>
                <li>To improve, personalize and expand our service</li>
                <li>To understand and analyze how you use our service</li>
                <li>To develop new products, services, features, and functionality</li>
                <li>To communicate with you for customer service and support purposes</li>
                <li>To send you marketing communications (with your consent)</li>
              </ul>
            </>
          ),
        },
        {
          heading: "4. Cookies",
          content: (
            <p className="text-fluid-base leading-relaxed text-text-secondary">
              We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. For more information about our use of cookies, please see our{" "}
              <a
                href="/legal/cookies"
                className="underline transition-colors duration-200 text-accent hover:text-accent-hover"
              >
                Cookie Policy
              </a>.
            </p>
          ),
        },
        {
          heading: "5. Affiliate Disclosure",
          content: (
            <p className="text-fluid-base leading-relaxed text-text-secondary">
              CameraSetup participates in affiliate marketing programs. When you click on affiliate links and make a purchase, we may receive a commission at no extra cost to you. This helps us maintain the site and continue providing free content. We only recommend products we genuinely believe in.
            </p>
          ),
        },
        {
          heading: "6. Data Security",
          content: (
            <p className="text-fluid-base leading-relaxed text-text-secondary">
              We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, accessed, altered, or disclosed in an unauthorized way. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          ),
        },
        {
          heading: "7. Your Rights",
          content: (
            <>
              <p className="text-fluid-base leading-relaxed mb-4 text-text-secondary">
                Under data protection laws, you have rights including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-fluid-base text-text-secondary">
                <li>Request access to your personal data</li>
                <li>Request correction of your personal data</li>
                <li>Request erasure of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing your personal data</li>
                <li>Request transfer of your personal data</li>
                <li>Right to withdraw consent</li>
              </ul>
            </>
          ),
        },
        {
          heading: "8. Third-Party Links",
          content: (
            <p className="text-fluid-base leading-relaxed text-text-secondary">
              Our website may contain links to third-party websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
            </p>
          ),
        },
        {
          heading: "9. Changes to This Policy",
          content: (
            <p className="text-fluid-base leading-relaxed text-text-secondary">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          ),
        },
        {
          heading: "10. Contact Us",
          content: (
            <p className="text-fluid-base leading-relaxed text-text-secondary">
              If you have any questions about this Privacy Policy, please contact us at <ContactEmailLink />
            </p>
          ),
        },
      ]}
    />
  );
}
