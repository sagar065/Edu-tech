import IconBtn from "./IconBtn"

export default function ConfirmationModal({ modalData }) {
  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-richblack-900 bg-opacity-10 backdrop-blur-sm transition-all duration-300">
      {/* Modal Card */}
      <div className="w-11/12 max-w-[380px] rounded-2xl border border-richblack-600 bg-richblack-800 p-8 shadow-2xl shadow-black/50">
        
        <h2 className="text-2xl font-bold text-richblack-5">
          {modalData?.text1}
        </h2>
        
        <p className="mt-3 mb-6 text-base leading-relaxed text-richblack-200">
          {modalData?.text2}
        </p>
        
        <div className="flex items-center justify-between gap-x-4">
          {/* Action Button (Delete/Confirm) */}
          <div className="flex-1">
            <IconBtn
              onClick={modalData?.btn1Handler}
              text={modalData?.btn1Text}
              customClasses="w-full justify-center py-2 px-5"
            />
          </div>
          
          {/* Secondary Button (Cancel) */}
          <button
            className="flex-1 cursor-pointer rounded-md bg-richblack-600 py-2 px-5 font-semibold text-richblack-50 hover:bg-richblack-700 transition-all duration-200"
            onClick={modalData?.btn2Handler}
          >
            {modalData?.btn2Text}
          </button>
        </div>
      </div>
    </div>
  )
}