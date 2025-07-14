import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "../../../config";
import Layout from "../../components/Layout/Layout";
import useStore from "../../zustand/useStore";
import { Circles } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const UsersList = () => {
  const [usersList, setUsersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredUsersList, setFilteredUsersList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("all");

  const navigate = useNavigate();

  const { mode } = useStore();
  // const mode = localStorage.getItem("mode");

  // get cookies value
  const token = Cookies.get("token");

  const fetchUsersList = async () => {
    try {
      axios
        .get(`${baseUrl}/api/admin/user-list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res?.data?.status) {
            setUsersList(res?.data?.data);
            setFilteredUsersList(res?.data?.data);
          }
        });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersList();
  }, []);
  console.log(usersList);
  const applyFilters = (search = searchTerm, type = userTypeFilter) => {
    const filtered = usersList.filter((user) => {
      const matchesSearch =
        user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        user?.email?.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        type === "all" ||
        (type === "admin" && user?.user_type === 1) ||
        (type === "editor" && user?.user_type === 2);

      return matchesSearch && matchesType;
    });

    setFilteredUsersList(filtered);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(value, userTypeFilter);
  };

  const handleUserTypeChange = (e) => {
    const value = e.target.value;
    setUserTypeFilter(value);
    applyFilters(searchTerm, value);
  };

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

  const handleUserCheckIn = async (id) => {
    try {
      await axios
        .get(`${baseUrl}/api/admin/hr/admin/check-in/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res?.data?.status) {
            toast.success("User Check in Successfully");
          } else {
            toast.error(res?.data?.message);
          }
        });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleUserCheckOut = async (id) => {
    try {
      await axios
        .get(`${baseUrl}/api/admin/hr/admin/check-out/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res?.data?.status) {
            toast.success("User Check Out Successfully");
          } else {
            toast.error(res?.data?.message);
          }
        });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <Layout>
      <div className="mt-6 lg:mt-16 flex items-center justify-between">
        <h1
          className={`text-xl font-bold border-l-8 border-purple-600 px-3 py-2 uppercase ${
            mode === "light" ? "text-black" : "text-white"
          }`}
        >
          All Users List
        </h1>
        <button
          onClick={() => navigate("/dashboard/create-user")}
          className="bg-blue-50 border-2 border-black hover:border-blue-400 hover:text-slate-700-400 transition-all duration-300 ease-in px-8 py-1 rounded-md"
        >
          Create New
        </button>
      </div>
      <div>
        <div className="mt-5 flex items-center gap-x-2">
          <p className={mode === "light" ? "text-black" : "text-white"}>
            Search:
          </p>
          <div className="flex items-center gap-x-4">
            <input
              onChange={handleSearchChange}
              type="text"
              placeholder="Search by name or email"
              className={`w-52 px-3 py-2 text-sm rounded-sm bg-transparent outline-none border-2 border-slate-600 focus:border-teal-500 ${
                mode === "light" ? "text-black" : "text-white"
              }`}
            />
          </div>
          {/* User type filter */}
          <select
            value={userTypeFilter}
            onChange={handleUserTypeChange}
            className={`px-3 py-2 text-sm rounded-sm border-2 border-slate-600 focus:border-teal-500   ${
              mode === "light"
                ? "text-black bg-white"
                : "text-white bg-slate-700"
            }`}
          >
            <option value="all">All</option>
            <option value="admin">Administrator</option>
            <option value="editor">Editor</option>
          </select>
        </div>
      </div>
      {/* search box */}

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
              <th scope="col" className="px-6 py-3 text-center">
                SL No
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                User Type
              </th>

              <th scope="col" className="px-6 py-3 text-center">
                Created Date
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Action
              </th>
              <th scope="col" className="px-6 py-3 text-left">
                Status
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
            ) : filteredUsersList?.length <= 0 ? (
              <tr className="text-center text-sm">
                <td colSpan={7} align="center">
                  <p className="py-2 text-red-500">No data to show.</p>
                </td>
              </tr>
            ) : (
              filteredUsersList &&
              filteredUsersList?.length > 0 &&
              filteredUsersList?.map((user, i) => (
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
                  <td className="px-6 py-4 text-center text-xs">{i + 1}</td>
                  <td className="px-6 py-4 text-center text-xs">
                    {user?.name}
                  </td>
                  <td className="px-6 py-4 text-center text-xs">
                    {user?.email}
                  </td>
                  <td className="px-6 py-4 text-center text-xs">
                    {user?.user_type === 1 ? "Administrator" : "Editor"}
                  </td>

                  <td className="px-6 py-4 text-center text-xs">
                    {formateDate(user?.created_at)}
                  </td>

                  <td className="px-6 py-4 flex items-center justify-center text-xs">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          navigate(`/dashboard/user/${user?.id}`);
                        }}
                        className="bg-blue-400 hover:bg-blue-500 text-white px-5 py-2 rounded"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleUserCheckIn(user?.id)}
                        className="bg-teal-400 hover:bg-teal-500 text-white px-5 py-2 rounded"
                      >
                        Check In
                      </button>
                      <button
                        onClick={() => handleUserCheckOut(user?.id)}
                        className="bg-rose-400 hover:bg-rose-500 text-white px-5 py-2 rounded"
                      >
                        Check Out
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-xl">
                    {user?.status === 1 ? (
                      <div
                        onClick={() => {
                          try {
                            axios
                              .post(
                                `${baseUrl}/api/admin/get-user-data/${user?.id}`,
                                {
                                  status: 0,
                                },
                                {
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                    Accept: "application/json",
                                  },
                                }
                              )
                              .then((res) => {
                                if (res?.data?.status) {
                                  fetchUsersList();
                                  toast.success("User Status Updated");
                                }
                              });
                          } catch (error) {
                            toast.error(error?.response?.data?.message);
                          }
                        }}
                        className="w-8 h-4 bg-green-500 rounded-full relative"
                      >
                        <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-[50%] -translate-y-1/2"></div>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          axios
                            .post(
                              `${baseUrl}/api/admin/get-user-data/${user?.id}`,
                              {
                                status: 1,
                              },
                              {
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                  Accept: "application/json",
                                },
                              }
                            )
                            .then((res) => {
                              if (res?.data?.status) {
                                fetchUsersList();
                                toast.success("User Status Updated");
                              }
                            });
                        }}
                        className="w-8 h-4 bg-gray-500 rounded-full relative"
                      >
                        <div className="w-3 h-3 bg-white rounded-full absolute left-0.5 top-[50%] -translate-y-1/2"></div>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default UsersList;
