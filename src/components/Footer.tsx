"use client";

import Link from "next/link";
import { Mail, Camera } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="border-t mt-16"
      style={{
        borderColor: "var(--border)",
        background: "var(--surface)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 mb-4 group"
            >
              <Camera
                size={24}
                style={{ color: "var(--accent)" }}
              />
              <span
                className="text-lg font-semibold"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  color: "var(--text-primary)",
                }}
              >
                CameraSetup
              </span>
            </Link>
            <p
              className="text-sm mb-4"
              style={{ color: "var(--text-secondary)" }}
            >
              Your trusted resource for expert camera recommendations and
              activity-specific setup guides. We help you find the perfect gear
              for your creative journey.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className="font-semibold mb-4"
              style={{
                fontFamily: "var(--font-montserrat)",
                color: "var(--text-primary)",
              }}
            >
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm transition-colors duration-200"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/product"
                  className="text-sm transition-colors duration-200"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }}
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/activity-setup"
                  className="text-sm transition-colors duration-200"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }}
                >
                  Activity Setup
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm transition-colors duration-200"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }}
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3
              className="font-semibold mb-4"
              style={{
                fontFamily: "var(--font-montserrat)",
                color: "var(--text-primary)",
              }}
            >
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/legal/terms"
                  className="text-sm transition-colors duration-200"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/privacy"
                  className="text-sm transition-colors duration-200"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/cookies"
                  className="text-sm transition-colors duration-200"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }}
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/affiliate"
                  className="text-sm transition-colors duration-200"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }}
                >
                  Affiliate Disclosure
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3
              className="font-semibold mb-4"
              style={{
                fontFamily: "var(--font-montserrat)",
                color: "var(--text-primary)",
              }}
            >
              Contact
            </h3>
            <div className="flex items-start gap-2">
              <Mail
                size={18}
                className="mt-0.5 flex-shrink-0"
                style={{ color: "var(--accent)" }}
              />
              <a
                href="mailto:contact@camerasetup.com"
                className="text-sm transition-colors duration-200"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-secondary)";
                }}
              >
                contact@camerasetup.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="pt-8 border-t flex justify-center items-center"
          style={{ borderColor: "var(--border)" }}
        >
          <p
            className="text-sm"
            style={{ color: "var(--text-tertiary)" }}
          >
            © {new Date().getFullYear()} CameraSetup. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
