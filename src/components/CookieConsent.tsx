"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      // Show banner after a short delay for better UX
      setTimeout(() => {
        setShowBanner(true);
      }, 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setShowBanner(false);
  };

  const handleClose = () => {
    // Allow closing without making a choice (will show again next visit)
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      style={{
        background: "rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div
          className="glass border border-border rounded-2xl p-4 md:p-6 shadow-2xl relative"
          style={{
            background:
              "color-mix(in srgb, var(--surface) 95%, transparent)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 8px 32px var(--shadow-strong)",
          }}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-1 rounded-lg transition-all duration-200 text-text-tertiary"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--hover-overlay)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-tertiary)";
            }}
            aria-label="Close cookie banner"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 pr-8 md:pr-0">
            {/* Icon */}
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-accent-gradient"
            >
              <Cookie size={24} color="white" />
            </div>

            {/* Text content */}
            <div className="flex-1">
              <h3
                className="text-base md:text-lg font-semibold mb-2 font-montserrat text-text-primary"
              >
                We Value Your Privacy
              </h3>
              <p
                className="text-sm leading-relaxed text-text-secondary"
              >
                We use cookies to enhance your browsing experience, analyze site
                traffic, and personalize content. By clicking "Accept All", you
                consent to our use of cookies.{" "}
                <Link
                  href="/legal/cookies"
                  className="underline transition-colors duration-200 text-accent hover:text-accent-hover"
                >
                  Learn more
                </Link>
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 w-full md:w-auto flex-shrink-0">
              <button
                onClick={handleDecline}
                className="flex-1 md:flex-initial px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 font-montserrat text-text-primary border-2 border-border"
                style={{ background: "var(--surface)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--text-tertiary)";
                  e.currentTarget.style.background = "var(--hover-overlay)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.background = "var(--surface)";
                }}
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 md:flex-initial px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 font-montserrat text-white"
                style={{ background: "var(--accent)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--accent-hover)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px color-mix(in srgb, var(--accent) 40%, transparent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--accent)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
