import React, { useState } from "react";
import UseAxios from "../../Hooks/UseAxios";
import { FaEnvelopeOpenText } from "react-icons/fa";
import Swal from "sweetalert2";

const Subscribtion = () => {
  const axiosPublic = UseAxios();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      return setMessage("Please fill in both fields.");
    }

    try {
      const res = await axiosPublic.post("/subscribers", formData);
      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Subscribed!",
          text: "You've successfully subscribed to our newsletter.",
          confirmButtonColor: "#1E40AF"
        });
        setMessage("");
        setFormData({ name: "", email: "" });
      } else {
        setMessage("Subscription failed. Try again.");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="bg-slate-800 py-16 px-4 max-w-7xl">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-2 flex justify-center items-center gap-2">
          <FaEnvelopeOpenText /> Newsletter Subscription
        </h2>
        <p className="text-gray-200 mb-8">
          Stay in the loop! Subscribe to receive updates, articles, and exclusive offers.
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center"
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="input input-bordered w-full bg-white text-black"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="input input-bordered w-full bg-white text-black"
            value={formData.email}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="btn bg-white text-slate-800 font-semibold md:col-span-2 hover:bg-gray-100 transition"
          >
            Subscribe
          </button>
        </form>

        {message && (
          <p className="text-sm text-center text-red-200 mt-4">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Subscribtion;
