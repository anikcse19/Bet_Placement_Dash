/* eslint-disable react/prop-types */
import toast from "react-hot-toast";
import useStore from "../../zustand/useStore";
import Cookies from "js-cookie";
import axios from "axios";
import { baseUrl } from "../../../config";

const ShiftDeleteModal = ({
  id,
  setOpenDeleteShiftModal,
  fetchOfficeShifts,
}) => {
  const { mode } = useStore();

  const token = Cookies.get("token");

  // delete client
  const handleShiftDelete = async () => {
    try {
      axios
        .delete(`${baseUrl}/api/admin/hr/admin/shift/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res?.data?.status) {
            setOpenDeleteShiftModal({ status: false, id: "" });
            toast.success("Successfully Deleted Client");
            fetchOfficeShifts();
          }
        });
    } catch (error) {
      console.log(error, "error message");

      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <div
      style={{
        boxShadow:
          " rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
      }}
      className={`w-[90%] lg:w-[450px] h-[200px]  fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 p-5 rounded-md ${
        mode === "light" ? "bg-violet-100" : "bg-slate-700"
      }`}
    >
      <p
        className={`text-center text-lg md:text-2xl font-bold ${
          mode === "light" ? "text-black" : "text-white"
        }`}
      >
        Are you sure to deleting this shift?
      </p>
      <div className="mt-10 flex justify-center">
        <div className="flex items-center gap-10">
          <button
            onClick={handleShiftDelete}
            className="bg-teal-500 hover:bg-teal-400 px-6 py-1 rounded-md text-white"
          >
            Yes
          </button>
          <button
            onClick={() => setOpenDeleteShiftModal({ status: false, id: "" })}
            className="bg-red-500 hover:bg-red-400 px-6 py-1 rounded-md text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShiftDeleteModal;
