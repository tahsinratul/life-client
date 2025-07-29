import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { FaPlus, FaEdit, FaTrash, FaFileAlt } from "react-icons/fa";
import Swal from "sweetalert2";

const ManagePolicies = () => {
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { data: policies = [], isLoading, isError } = useQuery({
    queryKey: ["policies"],
    queryFn: async () => {
      const res = await axiosSecure.get("/policy");
      return res.data;
    },
  });

  const addOrUpdatePolicy = useMutation({
    mutationFn: async (policy) => {
      if (editData) {
        return await axiosSecure.put(`/policy/${editData._id}`, policy);
      } else {
        return await axiosSecure.post("/policies", policy);
      }
    },
    onSuccess: (res) => {
  queryClient.invalidateQueries(["policies"]);
  reset();
  setModalOpen(false);
  setEditData(null);

  Swal.fire({
    icon: "success",
    title: editData ? "Policy Updated" : "Policy Added",
    text: editData
      ? "The policy has been successfully updated."
      : "New policy has been successfully added.",
    confirmButtonColor: "#3085d6",
    confirmButtonText: "OK"
  });
},

  });

  const deletePolicy = useMutation({
    mutationFn: async (id) => await axiosSecure.delete(`/policiesDelete/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["policies"]),
  });

  const onSubmit = async (data) => {
    try {
      let imageUrl = editData?.image || "";

      if (data.image?.[0]) {
        const formData = new FormData();
        formData.append("image", data.image[0]);
        const imgbbRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_Image_Key}`,
          formData
        );
        imageUrl = imgbbRes.data.data.url;
      }

      const newPolicy = {
        title: data.title,
        category: data.category,
        description: data.description,
        minAge: Number(data.minAge),
        maxAge: Number(data.maxAge),
        coverageRange: data.coverageRange,
        durationOptions: data.durationOptions,
        basePremiumRate: Number(data.basePremiumRate),
        image: imageUrl,
      };

      addOrUpdatePolicy.mutate(newPolicy);
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  const openEditModal = (policy) => {
    setEditData(policy);
    setModalOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-6">
       <h1 className="text-3xl font-bold text-[var(--color-primary)] flex items-center gap-2">
  <FaFileAlt className="text-[var(--color-primary)]" />
  Manage Policies
</h1>
        <button
          onClick={() => {
            reset();
            setEditData(null);
            setModalOpen(true);
          }}
          className="btn btn-primary flex items-center gap-2"
        >
          <FaPlus /> Add Policy
        </button>
      </div>

      {isLoading && <p className="text-center text-gray-500">Loading...</p>}
      {isError && <p className="text-center text-red-500">Failed to load policies.</p>}

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-200">
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Age</th>
              <th>Premium</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((p) => (
              <tr key={p._id}>
                <td>
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-16 h-10 object-cover rounded"
                  />
                </td>
                <td>{p.title}</td>
                <td>{p.category}</td>
                <td>
                  {p.minAge} - {p.maxAge}
                </td>
                <td>${p.basePremiumRate}</td>
                <td className="flex gap-2">
                  <button
                    className="btn btn-xs btn-info"
                    onClick={() => openEditModal(p)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-xs btn-error"
                    onClick={() => deletePolicy.mutate(p._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center z-50 overflow-auto"
          style={{ paddingTop: "4rem", paddingBottom: "4rem" }}
          onClick={() => {
            setModalOpen(false);
            setEditData(null);
          }}
        >
          <div
            className="bg-white rounded-xl shadow-xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
            style={{ minHeight: "400px" }}
          >
            <h2 className="text-3xl font-semibold mb-6 text-[var(--color-primary)]">
              {editData ? "Edit Policy" : "Add New Policy"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
              <input
                defaultValue={editData?.title}
                {...register("title", { required: true })}
                placeholder="Policy Title"
                className="input input-bordered col-span-2"
              />
              <select
                defaultValue={editData?.category}
                {...register("category", { required: true })}
                className="select select-bordered col-span-2"
              >
                <option value="">Select Category</option>
                <option value="Term Life">Term Life</option>
                <option value="Senior">Senior</option>
                <option value="Whole Life">Whole Life</option>
                <option value="Universal Life">Universal Life</option>
                <option value="Family Plan">Family Plan</option>
              </select>
              <textarea
                defaultValue={editData?.description}
                {...register("description", { required: true })}
                placeholder="Description"
                className="textarea textarea-bordered col-span-2"
                rows={4}
              />
              <input
                defaultValue={editData?.minAge}
                type="number"
                {...register("minAge", { required: true })}
                placeholder="Min Age"
                className="input input-bordered"
              />
              <input
                defaultValue={editData?.maxAge}
                type="number"
                {...register("maxAge", { required: true })}
                placeholder="Max Age"
                className="input input-bordered"
              />
              <input
                defaultValue={editData?.coverageRange}
                {...register("coverageRange", { required: true })}
                placeholder="Coverage Range"
                className="input input-bordered col-span-2"
              />
              <input
                defaultValue={editData?.durationOptions}
                {...register("durationOptions", { required: true })}
                placeholder="Duration Options"
                className="input input-bordered col-span-2"
              />
              <input
                defaultValue={editData?.basePremiumRate}
                type="number"
                {...register("basePremiumRate", { required: true })}
                placeholder="Base Premium Rate"
                className="input input-bordered col-span-2"
              />
              <input
                type="file"
                {...register("image")}
                accept="image/*"
                className="file-input file-input-bordered col-span-2"
              />

              <div className="col-span-2 flex justify-end gap-4 pt-4 border-t border-gray-200 mt-6">
                <button
                  onClick={() => {
                    setModalOpen(false);
                    setEditData(null);
                  }}
                  type="button"
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editData ? "Update" : "Add"} Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePolicies;
