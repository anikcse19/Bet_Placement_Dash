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
  const [filteredBetResults, setFilteredBetResults] = useState([]);

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
            setFilteredBetResults(res?.data?.data);
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

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    const filteredBets = betResults.filter(
      (bet) =>
        bet?.eventName.includes(searchValue) ||
        bet?.eventId.includes(searchValue) ||
        bet?.marketId.includes(searchValue) ||
        bet?.sportName.includes(searchValue)
    );

    setFilteredBetResults(filteredBets);
  };

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
      <div className=" flex items-center justify-between mt-16">
        <h1
          className={`text-xl  font-bold tracking-widest ${
            mode === "light" ? "text-black" : "text-white"
          }`}
        >
          Bet Results
        </h1>
      </div>
      {/* search box */}
      <div className="mt-5 flex items-center gap-x-2">
        <p className={mode === "light" ? "text-black" : "text-white"}>
          Search:
        </p>
        <div className="flex items-center gap-x-4">
          <input
            // onChange={(e) => setSearchValue(e.target.value)}
            // value={searchValue}
            onChange={(e) => {
              handleSearch(e);
            }}
            type="text"
            placeholder="Search Result"
            className="w-52 px-3 py-2 text-sm rounded-sm bg-transparent outline-none border-2 border-slate-600 focus:border-teal-500"
          />
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
                scope="col"
                className="px-6 py-3 text-left border-r-2 border-black"
              >
                Sport
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left border-r-2 border-black"
              >
                Event Id
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left border-r-2 border-black"
              >
                Market Id
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left border-r-2 border-black"
              >
                Event Name
              </th>

              <th
                scope="col"
                className="px-6 py-3 text-center border-r-2 border-b-2 border-black"
              >
                Winners
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center border-r-2 border-black"
              >
                Loosers
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left border-r-2 border-black"
              >
                Event Time
              </th>
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
              filteredBetResults.map((bet, i) => (
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
                  <td className="px-6 py-4 text-left text-xs border-r-2 border-black">
                    {bet?.sportName}
                  </td>
                  <td className="px-6 py-4 text-left text-xs border-r-2 border-black">
                    {bet?.eventId}
                  </td>
                  <td className="px-6 py-4 text-left text-xs border-r-2 border-black">
                    {bet?.marketId}
                  </td>
                  <td className="px-6 py-4 text-left text-xs border-r-2 border-black">
                    {bet?.eventName}
                  </td>

                  <td className="px-6 py-4 text-center text-xs border-r-2 border-black">
                    {`${bet?.winnerDetails?.runnerName}---${bet?.winnerDetails?.selectionId}`}
                  </td>

                  <td className="px-6 py-4 text-center text-xs flex flex-col gap-y-2  border-r-2 border-black">
                    {bet?.loserDetails.map((loser) => (
                      <p
                        key={loser?.selectionId}
                      >{`${loser?.runnerName}---${loser?.selectionId}`}</p>
                    ))}
                  </td>
                  <td className="px-6 py-4 text-left text-xs">
                    {formateDate(bet?.eventTime)}
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
