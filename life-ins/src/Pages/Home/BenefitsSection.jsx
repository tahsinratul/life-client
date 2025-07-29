import React from "react";
import {
  HiOutlineCalculator,
  HiOutlineUserGroup,
  HiOutlineDocumentText,
  HiOutlineLockClosed,
  HiOutlineClock,
  HiOutlineViewGrid,
} from "react-icons/hi";

const benefits = [
  {
    title: "Instant Quote Calculation",
    icon: <HiOutlineCalculator className="w-10 h-10" />,
    description: "Generate tailored insurance quotes instantly using our online estimator.",
  },
  {
    title: "Expert Agent Support",
    icon: <HiOutlineUserGroup className="w-10 h-10" />,
    description: "Get professional assistance from licensed agents when you need it.",
  },
  {
    title: "100% Online Application",
    icon: <HiOutlineDocumentText className="w-10 h-10" />,
    description: "Complete your application process fully online, hassle-free.",
  },
  {
    title: "Secure Online Payments",
    icon: <HiOutlineLockClosed className="w-10 h-10" />,
    description: "We ensure bank-level encryption to protect your transactions.",
  },
  {
    title: "Real-Time Claim Tracking",
    icon: <HiOutlineClock className="w-10 h-10" />,
    description: "Track your claim status live and stay updated in real-time.",
  },
  {
    title: "Personalized Dashboard Access",
    icon: <HiOutlineViewGrid className="w-10 h-10" />,
    description: "Easily manage your policies and documents in one secure place.",
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-12 text-[var(--color-primary)]">
          Benefits of <span className="text-[var(--color-primary)]">LifeSure</span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group  border-l-4 border-[var(--color-primary)] rounded-xl p-6 text-center shadow-sm transition-all  hover:shadow-md"
            >
              <div className="mb-4 flex justify-center text-[var(--color-primary)]  transition-colors">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[var(--color-primary)]  transition-colors">
                {benefit.title}
              </h3>
              <p className="text-gray-600  text-sm leading-relaxed transition-colors">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
