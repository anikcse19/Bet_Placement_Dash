import { ProfileOutlined } from "@ant-design/icons";

import { useEffect, useState } from "react";

import { FaAngleDown, FaTrash, FaUsersCog } from "react-icons/fa";
import Cookies from "js-cookie";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import useStore from "../../zustand/useStore";
import { VscOutput } from "react-icons/vsc";
import { IoMdPersonAdd } from "react-icons/io";
import axios from "axios";
import { baseUrl } from "../../../config";
import useStore from "../../zustand/useStore";
import { FaUsersViewfinder } from "react-icons/fa6";
import { TbUsersPlus } from "react-icons/tb";
import { PiBuildingOfficeBold } from "react-icons/pi";

const Sidebar2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const { mode, toggleMode } = useStore();

  // get Cookies value
  const userNmae = Cookies.get("username");
  const token = Cookies.get("token");
  const role = parseInt(Cookies.get("role"));

  // Sidebar Menu Data

  const menuItemsData = [
    {
      title: "Settlement",
      icon: <ProfileOutlined />,
      link: "/dashboard/settlement/unsettle-bet",
      active: true,
      subItems: [
        {
          title: "Unsettle Bet",
          link: "/dashboard/settlement/unsettle-bet",
          active: true,
        },
        {
          title: "Settle bet",
          link: "/dashboard/settlement/settle-bet",
          active: false,
        },
      ],
    },
    {
      title: "Bets",
      icon: <ProfileOutlined />,
      link: "/dashboard/bets/bet-list",
      active: true,
      subItems: [
        {
          title: "Bet List",
          link: "/dashboard/bets/bet-list",
          active: true,
        },
        {
          title: "Live Bet",
          link: "/dashboard/bets/live-bet",
          active: false,
        },
      ],
    },
    {
      title: "Match Results",
      icon: <VscOutput />,
      link: "/dashboard/match-results",
      active: false,
    },
    ...(role === 1
      ? [
          {
            title: "Office Shift",
            icon: <PiBuildingOfficeBold />,
            link: "/dashboard/office-shift",
            active: false,
          },
          {
            title: "User List",
            icon: <FaUsersCog />,
            link: "/dashboard/users-list",
            active: false,
          },
          {
            title: "Create User",
            icon: <IoMdPersonAdd />,
            link: "/dashboard/create-user",
            active: false,
          },
          {
            title: "Client List",
            icon: <FaUsersViewfinder />,
            link: "/dashboard/client-list",
            active: false,
          },
          {
            title: "Create Client",
            icon: <TbUsersPlus />,
            link: "/dashboard/create-client",
            active: false,
          },
          {
            title: "Trash List",
            icon: <FaTrash />,
            link: "/dashboard/trash-list",
            active: false,
          },
        ]
      : []),
  ];

  const [menuItems, setMenuItems] = useState(menuItemsData);
  // const [isShowMenuItem, setIsShowMenuItem] = useState(false);

  useEffect(() => {
    const updatedMenuItems = menuItemsData.map((menuItem) => {
      if (menuItem.subItems) {
        const updatedSubItems = menuItem.subItems.map((subItem) => ({
          ...subItem,
          active: pathname === subItem.link,
        }));
        return {
          ...menuItem,
          active: updatedSubItems.some((subItem) => subItem.active),
          subItems: updatedSubItems,
        };
      }
      return {
        ...menuItem,
        active: pathname === menuItem.link,
      };
    });

    setMenuItems(updatedMenuItems);
  }, [pathname]);

  // Function to handle submenu item activation
  const handleSubMenuItemClick = (parentTitle, subItemTitle) => {
    const updatedSubMenuItems = menuItems.map((menuItem) => {
      if (menuItem.title === parentTitle) {
        return {
          ...menuItem,
          subItems: menuItem.subItems?.map((subItem) => {
            return {
              ...subItem,
              active: subItem.title === subItemTitle, // Activate only the clicked subItem
            };
          }),
          active: true, // Keep parent active
        };
      }
      return { ...menuItem }; // Keep others unchanged
    });
    setMenuItems(updatedSubMenuItems);
  };

  // Function to handle parent menu item activation
  const handleMenuItemClick = (title) => {
    const updatedMenuItems = menuItems.map((menuItem) => {
      if (menuItem.title === title) {
        if (menuItem.subItems && menuItem.subItems.length > 0) {
          const updatedSubItems = menuItem.subItems.map((subItem, index) => {
            return { ...subItem, active: index === 0 };
          });
          return {
            ...menuItem,
            active: !menuItem.active,
            subItems: updatedSubItems,
          };
        }
        return { ...menuItem, active: !menuItem.active };
      }

      return { ...menuItem, active: false };
    });

    setMenuItems(updatedMenuItems);
  };

  return (
    <div
      className={`sidebar fixed flex lg:w-[230px] h-full overflow-y-auto flex-col justify-between gap-12 px-[18px] py-6 ${
        mode === "light" ? "bg-white" : "bg-[#272727] text-white"
      }`}
    >
      <div className="flex flex-col gap-[30px]">
        <div className="flex flex-col items-center gap-1.5 ">
          <Link className="flex items-center gap-x-2" to="">
            <img
              src="/logo.png"
              width={130}
              height={130}
              alt="logo"
              className="object-cover"
            />
          </Link>
        </div>

        <div className="flex flex-col gap-[18px]">
          {/* Sidebar Menu */}
          <div className="flex flex-col gap-1.5">
            <h4
              className={`text-[10px] font-bold ${
                mode === "light" ? "text-[#929292]" : "text-gray-200"
              }`}
            >
              MENU
            </h4>
            {menuItems.map((menuItem) => (
              <div key={menuItem.title} className="flex flex-col">
                <Link
                  to={menuItem.link}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-md ${
                    menuItem.active
                      ? mode === "light"
                        ? "bg-[#E3E3FD]"
                        : "bg-slate-700"
                      : ""
                  } px-1.5 py-2.5`}
                  onClick={() => handleMenuItemClick(menuItem.title)} // Click to toggle parent active
                >
                  <div className="flex gap-1.5">
                    {menuItem.icon}
                    <p
                      className={`text-xs font-bold leading-[18px] ${
                        mode === "light" ? "text-[#161616]" : "text-white"
                      }`}
                    >
                      {menuItem.title}
                    </p>
                  </div>

                  {menuItem.subItems && (
                    <FaAngleDown
                      className={`${menuItem.active ? "rotate-180" : ""} ${
                        mode === "light" ? "text-black" : "text-white"
                      }`}
                    />
                  )}
                </Link>

                {/* Render SubItems if parent is active */}
                {menuItem.subItems &&
                  menuItem.active &&
                  menuItem.subItems.map((subItem) => (
                    <Link key={subItem.title} to={subItem.link}>
                      <div
                        className="relative my-2.5 flex w-full cursor-pointer items-center gap-1.5 rounded-md px-1.5"
                        onClick={() =>
                          handleSubMenuItemClick(menuItem.title, subItem.title)
                        }
                      >
                        <div
                          className={`absolute left-3 top-0 h-full w-0.5 ${
                            subItem.active
                              ? mode === "light"
                                ? "bg-[#000091]"
                                : "bg-[#8282e0]"
                              : ""
                          }`}
                        />
                        <p
                          className={`pl-5 text-xs font-bold leading-[18px] ${
                            subItem.active
                              ? mode === "light"
                                ? "text-[#000091]"
                                : "text-[#8282e0]"
                              : mode === "light"
                              ? "text-[#161616]"
                              : "text-white"
                          }`}
                        >
                          {subItem.title}
                        </p>
                      </div>
                    </Link>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-y-5">
        <div
          className={`flex items-center  rounded-2xl overflow-hidden border-2 border-slate-700 ${
            mode === "light" ? "bg-gray-100" : "bg-slate-600"
          }`}
        >
          <p
            onClick={() => {
              // localStorage.setItem("mode", "dark");
              // setMode("dark");
              toggleMode();
            }}
            className={`px-4 py-1 cursor-pointer transition-all duration-300 ease-in ${
              mode === "dark" && "bg-blue-200 text-blue-900 font-bold "
            }`}
          >
            Dark
          </p>
          <p
            onClick={() => {
              // localStorage.setItem("mode", "light");
              // setMode("light");
              toggleMode();
            }}
            className={`px-4 py-1 cursor-pointer transition-all duration-300 ease-in ${
              mode === "light" && "bg-blue-200 text-blue-900 font-bold "
            }`}
          >
            Light
          </p>
        </div>
        <div className="flex flex-col justify-center items-center gap-y-3">
          {/* <img
            className="w-10 h-10 rounded-full"
            src="/images/profilePicIcon.png"
            alt=""
          /> */}
          <p className={mode === "light" ? "text-black" : "text-white"}>
            {userNmae}
          </p>
        </div>
        <div
          onClick={() => {
            navigate("/login");
            Cookies.remove("token");
            Cookies.remove("username");
            Cookies.remove("role");
            axios.post(
              `${baseUrl}/api/admin/logout`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          }}
          className={`w-full ${
            mode === "light" ? "bg-black text-white" : "bg-slate-500 text-white"
          } opacity-90 cursor-pointer  font-bold flex justify-center py-2 rounded-xl`}
        >
          <p>Logout</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar2;
