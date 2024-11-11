/* eslint-disable react/prop-types */

import { RiMenuUnfold2Fill } from "react-icons/ri";
import useStore from "../../zustand/useStore";
import Sidebar2 from "../Shared/Sidebar";
import { useState } from "react";
import MobileNav from "../Shared/MobileNav";
import { FaWindowClose } from "react-icons/fa";

const Layout = ({ children }) => {
  const { mode } = useStore();
  // const mode = localStorage.getItem("mode");

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // console.log(isMobileNavOpen, "mb");

  return (
    <div className="flex bg-red-700 relative w-full h-full">
      <div className="hidden lg:block z-[100]">
        <Sidebar2 />
      </div>
      <div
        className={`grow self-start flex flex-col  lg:ml-[230px]  ${
          mode === "light" ? "bg-gray-200" : "bg-[#201f1f] bg-opacity-100"
        }`}
      >
        <RiMenuUnfold2Fill
          onClick={() => setIsMobileNavOpen(true)}
          className={`${
            mode === "light" ? "text-black" : "text-white"
          } text-2xl font-bold m-3 lg:hidden z-20`}
        />
        <div
          className={`p-5 flex-grow min-h-[100vh] flex flex-col content-center `}
        >
          {children}
        </div>
      </div>

      {/* mobile nav */}

      <div
        className={`${
          mode === "light" ? "bg-gray-100" : "bg-slate-950"
        } h-screen absolute z-50  transition-all duration-300 ease-in ${
          isMobileNavOpen ? "w-60" : "w-0 opacity-0"
        }`}
      >
        <div className="m-2 flex justify-end">
          <FaWindowClose
            className={mode === "light" ? "text-black" : "text-white"}
            onClick={() => setIsMobileNavOpen(false)}
          />
        </div>
        <div className="block lg:hidden h-full">
          <MobileNav />
        </div>
      </div>
    </div>
  );
};

export default Layout;
