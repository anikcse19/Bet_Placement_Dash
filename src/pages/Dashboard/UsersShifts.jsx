import { useEffect, useState } from "react";
import { baseUrl } from "../../../config";
import Cookies from "js-cookie";
import Layout from "../../components/Layout/Layout";
import useStore from "../../zustand/useStore";
import axios from "axios";
import toast from "react-hot-toast";
import { Circles } from "react-loader-spinner";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const UsersShifts = () => {
  const [data, setData] = useState([]);
  const [weekdays, setWeekDays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const token = Cookies.get("token");
  const { mode } = useStore();
  const navigate = useNavigate();

  const fetchUsersAssignsData = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/admin/hr/admin/get-shifts-related-data`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res?.data?.status) {
        setWeekDays(res?.data?.WeekDays);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAssignsData();
  }, []);

  useEffect(() => {
    fetch(`${baseUrl}/api/admin/hr/admin/users-shift`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((result) => setData(result.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <Layout>
      <div className="mt-6 lg:mt-16">
        <h1
          className={`text-xl font-bold border-l-8 border-purple-600 px-3 py-2 ${
            mode === "light" ? "text-black" : "text-white"
          }`}
        >
          USER SHIFT
        </h1>
        <div className="flex justify-end my-3">
          <button
            onClick={() => navigate("/dashboard/assign-shift")}
            className={`${
              mode === "light"
                ? "bg-teal-400 hover:bg-teal-500 text-white"
                : "bg-gray-300 hover:bg-gray-400 text-black"
            } transition-all duration-300 ease-in px-3 py-2 rounded-md flex items-center gap-3`}
          >
            <MdOutlineCreateNewFolder />
            <p>Assign Shift</p>
          </button>
        </div>
      </div>
      <div className="relative overflow-x-auto max-h-screen overflow-y-auto my-5">
        <table className="w-full text-sm text-left rtl:text-right text-white ">
          <thead
            className={`sticky top-0 text-xs uppercase ${
              mode === "light"
                ? "bg-blue-300 text-black"
                : "bg-black text-white"
            } border-2 border-black rounded-md`}
          >
            <tr>
              <th scope="col" className="px-6 py-3 text-left">
                User Name
              </th>
              {weekdays.map((day) => (
                <th key={day.id} scope="col" className="px-6 py-3 text-left">
                  {day.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr className="text-center text-sm">
                <td colSpan={weekdays.length + 1} align="center">
                  <div className="my-5 flex flex-col justify-center items-center">
                    <Circles
                      height="50"
                      width="50"
                      color="#4fa94d"
                      ariaLabel="loading"
                    />
                  </div>
                </td>
              </tr>
            ) : data?.length <= 0 ? (
              <tr className="text-center text-sm">
                <td colSpan={weekdays.length + 1} align="center">
                  <p className="py-2 text-red-500">No data to show.</p>
                </td>
              </tr>
            ) : (
              data.map((user, i) => (
                <tr
                  key={user.id}
                  className={`${
                    i % 2 == 0
                      ? mode === "light"
                        ? "bg-white text-black"
                        : "bg-transparent text-white"
                      : mode === "light"
                      ? "bg-blue-100 text-black"
                      : "bg-black text-white"
                  }  text-sm cursor-pointer transition-all duration-500 ease-in  border-2 border-black`}
                >
                  <td className="px-6 py-4 text-left">{user.name}</td>
                  {user?.usershift?.map((shift) => (
                    <td key={shift.id} className="px-6 py-4 text-left">
                      {shift?.shift?.name}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default UsersShifts;
