import React from "react";
import { FooterLink2 } from "../../data/footer-links";
import { Link } from "react-router-dom";

// Images
import Logo from "../../assets/Logo/Logo-Full-Light.png";

// Icons
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa";

const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"];
const Resources = [
  "Articles", "Blog", "Chart Sheet", "Code challenges",
  "Docs", "Projects", "Videos", "Workspaces",
];
const Plans = ["Paid memberships", "For students", "Business solutions"];
const Community = ["Forums", "Chapters", "Events"];

const FooterLink = ({ to, children }) => (
  <Link 
    to={to} 
    onClick={() => window.scrollTo(0, 0)} // Immediate scroll for mobile UX
    className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
  >
    {children}
  </Link>
);

const Footer = () => {
  return (
    <footer className="bg-richblack-800 py-14">
      <div className="w-11/12 max-w-maxContent mx-auto text-richblack-400">
        
        {/* Main Section */}
        <div className="flex flex-col lg:flex-row border-b border-richblack-700 pb-10 gap-10">
          
          {/* LEFT SIDE: Company, Resources, Plans, Community */}
          <div className="lg:w-[50%] flex flex-col gap-10 lg:border-r lg:border-richblack-700 lg:pr-10">
            
            {/* Top Row: Company and Resources side-by-side on Mobile */}
            <div className="flex flex-row justify-between w-full">
                {/* Column 1: Company */}
                <div className="w-[48%] md:w-[33%] flex flex-col gap-3">
                  <img src={Logo} alt="Logo" className="object-contain w-32" />
                  <h2 className="text-richblack-50 font-semibold text-base mt-2">Company</h2>
                  <div className="flex flex-col gap-2">
                      {["About", "Careers", "Affiliates"].map((ele) => (
                      <FooterLink key={ele} to={ele.toLowerCase()}>{ele}</FooterLink>
                      ))}
                  </div>
                  <div className="flex gap-3 text-lg mt-1">
                      <FaFacebook className="hover:text-richblack-50 cursor-pointer" />
                      <FaGoogle className="hover:text-richblack-50 cursor-pointer" />
                      <FaTwitter className="hover:text-richblack-50 cursor-pointer" />
                      <FaYoutube className="hover:text-richblack-50 cursor-pointer" />
                  </div>
                </div>

                {/* Column 2: Resources */}
                <div className="w-[48%] md:w-[33%] flex flex-col gap-3">
                  <h2 className="text-richblack-50 font-semibold text-base">Resources</h2>
                  <div className="flex flex-col gap-2">
                      {Resources.map((ele) => (
                      <FooterLink key={ele} to={ele.split(" ").join("-").toLowerCase()}>{ele}</FooterLink>
                      ))}
                  </div>
                  <h2 className="text-richblack-50 font-semibold text-base mt-4">Support</h2>
                  <FooterLink to="/help-center">Help Center</FooterLink>
                </div>
            </div>

            {/* Bottom Row: Plans and Community side-by-side on Mobile */}
            <div className="flex flex-row justify-between w-full">
                <div className="w-[48%] md:w-[33%] flex flex-col gap-3">
                    <h2 className="text-richblack-50 font-semibold text-base">Plans</h2>
                    <div className="flex flex-col gap-2">
                        {Plans.map((ele) => (
                        <FooterLink key={ele} to={ele.split(" ").join("-").toLowerCase()}>{ele}</FooterLink>
                        ))}
                    </div>
                </div>

                <div className="w-[48%] md:w-[33%] flex flex-col gap-3">
                    <h2 className="text-richblack-50 font-semibold text-base">Community</h2>
                    <div className="flex flex-col gap-2">
                        {Community.map((ele) => (
                        <FooterLink key={ele} to={ele.split(" ").join("-").toLowerCase()}>{ele}</FooterLink>
                        ))}
                    </div>
                </div>
                {/* Hidden space holder to maintain 3-column look on Tablet/Desktop */}
                <div className="hidden md:block md:w-[33%]"></div>
            </div>
          </div>

          {/* RIGHT SIDE: Subjects, Languages, Career Building */}
          {/* Using grid here because these lists are more uniform */}
          <div className="lg:w-[50%] grid grid-cols-2 md:grid-cols-3 gap-8 lg:pl-10">
            {FooterLink2.map((section, i) => (
              <div key={i} className="flex flex-col gap-3">
                <h2 className="text-richblack-50 font-semibold text-base">
                  {section.title}
                </h2>
                <div className="flex flex-col gap-2">
                  {section.links.map((link, index) => (
                    <FooterLink key={index} to={link.link}>
                      {link.title}
                    </FooterLink>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-10 gap-5 text-sm">
          <div className="flex flex-row items-center divide-x divide-richblack-700">
            {BottomFooter.map((ele, i) => (
              <div key={i} className="px-3 first:pl-0 hover:text-richblack-50 transition-all cursor-pointer">
                <Link to={ele.split(" ").join("-").toLowerCase()}>{ele}</Link>
              </div>
            ))}
          </div>
          <div className="text-center text-richblack-400">
            Made with ❤️ By Sagar Singh | &copy; 2026-2027 | All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;