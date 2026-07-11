import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useParams } from "react-router-dom"
import { HiMenuAlt2 } from "react-icons/hi"

import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal"
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar"
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI"
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice"

export default function ViewCourse() {
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [reviewModal, setReviewModal] = useState(false)
  const [sidebarActive, setSidebarActive] = useState(false)

  useEffect(() => {
    ;(async () => {
      const courseData = await getFullDetailsOfCourse(courseId, token)
      dispatch(setCourseSectionData(courseData.courseDetails.courseContent))
      dispatch(setEntireCourseData(courseData.courseDetails))
      dispatch(setCompletedLectures(courseData.completedVideos))
      let lectures = 0
      courseData?.courseDetails?.courseContent?.forEach((sec) => {
        lectures += sec.subSection.length
      })
      dispatch(setTotalNoOfLectures(lectures))
    })()
  },[courseId,dispatch,token])

  return (
    <>
      <div className="relative flex min-h-[calc(100vh-3.5rem)] flex-col md:flex-row">
        
        {/* Mobile Top Header */}
        <div className="flex h-[50px] items-center justify-between border-b border-richblack-700 bg-richblack-900 px-4 md:hidden relative z-[50]">
            <button 
                onClick={() => setSidebarActive(true)}
                className="text-richblack-100 text-2xl"
            >
                <HiMenuAlt2 />
            </button>
            <span className="font-semibold text-richblack-50 text-sm">Course Content</span>
        </div>

        {/* Sidebar Container - FIXED: invisible when closed so it doesn't block clicks */}
        <div 
          className={`fixed inset-0 z-[1500] transition-all duration-300 md:relative md:inset-auto md:z-0 md:block 
          ${sidebarActive ? "visible" : "invisible md:visible"}`}
        >
            {/* Backdrop for mobile */}
            <div 
                className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 md:hidden ${
                  sidebarActive ? "opacity-100" : "opacity-0 pointer-events-none"
                }`} 
                onClick={() => setSidebarActive(false)}
            />
            
            {/* Sidebar Content */}
            <div className={`absolute left-0 top-0 h-full w-[250px] bg-richblack-800 transition-transform duration-300 md:relative md:translate-x-0 md:w-[320px] ${
              sidebarActive ? "translate-x-0" : "-translate-x-full"
            }`}>
                <VideoDetailsSidebar 
                    setReviewModal={setReviewModal} 
                    setSidebarActive={setSidebarActive} 
                />
            </div>
        </div>

        {/* Main Content */}
        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto bg-richblack-900">
          <div className="mx-auto w-11/12 max-w-[1000px] py-10">
            <Outlet />
          </div>
        </div>
      </div>
      
      {/* Review Modal */}
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  )
}