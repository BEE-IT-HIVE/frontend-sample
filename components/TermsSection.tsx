
import React from 'react';
import { BackgroundLines } from './ui/BackgroundLines';

const TermsSection: React.FC = () => {
  return (
    <div className="pt-32 pb-20 relative min-h-screen">
      <BackgroundLines>
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="mb-16 text-center md:text-left animate-in fade-in slide-in-from-top-4 duration-700">
          <span className="bg-hive-gold/10 text-hive-gold px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">
            Protocol v2.1
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-hive-blue dark:text-white mb-6 font-heading">
            Terms of Engagement
          </h1>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
            The definitive legal and operational framework governing your interaction with the BEE-IT HIVE digital ecosystem and physical jurisdiction.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 text-gray-600 dark:text-gray-300">
            
            {/* 1. Preamble */}
            <section className="bg-white dark:bg-white/5 p-8 md:p-12 rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-sm">
                <h2 className="text-2xl font-bold text-hive-blue dark:text-white mb-6 font-heading">1. Preamble & Acceptance</h2>
                <p className="mb-4 text-base md:text-lg leading-loose">
                    By accessing, browsing, or utilizing the BEE-IT HIVE Portal ("The System"), you ("The Innovator") acknowledge that you have read, understood, and agree to be bound by these Terms of Engagement ("The Protocol").
                </p>
                <p className="text-sm italic opacity-80 mt-4">
                    If you do not agree to these terms, you are strictly prohibited from accessing The System and must immediately terminate your session via `Alt + F4` or equivalent exit procedures.
                </p>
            </section>

            {/* 2. Definitions */}
            <section>
                <h3 className="text-xl md:text-2xl font-bold text-hive-blue dark:text-white mb-4 border-l-4 border-hive-gold pl-4">2. Definitions & Interpretation</h3>
                <ul className="space-y-3 list-disc pl-6 text-sm md:text-base leading-relaxed">
                    <li><strong>"The Hive"</strong>: Refers collectively to the BEE-IT HIVE organization, its executive committee, and digital infrastructure.</li>
                    <li><strong>"Assets"</strong>: Logos, typography, codebases, documentation, and media galleries hosted on the domain.</li>
                    <li><strong>"Force Majeure"</strong>: Unforeseeable circumstances including but not limited to server outages, fibre cuts, global pandemics, or unexpected exam schedules.</li>
                </ul>
            </section>

            {/* 3. Asset License */}
            <section className="bg-gray-50 dark:bg-[#0b1129] p-8 md:p-12 rounded-[2.5rem] border border-gray-200 dark:border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-hive-gold/10 rounded-full blur-[50px]"></div>
                <h3 className="text-xl md:text-2xl font-bold text-hive-blue dark:text-white mb-6 font-heading flex items-center gap-3">
                    <i className="fa-solid fa-copyright text-hive-gold"></i> 3. Brand Asset License & Intellectual Property
                </h3>
                <div className="space-y-6 text-sm md:text-base leading-loose">
                    <p>
                        <strong>3.1 Ownership:</strong> All brand assets, including the "Primary Mark", "Monochrome Light", and "University Lockup", are the exclusive intellectual property of <span className="font-bold">BEE-IT HIVE</span> and <span className="font-bold font-brand-uni">Gandaki University</span>.
                    </p>
                    <p>
                        <strong>3.2 Permissible Use:</strong> You are granted a limited, non-exclusive, revocable license to use these assets solely for:
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Official club business and authorized event promotion.</li>
                            <li>Journalistic coverage or academic presentations referencing the organization.</li>
                            <li>Approved partnership announcements.</li>
                        </ul>
                    </p>
                    <p>
                        <strong>3.3 Prohibited Actions:</strong> You strictly may <strong>NOT</strong>:
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-red-500/80 dark:text-red-400/80 font-medium">
                            <li>Modify, distort, or re-color the logos outside the brand guidelines.</li>
                            <li>Use assets for commercial gain or merchandise without written Secretariat consent.</li>
                            <li>Imply endorsement of personal projects or political views.</li>
                        </ul>
                    </p>
                    <p>
                        <strong>3.4 Student IP:</strong> Projects developed during Hive Hackathons remain the intellectual property of the student creators. However, The Hive retains a perpetual, royalty-free license to showcase said projects for institutional storytelling.
                    </p>
                </div>
            </section>

            {/* 4. System Integrity */}
            <section>
                <h3 className="text-xl md:text-2xl font-bold text-hive-blue dark:text-white mb-4 border-l-4 border-hive-gold pl-4">4. Digital Sovereignty & System Integrity</h3>
                <p className="mb-6 text-sm md:text-base leading-relaxed">
                    Any attempt to reverse-engineer, scrape, perform SQL injection, or bypass the Administrative Control Layer is a violation of <strong>Nepal's Electronic Transaction Act 2063</strong>. We log all interaction hashes to ensure site stability.
                </p>
                <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-100 dark:border-red-900/30 flex gap-4 items-start">
                    <i className="fa-solid fa-triangle-exclamation text-red-500 mt-1 text-xl"></i>
                    <p className="text-sm text-red-600 dark:text-red-400 font-bold leading-relaxed">
                        Warning: We deploy automated bot traps. Unauthorized scanners will be permanently blacklisted from the University network.
                    </p>
                </div>
            </section>

            {/* 5. Limitation of Liability */}
            <section>
                <h3 className="text-xl md:text-2xl font-bold text-hive-blue dark:text-white mb-4 border-l-4 border-hive-gold pl-4">5. Disclaimers & Limitation of Liability</h3>
                <p className="text-sm md:text-base leading-relaxed">
                    The System is provided on an "AS IS" and "AS AVAILABLE" basis. While we strive for 99.9% uptime, BEE-IT HIVE makes no warranties regarding the accuracy of event schedules or the availability of coffee at said events. We shall not be liable for any data loss, academic deadline misses, or caffeine-induced jitters resulting from the use of this portal.
                </p>
            </section>

            {/* 6. Membership & Conduct */}
            <section>
                <h3 className="text-xl md:text-2xl font-bold text-hive-blue dark:text-white mb-4 border-l-4 border-hive-gold pl-4">6. Membership & Conduct</h3>
                <p className="mb-4 text-sm md:text-base">
                    Membership is restricted to currently enrolled students of the BIT program at <span className="font-brand-uni">Gandaki University</span>.
                </p>
                <p className="text-sm md:text-base italic leading-relaxed bg-hive-gold/10 p-4 rounded-xl border-l-4 border-hive-gold">
                    The Hive is a space for "Radical Collaboration". Harassment, discrimination, or malicious disruption of technical sessions will lead to immediate portal de-authentication and referral to the Dean's Office for disciplinary action.
                </p>
            </section>

            {/* 7. Governing Law */}
            <section className="bg-hive-blue text-white p-8 md:p-12 rounded-[2rem] text-center">
                <h3 className="text-xl font-bold mb-4">7. Governing Law & Jurisdiction</h3>
                <p className="text-sm md:text-base opacity-90 leading-relaxed max-w-3xl mx-auto">
                    These terms are governed by the internal regulations of <strong>Gandaki University</strong> and the laws of <strong>Nepal</strong>. Any disputes arising shall be resolved amicably within the Faculty of Science & Technology before escalating to legal counsel.
                </p>
            </section>

        </div>
      </div>
      </BackgroundLines>
    </div>
  );
};

export default TermsSection;
