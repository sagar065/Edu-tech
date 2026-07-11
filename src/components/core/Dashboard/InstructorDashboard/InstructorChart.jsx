import React, { useState, useMemo } from "react"
import { Chart, registerables } from "chart.js"
import { Doughnut } from "react-chartjs-2"

Chart.register(...registerables)

export default function InstructorChart({ courses = [] }) {
  const [currChart, setCurrChart] = useState("students")

  const generatePalette = (num) => {
    const baseColors = [
      "#8338ec", "#3a86ff", "#ff006e", "#fb5607", "#ffbe0b", 
      "#2ec4b6", "#e71d36", "#00b4d8", "#9ef01a", "#70e000"
    ]
    return Array.from({ length: num }, (_, i) => baseColors[i % baseColors.length])
  }

  const colors = useMemo(() => generatePalette(courses.length), [courses.length])

  const chartData = useMemo(() => {
    const labels = courses.map((course) => course.courseName)
    const data = currChart === "students"
        ? courses.map((course) => course.totalStudentsEnrolled)
        : courses.map((course) => course.totalAmountGenerated)

    return {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: colors,
          hoverBackgroundColor: colors,
          borderColor: "#161D29",
          borderWidth: 3,
          hoverOffset: 15,
          borderRadius: 6,
          spacing: 2,
        },
      ],
    }
  }, [currChart, courses, colors])

  const options = {
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: "#999DAA",
          usePointStyle: true,
          pointStyle: "circle",
          padding: 15, // Reduced padding for mobile
          font: {
            size: window.innerWidth < 768 ? 10 : 12, // Responsive legend font
            weight: "500",
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#2C333F",
        cornerRadius: 10,
        padding: 10,
        callbacks: {
          label: (context) => {
            const val = context.parsed
            return currChart === "income" ? ` ₹${val.toLocaleString()}` : ` ${val} Students`
          }
        }
      }
    },
  }

  return (
    <div className="flex flex-1 flex-col gap-y-4 rounded-2xl border-[1px] border-richblack-700 bg-richblack-800 p-4 md:p-6 shadow-lg h-full">
      <div className="flex items-center justify-between gap-x-2">
        {/* SMALLER FONT FOR TITLE ON MOBILE */}
        <h2 className="text-sm md:text-xl font-semibold tracking-wide text-richblack-5">
          Instructor Insights
        </h2>

        {/* COMPACT TOGGLE BAR */}
        <div className="flex items-center gap-x-1 rounded-lg bg-richblack-900 p-1 shadow-inner">
          <button
            onClick={() => setCurrChart("students")}
            className={`px-2 py-1 md:px-4 md:py-1.5 text-[10px] md:text-sm font-medium transition-all duration-300 rounded-md ${
              currChart === "students"
                ? "bg-richblack-700 text-yellow-50 shadow-sm"
                : "text-richblack-400 hover:text-richblack-5"
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setCurrChart("income")}
            className={`px-2 py-1 md:px-4 md:py-1.5 text-[10px] md:text-sm font-medium transition-all duration-300 rounded-md ${
              currChart === "income"
                ? "bg-richblack-700 text-yellow-50 shadow-sm"
                : "text-richblack-400 hover:text-richblack-5"
            }`}
          >
            Income
          </button>
        </div>
      </div>

      {/* Chart Section */}
      <div className="relative flex flex-1 items-center justify-center min-h-[250px] md:min-h-[350px] w-full">
        {courses.length > 0 ? (
          <>
            <Doughnut data={chartData} options={options} />
            {/* COMPACT CENTER LABEL */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-[10px] md:text-xs font-medium text-richblack-400 uppercase tracking-tighter md:tracking-widest">
                Total {currChart}
              </span>
              <span className="text-lg md:text-2xl font-bold text-richblack-5">
                {currChart === "income" ? "₹" : ""}
                {courses.reduce((acc, curr) => 
                  acc + (currChart === "students" ? curr.totalStudentsEnrolled : curr.totalAmountGenerated), 0
                ).toLocaleString()}
              </span>
            </div>
          </>
        ) : (
          <div className="text-center text-richblack-400 py-10">
            <p className="text-sm">No course data available.</p>
          </div>
        )}
      </div>
    </div>
  )
}