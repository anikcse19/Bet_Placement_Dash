/* eslint-disable react/prop-types */
import { useState } from "react";
import useStore from "../../zustand/useStore";
import axios from "axios";
import { baseUrl } from "../../../config";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const CreateShiftModal = ({ setOpenCreateShiftModal, fetchOfficeShifts }) => {
  const [shiftName, setShiftName] = useState("");
  const [startHour, setStartHour] = useState("");
  const [endHour, setEndHour] = useState("");
  const [startMinute, setStartMinute] = useState("");
  const [endMinute, setEndMinute] = useState("");
  const [connectedDays, setConnectedDays] = useState("");

  const { mode } = useStore();

  const token = Cookies.get("token");

  const handleCreateShift = async () => {
    const createShiftData = {
      name: shiftName,
      start_time: `${startHour}:${startMinute}`,
      end_time: `${endHour}:${endMinute}`,
      connected_days: connectedDays,
    };

    try {
      const response = await axios.post(
        `${baseUrl}/api/admin/hr/admin/shift`,
        createShiftData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response?.data?.status) {
        toast.success("Shift Created Successfully");
        fetchOfficeShifts();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error ocuured");
    } finally {
      setOpenCreateShiftModal(false);
    }
  };
  return (
    <div className="fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-full px-2 lg:px-0 lg:w-[50%] xl:w-[30%] mx-auto h-fit ">
      <div
        style={{
          boxShadow:
            " rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
        }}
        className={`w-full h-full  border-4 rounded-lg ${
          mode === "light"
            ? "border-slate-600 bg-white"
            : "bg-slate-600 border-white"
        } p-5`}
      >
        <p className="text-center font-bold text-blue-500 text-xl">
          Create Shift
        </p>

        {/* form */}
        <div className="my-8 w-full flex flex-col gap-y-2">
          {/*shift name */}
          <div className="w-full xl:w-[80%] mx-auto  relative">
            {/* <label htmlFor="name">Shift Name</label> */}
            <input
              onChange={(e) => setShiftName(e.target.value)}
              type="text"
              className={`w-full ${
                mode === "light"
                  ? "bg-gray-300 text-black"
                  : "bg-slate-800 text-white"
              } py-2 px-3 italic text-right outline-none border-b-2 rounded border-slate-600 focus:border-blue-600`}
            />
            <p
              className={`absolute top-[50%] left-3 -translate-y-1/2 italic ${
                mode === "light" ? "text-black" : "text-gray-400"
              }`}
            >
              Shift Name:
            </p>
          </div>
          {/* start time */}
          <div className="flex flex-col xl:flex-row xl:items-center gap-2 xl:gap-4 w-full xl:w-[80%] mx-auto">
            <div className="w-full relative">
              {/* <label htmlFor="name">Name</label> */}
              <input
                onChange={(e) => setStartHour(e.target.value)}
                type="text"
                className={`w-full ${
                  mode === "light"
                    ? "bg-gray-300 text-black"
                    : "bg-slate-800 text-white"
                } py-2 px-3 text-right italic outline-none border-b-2 rounded border-slate-600 focus:border-blue-600`}
              />
              <p
                className={`absolute top-[50%] left-3 -translate-y-1/2 italic ${
                  mode === "light" ? "text-black" : "text-gray-400"
                }`}
              >
                Start Hour:
              </p>
            </div>
            <div className="w-full relative">
              {/* <label htmlFor="name">Name</label> */}
              <input
                onChange={(e) => setStartMinute(e.target.value)}
                type="text"
                className={`w-full ${
                  mode === "light"
                    ? "bg-gray-300 text-black"
                    : "bg-slate-800 text-white"
                } py-2 px-3 text-right italic outline-none border-b-2 rounded border-slate-600 focus:border-blue-600`}
              />
              <p
                className={`absolute top-[50%] left-3 -translate-y-1/2 italic ${
                  mode === "light" ? "text-black" : "text-gray-400"
                }`}
              >
                Start Minute:
              </p>
            </div>
          </div>
          {/* end time */}
          <div className="flex flex-col xl:flex-row xl:items-center gap-2 xl:gap-4 w-full xl:w-[80%] mx-auto">
            <div className="w-full relative">
              {/* <label htmlFor="name">Name</label> */}
              <input
                onChange={(e) => setEndHour(e.target.value)}
                type="text"
                className={`w-full ${
                  mode === "light"
                    ? "bg-gray-300 text-black"
                    : "bg-slate-800 text-white"
                } py-2 px-3 text-right italic outline-none border-b-2 rounded border-slate-600 focus:border-blue-600`}
              />
              <p
                className={`absolute top-[50%] left-3 -translate-y-1/2 italic ${
                  mode === "light" ? "text-black" : "text-gray-400"
                }`}
              >
                End Hour:
              </p>
            </div>
            <div className="w-full relative">
              {/* <label htmlFor="name">Name</label> */}
              <input
                onChange={(e) => setEndMinute(e.target.value)}
                type="text"
                className={`w-full ${
                  mode === "light"
                    ? "bg-gray-300 text-black"
                    : "bg-slate-800 text-white"
                } py-2 px-3 text-right italic outline-none border-b-2 rounded border-slate-600 focus:border-blue-600`}
              />
              <p
                className={`absolute top-[50%] left-3 -translate-y-1/2 italic ${
                  mode === "light" ? "text-black" : "text-gray-400"
                }`}
              >
                End Minute:
              </p>
            </div>
          </div>
          {/* connected days */}
          <div className="w-full xl:w-[80%] mx-auto">
            <select
              onChange={(e) => setConnectedDays(e.target.value)}
              className={`w-full ${
                mode === "light"
                  ? "bg-gray-300 text-black"
                  : "bg-slate-800 text-white"
              } py-2 px-3 italic outline-none border-b-2 rounded border-slate-600 focus:border-blue-600`}
            >
              <option value="">Connected Days</option>
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          {/* create button */}
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={handleCreateShift}
              className="bg-teal-400 hover:bg-teal-500 px-6 py-2 rounded-md"
            >
              Create
            </button>
            <button
              onClick={() => setOpenCreateShiftModal(false)}
              className="bg-red-400 hover:bg-red-500 px-6 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateShiftModal;
