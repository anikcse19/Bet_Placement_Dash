import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "../../../config";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import useStore from "../../zustand/useStore";
import { Circles } from "react-loader-spinner";

const BetResults = () => {
  const [betResults, setBetResults] = useState([]);
  const [searchEventName, setSearchEventName] = useState("");
  const [searchEventId, setSearchEventId] = useState("");
  const [searchSelectionName, setSearchSelectionName] = useState("");
  const [selectSportType, setSelectSportType] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // zustand store
  const { mode } = useStore();

  // get cookies value
  const token = Cookies.get("token");

  const fetchBetResults = async () => {
    try {
      axios
        .get(`${baseUrl}/api/admin/get-betf-api-results`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res?.data?.status) {
            toast.success(res?.data?.message);
            setBetResults(res?.data?.data);
          } else {
            toast.error(res?.data?.message);
          }
        });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBetResults();
  }, []);

  console.log(betResults);
  return (
    <Layout>
      <div className=" flex items-center justify-between">
        <h1
          className={`text-xl  font-bold tracking-widest ${
            mode === "light" ? "text-black" : "text-white"
          }`}
        >
          Unsettle Bets List
        </h1>
      </div>
      {/* search box */}
      <div className="mt-5 flex items-center gap-x-2">
        <p className={mode === "light" ? "text-black" : "text-white"}>
          Search:
        </p>
        <div className="flex items-center gap-x-4">
          <input
            onChange={(e) => setSearchEventName(e.target.value)}
            value={searchEventName}
            type="text"
            placeholder="Search Market Id"
            className="w-52 px-3 py-2 text-sm rounded-sm bg-transparent outline-none border-2 border-slate-600 focus:border-teal-500"
          />
          <input
            onChange={(e) => setSearchEventId(e.target.value)}
            value={searchEventId}
            type="text"
            placeholder="Search Event Id"
            className="w-52 px-3 py-2 text-sm rounded-sm bg-transparent outline-none border-2 border-slate-600 focus:border-teal-500"
          />
          <input
            onChange={(e) => setSearchSelectionName(e.target.value)}
            value={searchSelectionName}
            type="text"
            placeholder="Search Selection Name"
            className="w-52 px-3 py-2 text-sm rounded-sm bg-transparent outline-none border-2 border-slate-600 focus:border-teal-500"
          />
          <select
            onChange={(e) => setSelectSportType(e.target.value)}
            value={selectSportType}
            className="w-52 px-3 py-2 text-sm rounded-sm bg-transparent text-gray-600 outline-none cursor-pointer border-2 border-slate-600 focus:border-teal-500"
          >
            <option value="">All</option>
            <option value="cricket">Cricket</option>
            <option value="soccer">Soccer</option>
            <option value="tennis">Tennis</option>
          </select>

          <p
            style={{
              boxShadow:
                "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset",
            }}
            className="bg-teal-500 text-white font-bold px-3 py-1 rounded cursor-pointer hover:bg-teal-400"
            // onClick={handleSearch}
          >
            Get Bets
          </p>

          <p
            style={{
              boxShadow:
                "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset",
            }}
            className="bg-teal-500 text-white font-bold px-3 py-1 rounded cursor-pointer hover:bg-teal-400"
            onClick={() => {
              setSearchEventName("");
              setSearchEventId("");
              setSearchSelectionName("");
              setSelectSportType("");
              fetchBetResults();
            }}
          >
            Clear Filter
          </p>
        </div>
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
                rowSpan={2}
                scope="col"
                className="px-6 py-3 text-left border-r-2 border-black"
              >
                Sport
              </th>
              <th
                rowSpan={2}
                scope="col"
                className="px-6 py-3 text-left border-r-2 border-black"
              >
                Event Id
              </th>
              <th
                rowSpan={2}
                scope="col"
                className="px-6 py-3 text-left border-r-2 border-black"
              >
                Market Id
              </th>
              <th
                rowSpan={2}
                scope="col"
                className="px-6 py-3 text-left border-r-2 border-black"
              >
                Event Name
              </th>
              <th
                rowSpan={2}
                scope="col"
                className="px-6 py-3 text-left border-r-2 border-black"
              >
                Event Time
              </th>
              <th
                colSpan={2}
                scope="col"
                className="px-6 py-3 text-center border-r-2 border-b-2 border-black"
              >
                Winners
              </th>
              <th
                colSpan={2}
                scope="col"
                className="px-6 py-3 text-center border-b-2 border-black"
              >
                Loosers
              </th>
            </tr>
            <tr>
              <th className="px-6 py-3 text-center border-r-2 border-black">
                Selection Id
              </th>
              <th className="px-6 py-3 text-center border-r-2 border-black">
                Runner Name
              </th>
              <th className="px-6 py-3 text-center border-r-2 border-black">
                Selection Id
              </th>
              <th className="px-6 py-3 text-center">Runner Name</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr className="text-center text-sm">
                <td colSpan={12} align="center">
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
              betResults.map((bet, i) => (
                <tr
                  key={bet.id}
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
                  <td className="px-6 py-4 text-left text-xs">
                    {bet?.sportName}
                  </td>
                  <td className="px-6 py-4 text-left text-xs">
                    {bet?.eventId}
                  </td>
                  <td className="px-6 py-4 text-left text-xs">
                    {bet?.marketId}
                  </td>
                  <td className="px-6 py-4 text-left text-xs">
                    {bet?.eventName}
                  </td>
                  <td className="px-6 py-4 text-left text-xs">
                    {bet?.eventTime}
                  </td>
                  <td className="px-6 py-4 text-center text-xs">
                    {bet?.winnerDetails?.selectionId}
                  </td>
                  <td className="px-6 py-4 text-center text-xs">
                    {bet?.winnerDetails?.runnerName}
                  </td>
                  <td className="px-6 py-4 text-center text-xs flex flex-col gap-y-2">
                    {bet?.loserDetails.map((loser) => (
                      <p key={loser?.selectionId}>{loser?.selectionId}</p>
                    ))}
                  </td>
                  <td className="px-6 py-4 text-center text-xs ">
                    {bet?.loserDetails.map((loser) => (
                      <p className="mr-3" key={loser?.selectionId}>
                        {loser?.runnerName}
                      </p>
                    ))}
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

export default BetResults;
