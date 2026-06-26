import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | KYROZ Plus',
  description: 'Terms of Service for KYROZ Plus platform and services.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-black text-white/90 py-12 px-6 sm:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-white/50 hover:text-gold mb-8 transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">KYROZ Plus Terms of Service</h1>
        <div className="text-sm text-white/60 mb-12 space-y-1">
          <p>Effective Date: 26 June 2026</p>
          <p>Company: KYROZ Plus</p>
        </div>

        <div className="space-y-8 text-white/80 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-gold mb-3">Acceptance</h2>
            <p>
              By using KYROZ Plus you agree to these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gold mb-3">Services</h2>
            <p>
              KYROZ Plus provides restaurant management software, automation tools and related business services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gold mb-3">User Responsibilities</h2>
            <p>
              Users must provide accurate information, protect account credentials and use the platform lawfully.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gold mb-3">Payments</h2>
            <p>
              Paid subscriptions are billed according to the selected plan. Fees may change with prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gold mb-3">Intellectual Property</h2>
            <p>
              All KYROZ Plus software, branding and content remain the property of KYROZ Plus unless otherwise stated.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gold mb-3">Limitation of Liability</h2>
            <p>
              KYROZ Plus is provided on an &apos;as available&apos; basis. Liability is limited to the maximum extent permitted by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gold mb-3">Termination</h2>
            <p>
              We may suspend or terminate accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gold mb-3">Contact</h2>
            <div className="bg-white/5 p-6 rounded-lg mt-4 border border-white/10">
              <p>Email: <a href="mailto:info@kyrozplus.com" className="text-gold hover:underline">info@kyrozplus.com</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
