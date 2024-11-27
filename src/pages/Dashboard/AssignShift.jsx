import { Circles } from "react-loader-spinner";
import Layout from "../../components/Layout/Layout";
import useStore from "../../zustand/useStore";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../config";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const AssignShift = () => {
  const [usersData, setUsersData] = useState([]);
  const [shiftsData, setShiftsData] = useState([]);
  const [weekdays, setWeekDays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shiftAssignments, setShiftAssignments] = useState({});

  const token = Cookies.get("token");
  const { mode } = useStore();

  const fetchUsersAssignsData = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/admin/hr/admin/get-shifts-related-data`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res?.data?.status) {
        setUsersData(res?.data?.users);
        setShiftsData(res?.data?.shifts);
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

  // Handle shift change for a specific user and day
  const handleShiftChange = (userId, weekdayId, shiftId) => {
    setShiftAssignments((prev) => ({
      ...prev,
      [userId]: {
        ...(prev[userId] || {}),
        [weekdayId]: shiftId,
      },
    }));
  };

  // Prepare and submit the data to the API
  const handleSubmitShifts = async () => {
    const dataSet = Object.entries(shiftAssignments).map(
      ([userId, shifts]) => ({
        user_id: Number(userId),
        shiftdata: Object.entries(shifts).map(([weekdayId, shiftId]) => ({
          shift_id: shiftId,
          weekdays_id: Number(weekdayId),
        })),
      })
    );

    try {
      await axios.post(
        `${baseUrl}/api/admin/hr/admin/users-shift`,
        { dataSet },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Shifts assigned successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to assign shifts");
    }
  };

  return (
    <Layout>
      <div className="mt-6 lg:mt-16">
        <h1
          className={`text-xl font-bold border-l-8 border-purple-600 px-3 py-2 ${
            mode === "light" ? "text-black" : "text-white"
          }`}
        >
          ASSIGN SHIFT TO USER
        </h1>
      </div>

      {/* Users Table */}
      <div className="relative overflow-x-auto max-h-screen overflow-y-auto my-5">
        <table className="w-full text-sm text-left rtl:text-right text-white ">
          <thead
            className={`sticky top-0 text-xs uppercase ${
              mode === "light"
                ? "bg-blue-300 text-black"
                : "bg-black text-white"
            } border-2  border-black rounded-md`}
          >
            <tr>
              <th scope="col" className="px-6 py-3 text-center">
                User Name
              </th>
              {weekdays.map((day) => (
                <th key={day.id} scope="col" className="px-6 py-3 text-center">
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
            ) : (
              usersData.map((user, i) => (
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
                  }  text-sm cursor-pointer transition-all duration-500 ease-in  border-2 border-slate-700`}
                >
                  <td className="px-6 py-4 text-center">{user.name}</td>
                  {weekdays.map((day) => (
                    <td key={day.id} className="px-6 py-4 text-center">
                      <select
                        className={`${
                          mode === "light"
                            ? " text-black"
                            : "bg-slate-800 text-white"
                        } px-3 py-2 rounded-md cursor-pointer border-2 border-teal-500`}
                        onChange={(e) =>
                          handleShiftChange(
                            user.id,
                            day.id,
                            Number(e.target.value)
                          )
                        }
                        defaultValue={shiftAssignments[user.id]?.[day.id] || ""}
                      >
                        <option value="">Select Shift</option>
                        {shiftsData.map((shift) => (
                          <option key={shift.id} value={shift.id}>
                            {shift.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex justify-center my-4">
          <button
            onClick={handleSubmitShifts}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded"
          >
            Submit Shifts
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default AssignShift;
