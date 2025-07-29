import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router"; // ✅ FIXED!
import UseAxios from "../../../Hooks/UseAxios";

import {
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineEye,
  HiOutlineCurrencyBangladeshi,
} from "react-icons/hi";

const PopularPolicies = () => {
  const axiosPublic = UseAxios();

  const { data: popularPolicies = [], isLoading, isError } = useQuery({
    queryKey: ["popularPolicies"],
    queryFn: async () => {
      const res = await axiosPublic.get("/top-policies");
      return res.data;
    },
  });

  if (isLoading)
    return (
      <div className="text-center py-10 text-gray-500 text-lg">
        Loading popular policies...
      </div>
    );

  if (isError)
    return (
      <div className="text-center text-red-600 text-lg">
        Failed to load popular policies.
      </div>
    );

  return (
    <section className="py-16 ">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-[var(--color-primary)] mb-12">
           Popular Insurance Policies
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {popularPolicies.map((policy) => (
            <div
              key={policy._id}
              className=" rounded-xl shadow-md hover:shadow-xl border border-gray-200 transition duration-300 overflow-hidden group"
            >
              {/* ✅ Image */}
              <img
                src={policy.image}
                alt={policy.title}
                className="w-full h-52 object-cover group-hover:scale-105 transition duration-300"
                
              />

              {/* ✅ Content */}
              <div className="p-5 space-y-4">
                <h3 className="text-xl font-semibold text-[var(--color-primary)] flex items-center gap-2">
                  <HiOutlineShieldCheck className="text-[var(--color-primary)]" />
                  {policy.title}
                </h3>

                <div className="text-gray-700 space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <HiOutlineCurrencyBangladeshi className="text-green-600" />
                    <span className="font-medium">Coverage:</span>{" "}
                    {policy.coverageRange}
                  </p>
                  <p className="flex items-center gap-2">
                    <HiOutlineClock className="text-blue-500" />
                    <span className="font-medium">Duration:</span>{" "}
                    {policy.durationOptions}
                  </p>
                  <p className="flex items-center gap-2">
                    <HiOutlineChartBar className="text-yellow-600" />
                    <span className="font-medium">Popularity:</span>{" "}
                    {policy.purchaseCount} Purchases
                  </p>
                </div>

                {/* CTA */}
                <Link
                  to={`/policies/${policy._id}`}
                  className="mt-4 inline-flex items-center justify-center gap-2 w-full bg-[var(--color-primary)] text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition"
                >
                  <HiOutlineEye />
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularPolicies;
