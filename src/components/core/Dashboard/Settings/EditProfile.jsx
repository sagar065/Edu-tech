import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { updateProfile } from "../../../../services/operations/SettingsAPI"
import IconBtn from "../../../Common/IconBtn"

export default function EditProfile() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      dateOfBirth: user?.additionalDetails?.dateOfBirth || "",
      gender: user?.additionalDetails?.gender || "",
      contactNumber: user?.additionalDetails?.contactNumber || "",
      about: user?.additionalDetails?.about || "",
    },
  })

  const onSubmit = async (data) => {
    try {
      dispatch(updateProfile(token, data))
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
        <h2 className="text-lg font-semibold text-richblack-5">
          Profile Information
        </h2>

        {/* Row 1: Names */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="firstName" className="text-richblack-5 text-sm">First Name</label>
            <input
              type="text"
              id="firstName"
              className="rounded-md bg-richblack-700 p-3 text-richblack-5"
              {...register("firstName", { required: true })}
            />
          </div>
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="lastName" className="text-richblack-5 text-sm">Last Name</label>
            <input
              type="text"
              id="lastName"
              className="rounded-md bg-richblack-700 p-3 text-richblack-5"
              {...register("lastName", { required: true })}
            />
          </div>
        </div>

        {/* Row 2: DOB and Gender */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="dateOfBirth" className="text-richblack-5 text-sm">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              className="rounded-md bg-richblack-700 p-3 text-richblack-5"
              {...register("dateOfBirth", { required: true })}
            />
          </div>
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="gender" className="text-richblack-5 text-sm">Gender</label>
            <select
              id="gender"
              className="rounded-md bg-richblack-700 p-3 text-richblack-5"
              {...register("gender", { required: true })}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-Binary">Non-Binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Row 3: Contact Number and About */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="contactNumber" className="text-richblack-5 text-sm">Contact Number</label>
            <input
              type="tel"
              id="contactNumber"
              className="rounded-md bg-richblack-700 p-3 text-richblack-5"
              {...register("contactNumber", { required: true, maxLength: 12, minLength: 10 })}
            />
          </div>
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="about" className="text-richblack-5 text-sm">About</label>
            <input
              type="text"
              id="about"
              className="rounded-md bg-richblack-700 p-3 text-richblack-5"
              {...register("about", { required: true })}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-x-2">
        <button
          type="button"
          onClick={() => navigate("/dashboard/my-profile")}
          className="rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
        >
          Cancel
        </button>
        <IconBtn type="submit" text="Save" />
      </div>
    </form>
  )
}