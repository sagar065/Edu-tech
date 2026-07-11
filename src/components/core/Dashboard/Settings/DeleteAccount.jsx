import { useState } from "react"
import { FiTrash2 } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { deleteProfile } from "../../../../services/operations/SettingsAPI"
import ConfirmationModal from "../../../Common/ConfirmationModal"

export default function DeleteAccount() {
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  // State to control the visibility of the modal
  const [confirmationModal, setConfirmationModal] = useState(null)

  return (
    <>
      <div className="my-10 flex flex-col gap-x-6 rounded-xl border-[1px] border-pink-700 bg-pink-900/40 p-6 md:p-10 md:px-14 md:flex-row shadow-lg shadow-pink-900/20">
        {/* Icon Section */}
        <div className="flex aspect-square h-14 w-14 items-center justify-center rounded-full bg-pink-700 ring-4 ring-pink-800/50 mx-auto md:mx-0">
          <FiTrash2 className="text-3xl text-pink-100" />
        </div>

        {/* Content Section */}
        <div className="flex flex-col space-y-3 mt-5 md:mt-0 text-center md:text-left flex-1">
          <h2 className="text-xl font-bold text-richblack-5 tracking-wide">
            Delete Account
          </h2>
          
          <div className="w-full lg:w-4/5 space-y-1">
            <p className="text-pink-50 font-medium">
              Would you like to delete your account?
            </p>
            <p className="text-sm text-pink-200 leading-relaxed italic">
              This account may contain Paid Courses. Deleting your account is
              permanent and will remove all the content associated with it.
            </p>
          </div>
          
          <div className="pt-2">
            <button
              type="button"
              className="w-fit cursor-pointer text-base font-semibold text-pink-400 hover:text-pink-100 underline decoration-pink-700 underline-offset-4 transition-all duration-300 mx-auto md:mx-0 block"
              onClick={() =>
                setConfirmationModal({
                  text1: "Are you sure?",
                  text2: "Your account will be deleted permanently.",
                  btn1Text: "Delete",
                  btn2Text: "Cancel",
                  btn1Handler: () => dispatch(deleteProfile(token, navigate)),
                  btn2Handler: () => setConfirmationModal(null),
                })
              }
            >
              I want to delete my account.
            </button>
          </div>
        </div>
      </div>

      {/* Logic to show the modal */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}