"use client";

import { useState, useEffect, ReactNode } from "react";
import {
  Camera,
  Target,
  BookOpen,
  Users,
  Award,
  Heart,
  TrendingUp,
  CheckCircle2,
  Globe,
  Search,
  FileText,
  DollarSign,
  Star,
  Layers,
  ShieldCheck,
  Edit3,
  UserCheck,
} from "lucide-react";
import { useSidebarOffset } from "@/contexts/SidebarOffsetContext";

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div
      className="surface-card rounded-xl p-6 hover-lift transition-all duration-300"
    >
      <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 bg-accent-gradient">
        {icon}
      </div>
      <h3 className="text-fluid-xl font-semibold mb-3 font-montserrat text-text-primary">
        {title}
      </h3>
      <p className="text-fluid-base leading-relaxed text-text-secondary">
        {description}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const whatWeDoCards = [
  {
    icon: <Search size={28} color="white" />,
    title: "Curated Camera Recommendations",
    description:
      "We research and recommend the best cameras for every activity and skill level, from beginner-friendly options to professional-grade equipment.",
  },
  {
    icon: <FileText size={28} color="white" />,
    title: "Comprehensive Setup Guides",
    description:
      "Step-by-step guides tailored to specific activities like wildlife photography, vlogging, sports, travel, and more. Learn the optimal settings and accessories for each use case.",
  },
  {
    icon: <DollarSign size={28} color="white" />,
    title: "Budget-Conscious Guidance",
    description:
      "Find the best value cameras at every price point. We analyze price-to-performance ratios to help you get the most bang for your buck without compromising quality.",
  },
  {
    icon: <Star size={28} color="white" />,
    title: "Honest Reviews & Comparisons",
    description:
      "Unbiased reviews based on real-world testing and user feedback. Side-by-side comparisons help you understand the differences between similar models.",
  },
  {
    icon: <Layers size={28} color="white" />,
    title: "Activity-Specific Matching",
    description:
      "Match cameras to your specific activities and shooting scenarios. Whether you're capturing fast-paced action or cinematic landscapes, we'll guide you to the right gear.",
  },
  {
    icon: <TrendingUp size={28} color="white" />,
    title: "Regular Content Updates",
    description:
      "Stay informed with the latest camera releases, firmware updates, and industry trends. We continuously refresh our content to reflect current market conditions.",
  },
];

const featuresCards = [
  {
    icon: <Target size={28} color="white" />,
    title: "Activity-Specific Recommendations",
    description:
      "We don't just list cameras—we match them to your specific activities. From wildlife photography to vlogging, get recommendations tailored to how you'll actually use your gear.",
  },
  {
    icon: <BookOpen size={28} color="white" />,
    title: "Comprehensive Guides",
    description:
      "Our detailed setup guides help you understand not just what to buy, but why. Learn about key features, optimal settings, and accessories that complement your camera.",
  },
  {
    icon: <Award size={28} color="white" />,
    title: "Budget-Friendly Options",
    description:
      "Quality photography doesn't have to break the bank. We feature cameras across all price ranges, from beginner-friendly options to professional-grade equipment.",
  },
  {
    icon: <Users size={28} color="white" />,
    title: "Community-Driven",
    description:
      "Our recommendations are based on real user experiences and expert insights. We listen to the photography community to ensure our guides stay relevant and helpful.",
  },
  {
    icon: <TrendingUp size={28} color="white" />,
    title: "Always Up-to-Date",
    description:
      "The camera market evolves rapidly. We continuously update our recommendations to include the latest releases and best value options available today.",
  },
  {
    icon: <Heart size={28} color="white" />,
    title: "Passion for Photography",
    description:
      "We're photographers ourselves. Our love for the craft drives us to help others capture their best moments with the right equipment.",
  },
];

const editorialCards = [
  { icon: <CheckCircle2 size={20} color="white" />, title: "No Paid Rankings", description: "Product rankings are never influenced by affiliate commission rates. We rank cameras solely based on their merits and suitability for specific use cases." },
  { icon: <Edit3 size={20} color="white" />, title: "Unbiased Research", description: "Our recommendations are based on thorough research, professional reviews, user feedback, and industry expert opinions—not marketing materials or brand partnerships." },
  { icon: <UserCheck size={20} color="white" />, title: "Independent Editorial", description: "We maintain complete editorial independence from camera manufacturers and retailers. No brand can pay to influence our content or recommendations." },
  { icon: <FileText size={20} color="white" />, title: "Clear Affiliate Disclosure", description: "We clearly disclose our affiliate relationships and explain how we generate revenue. Transparency builds trust, and trust is the foundation of our relationship with you." },
  { icon: <Award size={20} color="white" />, title: "Expert Verification", description: "Our content is researched and verified by photography enthusiasts with real-world experience across various genres and skill levels." },
  { icon: <Users size={20} color="white" />, title: "Community-Driven Insights", description: "We actively listen to user experiences and feedback from the photography community to continuously improve our recommendations and stay relevant." },
];

const navItems = [
  { id: "mission", label: "Our Mission" },
  { id: "what-we-do", label: "What We Do" },
  { id: "features", label: "What Makes Us Different" },
  { id: "editorial-integrity", label: "Editorial Integrity" },
  { id: "transparency", label: "Transparency & Trust" },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function Page() {
  const [activeSection, setActiveSection] = useState("");
  const { setSidebarOffset } = useSidebarOffset();

  // Activate TopBar offset on xl screens to align header with content
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1280px)");
    const update = () => setSidebarOffset(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => {
      mql.removeEventListener("change", update);
      setSidebarOffset(false);
    };
  }, [setSidebarOffset]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const { id } of navItems) {
        const element = document.getElementById(id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <div className="relative xl:pl-[210px]">
      {/* On This Page - Desktop Sidebar */}
      <aside className="hidden xl:block fixed left-[25px] top-1/4 w-[170px] z-10">
        <nav className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider mb-3 font-montserrat text-text-tertiary">
            On this page
          </p>
          {navItems.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className="w-full text-left text-[13px] py-1.5 px-3 rounded-md transition-all duration-200 block"
              style={{
                color: activeSection === id ? "var(--accent)" : "var(--text-secondary)",
                background: activeSection === id ? "var(--hover-overlay)" : "transparent",
                fontWeight: activeSection === id ? 600 : 400,
                borderLeft: activeSection === id ? "2px solid var(--accent)" : "2px solid transparent",
              }}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <section className="py-16 md:py-24 text-center">
          <h1 className="text-fluid-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-montserrat text-text-primary">
            About <span className="text-gradient-accent">CameraSetup</span>
          </h1>
          <p className="text-fluid-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-text-secondary">
            Your trusted companion in finding the perfect camera gear for every creative pursuit. We simplify the overwhelming world of photography equipment with expert recommendations tailored to your specific needs.
          </p>
        </section>

        {/* Mission Section */}
        <section id="mission" className="py-12 md:py-16 scroll-mt-24">
          <div
            className="glass rounded-2xl p-8 md:p-12"
            style={{
              background: "color-mix(in srgb, var(--surface) 85%, transparent)",
              backdropFilter: "blur(12px)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <h2 className="text-fluid-3xl md:text-4xl font-bold mb-6 text-center font-montserrat text-text-primary">
              Our Mission
            </h2>
            <div className="space-y-4 max-w-4xl mx-auto">
              <p className="text-fluid-base md:text-lg leading-relaxed text-text-secondary">
                At CameraSetup, we understand that choosing the right camera equipment can be overwhelming. With countless options, technical specifications, and varying price points, finding the perfect gear for your specific needs shouldn&apos;t feel like solving a puzzle.
              </p>
              <p className="text-fluid-base md:text-lg leading-relaxed text-text-secondary">
                That&apos;s why we created this platform—to be your trusted guide in navigating the world of photography and videography equipment. We carefully curate camera recommendations based on real-world use cases, whether you&apos;re capturing wildlife, documenting your travels, filming sports, or starting your photography journey.
              </p>
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section id="what-we-do" className="py-12 md:py-16 scroll-mt-24">
          <h2 className="text-fluid-3xl md:text-4xl font-bold mb-12 text-center font-montserrat text-text-primary">
            What We Do
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {whatWeDoCards.map((card) => (
              <FeatureCard key={card.title} {...card} />
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-12 md:py-16 scroll-mt-24">
          <h2 className="text-fluid-3xl md:text-4xl font-bold mb-12 text-center font-montserrat text-text-primary">
            What Makes Us Different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuresCards.map((card) => (
              <FeatureCard key={card.title} {...card} />
            ))}
          </div>
        </section>

        {/* Editorial Integrity Section */}
        <section id="editorial-integrity" className="py-12 md:py-16 scroll-mt-24">
          <div
            className="glass rounded-2xl p-8 md:p-12"
            style={{
              background: "color-mix(in srgb, var(--surface) 85%, transparent)",
              backdropFilter: "blur(12px)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div className="flex items-start gap-4 mb-8">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--accent)" }}
              >
                <ShieldCheck size={24} color="white" />
              </div>
              <div>
                <h2 className="text-fluid-2xl md:text-3xl font-bold mb-4 font-montserrat text-text-primary">
                  Editorial Integrity
                </h2>
                <p className="text-fluid-base md:text-lg leading-relaxed text-text-secondary">
                  Our editorial standards ensure that every recommendation, review, and guide on CameraSetup meets the highest standards of accuracy, honesty, and independence.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {editorialCards.map(({ icon, title, description }) => (
                <div key={title} className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 bg-accent-gradient"
                  >
                    {icon}
                  </div>
                  <div>
                    <h3 className="text-fluid-lg font-semibold mb-2 font-montserrat text-text-primary">
                      {title}
                    </h3>
                    <p className="text-fluid-base leading-relaxed text-text-secondary">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Transparency Section */}
        <section id="transparency" className="py-12 md:py-16 scroll-mt-24">
          <div
            className="glass rounded-2xl p-8 md:p-12"
            style={{
              background: "color-mix(in srgb, var(--surface) 85%, transparent)",
              backdropFilter: "blur(12px)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div className="flex items-start gap-4 mb-6">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--accent)" }}
              >
                <CheckCircle2 size={24} color="white" />
              </div>
              <div>
                <h2 className="text-fluid-2xl md:text-3xl font-bold mb-4 font-montserrat text-text-primary">
                  Transparency & Trust
                </h2>
                <p className="text-fluid-base md:text-lg leading-relaxed mb-4 text-text-secondary">
                  CameraSetup is an affiliate website, which means we may earn a commission when you purchase products through our links. This comes at no extra cost to you and helps us keep this platform free and continuously improving.
                </p>
                <p className="text-fluid-base md:text-lg leading-relaxed text-text-secondary">
                  Our recommendations are never influenced by affiliate partnerships. We only feature cameras and equipment we genuinely believe will serve your needs well. Your trust is more important to us than any commission.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* More Sites Section */}
        <section className="py-12 md:py-16">
          <div
            className="glass rounded-2xl p-8 md:p-12 text-center"
            style={{
              background: "color-mix(in srgb, var(--surface) 85%, transparent)",
              backdropFilter: "blur(12px)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-accent-gradient">
              <Globe size={32} color="white" />
            </div>
            <h2 className="text-fluid-3xl md:text-4xl font-bold mb-4 font-montserrat text-text-primary">
              More Sites
            </h2>
            <p className="text-fluid-lg text-text-secondary">Coming soon...</p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 text-center">
          <h2 className="text-fluid-3xl md:text-4xl font-bold mb-6 font-montserrat text-text-primary">
            Ready to Find Your Perfect Camera?
          </h2>
          <p className="text-fluid-lg mb-8 max-w-2xl mx-auto text-text-secondary">
            Explore our curated recommendations and find the ideal setup for your photography journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/product"
              className="btn-accent px-8 py-4 rounded-lg font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2 font-montserrat"
              style={{ background: "var(--accent)", color: "white" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--accent-hover)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 16px color-mix(in srgb, var(--accent) 40%, transparent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--accent)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Camera size={20} />
              Browse Cameras
            </a>
            <a
              href="/activity-setup"
              className="px-8 py-4 rounded-lg font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2 font-montserrat"
              style={{ background: "var(--surface)", color: "var(--text-primary)", border: "2px solid var(--border)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.color = "var(--accent)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text-primary)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <Target size={20} />
              View Activity Setups
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
