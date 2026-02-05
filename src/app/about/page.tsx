"use client";

import { useState, useEffect } from "react";
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

export default function Page() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["mission", "what-we-do", "features", "editorial-integrity", "transparency"];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initialize on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative">
      {/* On This Page - Desktop Sidebar */}
      <aside className="hidden xl:block fixed left-8 top-1/4 w-56">
        <div
          className="glass rounded-xl p-4"
          style={{
            background:
              "color-mix(in srgb, var(--surface) 90%, transparent)",
            backdropFilter: "blur(12px)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <h3
            className="text-sm font-semibold mb-4"
            style={{
              fontFamily: "var(--font-montserrat)",
              color: "var(--text-primary)",
            }}
          >
            On this page
          </h3>
          <nav className="space-y-2">
            <button
              onClick={() => scrollToSection("mission")}
              className="w-full text-left text-sm py-1.5 px-2 rounded transition-all duration-200"
              style={{
                color:
                  activeSection === "mission"
                    ? "var(--accent)"
                    : "var(--text-secondary)",
                background:
                  activeSection === "mission"
                    ? "var(--hover-overlay)"
                    : "transparent",
                fontWeight: activeSection === "mission" ? 600 : 400,
              }}
            >
              Our Mission
            </button>
            <button
              onClick={() => scrollToSection("what-we-do")}
              className="w-full text-left text-sm py-1.5 px-2 rounded transition-all duration-200"
              style={{
                color:
                  activeSection === "what-we-do"
                    ? "var(--accent)"
                    : "var(--text-secondary)",
                background:
                  activeSection === "what-we-do"
                    ? "var(--hover-overlay)"
                    : "transparent",
                fontWeight: activeSection === "what-we-do" ? 600 : 400,
              }}
            >
              What We Do
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="w-full text-left text-sm py-1.5 px-2 rounded transition-all duration-200"
              style={{
                color:
                  activeSection === "features"
                    ? "var(--accent)"
                    : "var(--text-secondary)",
                background:
                  activeSection === "features"
                    ? "var(--hover-overlay)"
                    : "transparent",
                fontWeight: activeSection === "features" ? 600 : 400,
              }}
            >
              What Makes Us Different
            </button>
            <button
              onClick={() => scrollToSection("editorial-integrity")}
              className="w-full text-left text-sm py-1.5 px-2 rounded transition-all duration-200"
              style={{
                color:
                  activeSection === "editorial-integrity"
                    ? "var(--accent)"
                    : "var(--text-secondary)",
                background:
                  activeSection === "editorial-integrity"
                    ? "var(--hover-overlay)"
                    : "transparent",
                fontWeight: activeSection === "editorial-integrity" ? 600 : 400,
              }}
            >
              Editorial Integrity
            </button>
            <button
              onClick={() => scrollToSection("transparency")}
              className="w-full text-left text-sm py-1.5 px-2 rounded transition-all duration-200"
              style={{
                color:
                  activeSection === "transparency"
                    ? "var(--accent)"
                    : "var(--text-secondary)",
                background:
                  activeSection === "transparency"
                    ? "var(--hover-overlay)"
                    : "transparent",
                fontWeight: activeSection === "transparency" ? 600 : 400,
              }}
            >
              Transparency & Trust
            </button>
          </nav>
        </div>
      </aside>

      <main className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <section className="py-16 md:py-24 text-center">
          <h1
            className="text-fluid-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            style={{
              fontFamily: "var(--font-montserrat)",
              color: "var(--text-primary)",
            }}
          >
            About{" "}
            <span className="text-gradient-accent">CameraSetup</span>
          </h1>
          <p
            className="text-fluid-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Your trusted companion in finding the perfect camera gear for every
            creative pursuit. We simplify the overwhelming world of photography
            equipment with expert recommendations tailored to your specific needs.
          </p>
        </section>

        {/* Mission Section */}
        <section id="mission" className="py-12 md:py-16 scroll-mt-24">
          <div
            className="glass rounded-2xl p-8 md:p-12"
            style={{
              background:
                "color-mix(in srgb, var(--surface) 85%, transparent)",
              backdropFilter: "blur(12px)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <h2
              className="text-fluid-3xl md:text-4xl font-bold mb-6 text-center"
              style={{
                fontFamily: "var(--font-montserrat)",
                color: "var(--text-primary)",
              }}
            >
              Our Mission
            </h2>
            <div className="space-y-4 max-w-4xl mx-auto">
              <p
                className="text-fluid-base md:text-lg leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                At CameraSetup, we understand that choosing the right camera
                equipment can be overwhelming. With countless options, technical
                specifications, and varying price points, finding the perfect gear
                for your specific needs shouldn&apos;t feel like solving a puzzle.
              </p>
              <p
                className="text-fluid-base md:text-lg leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                That&apos;s why we created this platform—to be your trusted guide in
                navigating the world of photography and videography equipment. We
                carefully curate camera recommendations based on real-world use
                cases, whether you&apos;re capturing wildlife, documenting your
                travels, filming sports, or starting your photography journey.
              </p>
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section id="what-we-do" className="py-12 md:py-16 scroll-mt-24">
          <h2
            className="text-fluid-3xl md:text-4xl font-bold mb-12 text-center"
            style={{
              fontFamily: "var(--font-montserrat)",
              color: "var(--text-primary)",
            }}
          >
            What We Do
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Curated Recommendations */}
            <div
              className="surface-card rounded-xl p-6 hover-lift transition-all duration-300"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "0 2px 8px var(--shadow)",
              }}
            >
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                }}
              >
                <Search size={28} color="white" />
              </div>
              <h3
                className="text-fluid-xl font-semibold mb-3"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  color: "var(--text-primary)",
                }}
              >
                Curated Camera Recommendations
              </h3>
              <p
                className="text-fluid-base leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                We research and recommend the best cameras for every activity and
                skill level, from beginner-friendly options to professional-grade
                equipment.
              </p>
            </div>

            {/* Detailed Guides */}
            <div
              className="surface-card rounded-xl p-6 hover-lift transition-all duration-300"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "0 2px 8px var(--shadow)",
              }}
            >
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                }}
              >
                <FileText size={28} color="white" />
              </div>
              <h3
                className="text-fluid-xl font-semibold mb-3"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  color: "var(--text-primary)",
                }}
              >
                Comprehensive Setup Guides
              </h3>
              <p
                className="text-fluid-base leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Step-by-step guides tailored to specific activities like wildlife
                photography, vlogging, sports, travel, and more. Learn the optimal
                settings and accessories for each use case.
              </p>
            </div>

            {/* Budget Analysis */}
            <div
              className="surface-card rounded-xl p-6 hover-lift transition-all duration-300"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "0 2px 8px var(--shadow)",
              }}
            >
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                }}
              >
                <DollarSign size={28} color="white" />
              </div>
              <h3
                className="text-fluid-xl font-semibold mb-3"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  color: "var(--text-primary)",
                }}
              >
                Budget-Conscious Guidance
              </h3>
              <p
                className="text-fluid-base leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Find the best value cameras at every price point. We analyze
                price-to-performance ratios to help you get the most bang for your
                buck without compromising quality.
              </p>
            </div>

            {/* Product Reviews */}
            <div
              className="surface-card rounded-xl p-6 hover-lift transition-all duration-300"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "0 2px 8px var(--shadow)",
              }}
            >
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                }}
              >
                <Star size={28} color="white" />
              </div>
              <h3
                className="text-fluid-xl font-semibold mb-3"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  color: "var(--text-primary)",
                }}
              >
                Honest Reviews & Comparisons
              </h3>
              <p
                className="text-fluid-base leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Unbiased reviews based on real-world testing and user feedback.
                Side-by-side comparisons help you understand the differences between
                similar models.
              </p>
            </div>

            {/* Activity Matching */}
            <div
              className="surface-card rounded-xl p-6 hover-lift transition-all duration-300"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "0 2px 8px var(--shadow)",
              }}
            >
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                }}
              >
                <Layers size={28} color="white" />
              </div>
              <h3
                className="text-fluid-xl font-semibold mb-3"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  color: "var(--text-primary)",
                }}
              >
                Activity-Specific Matching
              </h3>
              <p
                className="text-fluid-base leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Match cameras to your specific activities and shooting scenarios.
                Whether you&apos;re capturing fast-paced action or cinematic
                landscapes, we&apos;ll guide you to the right gear.
              </p>
            </div>

            {/* Latest Updates */}
            <div
              className="surface-card rounded-xl p-6 hover-lift transition-all duration-300"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "0 2px 8px var(--shadow)",
              }}
            >
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                }}
              >
                <TrendingUp size={28} color="white" />
              </div>
              <h3
                className="text-fluid-xl font-semibold mb-3"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  color: "var(--text-primary)",
                }}
              >
                Regular Content Updates
              </h3>
              <p
                className="text-fluid-base leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Stay informed with the latest camera releases, firmware updates,
                and industry trends. We continuously refresh our content to reflect
                current market conditions.
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-12 md:py-16 scroll-mt-24">
          <h2
            className="text-fluid-3xl md:text-4xl font-bold mb-12 text-center"
            style={{
              fontFamily: "var(--font-montserrat)",
              color: "var(--text-primary)",
            }}
          >
            What Makes Us Different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Feature 1 */}
            <div
              className="surface-card rounded-xl p-6 hover-lift transition-all duration-300"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "0 2px 8px var(--shadow)",
              }}
            >
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                }}
              >
                <Target size={28} color="white" />
              </div>
              <h3
                className="text-fluid-xl font-semibold mb-3"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  color: "var(--text-primary)",
                }}
              >
                Activity-Specific Recommendations
              </h3>
              <p
                className="text-fluid-base leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                We don&apos;t just list cameras—we match them to your specific
                activities. From wildlife photography to vlogging, get
                recommendations tailored to how you&apos;ll actually use your gear.
              </p>
            </div>

            {/* Feature 2 */}
            <div
              className="surface-card rounded-xl p-6 hover-lift transition-all duration-300"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "0 2px 8px var(--shadow)",
              }}
            >
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                }}
              >
                <BookOpen size={28} color="white" />
              </div>
              <h3
                className="text-fluid-xl font-semibold mb-3"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  color: "var(--text-primary)",
                }}
              >
                Comprehensive Guides
              </h3>
              <p
                className="text-fluid-base leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Our detailed setup guides help you understand not just what to
                buy, but why. Learn about key features, optimal settings, and
                accessories that complement your camera.
              </p>
            </div>

            {/* Feature 3 */}
            <div
              className="surface-card rounded-xl p-6 hover-lift transition-all duration-300"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "0 2px 8px var(--shadow)",
              }}
            >
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                }}
              >
                <Award size={28} color="white" />
              </div>
              <h3
                className="text-fluid-xl font-semibold mb-3"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  color: "var(--text-primary)",
                }}
              >
                Budget-Friendly Options
              </h3>
              <p
                className="text-fluid-base leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Quality photography doesn&apos;t have to break the bank. We
                feature cameras across all price ranges, from beginner-friendly
                options to professional-grade equipment.
              </p>
            </div>

            {/* Feature 4 */}
            <div
              className="surface-card rounded-xl p-6 hover-lift transition-all duration-300"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "0 2px 8px var(--shadow)",
              }}
            >
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                }}
              >
                <Users size={28} color="white" />
              </div>
              <h3
                className="text-fluid-xl font-semibold mb-3"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  color: "var(--text-primary)",
                }}
              >
                Community-Driven
              </h3>
              <p
                className="text-fluid-base leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Our recommendations are based on real user experiences and expert
                insights. We listen to the photography community to ensure our
                guides stay relevant and helpful.
              </p>
            </div>

            {/* Feature 5 */}
            <div
              className="surface-card rounded-xl p-6 hover-lift transition-all duration-300"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "0 2px 8px var(--shadow)",
              }}
            >
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                }}
              >
                <TrendingUp size={28} color="white" />
              </div>
              <h3
                className="text-fluid-xl font-semibold mb-3"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  color: "var(--text-primary)",
                }}
              >
                Always Up-to-Date
              </h3>
              <p
                className="text-fluid-base leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                The camera market evolves rapidly. We continuously update our
                recommendations to include the latest releases and best value
                options available today.
              </p>
            </div>

            {/* Feature 6 */}
            <div
              className="surface-card rounded-xl p-6 hover-lift transition-all duration-300"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "0 2px 8px var(--shadow)",
              }}
            >
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                }}
              >
                <Heart size={28} color="white" />
              </div>
              <h3
                className="text-fluid-xl font-semibold mb-3"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  color: "var(--text-primary)",
                }}
              >
                Passion for Photography
              </h3>
              <p
                className="text-fluid-base leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                We&apos;re photographers ourselves. Our love for the craft drives
                us to help others capture their best moments with the right
                equipment.
              </p>
            </div>
          </div>
        </section>

        {/* Editorial Integrity Section */}
        <section id="editorial-integrity" className="py-12 md:py-16 scroll-mt-24">
          <div
            className="glass rounded-2xl p-8 md:p-12"
            style={{
              background:
                "color-mix(in srgb, var(--surface) 85%, transparent)",
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
                <h2
                  className="text-fluid-2xl md:text-3xl font-bold mb-4"
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    color: "var(--text-primary)",
                  }}
                >
                  Editorial Integrity
                </h2>
                <p
                  className="text-fluid-base md:text-lg leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Our editorial standards ensure that every recommendation,
                  review, and guide on CameraSetup meets the highest standards of
                  accuracy, honesty, and independence.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* No Paid Rankings */}
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                  }}
                >
                  <CheckCircle2 size={20} color="white" />
                </div>
                <div>
                  <h3
                    className="text-fluid-lg font-semibold mb-2"
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      color: "var(--text-primary)",
                    }}
                  >
                    No Paid Rankings
                  </h3>
                  <p
                    className="text-fluid-base leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Product rankings are never influenced by affiliate commission
                    rates. We rank cameras solely based on their merits and
                    suitability for specific use cases.
                  </p>
                </div>
              </div>

              {/* Unbiased Testing */}
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                  }}
                >
                  <Edit3 size={20} color="white" />
                </div>
                <div>
                  <h3
                    className="text-fluid-lg font-semibold mb-2"
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      color: "var(--text-primary)",
                    }}
                  >
                    Unbiased Research
                  </h3>
                  <p
                    className="text-fluid-base leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Our recommendations are based on thorough research,
                    professional reviews, user feedback, and industry expert
                    opinions—not marketing materials or brand partnerships.
                  </p>
                </div>
              </div>

              {/* Independent Editorial */}
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                  }}
                >
                  <UserCheck size={20} color="white" />
                </div>
                <div>
                  <h3
                    className="text-fluid-lg font-semibold mb-2"
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      color: "var(--text-primary)",
                    }}
                  >
                    Independent Editorial
                  </h3>
                  <p
                    className="text-fluid-base leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    We maintain complete editorial independence from camera
                    manufacturers and retailers. No brand can pay to influence our
                    content or recommendations.
                  </p>
                </div>
              </div>

              {/* Clear Disclosure */}
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                  }}
                >
                  <FileText size={20} color="white" />
                </div>
                <div>
                  <h3
                    className="text-fluid-lg font-semibold mb-2"
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      color: "var(--text-primary)",
                    }}
                  >
                    Clear Affiliate Disclosure
                  </h3>
                  <p
                    className="text-fluid-base leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    We clearly disclose our affiliate relationships and explain
                    how we generate revenue. Transparency builds trust, and trust
                    is the foundation of our relationship with you.
                  </p>
                </div>
              </div>

              {/* Expert Verification */}
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                  }}
                >
                  <Award size={20} color="white" />
                </div>
                <div>
                  <h3
                    className="text-fluid-lg font-semibold mb-2"
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      color: "var(--text-primary)",
                    }}
                  >
                    Expert Verification
                  </h3>
                  <p
                    className="text-fluid-base leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Our content is researched and verified by photography
                    enthusiasts with real-world experience across various genres
                    and skill levels.
                  </p>
                </div>
              </div>

              {/* Community Feedback */}
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                  }}
                >
                  <Users size={20} color="white" />
                </div>
                <div>
                  <h3
                    className="text-fluid-lg font-semibold mb-2"
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      color: "var(--text-primary)",
                    }}
                  >
                    Community-Driven Insights
                  </h3>
                  <p
                    className="text-fluid-base leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    We actively listen to user experiences and feedback from the
                    photography community to continuously improve our
                    recommendations and stay relevant.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Transparency Section */}
        <section id="transparency" className="py-12 md:py-16 scroll-mt-24">
          <div
            className="glass rounded-2xl p-8 md:p-12"
            style={{
              background:
                "color-mix(in srgb, var(--surface) 85%, transparent)",
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
                <h2
                  className="text-fluid-2xl md:text-3xl font-bold mb-4"
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    color: "var(--text-primary)",
                  }}
                >
                  Transparency & Trust
                </h2>
                <p
                  className="text-fluid-base md:text-lg leading-relaxed mb-4"
                  style={{ color: "var(--text-secondary)" }}
                >
                  CameraSetup is an affiliate website, which means we may earn a
                  commission when you purchase products through our links. This
                  comes at no extra cost to you and helps us keep this platform
                  free and continuously improving.
                </p>
                <p
                  className="text-fluid-base md:text-lg leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Our recommendations are never influenced by affiliate
                  partnerships. We only feature cameras and equipment we genuinely
                  believe will serve your needs well. Your trust is more important
                  to us than any commission.
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
              background:
                "color-mix(in srgb, var(--surface) 85%, transparent)",
              backdropFilter: "blur(12px)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent), var(--accent-hover))",
              }}
            >
              <Globe size={32} color="white" />
            </div>
            <h2
              className="text-fluid-3xl md:text-4xl font-bold mb-4"
              style={{
                fontFamily: "var(--font-montserrat)",
                color: "var(--text-primary)",
              }}
            >
              More Sites
            </h2>
            <p
              className="text-fluid-lg"
              style={{ color: "var(--text-secondary)" }}
            >
              Coming soon...
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 text-center">
          <h2
            className="text-fluid-3xl md:text-4xl font-bold mb-6"
            style={{
              fontFamily: "var(--font-montserrat)",
              color: "var(--text-primary)",
            }}
          >
            Ready to Find Your Perfect Camera?
          </h2>
          <p
            className="text-fluid-lg mb-8 max-w-2xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            Explore our curated recommendations and find the ideal setup for your
            photography journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/product"
              className="btn-accent px-8 py-4 rounded-lg font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2"
              style={{
                background: "var(--accent)",
                color: "white",
                fontFamily: "var(--font-montserrat)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--accent-hover)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 16px color-mix(in srgb, var(--accent) 40%, transparent)";
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
              className="px-8 py-4 rounded-lg font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2"
              style={{
                background: "var(--surface)",
                color: "var(--text-primary)",
                border: "2px solid var(--border)",
                fontFamily: "var(--font-montserrat)",
              }}
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
