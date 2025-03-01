import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "../../../config";
import Layout from "../../components/Layout/Layout";
import useStore from "../../zustand/useStore";
import { Circles } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { IoSettings } from "react-icons/io5";

const ClientSettings = () => {
  const [clientName, setClientName] = useState();
  const [clientSettingsList, setClientSettingsList] = useState([]);
  const [clientPermissionList, setClientPermissionList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState({
    status: false,
    vlaue: {},
  });
  const [isAddSettingModalOpen, setIsAddSettingModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState("");
  const [newSettingStatus, setNewSettingStatus] = useState(0);

  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;

  const { mode } = useStore();
  // const mode = localStorage.getItem("mode");

  // get cookies value
  const token = Cookies.get("token");

  const fetchClientSettingsList = async () => {
    try {
      axios
        .get(`${baseUrl}/api/admin/client-settings/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res?.data?.status) {
            setClientSettingsList(res?.data?.data);
          }
        });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllClientList = async () => {
    try {
      axios
        .get(`${baseUrl}/api/admin/clients`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res?.data?.status) {
            const clientName = res?.data?.data.filter(
              (client) => client.id == id
            );
            setClientName(clientName[0]?.name);
          }
        });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllSettings = async () => {
    try {
      axios
        .get(`${baseUrl}/api/admin/permission_list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res?.data?.status) {
            setClientPermissionList(res?.data?.data);
          }
        });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchClientSettingsList();
    fetchAllClientList();
    fetchAllSettings();
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

  // create setting
  const handleCreateSetting = async () => {
    try {
      axios
        .post(
          `${baseUrl}/api/admin/client-settings/${id}`,
          {
            name: selectedPermission,
            value: newSettingStatus,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res?.data?.status) {
            setIsAddSettingModalOpen(false);
            toast.success("Successfully Created Setting");
            fetchClientSettingsList();
          }
        });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  // delete setting
  const handleDeleteSetting = async () => {
    try {
      axios
        .delete(
          `${baseUrl}/api/admin/client-settings/${isDeleteModalOpen.value.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res?.data?.status) {
            setIsDeleteModalOpen({ status: false, value: {} });
            toast.success("Successfully Deleted Setting");
            fetchClientSettingsList();
          }
        });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <Layout>
      <div className="relative">
        <div className="mt-6 lg:mt-16"></div>

        <div className="bg-white py-8 mt-5 shadow-sm rounded-sm">
          <div
            className={`text-xl font-bold px-3 py-2 flex items-center gap-4 ${
              mode === "light" ? "text-black" : "text-white"
            }`}
          >
            <p>Client Setting</p>
            <p className="inline bg-yellow-300 px-5 rounded-xl shadow-md font-normal font-serif text-lg">
              {clientName}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="border-2 border-black shadow-md rounded-md px-5 py-0.5 hover:bg-black hover:text-white font-normal font-serif text-sm"
            >
              Back
            </button>
          </div>
          {/* add setting */}
          <div className="mb-5 flex justify-end px-5">
            <button
              onClick={() => setIsAddSettingModalOpen(true)}
              className="bg-white border-2 border-black px-5 py-1 rounded-md flex items-center gap-2 shadow-lg"
            >
              <IoSettings />
              Add New Setting
            </button>
          </div>
          {/* users table */}
          <div className="relative overflow-x-auto max-h-screen overflow-y-auto">
            <table className="w-full text-sm text-left rtl:text-right text-white ">
              <thead
                className={`sticky top-0 text-xs  uppercase ${
                  mode === "light"
                    ? "bg-blue-300 text-black"
                    : "bg-black text-white"
                } rounded-md`}
              >
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left whitespace-nowrap"
                  >
                    Setting Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left whitespace-nowrap"
                  >
                    Status
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
                ) : clientSettingsList?.length <= 0 ? (
                  <tr className="text-center text-sm">
                    <td colSpan={7} align="center">
                      <p className="py-2 text-red-500">No data to show.</p>
                    </td>
                  </tr>
                ) : (
                  clientSettingsList &&
                  clientSettingsList?.length > 0 &&
                  clientSettingsList?.map((user, i) => (
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
                      }  text-sm cursor-pointer transition-all duration-500 ease-in`}
                    >
                      <td className="px-6 py-4 text-left text-xs whitespace-nowrap">
                        {user?.name}
                      </td>
                      <td className="px-6 py-4 text-left text-xs whitespace-nowrap">
                        {user?.value === "0" ? (
                          <p className="bg-red-200 text-red-700 px-3 py-0.5 rounded-full inline">
                            Disallowed
                          </p>
                        ) : (
                          <p className="bg-green-200 text-green-700 px-3 py-0.5 rounded-full inline">
                            Allowed
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-4 text-left text-xs whitespace-nowrap">
                        {formateDate(user?.created_at)}
                      </td>

                      <td className="px-6 py-4 flex justify-center text-sm">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              setIsDeleteModalOpen({
                                status: true,
                                value: user,
                              })
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
        </div>

        {/* add new setting modal */}
        {isAddSettingModalOpen && (
          <div
            style={{
              boxShadow:
                " rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
            }}
            className={`w-[90%] lg:w-[450px] h-fit  fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 p-5 rounded-md ${
              mode === "light" ? "bg-violet-100" : "bg-slate-700"
            }`}
          >
            <p
              className={`text-center text-xl font-bold ${
                mode === "light" ? "text-black" : "text-white"
              }`}
            >
              Create New Setting
            </p>
            {/* input fields */}
            <div className="mt-8 flex flex-col gap-y-5">
              <div className="w-full">
                <select
                  onChange={(e) => setSelectedPermission(e.target.value)}
                  className="w-full py-1 px-3 outline-none border-2 border-black rounded-md"
                  name=""
                  id=""
                >
                  <option value="">Select Setting Name</option>
                  {Object.entries(clientPermissionList).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-5">
                <p className="text-lg font-medium">Status:</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setNewSettingStatus(1)}
                    className={
                      newSettingStatus === 1 &&
                      "border-2 border-black px-3 py-0.5 bg-teal-50"
                    }
                  >
                    Allowed
                  </button>
                  <button
                    onClick={() => setNewSettingStatus(0)}
                    className={
                      newSettingStatus === 0 &&
                      "border-2 border-black px-3 py-0.5 bg-teal-50"
                    }
                  >
                    Disallowed
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-10 flex justify-center">
              <div className="flex items-center gap-10">
                <button
                  onClick={handleCreateSetting}
                  className="bg-teal-500 px-6 py-1 rounded-md text-white"
                >
                  Done
                </button>
                <button
                  onClick={() => setIsAddSettingModalOpen(false)}
                  className="bg-red-500 px-6 py-1 rounded-md text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

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
                  onClick={handleDeleteSetting}
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

export default ClientSettings;
