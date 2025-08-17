import React, { useState } from "react";
import UseAxios from "../../Hooks/UseAxios";
import { useQuery } from "@tanstack/react-query";
import { FaCalendarAlt, FaRegNewspaper } from "react-icons/fa";
import { format } from "date-fns";
import { Link } from "react-router";

const AllBlogs = () => {
  const axiosPublic = UseAxios();
  const [selectedBlog, setSelectedBlog] = useState(null);

  const { data: blogs = [], isLoading, refetch } = useQuery({
    queryKey: ["latestBlogs"],
    queryFn: async () => {
      const res = await axiosPublic.get("/blogs?limit=4&sort=desc");
      return res.data;
    },
  });

  const handleOpenModal = async (blog) => {
    setSelectedBlog(blog);
    try {
      await axiosPublic.patch(`/blogs/${blog._id}/visit`);
      refetch(); // Refresh blogs if you want updated visit count
    } catch (err) {
      console.error("Failed to update visit count", err);
    }
  };

  return (
    <div className="py-14 mt-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-[var(--color-primary)] mb-2 flex items-center justify-center gap-2">
          <FaRegNewspaper className="text-[var(--color-primary)]" />
          Latest Blog & Articles
        </h2>
        <p className="text-center text-gray-600 mb-10 mt-4 mx-auto max-w-xl">
          Stay updated with expert insights and helpful tips on insurance, finance, and more.
        </p>

        {isLoading ? (
          <p className="text-center text-gray-500">Loading blogs...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
                  {blog.title}
                </h3>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <FaCalendarAlt className="mr-2" />
                  {blog.publishDate
                    ? format(new Date(blog.publishDate), "PPP")
                    : "Unknown date"}
                </div>
                <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                  {blog.content?.length > 150
                    ? blog.content.slice(0, 150) + "..."
                    : blog.content || "No summary available."}
                </p>
                <button
                  onClick={() => handleOpenModal(blog)}
                  className="text-sm text-slate-700 font-medium hover:underline"
                >
                  Read more →
                </button>
              </div>
            ))}
          </div>
        )}

       
      </div>

      {/* Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-xl relative">
            <h3 className="text-2xl font-bold mb-2 text-[var(--color-primary)]">
              {selectedBlog.title}
            </h3>
            <p className="text-gray-700 mb-4">
              {selectedBlog.content}
            </p>
            <div className="flex justify-between items-center">
              <Link
                to={`/blogs/${selectedBlog._id}`}
                className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-md hover:bg-opacity-90"
              >
                Go to Full Blog →
              </Link>
              <button
                onClick={() => setSelectedBlog(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBlogs;
