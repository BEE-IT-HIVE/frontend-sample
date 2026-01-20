
import React from 'react';
import { BackgroundLines } from './ui/BackgroundLines';

const PrivacySection: React.FC = () => {
  return (
    <div className="pt-32 pb-20 relative min-h-screen">
      <BackgroundLines>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="mb-16 text-center md:text-left animate-in fade-in slide-in-from-top-4 duration-700">
            <span className="bg-hive-gold/10 text-hive-gold px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">Security Layer 1</span>
            <h1 className="text-5xl md:text-6xl font-bold text-hive-blue dark:text-white mb-6 font-heading">Privacy Protocol</h1>
            <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg max-w-2xl mx-auto md:mx-0 leading-relaxed">Detailed specification on how BEE-IT HIVE handles community data, digital footprints, and information sovereignty.</p>
          </div>

          <div className="bg-white dark:bg-white/5 p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-white/10 shadow-sm space-y-12 text-gray-600 dark:text-gray-300 leading-loose backdrop-blur-sm animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* 1. Data Collection */}
            <section>
              <h2 className="text-xl md:text-2xl font-bold text-hive-blue dark:text-white mb-4 flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 text-lg shrink-0"><i className="fa-solid fa-database"></i></div>
                 1. Data Collection Scope
              </h2>
              <p className="text-sm md:text-base">
                We exclusively collect data essential for event logistics, membership recruitment, and institutional storytelling. This includes but is not limited to: Student IDs, University Emails, academic progress details, and dietary requirements for catering purposes. We adhere to strict <strong>Data Minimization</strong> principles, ensuring no extraneous information is requested.
              </p>
            </section>

            {/* 2. Encryption */}
            <section>
              <h2 className="text-xl md:text-2xl font-bold text-hive-blue dark:text-white mb-4 flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 text-lg shrink-0"><i className="fa-solid fa-lock"></i></div>
                 2. Encryption & Storage
              </h2>
              <p className="text-sm md:text-base">
                All submitted entries are encrypted at rest using AES-256 standards. Our "Privacy by Design" principle ensures that your data is handled in compliance with Nepal's Privacy Act 2018. Member profiles are only visible to authenticated committee members via the RBAC (Role-Based Access Control) Admin Panel.
              </p>
            </section>

            {/* 3. Media Rights */}
            <section>
              <h2 className="text-xl md:text-2xl font-bold text-hive-blue dark:text-white mb-4 flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 text-lg shrink-0"><i className="fa-solid fa-camera-retro"></i></div>
                 3. Media Usage Rights
              </h2>
              <p className="text-sm md:text-base">
                BEE-IT HIVE documents community activities via photography and videography. By attending events, you acknowledge that your likeness may appear in our "Media Gallery", "Digital Yearbook", or official social media channels. Requests for removal can be directed to the Hive Secretariat for review on a case-by-case basis.
              </p>
            </section>

            {/* 4. Student Rights */}
            <section>
              <h2 className="text-xl md:text-2xl font-bold text-hive-blue dark:text-white mb-4 flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 text-lg shrink-0"><i className="fa-solid fa-user-shield"></i></div>
                 4. Student Rights
              </h2>
              <p className="text-sm md:text-base">
                As a student innovator, you maintain the right to access, rectify, or purge your data from our active systems. You may request a data audit at any time. We pledge transparency in how your information is utilized to further the club's mission.
              </p>
            </section>

            {/* 5. Cookies */}
            <section>
              <h2 className="text-xl md:text-2xl font-bold text-hive-blue dark:text-white mb-4 flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 text-lg shrink-0"><i className="fa-solid fa-cookie-bite"></i></div>
                 5. Cookie & Local Storage Policy
              </h2>
              <p className="text-sm md:text-base">
                We utilize browser <code>localStorage</code> to persist user preferences (theme, accessibility settings, notification read states) and ensure a seamless experience. No third-party tracking cookies or advertising beacons are deployed within this ecosystem. Your session data remains on your device.
              </p>
            </section>

            {/* 6. Network Security */}
            <section>
              <h2 className="text-xl md:text-2xl font-bold text-hive-blue dark:text-white mb-4 flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 text-lg shrink-0"><i className="fa-solid fa-shield-virus"></i></div>
                 6. Network Security Layer
              </h2>
              <p className="text-sm md:text-base">
                All traffic between the client and our servers is encrypted via TLS 1.3 (Transport Layer Security). We employ strict Content Security Policies (CSP) to mitigate Cross-Site Scripting (XSS) attacks and sanitize all user inputs to prevent SQL Injection attempts.
              </p>
            </section>

            {/* 7. Data Retention */}
            <section>
              <h2 className="text-xl md:text-2xl font-bold text-hive-blue dark:text-white mb-4 flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 text-lg shrink-0"><i className="fa-solid fa-clock-rotate-left"></i></div>
                 7. Data Retention Lifecycle
              </h2>
              <p className="text-sm md:text-base">
                Student data is retained only for the duration of their academic tenure or the specific event lifecycle. Inactive accounts and outdated event registrations are purged annually during the executive committee handover process to ensure database hygiene.
              </p>
            </section>

            {/* 8. Incident Response */}
            <section>
              <h2 className="text-xl md:text-2xl font-bold text-hive-blue dark:text-white mb-4 flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 text-lg shrink-0"><i className="fa-solid fa-triangle-exclamation"></i></div>
                 8. Incident Response Protocol
              </h2>
              <p className="text-sm md:text-base">
                In the unlikely event of a data breach, the Technical Committee will notify affected users and the University Administration within 72 hours, detailing the scope of the breach and immediate remediation steps taken to secure the infrastructure.
              </p>
            </section>

          </div>

          <div className="mt-12 text-center">
             <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Protocol Version: 2.1.0 | Last Revision: March 2025</p>
             <p className="text-gray-500 text-[10px] mt-2">Questions? Contact <a href="mailto:bee-it.hive@gandakiuniversity.edu.np" className="text-hive-gold hover:underline">bee-it.hive@gandakiuniversity.edu.np</a></p>
          </div>
        </div>
      </BackgroundLines>
    </div>
  );
};

export default PrivacySection;
