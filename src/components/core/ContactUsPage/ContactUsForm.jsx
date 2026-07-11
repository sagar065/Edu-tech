import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import CountryCode from "../../../data/countrycode.json"
import { apiConnector } from "../../../services/apiConnector"
import { contactusEndpoint } from "../../../services/apis"

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm()

  const submitContactForm = async (data) => {
    try {
      setLoading(true)
      const res = await apiConnector(
        "POST",
        contactusEndpoint.CONTACT_US_API,
        data
      )
      
      if(res.data.success) {
        toast.success("Message sent successfully!")
      } else {
        toast.error("Something went wrong. Please try again.")
      }
      
      setLoading(false)
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
      toast.error("Failed to send message. Server error.")
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstname: "",
        lastname: "",
        message: "",
        phoneNo: "",
        countrycode: "+91"
      })
    }
  }, [reset, isSubmitSuccessful])

  return (
    <form
      className="flex flex-col gap-7"
      onSubmit={handleSubmit(submitContactForm)}
    >
      <div className="flex flex-col gap-5 lg:flex-row">
        {/* First Name */}
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="firstname" className="lable-style text-white">
            First Name
          </label>
          <input
            type="text"
            id="firstname"
            placeholder="Enter first name"
            className="form-style bg-richblack-800 p-3 rounded-md text-white"
            {...register("firstname", { required: true })}
          />
          {errors.firstname && (
            <span className="-mt-1 text-[12px] text-yellow-100">
              Please enter your first name.
            </span>
          )}
        </div>

        {/* Last Name */}
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="lastname" className="lable-style text-white">
            Last Name
          </label>
          <input
            type="text"
            id="lastname"
            placeholder="Enter last name"
            className="form-style bg-richblack-800 p-3 rounded-md text-white"
            {...register("lastname")}
          />
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="lable-style text-white">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter email address"
          className="form-style bg-richblack-800 p-3 rounded-md text-white"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <span className="-mt-1 text-[12px] text-yellow-100">
            Please enter your email address.
          </span>
        )}
      </div>

      {/* Phone Number */}
      <div className="flex flex-col gap-2">
        <label htmlFor="phonenumber" className="lable-style text-white">
          Phone Number
        </label>

        <div className="flex gap-5">
          <div className="flex w-[81px] flex-col gap-2">
            <select
              id="countrycode"
              className="form-style bg-richblack-800 p-3 rounded-md text-white"
              {...register("countrycode", { required: true })}
            >
              {CountryCode.map((ele, i) => (
                <option key={i} value={ele.code}>
                  {ele.code} - {ele.country}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-[calc(100%-90px)] flex-col gap-2">
            <input
              type="number"
              id="phonenumber"
              placeholder="12345 67890"
              className="form-style bg-richblack-800 p-3 rounded-md text-white"
              {...register("phoneNo", {
                required: {
                  value: true,
                  message: "Please enter your Phone Number.",
                },
                maxLength: { value: 12, message: "Invalid Phone Number" },
                minLength: { value: 10, message: "Invalid Phone Number" },
              })}
            />
          </div>
        </div>
        {errors.phoneNo && (
          <span className="-mt-1 text-[12px] text-yellow-100">
            {errors.phoneNo.message}
          </span>
        )}
      </div>

      {/* Message */}
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="lable-style text-white">
          Message
        </label>
        <textarea
          id="message"
          cols="30"
          rows="7"
          placeholder="Enter your message here"
          className="form-style bg-richblack-800 p-3 rounded-md text-white"
          {...register("message", { required: true })}
        />
        {errors.message && (
          <span className="-mt-1 text-[12px] text-yellow-100">
            Please enter your message.
          </span>
        )}
      </div>

      <button
        disabled={loading}
        type="submit"
        className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
         ${
           !loading &&
           "transition-all duration-200 hover:scale-95 hover:shadow-none"
         } disabled:bg-richblack-500 sm:text-[16px] `}
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  )
}

export default ContactUsForm