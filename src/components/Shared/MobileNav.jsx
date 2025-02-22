import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ProfileOutlined } from "@ant-design/icons";
import { VscOutput } from "react-icons/vsc";
import {
  FaChevronDown,
  FaChevronUp,
  FaTrash,
  FaUsersCog,
} from "react-icons/fa";
import { IoMdPersonAdd } from "react-icons/io";
import useStore from "../../zustand/useStore";
import { useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../config";
import { FaUsersViewfinder } from "react-icons/fa6";
import { TbUsersPlus } from "react-icons/tb";
import { PiBuildingOfficeBold, PiTimerBold } from "react-icons/pi";
import { HiHand } from "react-icons/hi";

const MobileNav = () => {
  const [isOpenSubMenuItem, setIsOpenSubMenuItem] = useState({
    status: true,
    id: "Settlement",
  });
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();

  // get cookies value
  const role = parseInt(Cookies.get("role"));
  const token = Cookies.get("token");
  const userNmae = Cookies.get("username");

  // get store vlaue
  const { mode, toggleMode } = useStore();

  const menuItemsData = [
    {
      title: "Settlement",
      label: "settlement",
      icon: <ProfileOutlined />,
      // link: "/dashboard/settlement/unsettle-bet",
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
      label: "bets",
      icon: <ProfileOutlined />,
      // link: "/dashboard/bets/bet-list",
      active: true,
      subItems: [
        {
          title: "Bet List",
          link: "/dashboard/bets/bet-list",
          active: false,
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
      label: "match-results",
      icon: <VscOutput />,
      link: "/dashboard/match-results",
      active: false,
    },
    {
      title: "Racing Results",
      label: "racing-results",
      icon: <VscOutput />,
      link: "/dashboard/racing-results",
      active: false,
    },
    ...(role === 2
      ? [
          {
            title: "My Attendance",
            label: "my-attendance",
            icon: <HiHand />,
            link: "/dashboard/my-attendance",
            active: false,
          },
        ]
      : []),
    ...(role === 1
      ? [
          {
            title: "User List",
            label: "users-list",
            icon: <FaUsersCog />,
            link: "/dashboard/users-list",
            active: false,
          },
          {
            title: "Office Shift",
            label: "office-shift",
            icon: <PiBuildingOfficeBold />,
            link: "/dashboard/office-shift",
            active: false,
          },
          {
            title: "Users Shift",
            label: "users-shifts",
            icon: <PiTimerBold />,
            link: "/dashboard/users-shifts",
            active: false,
          },
          {
            title: "Create User",
            label: "create-user",
            icon: <IoMdPersonAdd />,
            link: "/dashboard/create-user",
            active: false,
          },
          {
            title: "Client List",
            label: "client-list",
            icon: <FaUsersViewfinder />,
            link: "/dashboard/client-list",
            active: false,
          },
          {
            title: "Create Client",
            label: "create-client",
            icon: <TbUsersPlus />,
            link: "/dashboard/create-client",
            active: false,
          },
          {
            title: "Users Attendance",
            label: "users-attendance",
            icon: <HiHand />,
            link: "/dashboard/users-attendance",
            active: false,
          },
          {
            title: "Trash List",
            label: "trash-list",
            icon: <FaTrash />,
            link: "/dashboard/trash-list",
            active: false,
          },
        ]
      : []),
  ];
  return (
    <div className="flex flex-col gap-y-5 h-full overflow-y-auto">
      {/* logo */}
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

      <div className="flex-grow flex flex-col justify-between">
        {/* menu */}
        <div className="flex flex-col gap-y-3 p-2">
          {menuItemsData?.map((menu) => (
            <div key={menu?.title}>
              <div
                onClick={() => navigate(menu?.link)}
                className={`${
                  mode === "light"
                    ? `text-black ${
                        pathname
                          .toLowerCase()
                          .includes(menu?.label.toLowerCase()) && "bg-gray-400"
                      } `
                    : `text-white ${
                        pathname
                          .toLowerCase()
                          .includes(menu?.label.toLowerCase()) && "bg-slate-700"
                      } `
                } flex items-center justify-between p-2 rounded-md`}
              >
                <div className="flex items-center gap-x-2">
                  {menu?.icon}
                  <p>{menu?.title}</p>
                </div>
                <div>
                  {menu?.subItems &&
                    (isOpenSubMenuItem.status &&
                    isOpenSubMenuItem.id === menu?.id ? (
                      <FaChevronUp
                        onClick={() =>
                          setIsOpenSubMenuItem({ status: false, id: "" })
                        }
                        className=""
                      />
                    ) : (
                      <FaChevronDown
                        onClick={() =>
                          setIsOpenSubMenuItem({
                            status: true,
                            id: menu?.title,
                          })
                        }
                        className=""
                      />
                    ))}
                </div>
              </div>

              {/* subItems */}
              {isOpenSubMenuItem.status &&
                isOpenSubMenuItem.id === menu.title && (
                  <div className="w-full h-fit py-2 px-8  flex flex-col gap-y-4">
                    {menu.subItems.map((subItem, i) => (
                      <div
                        className={` ${
                          pathname.includes(subItem?.link) &&
                          "border-l-4 border-green-400"
                        } px-2 ${
                          mode === "light" ? "text-black" : "text-white"
                        }`}
                        key={i}
                        onClick={() => navigate(subItem?.link)}
                      >
                        {subItem?.title}
                      </div>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>

        {/* footer */}
        <div className="flex flex-col items-center gap-y-5 px-3 mt-8 lg:mt-0">
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
              mode === "light"
                ? "bg-black text-white"
                : "bg-slate-500 text-white"
            } opacity-90 cursor-pointer  font-bold flex justify-center py-2 rounded-xl`}
          >
            <p>Logout</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
