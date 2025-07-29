import React, { useContext, useState } from "react";
import { AuthContext } from "../../../Context/AuthProvider";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HiPlus, HiTrash } from "react-icons/hi";
import Swal from "sweetalert2";



const uploadImageToImgbb = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_Image_Key}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data?.data?.url;
};

const PostBlogs = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [editBlog, setEditBlog] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // === Query: Fetch blogs ===
  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/blogs");
      return res.data;
    },
  });

  // === Mutation: Add new blog ===
  const createBlogMutation = useMutation({
    mutationFn: async (blogData) => {
      const res = await axiosSecure.post("/blogs", blogData);
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["blogs"]);
      Swal.fire("Success!", "Blog published successfully!", "success");
      setShowModal(false);
      reset();
    },
    onError: () => {
      Swal.fire("Error", "Failed to publish blog", "error");
    },
  });

  // === Mutation: Update blog ===
  const updateBlogMutation = useMutation({
    mutationFn: async ({ id, updateData }) => {
      const res = await axiosSecure.patch(`/blogs/${id}`, updateData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs"]);
      Swal.fire("Updated!", "Blog updated successfully.", "success");
      setEditBlog(null);
      reset();
    },
    onError: () => {
      Swal.fire("Error", "Failed to update blog", "error");
    },
  });

  // === Mutation: Delete blog ===
  const deleteBlogMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/blogs/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs"]);
      Swal.fire("Deleted!", "Blog has been deleted.", "success");
    },
    onError: () => {
      Swal.fire("Error", "Failed to delete blog", "error");
    },
  });

  const onSubmit = async (data) => {
    try {
      const imageFile = data.image[0];
      const imageUrl = await uploadImageToImgbb(imageFile);

      const blogData = {
        title: data.title,
        content: data.content,
        author: user?.displayName || "Unknown",
        authorEmail: user?.email,
        image: imageUrl,
        publishDate: new Date(),
      };

      createBlogMutation.mutate(blogData);
    } catch (err) {
      console.error("Image upload failed:", err);
      Swal.fire("Error", "Image upload failed", "error");
    }
  };

  const handleUpdate = (data) => {
    const updated = {
      title: data.title,
      content: data.content,
      image: data.image, // You can support re-upload here if needed
    };
    updateBlogMutation.mutate({ id: editBlog._id, updateData: updated });
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the blog.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    });

    if (confirm.isConfirmed) {
      deleteBlogMutation.mutate(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[var(--color-primary)]">Manage Blogs</h2>
        <button
          onClick={() => {
            setEditBlog(null);
            reset();
            setShowModal(true);
          }}
          className="btn bg-[var(--color-primary)] text-white"
        >
          <HiPlus className="text-xl" /> Add New Blog
        </button>
      </div>

      <div className="overflow-x-auto border rounded-xl">
        <table className="table w-full">
          <thead>
            <tr className="bg-[var(--color-primary)] text-white">
              <th>Title</th>
              <th>Author</th>
              <th>Content</th>
              <th>Date</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id} className="hover">
                <td>{blog.title}</td>
                <td>{blog.author}</td>
                <td>{blog.content.slice(0, 20)}...</td>
                <td>{new Date(blog.publishDate).toLocaleDateString()}</td>
                <td className="text-right flex gap-2 justify-end">
                  <button
                    onClick={() => {
                      setEditBlog(blog);
                      reset(blog);
                    }}
                    className="btn btn-sm bg-yellow-400 hover:bg-yellow-500 text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="btn btn-sm btn-error text-white"
                  >
                    <HiTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showModal && (
        <Modal title="New Blog Post" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <InputField label="Title" name="title" register={register} error={errors.title} required />
            <div>
              <label className="block text-sm font-medium mb-1">Author</label>
              <input
                type="text"
                value={user?.displayName || "Unknown"}
                readOnly
                className="input input-bordered w-full bg-gray-100"
              />
            </div>
            <TextAreaField label="Content" name="content" register={register} error={errors.content} required />
            <div>
              <label className="block text-sm font-medium mb-1">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                {...register("image", { required: "Image is required" })}
                className="file-input file-input-bordered w-full"
              />
              {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image.message}</p>}
            </div>
            <div className="text-right">
              <button type="submit" className="btn bg-[var(--color-primary)] text-white">
                Publish
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Modal */}
      {editBlog && (
        <Modal title="Edit Blog" onClose={() => setEditBlog(null)}>
          <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
            <InputField
              label="Title"
              name="title"
              register={register}
              defaultValue={editBlog.title}
              required
            />
            <div>
              <label className="block text-sm font-medium mb-1">Author</label>
              <input
                type="text"
                value={editBlog.author || "Unknown"}
                readOnly
                className="input input-bordered w-full bg-gray-100"
              />
            </div>
            <TextAreaField
              label="Content"
              name="content"
              register={register}
              defaultValue={editBlog.content}
              required
            />
            <InputField
              label="Image URL"
              name="image"
              register={register}
              defaultValue={editBlog.image || ""}
              required
            />
            <div className="text-right">
              <button type="submit" className="btn bg-[var(--color-primary)] text-white">
                Update
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

// Shared components
const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
      <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-4">{title}</h3>
      {children}
      <button onClick={onClose} className="absolute top-2 right-2 text-xl">
        ✕
      </button>
    </div>
  </div>
);

const InputField = ({ label, name, register, error, defaultValue = "", required }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      {...register(name, required && { required: `${label} is required` })}
      defaultValue={defaultValue}
      className="input input-bordered w-full"
    />
    {error && <p className="text-red-600 text-sm mt-1">{error.message}</p>}
  </div>
);

const TextAreaField = ({ label, name, register, error, defaultValue = "", required }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <textarea
      {...register(name, required && { required: `${label} is required` })}
      defaultValue={defaultValue}
      rows={6}
      className="textarea textarea-bordered w-full"
    />
    {error && <p className="text-red-600 text-sm mt-1">{error.message}</p>}
  </div>
);

export default PostBlogs;
