import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "../../../config";
import Layout from "../../components/Layout/Layout";
import useStore from "../../zustand/useStore";
import { Circles } from "react-loader-spinner";
// import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const UsersAttendance = () => {
  const [usersAttendanceList, setUsersAttendanceList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
   const [filteredUsersAttendanceList, setFilteredUsersAttendanceList] =
     useState([]);
  // const navigate = useNavigate();

  const { mode } = useStore();
  // const mode = localStorage.getItem("mode");

  // get cookies value
  const token = Cookies.get("token");

  const fetchUsersAttendance = async () => {
    try {
      axios
        .get(`${baseUrl}/api/admin/hr/admin/attendance`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res?.data?.status) {
            setUsersAttendanceList(res?.data?.data);
            setFilteredUsersAttendanceList(res?.data?.data);
          }
        });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAttendance();
  }, []);
   const handleSearch = (e) => {
     const searchValue = e.target.value.toLowerCase();

     const filteredOffices = usersAttendanceList.filter((office) =>
       office?.name.toLowerCase().includes(searchValue)
     );
     setFilteredUsersAttendanceList(filteredOffices);
     // setPageNo(1); // Reset to the first page on new search
   };
  // console.log(usersList, "users");

  // const formateDate = (date) => {
  //   const localDate = new Date(date).toLocaleString(undefined, {
  //     timeZoneName: "short",
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   });

  //   return localDate;
  // };

  // const handleUserCheckIn = async () => {
  //   try {
  //     await axios.get(`${baseUrl}/api/admin/hr/staff/check-in/2`);
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message);
  //   }
  // };

  // const handleUserCheckOut = async () => {
  //   try {
  //     await axios.get(`${baseUrl}/api/admin/hr/staff/check-out/2`);
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message);
  //   }
  // };
  return (
    <Layout>
      <div className="mt-6 lg:mt-16">
        <h1
          className={`text-xl font-bold border-l-8 border-purple-600 px-3 py-2 uppercase ${
            mode === "light" ? "text-black" : "text-white"
          }`}
        >
          Users Attendance List
        </h1>
        <div className="mt-5 flex items-center gap-x-2">
          <p className={mode === "light" ? "text-black" : "text-white"}>
            Search:
          </p>
          <div className="flex items-center gap-x-4">
            <input
              onChange={handleSearch}
              type="text"
              placeholder="Search Result"
              className={`w-52 px-3 py-2 text-sm rounded-sm bg-transparent outline-none border-2 border-slate-600 focus:border-teal-500 ${
                mode === "light" ? "text-black" : "text-white"
              }`}
            />
          </div>
        </div>
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
              <th scope="col" className="px-6 py-3 text-center">
                SL No
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                User Name
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Shift
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Started At
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Ended At
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Check In
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Check Out
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Weekdays
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
            ) : filteredUsersAttendanceList?.length <= 0 ? (
              <tr className="text-center text-sm">
                <td colSpan={7} align="center">
                  <p className="py-2 text-red-500">No data to show.</p>
                </td>
              </tr>
            ) : (
              filteredUsersAttendanceList &&
              filteredUsersAttendanceList?.length > 0 &&
              filteredUsersAttendanceList?.map((user, i) => (
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
                    {user?.user?.name}
                  </td>
                  <td className="px-6 py-4 text-center text-xs">
                    {user?.shift?.name}
                  </td>
                  <td className="px-6 py-4 text-center text-xs">
                    {user?.shift_stime}
                  </td>
                  <td className="px-6 py-4 text-center text-xs">
                    {user?.shift_etime}
                  </td>
                  <td className="px-6 py-4 text-center text-xs">
                    {user?.check_in.split(" ")[1]}
                  </td>
                  <td className="px-6 py-4 text-center text-xs">
                    {user?.check_out ? (
                      user?.check_out.split(" ")[1]
                    ) : (
                      <p className="bg-green-200 text-green-700 px-2 py-1 inline">
                        On Duty
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center text-xs">
                    {user?.weekdays_id === 1
                      ? "Monday"
                      : user?.weekdays_id === 2
                      ? "Tuesday"
                      : user?.weekdays_id === 3
                      ? "Wednesday"
                      : user?.weekdays_id === 4
                      ? "Thursday"
                      : user?.weekdays_id === 5
                      ? "Friday"
                      : user?.weekdays_id === 6
                      ? "Saturday"
                      : ""}
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

export default UsersAttendance;
