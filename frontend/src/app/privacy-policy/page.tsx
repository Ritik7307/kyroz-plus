import React from 'react';

export const metadata = {
  title: 'Privacy Policy | KYROZ Plus',
  description: 'Privacy Policy for KYROZ Plus platform and services.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white/90 py-20 px-6 sm:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">KYROZ Plus Privacy Policy</h1>
        <div className="text-sm text-white/60 mb-12 space-y-1">
          <p>Effective Date: 26 June 2026</p>
          <p>Last Updated: 26 June 2026</p>
        </div>

        <div className="space-y-8 text-white/80 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-gold mb-3">1. Introduction</h2>
            <p>
              Welcome to KYROZ Plus. We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and protect information when you use our website, dashboard, mobile applications, AI services, WhatsApp integration, and related restaurant management solutions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gold mb-3">2. Information We Collect</h2>
            <p>
              We may collect your name, email address, phone number, restaurant information, business address, GST details (if provided), menu data, inventory records, recipes, sales data, order history, payment information, device information, IP address, browser details, and communications with our support team.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gold mb-3">3. How We Use Your Information</h2>
            <p>
              We use your information to create and manage your account, operate the KYROZ platform, provide AI-powered restaurant tools, process orders, send notifications, improve our services, provide customer support, maintain security, and comply with legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gold mb-3">4. WhatsApp Integration</h2>
            <p>
              KYROZ Plus may integrate with the WhatsApp Business Platform. Messages exchanged through our automated services may be processed solely to provide requested services, automate restaurant operations, and improve customer support.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gold mb-3">5. Data Sharing</h2>
            <p>
              We do not sell your personal information. We may share data with trusted service providers such as cloud hosting providers, payment gateways, Meta (for WhatsApp integration), analytics providers, and government authorities where legally required.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gold mb-3">6. Data Security</h2>
            <p>
              We implement reasonable administrative, technical, and organizational safeguards including encrypted communication, access controls, authentication, secure cloud infrastructure, backups, and monitoring to protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gold mb-3">7. Cookies</h2>
            <p>
              Our website may use cookies and similar technologies to improve functionality, remember preferences, analyze traffic, and enhance user experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gold mb-3">8. Your Rights</h2>
            <p>
              You may request access, correction, deletion, export, or restriction of your personal information, subject to applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gold mb-3">9. Data Retention</h2>
            <p>
              We retain information only as long as necessary to provide services, comply with legal obligations, resolve disputes, and enforce agreements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gold mb-3">10. Children&apos;s Privacy</h2>
            <p>
              Our services are not intended for children under 13 years of age, and we do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gold mb-3">11. Changes</h2>
            <p>
              We may update this Privacy Policy periodically. Updated versions will be published on our website with a revised effective date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gold mb-3">12. Contact Us</h2>
            <div className="bg-white/5 p-6 rounded-lg mt-4 border border-white/10">
              <p className="font-semibold text-white">KYROZ Plus</p>
              <p>Email: <a href="mailto:info@kyrozplus.com" className="text-gold hover:underline">info@kyrozplus.com</a></p>
              <p>Website: <a href="https://kyrozplus.com" className="text-gold hover:underline">https://kyrozplus.com</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
