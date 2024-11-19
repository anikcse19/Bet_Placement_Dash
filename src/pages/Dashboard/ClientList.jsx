import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "../../../config";
import Layout from "../../components/Layout/Layout";
import useStore from "../../zustand/useStore";
import { Circles } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { AiFillEdit } from "react-icons/ai";

const ClientList = () => {
  const [clientList, setClientList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
  return (
    <Layout>
      <div className="mt-16">
        <h1
          className={`text-xl  font-bold tracking-widest ${
            mode === "light" ? "text-black" : "text-white"
          }`}
        >
          All Client List
        </h1>
      </div>
      {/* search box */}
      {/* <div className="mt-5 flex items-center gap-x-2">
        <p className={mode === "light" ? "text-black" : "text-white"}>
          Search:
        </p>
        <div className="flex items-center gap-x-4">
          <input
            // onChange={(e) => setSearchEventName(e.target.value)}
            // value={searchEventName}
            type="text"
            placeholder="Search Client"
            className="w-52 px-3 py-2 text-sm rounded-sm bg-transparent outline-none border-2 border-slate-600 focus:border-teal-500"
          />
        </div>
      </div> */}

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
              <th scope="col" className="px-6 py-3 text-left">
                SL No
              </th>
              <th scope="col" className="px-6 py-3 text-left">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left">
                Client ID
              </th>
              <th scope="col" className="px-6 py-3 text-left">
                Client Secret
              </th>

              <th scope="col" className="px-6 py-3 text-left">
                Client IP
              </th>
              <th scope="col" className="px-6 py-3 text-left">
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
                  <td className="px-6 py-4 text-left text-xs">{user?.name}</td>
                  <td className="px-6 py-4 text-left text-xs">
                    {user?.clientId}
                  </td>
                  <td className="px-6 py-4 text-left text-xs">
                    {user?.clientSecret}
                  </td>
                  <td className="px-6 py-4 text-left text-xs">
                    {user?.clientIp}
                  </td>

                  <td className="px-6 py-4 text-left text-xs">
                    {formateDate(user?.created_at)}
                  </td>

                  <td className="px-6 py-4 flex justify-center text-sm">
                    <div className="flex items-center gap-3">
                      <button className="bg-blue-200 hover:bg-blue-300 text-blue-600 px-3 py-0.5 rounded-md">
                        Edit
                      </button>
                      <button className="bg-red-200 hover:bg-red-300 text-red-600 px-3 py-0.5 rounded-md">
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
    </Layout>
  );
};

export default ClientList;
