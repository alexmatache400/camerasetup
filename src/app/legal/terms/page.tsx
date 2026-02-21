"use client";

import { Scale } from "lucide-react";
import LegalPageLayout from "@/components/LegalPageLayout";
import { ContactEmailLink } from "@/components/ContactEmailLink";

export default function TermsPage() {
  return (
    <LegalPageLayout
      icon={<Scale size={32} color="white" />}
      title="Terms of Service"
      sections={[
        {
          heading: "1. Acceptance of Terms",
          content: (
            <p className="text-fluid-base leading-relaxed text-text-secondary">
              By accessing and using CameraSetup (&quot;the Website&quot;), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these Terms of Service, please do not use the Website.
            </p>
          ),
        },
        {
          heading: "2. Use License",
          content: (
            <>
              <p className="text-fluid-base leading-relaxed mb-4 text-text-secondary">
                Permission is granted to temporarily download one copy of the materials on CameraSetup for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-fluid-base text-text-secondary">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on the Website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or &quot;mirror&quot; the materials on any other server</li>
              </ul>
            </>
          ),
        },
        {
          heading: "3. Affiliate Disclaimer",
          content: (
            <p className="text-fluid-base leading-relaxed text-text-secondary">
              CameraSetup is an affiliate website. We may earn a commission when you purchase products through our affiliate links at no extra cost to you. Our recommendations are based on genuine research and expertise, and affiliate partnerships do not influence our editorial content.
            </p>
          ),
        },
        {
          heading: "4. Disclaimer",
          content: (
            <>
              <p className="text-fluid-base leading-relaxed mb-4 text-text-secondary">
                The materials on CameraSetup are provided on an &apos;as is&apos; basis. CameraSetup makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
              <p className="text-fluid-base leading-relaxed text-text-secondary">
                CameraSetup does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
              </p>
            </>
          ),
        },
        {
          heading: "5. Limitations",
          content: (
            <p className="text-fluid-base leading-relaxed text-text-secondary">
              In no event shall CameraSetup or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on CameraSetup, even if CameraSetup or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          ),
        },
        {
          heading: "6. Revisions",
          content: (
            <p className="text-fluid-base leading-relaxed text-text-secondary">
              CameraSetup may revise these Terms of Service at any time without notice. By using this Website, you are agreeing to be bound by the then current version of these Terms of Service.
            </p>
          ),
        },
        {
          heading: "7. Contact Information",
          content: (
            <p className="text-fluid-base leading-relaxed text-text-secondary">
              If you have any questions about these Terms of Service, please contact us at <ContactEmailLink />
            </p>
          ),
        },
      ]}
    />
  );
}
