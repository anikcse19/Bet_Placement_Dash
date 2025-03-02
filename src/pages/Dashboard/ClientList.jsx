import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "../../../config";
import Layout from "../../components/Layout/Layout";
import useStore from "../../zustand/useStore";
import { Circles } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { IoSettings } from "react-icons/io5";

const ClientList = () => {
  const [clientList, setClientList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState({
    status: false,
    vlaue: {},
  });

  const navigate = useNavigate();

  const { mode } = useStore();
  // const mode = localStorage.getItem("mode");

  // get cookies value
  const token = Cookies.get("token");

  const fetchClientList = async () => {
    try {
      axios
        .get(`${baseUrl}/api/admin/clients`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res?.data?.status) {
            setClientList(res?.data?.data);
          }
        });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClientList();
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
  const handleClientDelete = async () => {
    try {
      axios
        .delete(`${baseUrl}/api/admin/clients/${isDeleteModalOpen.value.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res?.data?.status) {
            setIsDeleteModalOpen({ status: false, value: {} });
            toast.success("Successfully Deleted Client");
            fetchClientList();
          }
        });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <Layout>
      <div className="relative">
        <div className="mt-6 lg:mt-16 flex justify-between items-center">
          <h1
            className={`text-xl font-bold border-l-8 border-purple-600 px-3 py-2 ${
              mode === "light" ? "text-black" : "text-white"
            }`}
          >
            All Client List
          </h1>
          <button
            onClick={() => navigate("/dashboard/create-client")}
            className="bg-blue-50 border-2 border-black hover:border-blue-400 hover:text-slate-700-400 transition-all duration-300 ease-in px-8 py-1 rounded-md"
          >
            Create New
          </button>
        </div>

        {/* users table */}
        <div className="relative overflow-x-auto max-h-screen overflow-y-auto my-5">
          <table className="w-full text-sm text-left rtl:text-right text-white  border-l-2 border-r-2 border-black">
            <thead
              className={`sticky top-0 text-xs  uppercase ${
                mode === "light"
                  ? "bg-blue-300 text-black"
                  : "bg-black text-white"
              }  border-b-2 border-t-2 border-black rounded-md`}
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
                <th scope="col" className="px-6 py-3 text-left">
                  Setting
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
              ) : clientList?.length <= 0 ? (
                <tr className="text-center text-sm">
                  <td colSpan={7} align="center">
                    <p className="py-2 text-red-500">No data to show.</p>
                  </td>
                </tr>
              ) : (
                clientList &&
                clientList?.length > 0 &&
                clientList?.map((user, i) => (
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
                    }  text-sm cursor-pointer transition-all duration-500 ease-in  border-b-2 border-slate-700`}
                  >
                    <td className="px-6 py-4 text-left text-xs">{i + 1}</td>
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
                    <td className="px-6 py-4 text-left whitespace-nowrap">
                      <IoSettings
                        onClick={() =>
                          navigate(`/dashboard/client/settings/${user.id}`)
                        }
                        className="text-xl"
                      />
                    </td>

                    <td className="px-6 py-4 flex justify-center text-sm">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            navigate(`/dashboard/client/update/${user.id}`)
                          }
                          className="bg-blue-200 hover:bg-blue-300 text-blue-600 px-3 py-0.5 rounded-md"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            setIsDeleteModalOpen({ status: true, value: user })
                          }
                          className="bg-red-200 hover:bg-red-300 text-red-600 px-3 py-0.5 rounded-md"
                        >
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

        {/* delete modal */}
        {isDeleteModalOpen.status && (
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
                  onClick={handleClientDelete}
                  className="bg-green-500 px-6 py-1 rounded-md text-white"
                >
                  Yes
                </button>
                <button
                  onClick={() =>
                    setIsDeleteModalOpen({ status: false, value: {} })
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

export default ClientList;
