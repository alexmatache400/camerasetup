'use client';

import { ReactNode } from 'react';

interface LegalSection {
  heading: string;
  content: ReactNode;
}

interface LegalPageLayoutProps {
  icon: ReactNode;
  title: string;
  sections: LegalSection[];
}

export default function LegalPageLayout({ icon, title, sections }: LegalPageLayoutProps) {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-accent-gradient">
          {icon}
        </div>
        <h1 className="text-fluid-4xl md:text-5xl font-bold mb-4 font-montserrat text-text-primary">
          {title}
        </h1>
        <p className="text-sm text-text-tertiary">
          Last updated:{' '}
          {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Content */}
      <div className="glass rounded-2xl p-8 md:p-12 space-y-8">
        {sections.map((section, i) => (
          <section key={i}>
            <h2 className="text-fluid-2xl md:text-3xl font-bold mb-4 font-montserrat text-text-primary">
              {section.heading}
            </h2>
            {section.content}
          </section>
        ))}
      </div>
    </main>
  );
}
