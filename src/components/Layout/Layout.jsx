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

  return (
    <div className="flex relative w-full h-full">
      <div className="hidden lg:block z-[100] lg:w-[230px]">
        <Sidebar2 />
      </div>

      {/* children */}
      <div
        className={`grow self-start flex flex-col  w-[calc(100vw-230px)]  ${
          mode === "light" ? "bg-gray-200" : "bg-[#201f1f] bg-opacity-100"
        }`}
      >
        <RiMenuUnfold2Fill
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
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
          mode === "light" ? "bg-gray-100" : "bg-slate-800"
        } absolute z-[1000] h-full w-60  transition-all duration-300 ease-in  ${
          isMobileNavOpen ? "left-0" : "-left-full"
        }`}
      >
        <div className="flex fixed justify-end w-60 z-[2000] p-2">
          <FaWindowClose
            className={mode === "light" ? "text-black" : "text-white"}
            onClick={() => setIsMobileNavOpen(false)}
          />
        </div>
        <div className="block lg:hidden w-60 h-full py-3 fixed">
          <MobileNav />
        </div>
      </div>
    </div>
  );
};

export default Layout;
