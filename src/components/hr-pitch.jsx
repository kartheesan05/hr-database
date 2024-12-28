import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function HRPitch() {
  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-6 py-16 md:px-8 md:py-32">
        {/* Pitch Section */}
        <section className="mb-16">
          <h1 className="text-5xl font-bold tracking-tight text-blue-900 md:text-6xl mb-8">
            HR Pitch
          </h1>
          <div className="text-[1.2rem] font-[450] max-w-none text-gray-800">
            <p>
              In today's rapidly evolving business landscape, the key to
              sustainable success lies in building and nurturing a workforce
              that's not just skilled, but deeply engaged and aligned with your
              organizational values. Our comprehensive human resources solutions
              are designed to transform your workplace culture from the ground
              up, creating an environment where innovation thrives and employees
              reach their full potential.
            </p>
            <p>
              We understand that every organization faces unique challenges in
              talent acquisition, retention, and development. That's why our
              approach combines cutting-edge technology with human-centric
              methodologies to deliver customized solutions that address your
              specific needs. From implementing sophisticated performance
              management systems to developing leadership programs that inspire
              and motivate, we provide the tools and expertise necessary to
              drive meaningful change.
            </p>
            <p>
              Our track record speaks for itself: organizations partnering with
              us have seen significant improvements in employee satisfaction
              scores, reduced turnover rates, and increased productivity
              metrics. We've helped companies across various industries
              streamline their HR processes, enhance their employer brand, and
              create workplace environments that attract and retain top talent.
            </p>
            <p>
              By focusing on data-driven insights and best practices in
              organizational development, we ensure that your HR initiatives
              align perfectly with your business objectives. Our team of
              experienced consultants works closely with your leadership to
              identify opportunities for improvement and implement strategies
              that deliver measurable results.
            </p>
            <p>
              The future of work is here, and it demands a fresh perspective on
              human resource management. Let us help you build a workplace
              culture that not only meets the challenges of today but is
              prepared for the opportunities of tomorrow. Together, we can
              create an organization where talent thrives, innovation
              flourishes, and success is sustainable.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-4xl font-bold text-blue-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-[1.3rem] font-semibold text-blue-900 mb-2">
                What makes your HR solutions unique?
              </h3>
              <p className="text-[1.2rem] text-gray-800">
                Our solutions combine cutting-edge technology with personalized
                approaches, ensuring that each client receives a tailored
                strategy that addresses their specific organizational needs
                while maintaining scalability and efficiency.
              </p>
            </div>

            <div>
              <h3 className="text-[1.3rem] font-semibold text-blue-900 mb-2">
                How long does implementation typically take?
              </h3>
              <p className="text-[1.2rem] text-gray-800">
                Implementation timelines vary based on the scope and complexity
                of the solution, but typically range from 4-12 weeks. We work
                closely with your team to ensure a smooth transition and minimal
                disruption to operations.
              </p>
            </div>

            <div>
              <h3 className="text-[1.3rem] font-semibold text-blue-900 mb-2">
                What kind of support do you provide post-implementation?
              </h3>
              <p className="text-[1.2rem] text-gray-800">
                We provide comprehensive post-implementation support including
                dedicated account management, regular check-ins, performance
                monitoring, and ongoing training sessions to ensure maximum
                value from your investment.
              </p>
            </div>

            <div>
              <h3 className="text-[1.3rem] font-semibold text-blue-900 mb-2">
                Can you integrate with existing HR systems?
              </h3>
              <p className="text-[1.2rem] text-gray-800">
                Yes, our solutions are designed to integrate seamlessly with
                most major HR management systems and can be customized to work
                with proprietary systems as needed.
              </p>
            </div>

            <div>
              <h3 className="text-[1.3rem] font-semibold text-blue-900 mb-2">
                What ROI can we expect from your solutions?
              </h3>
              <p className="text-[1.2rem] text-gray-800">
                While specific ROI varies by organization, our clients typically
                see improvements in employee retention rates, reduced hiring
                costs, increased productivity, and enhanced employee
                satisfaction within the first year of implementation.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
