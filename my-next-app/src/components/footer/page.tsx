"use client";

import * as React from "react";
import Image from 'next/image';
import Logo from '/src/app/assets/TechHire.png';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { useLoading } from '@/context/loading-context';
import { usePathname, useRouter } from 'next/navigation';

function isSameAppRoute(pathname: string, target: string): boolean {
  const norm = (p: string) => {
    if (!p || p === "/") return "/";
    const t = p.replace(/\/$/, "");
    return t || "/";
  };
  const a = norm(pathname);
  const b = norm(target);
  if (a === b) return true;
  const isHome = (p: string) => p === "/" || p === "/Homepage";
  return isHome(a) && isHome(b);
}

const footerLinks = {
  company: [
    { title: "About Us", href: "/AboutUs" },
    { title: "Contact", href: "/Contact" },
    { title: "Careers", href: "/Careers" },
  ],
  legal: [
    { title: "Privacy Policy", href: "/PrivacyPolicy" },
    { title: "Terms of Service", href: "/TermsOfService" },
    { title: "Cookie Policy", href: "/Cookiepolicy" },
  ],
  support: [
    { title: "Help Center", href: "/HelpCenter" },
    { title: "FAQs", href: "/Faqs" },
    { title: "Documentation", href: "/Documentation" },
  ]
};

export function Footer() {
  const { setLoading } = useLoading();
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    if (isSameAppRoute(pathname, path)) return;
    setLoading(true);
    router.push(path);
  };

  return (
    <footer className="w-full bg-gradient-to-b from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 border-t border-blue-100 dark:border-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <button 
              onClick={() => handleNavigation('/')} 
              className="inline-block"
            >
              <Image 
                src={Logo} 
                alt="TechHire Logo" 
                width={120} 
                height={40}
                className="hover:opacity-80 transition-opacity" 
                priority
              />
            </button>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Empowering businesses with intelligent interview solutions and skill assessment.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <FaEnvelope className="text-blue-500 dark:text-blue-400" />
                <span>support@TechHire.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                <FaPhone className="text-green-500 dark:text-green-400" />
                <span>+44 20 7946 0958</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <FaMapMarkerAlt className="text-blue-500 dark:text-blue-400" />
                <span>6 Pancras Square, London N1C 4AG (King's Cross) and 1-13 St Giles High St, London WC2H 8AG (Central Saint Giles)</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.title}>
                  <button
                    onClick={() => handleNavigation(link.href)}
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.title}>
                  <button
                    onClick={() => handleNavigation(link.href)}
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  >
                    {link.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.title}>
                  <button
                    onClick={() => handleNavigation(link.href)}
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-blue-100 dark:border-blue-900 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            &copy; {new Date().getFullYear()} TechHire. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}