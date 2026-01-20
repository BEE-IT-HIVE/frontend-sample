
import React from 'react';
import { BackgroundLines } from './ui/BackgroundLines';
import { LightRays } from './ui/LightRays';
import { BentoGrid, BentoCard } from './ui/BentoGrid';
import { GlowingEffect } from './ui/GlowingEffect';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/Accordion';

const AboutSection: React.FC = () => {
  return (
    <div className="pt-20 pb-20 relative">
      <BackgroundLines>
        <div className="max-w-7xl mx-auto px-4 pt-12">
          {/* Header with LightRays */}
          <div className="relative text-center mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <LightRays />
            <h2 className="text-hive-gold font-bold tracking-widest uppercase mb-4 text-sm relative z-10">Our Identity</h2>
            <h1 className="text-6xl font-bold text-hive-blue dark:text-white mb-8 leading-tight relative z-10 font-heading">Human-Centric Technology.</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8 max-w-3xl mx-auto relative z-10">
              BEE-IT HIVE is more than just a club; it's a student-led ecosystem at <span className="font-brand-uni">Gandaki University</span>. We believe that technology should enhance human connection, not replace it.
            </p>
          </div>

          {/* Bento Grid for Pillars */}
          <BentoGrid className="mb-24">
            <div className="relative col-span-1 md:col-span-2 row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 bg-white dark:bg-[#0b1129] border border-gray-200 dark:border-white/10 flex flex-col justify-between space-y-4">
               <GlowingEffect spread={60} />
               <div className="flex flex-row items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-hive-gold/20 flex items-center justify-center text-hive-gold">
                     <i className="fa-solid fa-bullseye text-xl"></i>
                  </div>
                  <h3 className="font-bold text-neutral-600 dark:text-neutral-200">Our Mission</h3>
               </div>
               <div className="group-hover/bento:translate-x-2 transition duration-200">
                  <div className="font-sans font-normal text-neutral-600 text-sm dark:text-neutral-300">
                    To promote technical education and collaborative learning through hands-on development, hackathons, and industry partnerships.
                  </div>
               </div>
            </div>

            <BentoCard 
               title="Vision" 
               description="A dynamic digital hub connecting BIT students to the global tech future."
               icon={<div className="h-10 w-10 rounded-full bg-hive-blue/20 flex items-center justify-center text-hive-blue dark:text-white mb-2"><i className="fa-solid fa-eye text-xl"></i></div>}
               className="md:col-span-1"
            />
            
            <BentoCard 
               title="Community" 
               description="Fostering an inclusive environment where every student, regardless of skill level, can contribute and grow."
               icon={<div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-2"><i className="fa-solid fa-users text-xl"></i></div>}
               className="md:col-span-1"
            />

            <div className="relative col-span-1 md:col-span-2 row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 bg-white dark:bg-[#0b1129] border border-gray-200 dark:border-white/10 flex flex-col justify-between space-y-4">
               <GlowingEffect spread={60} />
               <div className="flex flex-row items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500">
                     <i className="fa-solid fa-rocket text-xl"></i>
                  </div>
                  <h3 className="font-bold text-neutral-600 dark:text-neutral-200">Innovation First</h3>
               </div>
               <div className="group-hover/bento:translate-x-2 transition duration-200">
                  <div className="font-sans font-normal text-neutral-600 text-sm dark:text-neutral-300">
                    We push the boundaries of what student organizations can achieve, building real-world software like this very portal.
                  </div>
               </div>
            </div>
          </BentoGrid>

          <section className="bg-hive-blue rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden text-center shadow-2xl mb-24">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-hive-gold/5 blur-[120px] rounded-full"></div>
             <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold mb-8 font-heading">Empowering BIT Students since 2023</h2>
                <p className="text-xl text-gray-300 leading-relaxed">
                  We provide the tools, mentorship, and community needed for students at <span className="font-brand-uni">Gandaki University</span> to transform their ideas into reality.
                </p>
             </div>
          </section>

          {/* FAQ Section */}
          <section className="max-w-4xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            <h2 className="text-3xl font-bold text-hive-blue dark:text-white mb-8 text-center font-heading">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 px-6">
                <AccordionTrigger className="text-lg">How to become a member?</AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Membership is open to all BIT students at Gandaki University. Simply navigate to the Contact page, select 'Membership' in the inquiry form, and fill in your details. We recruit new members at the beginning of each semester.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 px-6">
                <AccordionTrigger className="text-lg">What are the benefits of joining?</AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Members gain exclusive access to workshops, mentorship programs, and cloud resources. You'll also get the opportunity to network with industry professionals and collaborate on university-level projects.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 px-6">
                <AccordionTrigger className="text-lg">What events are typically hosted?</AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  We regularly organize Hackathons (like the annual BIT Hackathon), technical workshops (Cloud, AI, Web Dev), and social networking events to foster community spirit.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>
      </BackgroundLines>
    </div>
  );
};

export default AboutSection;
