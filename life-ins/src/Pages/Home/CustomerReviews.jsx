import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaStar } from "react-icons/fa";
import UseAxios from "../../Hooks/UseAxios";

const truncateWords = (text, wordLimit) => {
  const words = text.trim().split(" ");
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + "...";
};

const CustomerReviews = () => {
  const axiosPublic = UseAxios();
  const [expandedReviewId, setExpandedReviewId] = useState(null);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await axiosPublic.get("/reviews");
      return res.data;
    },
  });

  return (
    <div className="py-16 ">
      <div className="max-w-7xl mx-auto px-4">
       <h2 className="text-4xl font-bold text-center mb-2 text-[var(--color-primary)]">
  What Our Customers Say
</h2>
<p className="text-center text-gray-600 mb-10 max-w-xl mx-auto">
  Hear directly from our valued customers — real reviews and honest feedback about their experiences.
</p>


        {isLoading ? (
          <p className="text-center text-gray-500">Loading reviews...</p>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{ delay: 5000 }}
            pagination={{ clickable: true }}
            navigation
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {reviews.map((review) => {
              const isExpanded = expandedReviewId === review._id;
              const shortComment = truncateWords(review.comment, 10);

              return (
                <SwiperSlide key={review._id}>
                  <div className=" rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 flex flex-col h-[420px]">
                    {/* Image */}
                    <div className="relative h-60 w-full">
                      <img
                        src={review.photo}
                        alt={review.userName}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>

                    {/* Name and Policy below image */}
                    <div className="px-5 pt-4">
                      <h4 className="text-lg font-semibold text-[var(--color-primary)]">
                        {review.userName}
                      </h4>
                      <p className="text-sm text-gray-600">{review.policyTitle}</p>
                    </div>

                    {/* Bottom Content */}
                    <div className="p-5 flex flex-col flex-grow">
                      <p className="text-sm mb-3 leading-relaxed text-[var(--color-primary)]">
                        {isExpanded ? review.comment : shortComment}
                        {review.comment.trim().split(" ").length > 10 && !isExpanded && (
                          <button
                            className="text-slate-700 text-sm ml-1 hover:underline"
                            onClick={() => setExpandedReviewId(review._id)}
                          >
                            Read more
                          </button>
                        )}
                        {isExpanded && (
                          <button
                            className="text-slate-700 text-sm ml-2 hover:underline"
                            onClick={() => setExpandedReviewId(null)}
                          >
                            Show less
                          </button>
                        )}
                      </p>

                      <div className="flex items-center mt-auto gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-sm ${
                              i < review.rating ? "text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-500">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default CustomerReviews;
