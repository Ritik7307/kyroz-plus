import React from 'react';

export const metadata = {
  title: 'Data Deletion Instructions | KYROZ Plus',
  description: 'Instructions on how to request deletion of your personal data from KYROZ Plus.',
};

export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-black text-white/90 py-20 px-6 sm:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">KYROZ Plus - Data Deletion Instructions</h1>
        <div className="text-sm text-white/60 mb-12 space-y-1">
          <p>Effective Date: 26 June 2026</p>
          <p>Company: KYROZ Plus</p>
        </div>

        <div className="space-y-8 text-white/80 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-gold mb-3">Purpose</h2>
            <p>
              KYROZ Plus allows users to request deletion of their personal information in accordance with applicable privacy laws and Meta Platform requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gold mb-3">How to Request Data Deletion</h2>
            <p>
              Users may request deletion of their account and associated personal data by sending an email to <a href="mailto:info@kyrozplus.com" className="text-gold hover:underline">info@kyrozplus.com</a> with the subject line <strong>&quot;Data Deletion Request&quot;</strong>. Please include your registered name, phone number and email address used with KYROZ Plus.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gold mb-3">Verification</h2>
            <p>
              To protect user privacy, KYROZ Plus may request additional information to verify the identity of the requester before processing the deletion request.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gold mb-3">Processing Time</h2>
            <p>
              Verified requests are normally processed within 30 days unless a longer period is required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gold mb-3">Data That May Be Retained</h2>
            <p>
              Certain records may be retained where required for legal, accounting, fraud prevention or regulatory compliance.
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
