import { ProfileOutlined } from "@ant-design/icons";

import { useEffect, useState } from "react";

import { FaAngleDown } from "react-icons/fa";
import Cookies from "js-cookie";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  // get Cookies value
  const userNmae = Cookies.get("username");

  // Sidebar Menu Data

  const menuItemsData = [
    {
      title: "Settlement",
      icon: <ProfileOutlined />,
      link: "/dashboard/settlement/unsettle-bet",
      active: false,
      subItems: [
        {
          title: "Unsettle Bet",
          link: "/dashboard/settlement/unsettle-bet",
          active: false,
        },
        {
          title: "Settle bet",
          link: "/dashboard/settlement/settle-bet",
          active: false,
        },
      ],
    },
  ];

  const [menuItems, setMenuItems] = useState(menuItemsData);
  const [isShowMenuItem, setIsShowMenuItem] = useState(false);

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
    <div className="sidebar flex min-w-[230px] h-full overflow-y-auto flex-col justify-between gap-12 rounded-l-xl bg-white px-[18px] py-6 fixed ">
      <div className="flex flex-col gap-[30px]">
        <div className="flex flex-col items-center gap-1.5 ">
          <Link className="flex items-center gap-x-2" to="/">
            {/* <img
              src="/images/logos/bondhuBuildersLogo.png"
              width={130}
              height={130}
              alt="logo"
              className="object-cover"
            /> */}
          </Link>
        </div>

        <div className="flex flex-col gap-[18px]">
          {/* Sidebar Menu */}
          <div className="flex flex-col gap-1.5">
            <h4 className="text-[10px] font-bold text-[#929292]">MENU</h4>
            {menuItems.map((menuItem) => (
              <div key={menuItem.title} className="flex flex-col">
                <Link
                  to={menuItem.link}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-md ${
                    menuItem.active ? "bg-[#E3E3FD]" : ""
                  } px-1.5 py-2.5`}
                  onClick={() => handleMenuItemClick(menuItem.title)} // Click to toggle parent active
                >
                  <div className="flex gap-1.5">
                    {menuItem.icon}
                    <p className="text-xs font-bold leading-[18px] text-[#161616]">
                      {menuItem.title}
                    </p>
                  </div>

                  {menuItem.subItems && (
                    <FaAngleDown
                      className={menuItem.active ? "rotate-180" : ""}
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
                            subItem.active ? "bg-[#000091]" : ""
                          }`}
                        />
                        <p
                          className={`pl-5 text-xs font-bold leading-[18px] ${
                            subItem.active ? "text-[#000091]" : "text-[#161616]"
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
        <div className="flex flex-col justify-center items-center gap-y-3">
          {/* <img
            className="w-10 h-10 rounded-full"
            src="/images/profilePicIcon.png"
            alt=""
          /> */}
          <p className="text-black">{userNmae}</p>
        </div>
        <div
          onClick={() => {
            navigate("/login");
            Cookies.remove("token");
            Cookies.remove("username");
          }}
          className="w-full bg-black opacity-90 cursor-pointer text-white font-bold flex justify-center py-2 rounded-xl"
        >
          <p>Logout</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar2;
