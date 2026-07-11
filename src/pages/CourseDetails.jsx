import React, { useEffect, useState } from "react"
import { BiInfoCircle } from "react-icons/bi"
import { HiOutlineGlobeAlt } from "react-icons/hi"
import ReactMarkdown from "react-markdown"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import ConfirmationModal from "../components/Common/ConfirmationModal"
import Footer from "../components/Common/Footer"
import RatingStars from "../components/Common/RatingStars"
import CourseAccordionBar from "../components/core/Course/CourseAccordionBar"
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard"
import { formatDate } from "../services/formatDate"
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI"
import { BuyCourse } from "../services/operations/studentFeaturesAPI"
import GetAvgRating from "../utils/avgRating"
import Error from "./Error"

function CourseDetails() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.profile)
  const { paymentLoading } = useSelector((state) => state.course)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { courseId } = useParams()

  const [response, setResponse] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)
  const [avgReviewCount, setAvgReviewCount] = useState(0)
  const [isActive, setIsActive] = useState([])
  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetchCourseDetails(courseId)
        setResponse(res)
      } catch (error) {
        console.log("Could not fetch Course Details")
      }
    })()
  }, [courseId])

  useEffect(() => {
    // Defensive check for average rating calculation
    const count = GetAvgRating(response?.data?.courseDetails?.ratingAndReviews || [])
    setAvgReviewCount(count || 0)
  }, [response])

  useEffect(() => {
    let lectures = 0
    // Defensive check for course content mapping
    response?.data?.courseDetails?.courseContent?.forEach((sec) => {
      lectures += sec?.subSection?.length || 0
    })
    setTotalNoOfLectures(lectures)
  }, [response])

  const handleActive = (id) => {
    setIsActive(
      isActive.includes(id)
        ? isActive.filter((e) => e !== id)
        : [...isActive, id]
    )
  }

  // Loader state
  if (loading || !response) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  // Handle case where API response is unsuccessful
  if (!response?.success) {
    return <Error />
  }

  // Destructuring with safety
  const {
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentsEnrolled,
    createdAt,
  } = response?.data?.courseDetails || {}

  const handleBuyCourse = () => {
    if (token) {
      BuyCourse(token, [courseId], user, navigate, dispatch)
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to Purchase Course.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  if (paymentLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <>
      <div className="relative w-full bg-richblack-800">
        <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative">
          <div className="mx-auto grid min-h-[450px] max-w-maxContentTab py-8 lg:mx-0 lg:py-0 xl:max-w-[810px]">
            <div className="block lg:hidden">
              <img src={thumbnail} alt="course" className="w-full" />
            </div>

            <div className="my-5 flex flex-col gap-4 text-richblack-5">
              <p className="text-4xl font-bold">{courseName || "Course Name"}</p>
              <p className="text-richblack-200">{courseDescription || "No description available."}</p>

              <div className="flex items-center gap-2">
                {/* Fixed: Mandatory numeric fallback to prevent NaN warning */}
                <span className="text-yellow-25">{avgReviewCount || 0}</span>
                <RatingStars Review_Count={avgReviewCount || 0} Star_Size={24} />
                <span>{`(${ratingAndReviews?.length || 0} reviews)`}</span>
                <span>{`${studentsEnrolled?.length || 0} students enrolled`}</span>
              </div>

              <p>
                Created By {instructor ? `${instructor.firstName} ${instructor.lastName}` : "Unknown Instructor"}
              </p>

              <div className="flex gap-5">
                <p className="flex items-center gap-2">
                  <BiInfoCircle /> Created at {createdAt ? formatDate(createdAt) : "N/A"}
                </p>
                <p className="flex items-center gap-2">
                  <HiOutlineGlobeAlt /> English
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-y border-richblack-500 py-4 lg:hidden">
              <p className="text-3xl font-semibold">₹ {price || 0}</p>
              <button className="yellowButton" onClick={handleBuyCourse}>Buy Now</button>
            </div>
          </div>

          <div className="absolute right-4 top-20 hidden w-[410px] lg:block">
            {/* Safe rendering of Course Card */}
            {response?.data?.courseDetails && (
              <CourseDetailsCard
                course={response.data.courseDetails}
                setConfirmationModal={setConfirmationModal}
                handleBuyCourse={handleBuyCourse}
              />
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 text-richblack-5 lg:w-[1260px]">
        <div className="xl:max-w-[810px]">
          <div className="my-8 border border-richblack-600 p-8">
            <p className="text-3xl font-semibold">What you'll learn</p>
            {/* Fixed: Removed className from ReactMarkdown to prevent crash */}
            <div className="mt-4 prose prose-invert">
              <ReactMarkdown>{whatYouWillLearn || "No details provided."}</ReactMarkdown>
            </div>
          </div>

          <div>
            <p className="text-[28px] font-semibold">Course Content</p>
            <div className="flex justify-between py-2">
              <div className="flex gap-2">
                <span>{courseContent?.length || 0} sections</span>
                <span>{totalNoOfLectures || 0} lectures</span>
                <span>{response?.data?.totalDuration || "0m"}</span>
              </div>
              <button className="text-yellow-25" onClick={() => setIsActive([])}>Collapse all</button>
            </div>

            {/* Fixed: Safe map for Course Content */}
            {courseContent?.length > 0 ? (
              courseContent.map((section, index) => (
                <CourseAccordionBar
                  key={section?._id || index}
                  course={section}
                  isActive={isActive}
                  handleActive={handleActive}
                />
              ))
            ) : (
              <p className="py-4 text-richblack-200">No sections available.</p>
            )}
          </div>

          {/* Fixed: Safe Author Section to prevent Scroll Crash */}
          <div className="my-12">
            <p className="text-[28px] font-semibold">Author</p>
            <div className="flex items-center gap-4 py-4">
              <img
                src={instructor?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${instructor?.firstName}`}
                alt="author"
                className="h-14 w-14 rounded-full object-cover"
              />
              <p className="text-lg">
                {instructor?.firstName} {instructor?.lastName}
              </p>
            </div>
            <p className="text-richblack-50">
              {instructor?.additionalDetails?.about || "This instructor hasn't provided a biography."}
            </p>
          </div>
        </div>
      </div>

      <Footer />
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}

export default CourseDetails