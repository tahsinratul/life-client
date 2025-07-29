import React from "react";
import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import UseAxios from "../../Hooks/UseAxios";
import { format } from "date-fns";
import { FaCalendarAlt, FaUser } from "react-icons/fa";

const DetailsBlogs = () => {
  const { id } = useParams();
  const axiosPublic = UseAxios();

  const { data: blog, isLoading } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/blogs/${id}`);
      return res.data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-20 text-gray-500">Loading blog...</div>;
  }

  if (!blog?._id) {
    return <div className="text-center py-20 text-red-500">Blog not found.</div>;
  }

  return (
    <div className="py-14 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 bg-white rounded-xl shadow p-8">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-4">
          {blog.title}
        </h1>

        {/* Date and Author */}
        <div className="flex flex-wrap items-center text-sm mb-6 space-x-6">
          <div className="flex items-center text-[var(--color-primary)]">
            <FaCalendarAlt className="mr-2" />
            {blog.publishDate
              ? format(new Date(blog.publishDate), "PPP")
              : "No publish date"}
          </div>
          {blog.author && (
            <div className="flex items-center text-[var(--color-primary)]">
              <FaUser className="mr-2" />
              {blog.author}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="prose max-w-none text-gray-700 text-lg leading-relaxed mb-8">
          {blog.content || "No content available."}
        </div>

        {/* Go Back Button aligned to right */}
        <div className="flex justify-end">
          <Link
            to="/blogs"
            className="btn btn-outline border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
          >
            Go All Blogs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DetailsBlogs;
