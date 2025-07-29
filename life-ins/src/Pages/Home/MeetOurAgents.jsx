import React from "react";
import { useQuery } from "@tanstack/react-query";
import UseAxios from "../../Hooks/UseAxios";
import { FaStar, FaUserTie, FaSuitcase, FaPhoneAlt } from "react-icons/fa";

const MeetOurAgents = () => {
  const axiosSecure = UseAxios();

  const { data: agents = [], isLoading } = useQuery({
    queryKey: ["featured-agents"],
    queryFn: async () => {
      const res = await axiosSecure.get("/featured-agents");
      return res.data;
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
     <div className="text-center mb-12">
  <div className="flex justify-center items-center gap-3 text-[var(--color-primary)] mb-2">
    <FaUserTie className="text-4xl" />
    <h2 className="text-4xl font-bold">Meet Our Featured Agents</h2>
  </div>
  <p className="text-gray-600 text-lg max-w-xl mx-auto">
    Discover our top-performing agents who are dedicated to helping you find the best insurance solutions.
  </p>
</div>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading agents...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {agents.map((agent) => (
            <div
              key={agent._id}
              className=" rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center"
            >
              <img
                src={agent.photo}
                alt={agent.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-[var(--color-primary)] mb-4"
              />
              <h3 className="text-xl font-bold text-gray-800">{agent.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{agent.email}</p>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <FaSuitcase className="text-[var(--color-primary)]" />
                <span>{agent.experience || "2+"} years of experience</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <FaUserTie className="text-[var(--color-primary)]" />
                <span>Specialized in: {agent.specialties || "Life, Family, Senior"}</span>
              </div>
              
              <div className="flex justify-center gap-1 mt-3">
                {[...Array(5)].map((_, idx) => (
                  <FaStar key={idx} className="text-yellow-400" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MeetOurAgents;
