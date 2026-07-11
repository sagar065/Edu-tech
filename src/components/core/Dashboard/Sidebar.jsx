import { useState } from "react"
import { VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { sidebarLinks } from "../../../data/dashboard-links"
import { logout } from "../../../services/operations/authAPI"
import ConfirmationModal from "../../Common/ConfirmationModal"
import SidebarLink from "./SidebarLink"

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const { user, loading: profileLoading } = useSelector((state) => state.profile)
  const { loading: authLoading } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [confirmationModal, setConfirmationModal] = useState(null)

  if (profileLoading || authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <>
      {/* Mobile Overlay - Dims background when menu is open */}
      <div 
        className={`fixed inset-0 z-[100] bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar Container */}
      <div className={`
        fixed left-0 top-0 z-[101] flex h-screen w-[220px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10 transition-all duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:sticky md:top-[3.5rem] md:h-[calc(100vh-3.5rem)] md:translate-x-0 md:flex
      `}>
        
        <div className="flex flex-col">
          {sidebarLinks.map((link) => {
            // This line ensures Instructor see Instructor links, Students see Student links
            if (link.type && user?.accountType !== link.type) return null
            return (
              <SidebarLink 
                key={link.id} 
                link={link} 
                iconName={link.icon} 
                onClick={() => setIsSidebarOpen(false)} 
              />
            )
          })}
        </div>
        
        <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />
        
        <div className="flex flex-col">
          <SidebarLink 
            link={{ name: "Settings", path: "/dashboard/settings" }} 
            iconName="VscSettingsGear" 
            onClick={() => setIsSidebarOpen(false)}
          />
          
          <button
            onClick={() => {
              setIsSidebarOpen(false);
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setConfirmationModal(null),
              })
            }}
            className="px-8 py-2 text-sm font-medium text-richblack-300"
          >
            <div className="flex items-center gap-x-2">
              <VscSignOut className="text-lg" />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}