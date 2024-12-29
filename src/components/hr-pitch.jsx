"use client";

// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
import { useEffect, useState } from "react";

export default function HRPitch() {
  const [name, setName] = useState(null);

  useEffect(() => {
    const name = localStorage.getItem("name");
    setName(name);
  }, []);

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-6 py-16 md:px-8 md:py-32">
        {/* Title Section */}
        <h1 className="text-5xl font-bold tracking-tight text-blue-900 md:text-6xl mb-8">
          HR Calling Script
        </h1>

        {/* Main Script Section */}
        <section className="mb-16">
          <div className="text-[1.2rem] font-[450] max-w-none text-gray-800 space-y-4">
            <p>Call the HR (Office Hours: 9 AM to 4 PM)</p>

            <p>
              Good Morning/Good Afternoon. Am I speaking to (Mr./Ms.) (HR Name)
              from (COMPANY NAME)?
            </p>

            <p className="font-semibold">If yes</p>

            <p>
              Hello, (Sir/Ma'am). My name is {name ? name : "(YOUR NAME)"} and I
              am calling on behalf of Mr. Muralidharan, Chief Placement Officer
              of Sri Venkateswara College of Engineering, Sriperumbudur. Could I
              please borrow 5 minutes of your time?
            </p>

            <p className="font-semibold">If yes</p>

            <div className="space-y-4">
              <p>
                Sir/ Ma'am, we are organizing an event called the MOCK
                PLACEMENTS. This event is held exclusively for the pre-final
                year students of our college and assists them in preparing for
                the actual placements that will be held for them next year. The
                event aims to help students understand the requirements of the
                industry, by offering them a one-on-one interview-like
                environment.
              </p>

              <p>
                This year it is being held both online and offline. The online
                event is being held on the 16th of March and the offline event
                is being held on the 23rd of March, both of which fall on a
                Sunday. It'll begin at 9:30 AM and will conclude by 3:00 PM.
              </p>

              <p>
                We invite HRs and company executives to interview our pre-final
                year students in a mock placement setting. We've been doing this
                for the past 16 years and over 100 HRs are usually in
                attendance. We aim to give our students the opportunity to
                experience placements first-hand and learn how to conduct
                themselves professionally.
              </p>

              <p>
                If you choose to attend our offline event, you will be provided
                with breakfast, lunch, and refreshments. Transportation will be
                arranged to and from our college. If you prefer our online
                event, it'll be held on Google Meet using break-out rooms. Based
                on your availability and preferences, timings and other
                arrangements can be tailored accordingly.
              </p>

              <p>
                We would be honored if you participated and shared your
                expertise to help our students prepare for their actual
                placements.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-4xl font-bold text-blue-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-[1.3rem] font-semibold text-blue-900">
                  {index + 1}. {faq.question}
                </h3>
                <p className="text-[1.2rem] text-gray-800">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

const faqs = [
  {
    question: "Will I be paid for the event?",
    answer:
      "As a student-organized event, we regret that we don't have the means to offer any payment. However, we greatly value your participation. Your support would be invaluable to our students (Sir/Ma'am).",
  },
  {
    question: "What benefits does an HR gain from attending mock placements?",
    answer:
      "HR professionals can leverage mock placements to assess candidate suitability, provide feedback, evaluate cultural fit, identify talent, network amongst HRs, and contribute to employee development.",
  },
  {
    question: "Can the timings be adjusted?",
    answer:
      "Yes sure (Sir/Ma'am), the timing can be tailored to meet your requirements.",
  },
  {
    question: "What arrangements do you offer?",
    answer:
      "If you choose to attend online, the event will be held in Google Meet with break-out rooms. The arrangements can be tailored according to your preferences. If you choose to attend offline, we will arrange for a cab to and from our college, as well as breakfast, lunch, and refreshments.",
  },
  {
    question: "Are these actual placements?",
    answer:
      "No (Sir/Ma'am), this is only a mock placement where we provide our students with an interview-like experience.",
  },
  {
    question: "For whom is this event being held?",
    answer:
      "This event is held for pre-final year students to prepare them for upcoming placements.",
  },
  {
    question: "What advantages do the students gain?",
    answer:
      "Mock placements increase students' confidence and interview skills, provide valuable feedback for improvement, offer industry insights, and establish a competitive advantage in the job market.",
  },
  {
    question: "What courses are offered by the college?",
    answer:
      "A total of 11 courses are offered, namely CS, IT, AI, ECE, EEE, MECH AND AUTO, BIOTECH, CIVIL, and CHEMICAL.",
  },
  {
    question: "How many students attend the event?",
    answer: "Over 900 pre-final students attend the event every year.",
  },
  {
    question: "What are the companies that are usually in attendance?",
    answer:
      "Amazon, Hyundai, HTC, Schneider, and many more are seen in attendance.",
  },
];
