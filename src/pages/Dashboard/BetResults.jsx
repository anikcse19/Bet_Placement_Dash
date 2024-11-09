import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { baseUrl } from "../../../config";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import useStore from "../../zustand/useStore";
import { Circles } from "react-loader-spinner";

const BetResults = () => {
  const [betResults, setBetResults] = useState([]);
  const [filteredBetResults, setFilteredBetResults] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Items per page
  const ITEMS_PER_PAGE = 10;

  // Zustand store
  const { mode } = useStore();
  // const mode = localStorage.getItem("mode");

  // Get cookies value
  const token = Cookies.get("token");

  const fetchBetResults = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/api/admin/get-betf-api-results`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response?.data?.status) {
        toast.success(response.data.message);
        setBetResults(response.data.data);
        setFilteredBetResults(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBetResults();
  }, []);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredBets = betResults.filter(
      (bet) =>
        bet?.eventName.toLowerCase().includes(searchValue) ||
        bet?.eventId.toLowerCase().includes(searchValue) ||
        bet?.marketId.toLowerCase().includes(searchValue) ||
        bet?.sportName.toLowerCase().includes(searchValue)
    );
    setFilteredBetResults(filteredBets);
    setPageNo(1); // Reset to the first page on new search
  };

  const formatDate = (marketDate) => {
    return new Date(marketDate).toLocaleString(undefined, {
      timeZoneName: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalPages = useMemo(
    () => Math.ceil(filteredBetResults.length / ITEMS_PER_PAGE),
    [filteredBetResults]
  );

  const paginatedResults = useMemo(
    () =>
      filteredBetResults.slice(
        (pageNo - 1) * ITEMS_PER_PAGE,
        pageNo * ITEMS_PER_PAGE
      ),
    [filteredBetResults, pageNo]
  );

  return (
    <Layout>
      <div className="flex items-center justify-between mt-16">
        <h1
          className={`text-xl font-bold border-l-8 border-purple-600 px-3 py-2 ${
            mode === "light" ? "text-black" : "text-white"
          }`}
        >
          Match Results
        </h1>
      </div>

      {/* Search box */}
      <div className="mt-5 flex items-center gap-x-2">
        <p className={mode === "light" ? "text-black" : "text-white"}>
          Search:
        </p>
        <div className="flex items-center gap-x-4">
          <input
            onChange={handleSearch}
            type="text"
            placeholder="Search Result"
            className="w-52 px-3 py-2 text-sm rounded-sm bg-transparent outline-none border-2 border-slate-600 focus:border-teal-500"
          />
        </div>
      </div>

      {/* Results table */}
      <div className="relative overflow-x-auto max-h-screen overflow-y-auto my-5">
        <table className="w-full text-sm text-left text-white border-l-2 border-r-2 border-black">
          <thead
            className={`sticky top-0 text-xs uppercase ${
              mode === "light"
                ? "bg-blue-300 text-black"
                : "bg-black text-white"
            } border-b-2 border-t-2 border-black rounded-md`}
          >
            <tr>
              <th className="px-6 py-3 text-left border-r-2 border-black">
                Sport
              </th>
              <th className="px-6 py-3 text-left border-r-2 border-black">
                Event Id
              </th>
              <th className="px-6 py-3 text-left border-r-2 border-black">
                Market Id
              </th>
              <th className="px-6 py-3 text-left border-r-2 border-black">
                Event Name
              </th>
              <th className="px-6 py-3 text-center border-r-2 border-black">
                Winners
              </th>
              <th className="px-6 py-3 text-center border-r-2 border-black">
                Loosers
              </th>
              <th className="px-6 py-3 text-left">Event Time</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr className="text-center">
                <td colSpan={7} align="center">
                  <div className="my-5 flex flex-col justify-center items-center">
                    <Circles
                      height="50"
                      width="50"
                      color="#4fa94d"
                      ariaLabel="circles-loading"
                      visible={true}
                    />
                  </div>
                </td>
              </tr>
            ) : (
              paginatedResults.map((bet, i) => (
                <tr
                  key={bet.id}
                  className={`${
                    i % 2 === 0
                      ? mode === "light"
                        ? "bg-white text-black"
                        : "bg-transparent text-white"
                      : mode === "light"
                      ? "bg-blue-100 text-black"
                      : "bg-black text-white"
                  } text-sm cursor-pointer transition-all duration-500 ease-in border-b-2 border-slate-700`}
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
                  <td className="px-6 py-4 text-center text-xs text-[#3caa52] font-medium border-r-2 border-black">
                    {`${bet?.winnerDetails?.runnerName} (${bet?.winnerDetails?.selectionId})`}
                  </td>
                  <td className="px-6 py-4 text-center text-xs flex flex-col gap-y-2 text-red-600 font-medium border-r-2 border-black">
                    {bet?.loserDetails.map((loser) => (
                      <p
                        key={loser?.selectionId}
                      >{`${loser?.runnerName} (${loser?.selectionId})`}</p>
                    ))}
                  </td>
                  <td className="px-6 py-4 text-left text-xs">
                    {formatDate(bet?.eventTime)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-x-3">
          {pageNo > 1 && (
            <p
              onClick={() => setPageNo(pageNo - 1)}
              className={`border-2 px-2 rounded-md cursor-pointer ${
                mode === "light"
                  ? "border-black text-black"
                  : "border-white text-white"
              }`}
            >
              Prev
            </p>
          )}
          {[...Array(totalPages)].map((_, index) => (
            <p
              key={index}
              onClick={() => setPageNo(index + 1)}
              className={`border-2 px-2 rounded-md cursor-pointer ${
                pageNo === index + 1
                  ? mode === "light"
                    ? "bg-black text-white"
                    : "bg-slate-300 text-black"
                  : mode === "light"
                  ? "text-black border-black"
                  : "text-white"
              }`}
            >
              {index + 1}
            </p>
          ))}
          {pageNo < totalPages && (
            <p
              onClick={() => setPageNo(pageNo + 1)}
              className={`border-2 px-2 rounded-md cursor-pointer ${
                mode === "light"
                  ? "border-black text-black"
                  : "border-white text-white"
              }`}
            >
              Next
            </p>
          )}
        </div>
      )}
    </Layout>
  );
};

export default BetResults;
