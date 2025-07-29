import React, { useState } from "react";
import { Link } from "react-router";
import UseAxios from "../../Hooks/UseAxios";
import { useQuery } from "@tanstack/react-query";
import { FaFilter, FaSearch, FaTags } from "react-icons/fa";
import Loading from "../../Components/Loading";

const AllPolicies = () => {
  const axiosPublic = UseAxios();
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const policiesPerPage = 9;

  const { data: policyData = {}, isLoading } = useQuery({
    queryKey: ["policies", currentPage, category, searchTerm],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/policies?page=${currentPage}&limit=${policiesPerPage}&category=${category}&search=${searchTerm}`
      );
      return res.data;
    },
  });

  const totalPages = Math.ceil((policyData.total || 0) / policiesPerPage);

  const handleFilterChange = (e) => {
    setCategory(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-start mb-4">
        {/* Left: Search */}
        <div className=" lg:w-60 md:w-1/2">
          <label className="flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] mb-1">
    <FaSearch /> Search Policies
  </label>
          <input
            type="text"
            placeholder="eg. Life Saver Plan"
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Right: Category Filter */}
        <div className="hidden md:block">
          <label className="flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] mb-1">
    <FaFilter /> Filter
  </label>
          <select
            value={category}
            onChange={handleFilterChange}
            className="select select-bordered w-40"
          >
            <option value="">All</option>
            <option value="Term Life">Term Life</option>
            <option value="Senior">Senior</option>
            <option value="Whole Life">Whole Life</option>
            <option value="Universal Life">Universal Life</option>
            <option value="Family Plan">Family Plan</option>
            <option value="Child Plan">Child Plan</option>
          </select>
        </div>
      </div>

      {/* For Mobile View: Show Filter below Search */}
      <div className="block md:hidden mb-6">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Filter by Category
        </label>
        <select
          value={category}
          onChange={handleFilterChange}
          className="select select-bordered w-full"
        >
          <option value="">All</option>
          <option value="Term Life">Term Life</option>
          <option value="Senior">Senior</option>
          <option value="Whole Life">Whole Life</option>
          <option value="Universal Life">Universal Life</option>
          <option value="Family Plan">Family Plan</option>
          <option value="Child Plan">Child Plan</option>
        </select>
      </div>

      <h2 className="text-4xl font-bold text-center text-[var(--color-primary)] mb-8">
        All Insurance Policies
      </h2>

      {/* Policy Cards */}
      {isLoading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {policyData.policies?.map((policy) => (
            <div
              key={policy._id}
              className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-all flex flex-col"
            >
              <img
                src={policy.image}
                alt={policy.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-[var(--color-primary)]">
                    {policy.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 italic mb-1">
                    <FaTags className="text-[var(--color-primary)]" />
                    <span className="ml-2">{policy.category}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    {(policy.description || "No details available").slice(0, 90)}...
                  </p>
                  <p className="text-sm text-gray-700 font-semibold">
                    Base Premium: ${policy.basePremiumRate}
                  </p>
                </div>
                <div className="mt-4">
                  <Link
                    to={`/policies/${policy._id}`}
                    className="btn btn-sm btn-primary w-full"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-10 gap-2">
        {[...Array(totalPages).keys()].map((num) => (
          <button
            key={num + 1}
            onClick={() => setCurrentPage(num + 1)}
            className={`btn btn-sm ${
              currentPage === num + 1
                ? "bg-[var(--color-primary)] text-white"
                : "btn-outline"
            }`}
          >
            {num + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AllPolicies;
