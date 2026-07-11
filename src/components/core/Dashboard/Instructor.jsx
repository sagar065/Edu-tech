import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"
import { getInstructorData } from "../../../services/operations/profileAPI"
import InstructorChart from "./InstructorDashboard/InstructorChart"

export default function Instructor() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const [loading, setLoading] = useState(false)
  const [instructorData, setInstructorData] = useState(null)
  const [courses, setCourses] = useState([])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const instructorApiData = await getInstructorData(token)
      const result = await fetchInstructorCourses(token)
      if (instructorApiData.length) setInstructorData(instructorApiData)
      if (result) {
        setCourses(result)
      }
      setLoading(false)
    })()
  }, [token])

  const totalAmount = instructorData?.reduce((acc, curr) => acc + curr.totalAmountGenerated, 0)
  const totalStudents = instructorData?.reduce((acc, curr) => acc + curr.totalStudentsEnrolled, 0)

  return (
    <div className="px-4 py-6 md:px-0">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-richblack-5">
          Hi {user?.firstName} 👋
        </h1>
        <p className="font-medium text-richblack-200">
          Let's start something new
        </p>
      </div>

      {loading ? (
        <div className="spinner mx-auto mt-20"></div>
      ) : courses.length > 0 ? (
        <div>
          {/* Main Content Area: Stack on mobile, side-by-side on desktop */}
          <div className="my-4 flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0 lg:h-[450px]">
            {/* Chart Section */}
            <div className="flex-1">
              {totalAmount > 0 || totalStudents > 0 ? (
                <InstructorChart courses={instructorData} />
              ) : (
                <div className="flex-1 rounded-md bg-richblack-800 p-6 h-full">
                  <p className="text-lg font-bold text-richblack-5">Visualize</p>
                  <p className="mt-4 text-xl font-medium text-richblack-50">
                    Not Enough Data To Visualize
                  </p>
                </div>
              )}
            </div>

            {/* Statistics Sidebar */}
            <div className="flex min-w-[250px] flex-col rounded-md bg-richblack-800 p-6">
              <p className="text-lg font-bold text-richblack-5">Statistics</p>
              <div className="mt-4 grid grid-cols-2 gap-4 lg:flex lg:flex-col lg:space-y-4">
                <div>
                  <p className="text-lg text-richblack-200">Total Courses</p>
                  <p className="text-2xl lg:text-3xl font-semibold text-richblack-50">{courses.length}</p>
                </div>
                <div>
                  <p className="text-lg text-richblack-200">Total Students</p>
                  <p className="text-2xl lg:text-3xl font-semibold text-richblack-50">{totalStudents}</p>
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <p className="text-lg text-richblack-200">Total Income</p>
                  <p className="text-2xl lg:text-3xl font-semibold text-richblack-50">Rs. {totalAmount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Courses Section */}
          <div className="rounded-md bg-richblack-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-lg font-bold text-richblack-5">Your Courses</p>
              <Link to="/dashboard/my-courses">
                <p className="text-xs font-semibold text-yellow-50 hover:underline">View All</p>
              </Link>
            </div>
            
            {/* Responsive Grid for Courses */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.slice(0, 3).map((course) => (
                <div key={course._id} className="w-full">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="h-[200px] w-full rounded-md object-cover"
                  />
                  <div className="mt-3">
                    <p className="text-sm font-medium text-richblack-50">{course.courseName}</p>
                    <div className="mt-1 flex items-center gap-x-2">
                      <p className="text-xs font-medium text-richblack-300">
                        {course.studentsEnroled.length} students
                      </p>
                      <span className="text-richblack-300">|</span>
                      <p className="text-xs font-medium text-richblack-300">Rs. {course.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-10 lg:mt-20 rounded-md bg-richblack-800 p-6 py-10 lg:py-20">
          <p className="text-center text-xl lg:text-2xl font-bold text-richblack-5">
            You have not created any courses yet
          </p>
          <Link to="/dashboard/add-course">
            <p className="mt-2 text-center text-lg font-semibold text-yellow-50 underline">
              Create a course
            </p>
          </Link>
        </div>
      )}
    </div>
  )
}