"use client";

import { Cookie } from "lucide-react";
import LegalPageLayout from "@/components/LegalPageLayout";
import { ContactEmailLink } from "@/components/ContactEmailLink";

export default function CookiesPage() {
  return (
    <LegalPageLayout
      icon={<Cookie size={32} color="white" />}
      title="Cookie Policy"
      sections={[
        {
          heading: "1. What Are Cookies?",
          content: (
            <p className="text-fluid-base leading-relaxed text-text-secondary">
              Cookies are small text files that are placed on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and provide information to website owners.
            </p>
          ),
        },
        {
          heading: "2. How We Use Cookies",
          content: (
            <>
              <p className="text-fluid-base leading-relaxed mb-4 text-text-secondary">
                CameraSetup uses cookies for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-fluid-base text-text-secondary">
                <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function and cannot be switched off. They include cookies that remember your cookie consent choice.</li>
                <li><strong>Performance Cookies:</strong> These cookies collect information about how visitors use our website, such as which pages are visited most often and if error messages are received from web pages.</li>
                <li><strong>Functionality Cookies:</strong> These cookies allow the website to remember choices you make (such as theme preferences) and provide enhanced, more personalized features.</li>
                <li><strong>Targeting Cookies:</strong> These cookies are used to deliver relevant advertisements and measure the effectiveness of advertising campaigns.</li>
              </ul>
            </>
          ),
        },
        {
          heading: "3. Types of Cookies We Use",
          content: (
            <div className="space-y-4">
              {[
                { title: "Session Cookies", desc: "These are temporary cookies that expire when you close your browser. They help us maintain your session as you navigate through different pages." },
                { title: "Persistent Cookies", desc: "These cookies remain on your device after you close your browser and are used to remember your preferences and settings for future visits." },
                { title: "First-Party Cookies", desc: "These are cookies set by CameraSetup directly." },
                { title: "Third-Party Cookies", desc: "These are cookies set by external services we use, such as analytics providers and advertising networks. This includes cookies from our affiliate partners." },
              ].map(({ title, desc }) => (
                <div key={title}>
                  <h3 className="text-fluid-xl font-semibold mb-2 font-montserrat text-text-primary">{title}</h3>
                  <p className="text-fluid-base leading-relaxed text-text-secondary">{desc}</p>
                </div>
              ))}
            </div>
          ),
        },
        {
          heading: "4. Affiliate Marketing Cookies",
          content: (
            <p className="text-fluid-base leading-relaxed text-text-secondary">
              As an affiliate website, we use cookies to track when visitors click on affiliate links and make purchases. These cookies help us receive credit for referrals and earn commissions. This information is used solely for affiliate tracking purposes and does not personally identify you.
            </p>
          ),
        },
        {
          heading: "5. Managing Cookies",
          content: (
            <>
              <p className="text-fluid-base leading-relaxed mb-4 text-text-secondary">
                You can control and manage cookies in several ways:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-fluid-base mb-4 text-text-secondary">
                <li><strong>Browser Settings:</strong> Most browsers allow you to refuse or accept cookies through their settings. Consult your browser&apos;s help section for instructions.</li>
                <li><strong>Cookie Consent Banner:</strong> When you first visit our site, you can choose to accept or decline cookies through our consent banner.</li>
                <li><strong>Third-Party Opt-Out:</strong> You can opt out of third-party cookies through industry opt-out platforms.</li>
              </ul>
              <p className="text-fluid-base leading-relaxed text-text-secondary">
                Please note that disabling cookies may affect the functionality of our website and your user experience.
              </p>
            </>
          ),
        },
        {
          heading: "6. Updates to This Policy",
          content: (
            <p className="text-fluid-base leading-relaxed text-text-secondary">
              We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our business operations. We encourage you to review this page periodically for the latest information.
            </p>
          ),
        },
        {
          heading: "7. Contact Us",
          content: (
            <p className="text-fluid-base leading-relaxed text-text-secondary">
              If you have any questions about our use of cookies, please contact us at <ContactEmailLink />
            </p>
          ),
        },
      ]}
    />
  );
}
