import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { baseUrl } from "../../../config";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import useStore from "../../zustand/useStore";
import { Circles } from "react-loader-spinner";
import { FaCaretSquareRight } from "react-icons/fa";

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
      filteredBetResults.length > 0 &&
      filteredBetResults.slice(
        (pageNo - 1) * ITEMS_PER_PAGE,
        pageNo * ITEMS_PER_PAGE
      ),
    [filteredBetResults, pageNo]
  );

  return (
    <Layout>
      <div className="flex items-center justify-between mt-6 lg:mt-16">
        <h1
          className={`text-xl font-bold border-l-8 border-purple-600 px-3 py-2 uppercase ${
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
            className={`w-52 px-3 py-2 text-sm rounded-sm bg-transparent outline-none border-2 border-slate-600 focus:border-teal-500 ${
              mode === "light" ? "text-black" : "text-white"
            }`}
          />
        </div>
      </div>

      <div className="flex flex-col items-center  overflow-hidden pb-3">
        {/* Results table */}
        <div className="relative overflow-x-auto  overflow-y-auto my-5 w-full">
          <table className="w-full text-sm text-left text-white ">
            <thead
              className={`sticky top-0 text-xs uppercase ${
                mode === "light"
                  ? "bg-blue-300 text-black"
                  : "bg-black text-white"
              }  border-2 border-black rounded-md`}
            >
              <tr>
                <th className="px-6 py-3 text-left border-r-2 border-black whitespace-nowrap">
                  Sport
                </th>
                <th className="px-6 py-3 text-left border-r-2 border-black whitespace-nowrap">
                  Event Id
                </th>
                <th className="px-6 py-3 text-left border-r-2 border-black whitespace-nowrap">
                  Market Id
                </th>
                <th className="px-6 py-3 text-left border-r-2 border-black whitespace-nowrap">
                  Event Name
                </th>
                <th className="px-6 py-3 text-center border-r-2 border-black">
                  Winners
                </th>
                <th className="px-6 py-3 text-center border-r-2 border-black">
                  Loosers
                </th>
                <th className="px-6 py-3 text-center border-r-2 border-black">
                  Removers
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
              ) : paginatedResults?.length <= 0 ? (
                <tr className="text-center">
                  <td colSpan={7} align="center">
                    <div className="my-5 flex flex-col justify-center items-center">
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
                paginatedResults?.map((bet, i) => (
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
                    } text-sm cursor-pointer transition-all duration-500 ease-in border-2 border-black`}
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
                      <div className="flex justify-between items-center">
                        <p>
                          {`${bet?.eventName}   ${
                            bet?.score !== null
                              ? bet?.score?.nscore !== null
                                ? ` || ${bet?.score?.nscore}`
                                : ""
                              : ""
                          }`}
                        </p>
                        {bet?.score !== null && bet?.score?.iscoreLink && (
                          <p>
                            <FaCaretSquareRight
                              onClick={() =>
                                window.open(bet?.score?.iscoreLink, "_blank")
                              }
                              className="text-lg"
                            />
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-xs text-[#3caa52] font-medium border-r-2 border-black">
                      {`${bet?.winnerDetails?.runnerName} (${bet?.winnerDetails?.selectionId})`}
                    </td>
                    <td className="px-6 py-4 text-center text-xs  text-red-600 font-medium border-r-2 border-black">
                      <div className="flex flex-col gap-y-2">
                        {Array.isArray(bet?.loserDetails) &&
                          bet?.loserDetails.map((loser) => (
                            <p
                              key={loser?.selectionId}
                            >{`${loser?.runnerName} (${loser?.selectionId})`}</p>
                          ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-xs  text-red-600 font-medium border-r-2 border-black">
                      <div className="flex flex-col gap-y-2">
                        {Array.isArray(bet?.removerDetails)
                          ? bet?.removerDetails.map((remover) => (
                              <p
                                key={remover?.selectionId}
                              >{`${remover?.runnerName} (${remover?.selectionId})`}</p>
                            ))
                          : "--"}
                      </div>
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
          <div className="mt-5 flex flex-wrap items-center gap-3 justify-center self-center">
            {/* Previous button */}
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

            {/* Page numbers */}
            {(() => {
              // Determine the range of page numbers to display
              let startPage = Math.max(1, pageNo - 5);
              let endPage = Math.min(totalPages, pageNo + 4);

              // Adjust start and end pages to always show 10 pages when possible
              if (endPage - startPage < 9) {
                if (startPage === 1) {
                  endPage = Math.min(totalPages, startPage + 9);
                } else if (endPage === totalPages) {
                  startPage = Math.max(1, endPage - 9);
                }
              }

              return Array.from(
                { length: endPage - startPage + 1 },
                (_, index) => {
                  const page = startPage + index;
                  return (
                    <p
                      key={page}
                      onClick={() => setPageNo(page)}
                      className={`border-2 px-2 rounded-md cursor-pointer ${
                        pageNo === page
                          ? mode === "light"
                            ? "bg-black text-white"
                            : "bg-slate-300 text-black"
                          : mode === "light"
                          ? "text-black border-black"
                          : "text-white"
                      }`}
                    >
                      {page}
                    </p>
                  );
                }
              );
            })()}

            {/* Next button */}
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
      </div>
    </Layout>
  );
};

export default BetResults;
