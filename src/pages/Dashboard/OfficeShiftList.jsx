import { RiStickyNoteAddFill } from "react-icons/ri";
import Layout from "../../components/Layout/Layout";
import useStore from "../../zustand/useStore";
import axios from "axios";
import { baseUrl } from "../../../config";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { Circles } from "react-loader-spinner";
import CreateShiftModal from "../../components/Modal/CreateShiftModal";
import ShiftUpdateModal from "../../components/Modal/ShiftUpdateModal";

const OfficeShiftList = () => {
  const [officeShifts, setOfficeShifts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [openCreateShiftModal, setOpenCreateShiftModal] = useState(false);
  const [openUpdateShiftModal, setOpenUpdateShiftModal] = useState({
    status: false,
    id: "",
  });
  const { mode } = useStore();

  // get cookies value
  const token = Cookies.get("token");

  const fetchOfficeShifts = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/admin/hr/admin/shift`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        setOfficeShifts(response?.data?.data);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occured");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficeShifts();
  }, []);

  return (
    <Layout>
      <div className="mt-8">
        <h1
          className={`text-xl font-bold ${
            mode === "light" ? "text-slate-700" : "text-white"
          }`}
        >
          Office Shift
        </h1>
      </div>
      {/* cretae shift button */}
      <div className="flex justify-end">
        <button
          onClick={() => setOpenCreateShiftModal(true)}
          className={`${
            mode === "light"
              ? "bg-teal-400 text-white"
              : "bg-gray-300 text-black"
          } px-6 py-2 rounded-md flex items-center gap-3`}
        >
          <RiStickyNoteAddFill />
          <p>Create Shift</p>
        </button>
      </div>

      {/* table*/}
      <div className="flex flex-col items-center overflow-hidden p-3 my-5">
        {/* Users table */}
        <div className="self-start relative overflow-x-auto my-5 w-full">
          <table className="w-full text-xs sm:text-sm text-left text-white">
            <thead
              className={`sticky top-0 uppercase ${
                mode === "light"
                  ? "bg-blue-300 text-black"
                  : "bg-black text-white"
              } border-b-2 border-t-2 border-black`}
            >
              <tr>
                <th scope="col" className="px-3 sm:px-6 py-2 whitespace-nowrap">
                  SL
                </th>
                <th scope="col" className="px-3 sm:px-6 py-2 whitespace-nowrap">
                  shift name
                </th>
                <th scope="col" className="px-3 sm:px-6 py-2 whitespace-nowrap">
                  start time
                </th>
                <th scope="col" className="px-3 sm:px-6 py-2 whitespace-nowrap">
                  end time
                </th>
                <th scope="col" className="px-3 sm:px-6 py-2 whitespace-nowrap">
                  connected days
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-2 text-center whitespace-nowrap"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="w-full">
              {isLoading ? (
                <tr className="text-center text-sm">
                  <td colSpan={9} align="center">
                    <div className="my-5 flex flex-col justify-center items-center">
                      <Circles
                        height="50"
                        width="50"
                        color="#4fa94d"
                        ariaLabel="circles-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                      />
                    </div>
                  </td>
                </tr>
              ) : officeShifts?.length <= 0 ? (
                <tr>
                  <td colSpan={8} className="py-5 text-center">
                    <p
                      className={`${
                        mode === "light" ? "text-black" : "text-white"
                      }`}
                    >
                      No data to show
                    </p>
                  </td>
                </tr>
              ) : (
                officeShifts?.map((shift, i) => (
                  <tr
                    key={shift.id}
                    className={`${
                      i % 2 === 0
                        ? mode === "light"
                          ? "bg-white text-black"
                          : "bg-transparent text-white"
                        : mode === "light"
                        ? "bg-blue-100 text-black"
                        : "bg-black text-white"
                    } text-xs sm:text-sm transition-all duration-500 ease-in border-b-2 border-slate-700`}
                  >
                    <td className="px-3 sm:px-6 py-4">{i + 1}</td>
                    <td className="px-3 sm:px-6 py-4">{shift?.name}</td>
                    <td className="px-3 sm:px-6 py-4">{shift?.start_time}</td>
                    <td className="px-3 sm:px-6 py-4 ">{shift?.end_time}</td>
                    <td className="px-3 sm:px-6 py-4">
                      {shift?.connected_days}
                    </td>
                    <td className="px-3 sm:px-6 py-4 flex justify-center">
                      <div className="flex items-center gap-3">
                        <button
                          // onClick={() =>
                          //   setOpenUpdateShiftModal({
                          //     status: true,
                          //     id: shift?.id,
                          //   })
                          // }
                          className="bg-teal-500 px-4 py-1 rounded"
                        >
                          Update
                        </button>
                        <button className="bg-red-500 px-4 py-1 rounded">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* modal */}
      {openCreateShiftModal && (
        <CreateShiftModal
          setOpenCreateShiftModal={setOpenCreateShiftModal}
          fetchOfficeShifts={fetchOfficeShifts}
        />
      )}

      {openUpdateShiftModal.status && (
        <ShiftUpdateModal
          id={openUpdateShiftModal?.id}
          fetchOfficeShifts={fetchOfficeShifts}
          setOpenUpdateShiftModal={setOpenUpdateShiftModal}
        />
      )}
    </Layout>
  );
};

export default OfficeShiftList;
