import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Footer from "../components/Common/Footer";
import CourseCard from "../components/core/Catalog/CourseCard";
import CourseSlider from "../components/core/Catalog/CourseSlider";
import { apiConnector } from "../services/apiConnector";
import { categories } from "../services/apis";
import { getCatalogPageData } from "../services/operations/pageAndComponntDatas";
import Error from "./Error";

function Catalog() {
  const { loading: profileLoading } = useSelector((state) => state.profile);
  const { catalogName } = useParams();

  const [active, setActive] = useState(1);
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState(false);

  // Fetch Category ID
  useEffect(() => {
    const fetchCategoryId = async () => {
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        const matchedCategory = res?.data?.data?.find(
          (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
        );

        if (matchedCategory) {
          setCategoryId(matchedCategory._id);
          setError(false);
        } else {
          console.log("Category not found:", catalogName);
          setError(true);
        }
      } catch (err) {
        console.error("Could not fetch categories:", err);
        setError(true);
      }
    };

    fetchCategoryId();
  }, [catalogName]);

  // Fetch Catalog Data
  useEffect(() => {
    if (!categoryId) return;

    const fetchCatalogData = async () => {
      try {
        const res = await getCatalogPageData(categoryId);

        if (res.success) {
          setCatalogPageData(res);
          setError(false);
        } else {
          console.log("Catalog API returned failure");
          setError(true);
        }
      } catch (err) {
        console.error("Could not fetch catalog data:", err);
        setError(true);
      }
    };

    fetchCatalogData();
  }, [categoryId]);

  // Show loader while fetching
  if (profileLoading || (!catalogPageData && !error)) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  // Show error page if category or data fetch failed
  if (error) {
    return <Error />;
  }

  // Fallback data to avoid breaking layout
  const selectedCategoryCourses =
    catalogPageData?.data?.selectedCategory?.courses || [];
  const differentCategoryCourses =
    catalogPageData?.data?.differentCategory?.courses || [];
  const mostSellingCourses = catalogPageData?.data?.mostSellingCourses || [];

  const selectedCategoryName =
    catalogPageData?.data?.selectedCategory?.name || "Category";
  const selectedCategoryDesc =
    catalogPageData?.data?.selectedCategory?.description || "";
  const differentCategoryName =
    catalogPageData?.data?.differentCategory?.name || "Other Category";

  return (
    <>
      {/* Hero Section */}
      <div className="box-content bg-richblack-800 px-4">
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent">
          <p className="text-sm text-richblack-300">
            Home / Catalog /{" "}
            <span className="text-yellow-25">{selectedCategoryName}</span>
          </p>
          <p className="text-3xl text-richblack-5">{selectedCategoryName}</p>
          <p className="max-w-[870px] text-richblack-200">{selectedCategoryDesc}</p>
        </div>
      </div>

      {/* Section 1: Courses to get you started */}
      <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Courses to get you started</div>
        <div className="my-4 flex border-b border-b-richblack-600 text-sm">
          <p
            className={`px-4 py-2 ${
              active === 1
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(1)}
          >
            Most Popular
          </p>
          <p
            className={`px-4 py-2 ${
              active === 2
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(2)}
          >
            New
          </p>
        </div>
        <div>
          {selectedCategoryCourses.length > 0 ? (
            <CourseSlider Courses={selectedCategoryCourses} />
          ) : (
            <p className="text-richblack-200">No courses available.</p>
          )}
        </div>
      </div>

      {/* Section 2: Top courses in another category */}
      <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Top courses in {differentCategoryName}</div>
        <div className="py-8">
          {differentCategoryCourses.length > 0 ? (
            <CourseSlider Courses={differentCategoryCourses} />
          ) : (
            <p className="text-richblack-200">No courses available.</p>
          )}
        </div>
      </div>

      {/* Section 3: Frequently Bought */}
      <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Frequently Bought</div>
        <div className="py-8">
          {mostSellingCourses.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {mostSellingCourses.slice(0, 4).map((course, i) => (
                <CourseCard course={course} key={i} Height={"h-[400px]"} />
              ))}
            </div>
          ) : (
            <p className="text-richblack-200">No courses available.</p>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Catalog;
