import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router"; // Make sure you're using react-router-dom
import UseAxios from "../../Hooks/UseAxios";
import { format } from "date-fns";
import { FaCalendarAlt } from "react-icons/fa";

const LatestBlogs = () => {
  const axiosPublic = UseAxios();

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ["latestBlogs"],
    queryFn: async () => {
      const res = await axiosPublic.get("/blogs?limit=4&sort=desc");
      return res.data;
    },
  });

  return (
    <div className="py-14">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-[var(--color-primary)] mb-2">
          Latest Blog & Articles
        </h2>
        <p className=" text-gray-600 mb-10 text-center mt-2">
          Stay updated with expert insights and helpful tips on insurance, finance, and more.
        </p>

        {isLoading ? (
          <p className="text-center text-gray-500">Loading blogs...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {blogs.slice(0,4).map((blog) => (
              <div
                key={blog._id}
                className=" border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
                  {blog.title}
                </h3>
                <div className="flex items-center text-sm text-gray-500 mb-3">
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
                <Link
                  to={`/blogs/${blog._id}`}
                  className="text-sm text-slate-700 font-medium hover:underline"
                >
                  Read more →
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* All Blogs Button */}
        <div className="text-center mt-10">
          <Link
            to="/blogs"
            className="btn btn-outline border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
          >
            All Blog & Articles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LatestBlogs;
