/* eslint-disable react/prop-types */

import useStore from "../../zustand/useStore";
import Sidebar2 from "../Shared/Sidebar";

const Layout = ({ children }) => {
  const { mode } = useStore();
  return (
    <div className="flex">
      <Sidebar2 />
      <div className="grow self-start flex flex-col  ml-[230px] ">
        <div
          className={`p-5   flex-grow min-h-[100vh] ${
            mode === "light" ? "bg-gray-200" : "bg-[#201f1f] bg-opacity-100"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
