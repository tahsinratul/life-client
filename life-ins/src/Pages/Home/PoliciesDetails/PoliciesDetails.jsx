import React from "react";
import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import UseAxios from "../../../Hooks/UseAxios";

import {
  HiOutlineUser,
  HiOutlineTag,
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineCurrencyBangladeshi,
  HiOutlineChartBar,
  HiOutlineCalculator,
  HiOutlineCurrencyDollar,
} from "react-icons/hi";

const PoliciesDetails = () => {
  const { id } = useParams();
  const axiosPublic = UseAxios();

  const { data: policy, isLoading, isError } = useQuery({
    queryKey: ["policy", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/policies/${id}`);
      return res.data;
    },
  });

  if (isLoading) return <div className="text-center py-10">Loading policy details...</div>;
  if (isError || !policy) return <div className="text-center text-red-600">Failed to load policy.</div>;

  return (
    <section className="min-h-screen  px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start  shadow-lg rounded-xl overflow-hidden">
        
        {/* Image Section */}
        <div className="w-full h-full">
          <img
            src={policy.image}
            alt={policy.title}
            className="object-cover w-full h-full max-h-[500px]"
          />
        </div>

        {/* Details Section */}
        <div className="p-8 space-y-6">
          <h2 className="text-3xl font-bold text-[var(--color-primary)]">
            {policy.title}
          </h2>

          <p className="text-gray-600">{policy.description}</p>

          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            {/* Category */}
            <div className="border-l-4 border-[var(--color-primary)] bg-white p-4 rounded-md shadow-sm flex gap-3 items-center">
              <HiOutlineTag className="w-6 h-6 text-[var(--color-primary)]" />
              <div>
                <p className="text-gray-500 font-medium">Category</p>
                <p className="text-gray-800">{policy.category}</p>
              </div>
            </div>

            {/* Eligibility */}
            <div className="border-l-4 border-[var(--color-primary)] bg-white p-4 rounded-md shadow-sm flex gap-3 items-center">
              <HiOutlineUser className="w-6 h-6 text-[var(--color-primary)]" />
              <div>
                <p className="text-gray-500 font-medium">Eligibility</p>
                <p className="text-gray-800">
                  {policy.minAge} - {policy.maxAge} years
                </p>
              </div>
            </div>

            {/* Coverage */}
            <div className="border-l-4 border-[var(--color-primary)] bg-white p-4 rounded-md shadow-sm flex gap-3 items-center">
              <HiOutlineShieldCheck className="w-6 h-6 text-[var(--color-primary)]" />
              <div>
                <p className="text-gray-500 font-medium">Coverage</p>
                <p className="text-gray-800">${policy.coverageRange}</p>
              </div>
            </div>

            {/* Duration */}
            <div className="border-l-4 border-[var(--color-primary)] bg-white p-4 rounded-md shadow-sm flex gap-3 items-center">
              <HiOutlineClock className="w-6 h-6 text-[var(--color-primary)]" />
              <div>
                <p className="text-gray-500 font-medium">Term Duration</p>
                <p className="text-gray-800">{policy.durationOptions}</p>
              </div>
            </div>

            {/* Premium */}
            <div className="border-l-4 border-[var(--color-primary)] bg-white p-4 rounded-md shadow-sm flex gap-3 items-center">
              <HiOutlineCurrencyDollar className="w-6 h-6 text-[var(--color-primary)]" />
              <div>
                <p className="text-gray-500 font-medium">Base Premium</p>
                <p className="text-gray-800">${policy.basePremiumRate} </p>
              </div>
            </div>

            {/* Purchase Count */}
            <div className="border-l-4 border-[var(--color-primary)] bg-white p-4 rounded-md shadow-sm flex gap-3 items-center">
              <HiOutlineChartBar className="w-6 h-6 text-[var(--color-primary)]" />
              <div>
                <p className="text-gray-500 font-medium">Purchases</p>
                <p className="text-gray-800">{policy.purchaseCount || 0} times</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              to={`/quote/${id}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-md hover:bg-opacity-90 transition-all font-medium"
            >
              <HiOutlineCalculator className="w-5 h-5" />
              Get a Free Quote
            </Link>
            <Link
              to="/agents"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-md hover:bg-[var(--color-primary)] hover:text-white transition-all font-medium"
            >
              <HiOutlineUser className="w-5 h-5" />
              Book Agent Consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PoliciesDetails;
