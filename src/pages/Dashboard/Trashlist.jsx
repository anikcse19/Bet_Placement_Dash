import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "../../../config";
import Layout from "../../components/Layout/Layout";
import useStore from "../../zustand/useStore";
import { Circles } from "react-loader-spinner";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const TrashList = () => {
  const [trashedClientList, setTrashedClientList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState({
    status: false,
    value: {},
  });

  const { mode } = useStore();
  // const mode = localStorage.getItem("mode");

  // get cookies value
  const token = Cookies.get("token");

  const fetchTrashedClientList = async () => {
    try {
      axios
        .get(`${baseUrl}/api/admin/trashed-clients`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res?.data?.status) {
            setTrashedClientList(res?.data?.data);
          }
        });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrashedClientList();
  }, []);

  // console.log(usersList, "users");

  const formateDate = (marketDate) => {
    const localDate = new Date(marketDate).toLocaleString(undefined, {
      timeZoneName: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return localDate;
  };

  // delete client
  const handleClientRestore = async () => {
    try {
      await axios
        .get(
          `${baseUrl}/api/admin/restore-client/${isRestoreModalOpen.value.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res?.data?.status) {
            setIsRestoreModalOpen({ status: false, value: {} });
            toast.success("Successfully Restored Client");
            fetchTrashedClientList();
          }
        });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <Layout>
      <div className="relative">
        <div className="mt-6 lg:mt-16">
          <h1
            className={`text-xl font-bold border-l-8 border-purple-600 px-3 py-2 uppercase ${
              mode === "light" ? "text-black" : "text-white"
            }`}
          >
            Trashed Client List
          </h1>
        </div>

        {/* users table */}
        <div className="relative overflow-x-auto max-h-screen overflow-y-auto my-5">
          <table className="w-full text-sm text-left rtl:text-right text-white  ">
            <thead
              className={`sticky top-0 text-xs  uppercase ${
                mode === "light"
                  ? "bg-blue-300 text-black"
                  : "bg-black text-white"
              }  border-2  border-black rounded-md`}
            >
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left whitespace-nowrap"
                >
                  SL No
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left whitespace-nowrap"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left whitespace-nowrap"
                >
                  Client ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left whitespace-nowrap"
                >
                  Client Secret
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-left whitespace-nowrap"
                >
                  Client IP
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left whitespace-nowrap"
                >
                  Created At
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr className="text-center text-sm">
                  <td colSpan={7} align="center">
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
              ) : trashedClientList.length <= 0 ? (
                <tr className="text-center text-sm">
                  <td colSpan={7} align="center">
                    <div className="my-5 flex flex-col justify-center items-center ">
                      <p
                        className={
                          mode === "light" ? "text-black" : "text-white"
                        }
                      >
                        No data to show
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                trashedClientList &&
                trashedClientList?.length > 0 &&
                trashedClientList?.map((user, i) => (
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
                    <td className="px-6 py-4 text-left text-xs whitespace-nowrap">
                      {i + 1}
                    </td>
                    <td className="px-6 py-4 text-left text-xs whitespace-nowrap">
                      {user?.name}
                    </td>
                    <td className="px-6 py-4 text-left text-xs whitespace-nowrap">
                      {user?.clientId}
                    </td>
                    <td className="px-6 py-4 text-left text-xs whitespace-nowrap">
                      {user?.clientSecret}
                    </td>
                    <td className="px-6 py-4 text-left text-xs whitespace-nowrap">
                      {user?.clientIp}
                    </td>

                    <td className="px-6 py-4 text-left text-xs whitespace-nowrap">
                      {formateDate(user?.created_at)}
                    </td>

                    <td className="px-6 py-4 flex justify-center text-sm">
                      <button
                        onClick={() =>
                          setIsRestoreModalOpen({ status: true, value: user })
                        }
                        className="bg-teal-300 hover:bg-teal-400 text-teal-800 px-3 py-0.5 rounded-md"
                      >
                        Restore
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* restore modal */}
        {isRestoreModalOpen.status && (
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
              className={`text-center text-2xl font-bold ${
                mode === "light" ? "text-black" : "text-white"
              }`}
            >
              Are you sure ?
            </p>
            <div className="mt-10 flex justify-center">
              <div className="flex items-center gap-10">
                <button
                  onClick={handleClientRestore}
                  className="bg-green-500 px-6 py-1 rounded-md text-white"
                >
                  Yes
                </button>
                <button
                  onClick={() =>
                    setIsRestoreModalOpen({ status: false, value: {} })
                  }
                  className="bg-red-500 px-6 py-1 rounded-md text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TrashList;
