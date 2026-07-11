import React, { useEffect, useState } from "react"
import ReactStars from "react-rating-stars-component"
import { Swiper, SwiperSlide } from "swiper/react"
import { FaStar } from "react-icons/fa"

// Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "../../App.css"

// Swiper modules
import { Autoplay, FreeMode, Pagination } from "swiper/modules"

// API
import { apiConnector } from "../../services/apiConnector"
import { ratingsEndpoints } from "../../services/apis"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        )
        if (data?.success) {
          const finalData = data?.data
          // Duplicate data for smooth loop if items are fewer than 8
          if (finalData.length > 0 && finalData.length < 8) {
            setReviews([...finalData, ...finalData])
          } else {
            setReviews(finalData)
          }
        }
      } catch (error) {
        console.error("Error fetching reviews:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[150px] items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-yellow-100 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="text-white w-full">
      <div className="my-[50px] max-w-maxContentTab lg:max-w-maxContent mx-auto px-4">
        <Swiper
          key={reviews.length}
          loop={reviews.length > 1}
          spaceBetween={15}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          breakpoints={{
            // Mobile: 2 slides, no "peek"
            320: { slidesPerView: 2, spaceBetween: 10 },
            // Tablet: 2 slides
            640: { slidesPerView: 2, spaceBetween: 15 },
            // Desktop: 3 slides
            1024: { slidesPerView: 3, spaceBetween: 20 },
            // Large Desktop: 4 slides
            1280: { slidesPerView: 4, spaceBetween: 25 },
          }}
          modules={[FreeMode, Pagination, Autoplay]}
          // pb-14 creates the dedicated space for dots below the cards
          className="w-full pb-14"
        >
          {reviews.map((review, i) => (
            <SwiperSlide key={review?._id || i}>
              <div className="flex flex-col gap-3 bg-richblack-800 p-4 text-richblack-25 rounded-lg border border-richblack-700 
                              h-[210px] md:h-[240px] w-full transition-all duration-200 hover:bg-richblack-900">

                {/* Header Section */}
                <div className="flex items-center gap-3 h-[40px] shrink-0">
                  <img
                    src={review?.user?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName}`}
                    alt="profile"
                    className="h-9 w-9 rounded-full object-cover border border-richblack-600"
                  />
                  <div className="flex flex-col min-w-0">
                    <p className="font-semibold text-richblack-5 truncate text-[14px]">
                      {review?.user?.firstName} {review?.user?.lastName}
                    </p>
                    <p className="text-[11px] font-medium text-richblack-500 truncate">
                      {review?.course?.courseName}
                    </p>
                  </div>
                </div>

                {/* Review Text Area (fills remaining space) */}
                <div className="flex-grow overflow-hidden">
                  <p className="text-[12px] md:text-[14px] font-medium text-richblack-25 leading-snug italic line-clamp-4">
                    "{review?.review}"
                  </p>
                </div>

                {/* Footer Section */}
                <div className="flex items-center gap-2 mt-auto pt-2 border-t border-richblack-700">
                  <span className="font-semibold text-yellow-100 text-[14px]">
                    {review.rating.toFixed(1)}
                  </span>
                  <div className="scale-75 md:scale-90 origin-left">
                    <ReactStars
                      count={5}
                      value={review.rating}
                      size={20}
                      edit={false}
                      activeColor="#ffd700"
                      emptyIcon={<FaStar />}
                      fullIcon={<FaStar />}
                    />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* CSS Overrides to force dots to the bottom of the padding gutter */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .swiper-pagination {
          bottom: 0px !important;
          position: absolute !important;
        }
        .swiper-pagination-bullet {
          background: #424854 !important; /* richblack-600 */
          opacity: 1 !important;
        }
        .swiper-pagination-bullet-active {
          background: #FFD60A !important; /* yellow-50 */
          width: 20px !important;
          border-radius: 4px !important;
        }
      `}} />
    </div>
  )
}

export default ReviewSlider