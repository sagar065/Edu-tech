import { RiEditBoxLine } from "react-icons/ri"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { formattedDate } from "../../../utils/dateFormatter"
import IconBtn from "../../Common/IconBtn"

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()

  const handleEdit = () => {
    console.log("Navigating to settings...");
    navigate("/dashboard/settings")
  }

  return (
    <div className="mx-auto w-full max-w-[1000px] py-4 md:py-10">
      <h1 className="mb-6 px-4 text-2xl font-medium text-richblack-5 md:mb-10 md:px-0 md:text-3xl">
        My Profile
      </h1>

      <div className="mx-4 flex flex-col gap-y-4 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-5 md:mx-0 md:p-8 md:px-12 shadow-sm">
        <div className="flex flex-col items-start gap-y-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-x-4">
            <img
              src={user?.image}
              alt={`profile-${user?.firstName}`}
              className="aspect-square w-[60px] rounded-full border-2 border-richblack-700 object-cover md:w-[78px]"
            />
            <div className="flex flex-col min-w-0">
              <p className="break-words text-lg font-semibold leading-tight text-richblack-5">
                {user?.firstName + " " + user?.lastName}
              </p>
              <p className="break-all text-sm text-richblack-300">
                {user?.email}
              </p>
            </div>
          </div>
          
          <IconBtn text="Edit" onClick={handleEdit}>
            <RiEditBoxLine />
          </IconBtn>
        </div>
      </div>

      <div className="my-6 mx-4 flex flex-col gap-y-4 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-5 md:mx-0 md:p-8 md:px-12">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-richblack-5">About</h2>
          <IconBtn text="Edit" onClick={handleEdit}>
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <p className={`${user?.additionalDetails?.about ? "text-richblack-5" : "text-richblack-400"} text-sm font-medium`}>
          {user?.additionalDetails?.about ?? "Write Something About Yourself"}
        </p>
      </div>

      <div className="my-6 mx-4 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-5 md:mx-0 md:p-8 md:px-12">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-richblack-5">Personal Details</h2>
          <IconBtn text="Edit" onClick={handleEdit}>
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 lg:max-w-[800px]">
          {[
            { label: "First Name", value: user?.firstName },
            { label: "Last Name", value: user?.lastName },
            { label: "Email", value: user?.email, class: "break-all" },
            { label: "Phone Number", value: user?.additionalDetails?.contactNumber ?? "Add Contact Number" },
            { label: "Gender", value: user?.additionalDetails?.gender ?? "Add Gender" },
            { label: "Date Of Birth", value: user?.additionalDetails?.dateOfBirth ? formattedDate(user?.additionalDetails?.dateOfBirth) : "Add Date Of Birth" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col gap-y-1">
              <p className="text-xs text-richblack-600">{item.label}</p>
              <p className={`text-sm font-medium text-richblack-5 ${item.class || ""}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}