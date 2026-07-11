import React from "react";
import { useNavigate } from "react-router-dom";

function Error() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] w-full flex-col items-center justify-center bg-richblack-900 px-6 py-10 text-center">
      {/* Visual Element */}
      <div className="relative mb-8 flex items-center justify-center">
        <div className="absolute h-24 w-24 rounded-full bg-yellow-50 opacity-20 blur-2xl md:h-40 md:w-40"></div>
        <span className="text-6xl md:text-8xl animate-pulse">👨‍🍳</span>
      </div>

      {/* Text Content */}
      <div className="max-w-[800px] space-y-4">
        <h1 className="text-2xl font-bold text-richblack-5 sm:text-3xl md:text-5xl lg:text-6xl">
          Hold On! We are <span className="text-yellow-50">cooking</span> this feature for you.
        </h1>
        
        <p className="mx-auto max-w-[500px] text-base text-richblack-300 md:text-xl">
          We're working hard to get this section ready. Meanwhile, you can explore other parts of the platform.
        </p>
      </div>

      {/* Buttons - Stacked on Mobile, Side-by-side on Desktop */}
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <button
          onClick={() => navigate(-1)}
          className="w-full rounded-md border border-richblack-700 bg-richblack-800 px-6 py-3 font-semibold text-richblack-5 transition-all duration-200 hover:bg-richblack-700 sm:w-auto"
        >
          Go Back
        </button>
        
        <button
          onClick={() => navigate("/")}
          className="w-full rounded-md bg-yellow-50 px-6 py-3 font-semibold text-richblack-900 transition-all duration-200 hover:scale-95 active:scale-90 sm:w-auto shadow-[2px_2px_0px_rgba(255,255,255,0.18)]"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default Error;