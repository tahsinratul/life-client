import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../Context/AuthProvider";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { NavLink, useNavigate } from "react-router";

const MyApprovedPolicies = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();
  const navigate = useNavigate();

  const { data: policies = [], isLoading } = useQuery({
    queryKey: ["approvedPolicies", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/approvedApplications?email=${user.email}`);
      return res.data;
    },
  });

  const handlePay = (appId) => {
  
    navigate(`/dashboard/payment/${appId}`);
  
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-[var(--color-primary)]">
        My Approved Policies
      </h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : policies.length === 0 ? (
        <p className="text-gray-500">No approved policies found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full bg-white shadow rounded-xl">
            <thead>
              <tr className="bg-[var(--color-primary)] text-white">
                <th className="py-3 px-4 text-left">Policy</th>
                <th className="py-3 px-4 text-left">Premium</th>
                <th className="py-3 px-4 text-left">Frequency</th>
                <th className="py-3 px-4 text-left">Payment Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((app) => {
                const { _id, policyTitle, quoteInfo, paymentStatus } = app;
                const frequency = quoteInfo?.paymentFrequency || "monthly";
                const premium = frequency === "monthly" ? quoteInfo?.monthly : quoteInfo?.annual;

                return (
                  <tr key={_id} className="border-t">
                    <td className="py-3 px-4">{policyTitle}</td>
                    <td className="py-3 px-4">${premium}</td>
                    <td className="py-3 px-4 capitalize">{frequency}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`badge ${
                          paymentStatus === "paid" ? "badge-success" : "badge-error"
                        }`}
                      >
                        {paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {paymentStatus === "due" ? (
                        <button
                          onClick={() => handlePay(_id)}
                          className="btn btn-sm bg-[var(--color-primary)] text-white"
                        >
                          Pay
                        </button>
                      ) : (
                        <span className="text-[var(--color-primary)] italic">Paid</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyApprovedPolicies;
