import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";

import { FaUserTie } from "react-icons/fa";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import { AuthContext } from "../../Context/AuthProvider";

const ToBeAgentForm = () => {
  const axiosSecure = UseAxiosSecure();
  const { user } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // Upload custom image to imgbb if user uploaded a new file
      let imageUrl = user?.photoURL || ""; // default to user's photo

      if (data.image?.[0]) {
        const formData = new FormData();
        formData.append("image", data.image[0]);

        const res = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_Image_Key}`,
          formData
        );
        imageUrl = res.data.data.url;
      }

      const agentData = {
        userId: user?.uid,
        fullName: user?.displayName,
        email: user?.email,
        phone: data.phone,
        nationalId: data.nationalId,
        education: data.education,
        experience: data.experience,
        location: data.location,
        linkedin: data.linkedin,
        message: data.message,
        image: imageUrl,
        status: "pending",
      };

      const response = await axiosSecure.post("/to-be-agent", agentData);

      if (response.data?.insertedId) {
        Swal.fire("Success", "Your agent request has been submitted!", "success");
        reset();
      } else {
        Swal.fire("Error", "Failed to submit. Try again.", "error");
      }
    } catch (error) {
      console.error("Agent form submission failed:", error);
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  return (
    <div className="min-h-screen py-6 px-4 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6 text-[var(--color-primary)] flex items-center justify-center gap-2">
        <FaUserTie className="text-[var(--color-primary)] text-3xl" />
        Become an Agent
      </h2>

      {/* Show User Photo */}
      {user?.photoURL && (
        <div className="flex justify-center mb-6">
          <img
            src={user.photoURL}
            alt="User Avatar"
            className="w-24 h-24 rounded-full object-cover border-2 border-[var(--color-primary)]"
          />
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 bg-white shadow-lg p-8 rounded-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            defaultValue={user?.displayName}
            disabled
            className="input input-bordered w-full bg-gray-100 text-gray-600 cursor-not-allowed"
            placeholder="Full Name"
          />
          <input
            type="email"
            defaultValue={user?.email}
            disabled
            className="input input-bordered w-full bg-gray-100 text-gray-600 cursor-not-allowed"
            placeholder="Email Address"
          />
          <input
            type="tel"
            {...register("phone", { required: true })}
            className="input input-bordered w-full focus:outline-none focus:ring-0 focus:border-[var(--color-primary)]"
            placeholder="Phone Number"
          />
          <input
            {...register("nationalId", { required: true })}
            className="input input-bordered w-full focus:outline-none focus:ring-0 focus:border-[var(--color-primary)]"
            placeholder="National ID / NID"
          />
          <input
            {...register("education", { required: true })}
            className="input input-bordered w-full focus:outline-none focus:ring-0 focus:border-[var(--color-primary)]"
            placeholder="Educational Qualification"
          />
          <input
            {...register("experience", { required: true })}
            className="input input-bordered w-full focus:outline-none focus:ring-0 focus:border-[var(--color-primary)]"
            placeholder="Years of Sales/Marketing Experience"
          />
          <input
            {...register("location", { required: true })}
            className="input input-bordered w-full focus:outline-none focus:ring-0 focus:border-[var(--color-primary)]"
            placeholder="Current Location"
          />
          <input
            {...register("linkedin")}
            className="input input-bordered w-full focus:outline-none focus:ring-0 focus:border-[var(--color-primary)]"
            placeholder="LinkedIn (Optional)"
          />
        </div>

        {/* Image Upload */}
        <input
          type="file"
          {...register("image")}
          accept="image/*"
          className="file-input file-input-bordered w-full focus:outline-none focus:ring-0 focus:border-[var(--color-primary)]"
        />

        <textarea
          {...register("message")}
          placeholder="Tell us why you want to be an agent (optional)"
          className="textarea textarea-bordered w-full focus:outline-none focus:ring-0 focus:border-[var(--color-primary)]"
          rows={6}
        />

        <div className="text-right">
          <button type="submit" className="btn btn-primary px-6">
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default ToBeAgentForm;
