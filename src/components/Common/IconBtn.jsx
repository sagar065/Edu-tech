export default function IconBtn({
  text,
  onClick,
  children,
  disabled,
  outline = false,
  customClasses,
  type = "button",
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick} // Removed the console.log for production, simplified
      className={`flex items-center justify-center w-fit relative z-30 ${
        outline ? "border border-yellow-50 bg-transparent" : "bg-yellow-50"
      } cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 transition-all duration-200 active:scale-90 hover:scale-95 disabled:bg-richblack-500 disabled:cursor-not-allowed ${customClasses}`}
      type={type}
    >
      {children ? (
        /* REMOVED: pointer-events-none so mobile touches register correctly */
        <div className="flex items-center gap-x-2">
          <span className={`${outline ? "text-yellow-50" : "text-richblack-900"}`}>
            {text}
          </span>
          {children}
        </div>
      ) : (
        <span>{text}</span>
      )}
    </button>
  )
}