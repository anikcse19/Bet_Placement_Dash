/* eslint-disable react/prop-types */

import Sidebar2 from "../Shared/Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar2 />
      <div className="grow self-start flex flex-col  ml-[230px] ">
        <div className="p-5  bg-gray-100 flex-grow min-h-[100vh]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
