"use client";

import { HandCoins } from "lucide-react";
import LegalPageLayout from "@/components/LegalPageLayout";
import { ContactEmailLink } from "@/components/ContactEmailLink";

export default function AffiliatePage() {
  return (
    <LegalPageLayout
      icon={<HandCoins size={32} color="white" />}
      title="Affiliate Disclosure"
      sections={[
        {
          heading: "1. Affiliate Relationship",
          content: (
            <p className="text-fluid-base leading-relaxed text-text-secondary">
              CameraSetup is a participant in various affiliate marketing programs
              designed to provide a means for sites to earn advertising fees by
              advertising and linking to products and services. This means that
              when you click on certain links on our site and make a purchase, we
              may receive a commission at no extra cost to you.
            </p>
          ),
        },
        {
          heading: "2. How Affiliate Links Work",
          content: (
            <>
              <p className="text-fluid-base leading-relaxed mb-4 text-text-secondary">
                When you click on an affiliate link and make a purchase:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-fluid-base text-text-secondary">
                <li>You will be redirected to the retailer&apos;s website (e.g., Amazon, B&H Photo, Adorama)</li>
                <li>The price you pay remains the same - you don&apos;t pay extra</li>
                <li>The retailer pays us a small commission for referring you to their site</li>
                <li>This commission helps us maintain and improve CameraSetup at no cost to you</li>
              </ul>
            </>
          ),
        },
        {
          heading: "3. Affiliate Partners",
          content: (
            <>
              <p className="text-fluid-base leading-relaxed mb-4 text-text-secondary">
                We are affiliates of the following programs:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-fluid-base text-text-secondary">
                <li>Amazon Associates Program</li>
                <li>B&H Photo Video Affiliate Program</li>
                <li>Adorama Affiliate Program</li>
                <li>Other camera and photography equipment retailers</li>
              </ul>
            </>
          ),
        },
        {
          heading: "4. Our Commitment to Integrity",
          content: (
            <>
              <p className="text-fluid-base leading-relaxed mb-4 text-text-secondary">
                We maintain strict editorial independence:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-fluid-base text-text-secondary">
                <li><strong>Honest Recommendations:</strong> We only recommend products we genuinely believe in and would use ourselves</li>
                <li><strong>No Paid Rankings:</strong> Our product rankings and recommendations are based on merit, not commission rates</li>
                <li><strong>Transparent Reviews:</strong> Our reviews are honest, balanced, and based on thorough research</li>
                <li><strong>User-First Approach:</strong> Your needs and interests come before our potential earnings</li>
                <li><strong>Regular Updates:</strong> We continuously update our recommendations to reflect the best current options</li>
              </ul>
            </>
          ),
        },
        {
          heading: "5. Your Support Matters",
          content: (
            <>
              <p className="text-fluid-base leading-relaxed text-text-secondary">
                When you make a purchase through our affiliate links, you&apos;re supporting CameraSetup at no additional cost to you. This allows us to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-fluid-base mt-4 text-text-secondary">
                <li>Keep the website free for all users</li>
                <li>Create comprehensive camera guides and setup tutorials</li>
                <li>Regularly update our product recommendations</li>
                <li>Test and review new camera equipment</li>
                <li>Maintain and improve the website infrastructure</li>
              </ul>
            </>
          ),
        },
        {
          heading: "6. No Extra Cost to You",
          content: (
            <p className="text-fluid-base leading-relaxed text-text-secondary">
              It&apos;s important to note that using our affiliate links doesn&apos;t increase the price you pay. The commission comes from the retailer&apos;s marketing budget, not from your pocket. You would pay the exact same price whether you use our link or go directly to the retailer.
            </p>
          ),
        },
        {
          heading: "7. FTC Compliance",
          content: (
            <p className="text-fluid-base leading-relaxed text-text-secondary">
              This disclosure is provided in accordance with the Federal Trade Commission&apos;s guidelines on endorsements and testimonials. We aim to be fully transparent about our affiliate relationships and ensure our users are informed about how we generate revenue.
            </p>
          ),
        },
        {
          heading: "8. Questions or Concerns",
          content: (
            <p className="text-fluid-base leading-relaxed text-text-secondary">
              If you have any questions about our affiliate relationships or how we generate revenue, please don&apos;t hesitate to contact us at{" "}
              <ContactEmailLink />. We&apos;re committed to transparency and happy to answer any questions you may have.
            </p>
          ),
        },
      ]}
    />
  );
}
