import toast from "react-hot-toast";
import Layout from "../../../components/Layout/Layout";
import { useEffect, useState } from "react";
import { baseUrl } from "../../../../config";
import Cookies from "js-cookie";
import { Circles } from "react-loader-spinner";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { AiFillEdit } from "react-icons/ai";
import axios from "axios";
import useStore from "../../../zustand/useStore";

const SetteBet = () => {
  const [pageNo, setPagNo] = useState(1);
  const [pages, setPages] = useState([]);
  const [lastPage, setLastPage] = useState();
  const [settleBetList, setSettleBetList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [infoModalOpen, setInfoModalOpen] = useState({
    status: false,
    value: {},
  });
  const [searchMarketId, setSearchMarketId] = useState("");
  const [searchEventId, setSearchEventId] = useState("");
  const [searchSelectionName, setSearchSelectionName] = useState("");
  const [selectSportType, setSelectSportType] = useState("");
  const [isBetPlaceLoading, setIsBetPlaceLoading] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState({
    status: false,
    value: {},
  });
  const [isRefundYesChecked, setIsRefundYesChecked] = useState(false);
  const [isRefundNoChecked, setIsRefundNoChecked] = useState(true);
  const [isWinYesChecked, setIsWinYesChecked] = useState(true);
  const [isWinNoChecked, setIsWinNoChecked] = useState(false);
  const [isRefund, setIsRefund] = useState("no");
  // const [isWin, setIsWin] = useState("yes");
  const [result, setResult] = useState("yes");
  const [OTP, setOTP] = useState(0);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const token = Cookies.get("token");
  const [queryParams, setQueryParams] = useState("");

  const { mode } = useStore();
  // const mode = localStorage.getItem("mode");

  const fetchUnSettledBets = async (withClear) => {
    // console.log("sea");

    try {
      const response = await fetch(
        `${baseUrl}/api/admin/get-settle-list?page=${pageNo}&${
          withClear ? "" : queryParams
        }`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (data?.status) {
        setSettleBetList(data?.data?.data);
        setPages(data?.data?.links);
        setLastPage(data?.data?.last_page);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formateDate = (marketDate) => {
    const date = new Date(marketDate);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    fetchUnSettledBets();
    handleSearch();
  }, [pageNo]);

  const handleYesChange = () => {
    setIsRefundYesChecked(true);
    setIsRefundNoChecked(false);
    setIsRefund("yes");
  };

  const handleNoChange = () => {
    setIsRefundYesChecked(false);
    setIsRefundNoChecked(true);
    setIsRefund("no");
  };

  const handleWinYesChange = () => {
    setIsWinYesChecked(true);
    setIsWinNoChecked(false);
    // setIsWin("yes");
    setResult("yes");
  };

  const handleWinNoChange = () => {
    setIsWinYesChecked(false);
    setIsWinNoChecked(true);
    // setIsWin("no");
    setResult("no");
  };

  const handleSendOTP = async () => {
    await axios
      .get(`${baseUrl}/api/admin/send-otp`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log(res);

        if (res?.data?.status) {
          // console.log("asce");
          toast.success("Successfully sent the OTP. Please check your device.");
          setIsOTPSent(true);
        }
      });
  };

  const handleDoSettle = async () => {
    if (isRefund === "no" && result === "") {
      toast.error("Filled all field first", {
        duration: 3000,
      });
      return;
    }
    setIsBetPlaceLoading(true);
    const betData = {
      eventId: actionModalOpen.value.eventId,
      marketId: actionModalOpen.value.marketId,
      selectionName: actionModalOpen.value.selectionName
        ? actionModalOpen.value.selectionName
        : actionModalOpen.value.eventTitle,
      isRefund: isRefund,
      type: actionModalOpen?.value?.type,
      gtype:
        actionModalOpen?.value?.type === "Fancy"
          ? actionModalOpen?.value?.gtype
          : null,
      result: isRefund === "yes" ? null : result,
      otp: isRefund === "yes" && OTP,
    };

    try {
      await axios
        .post(`${baseUrl}/api/admin/do-resettle`, betData, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res?.data?.status) {
            toast.success("Successfull");
            fetchUnSettledBets();
          }
        });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsBetPlaceLoading(false);
      setResult("");
      setIsRefund("no");
      setOTP(0);
      setIsOTPSent(false);
      setIsRefundYesChecked(false);
      setIsRefundNoChecked(true);
      setIsWinYesChecked(true);
      setIsWinNoChecked(false);
      setActionModalOpen({
        status: false,
        value: {},
      });
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    // Build the query string based on non-empty search inputs
    const queryParams = new URLSearchParams();

    if (searchMarketId) queryParams.append("marketId", searchMarketId);
    if (searchEventId) queryParams.append("eventId", searchEventId);
    if (searchSelectionName)
      queryParams.append("selectionName", searchSelectionName);
    if (selectSportType) queryParams.append("sport", selectSportType);

    setQueryParams(queryParams.toString());

    try {
      const response = await fetch(
        `${baseUrl}/api/admin/get-settle-list?page=${pageNo}&${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (data?.status) {
        if (data?.data?.data.length > 0) {
          setSettleBetList(data?.data?.data);
          setPages(data?.data?.links);
          setLastPage(data?.data?.last_page);
        } else {
          setSettleBetList(data?.data?.data);
          setPages([]);
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setQueryParams("");
    setSearchMarketId("");
    setSearchEventId("");
    setSearchSelectionName("");
    setSelectSportType("");
    fetchUnSettledBets(true); // or call this in an effect
  };

  useEffect(() => {
    // Run any effect needed when `queryParams` changes.
    if (!queryParams) {
      fetchUnSettledBets();
    }
  }, [queryParams]);
  return (
    <Layout>
      <div className="relative w-full h-full mt-6 lg:mt-16">
        <div className=" flex items-center justify-between">
          <h1
            className={`text-xl  font-bold border-l-8 border-purple-600 px-3 py-2 uppercase ${
              mode === "light" ? "text-black" : "text-white"
            }`}
          >
            Settle Bets List
          </h1>
        </div>
        {/* search box */}
        <div className="mt-5 flex flex-col xl:flex-row gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex items-center gap-3 w-full">
              <input
                onChange={(e) => setSearchMarketId(e.target.value)}
                value={searchMarketId}
                type="text"
                placeholder="Search Market Id"
                className={`w-full xl:w-40 px-3 py-2 text-xs lg:text-sm rounded-sm bg-transparent outline-none border-2 border-slate-600 focus:border-teal-500 ${
                  mode === "light" ? "text-black" : "text-white"
                }`}
              />
              <input
                onChange={(e) => setSearchEventId(e.target.value)}
                value={searchEventId}
                type="text"
                placeholder="Search Event Id"
                className={`w-full xl:w-40 px-3 py-2 text-xs lg:text-sm rounded-sm bg-transparent outline-none border-2 border-slate-600 focus:border-teal-500 ${
                  mode === "light" ? "text-black" : "text-white"
                }`}
              />
            </div>
            <div className="flex items-center gap-3 w-full">
              <input
                onChange={(e) => setSearchSelectionName(e.target.value)}
                value={searchSelectionName}
                type="text"
                placeholder="Search Selection Name"
                className={`w-full xl:w-40 px-3 py-2 text-xs lg:text-sm rounded-sm bg-transparent outline-none border-2 border-slate-600 focus:border-teal-500 ${
                  mode === "light" ? "text-black" : "text-white"
                }`}
              />
              <select
                onChange={(e) => setSelectSportType(e.target.value)}
                value={selectSportType}
                className={`w-full xl:w-40 px-3 py-2 text-xs lg:text-sm rounded-sm  outline-none border-2 border-slate-600 focus:border-teal-500 ${
                  mode === "light"
                    ? "text-black bg-transparent"
                    : "text-white bg-[#201F1F]"
                }`}
              >
                <option value="">All</option>
                <option value="cricket">Cricket</option>
                <option value="soccer">Soccer</option>
                <option value="tennis">Tennis</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p
              style={{
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset",
              }}
              className="inline bg-teal-500 text-white font-bold px-3 py-2 rounded cursor-pointer hover:bg-teal-400"
              onClick={handleSearch}
            >
              Get Bets
            </p>
            <p
              style={{
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset",
              }}
              className="bg-teal-500 text-white font-bold px-3 py-2 rounded cursor-pointer hover:bg-teal-400"
              onClick={(e) => {
                handleClear(e);
              }}
            >
              Clear Filter
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center  overflow-hidden pb-3">
          {/* users table */}
          <div className="relative overflow-x-auto overflow-y-auto my-5 w-full">
            <table className="w-[400px] lg:w-full overflow-x-auto text-sm text-left rtl:text-right text-white  ">
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
                    Sport
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left whitespace-nowrap"
                  >
                    Event Id
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left whitespace-nowrap"
                  >
                    Market Id
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left whitespace-nowrap"
                  >
                    Event Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left whitespace-nowrap"
                  >
                    Selection Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left whitespace-nowrap"
                  >
                    Bet Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left whitespace-nowrap"
                  >
                    Result
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left whitespace-nowrap"
                  >
                    Resettle
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left whitespace-nowrap"
                  >
                    Info
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr className="text-center text-sm">
                    <td colSpan={9} align="center">
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
                ) : settleBetList.length <= 0 ? (
                  <tr className="text-center text-sm">
                    <td colSpan={9} align="center">
                      <p
                        className={`py-3 text-lg ${
                          mode === "light" ? "text-black" : "text-white"
                        }`}
                      >
                        No data to show
                      </p>
                    </td>
                  </tr>
                ) : (
                  settleBetList.map((bet, i) => (
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
                        {bet?.sport}
                      </td>
                      <td className="px-6 py-4 text-left text-xs">
                        {bet?.eventId}
                      </td>
                      <td className="px-6 py-4 text-left text-xs">
                        {bet?.marketId}
                      </td>
                      <td className="px-6 py-4 text-left text-xs">
                        {bet?.eventTitle}
                      </td>
                      <td className="px-6 py-4 text-left text-xs">
                        {bet?.selectionName ? bet?.selectionName : "--"}
                      </td>
                      <td className="px-6 py-4 text-left text-xs">
                        {bet?.type}
                      </td>
                      <td className="px-6 py-4 text-left text-xs">
                        {bet?.type === "Fancy"
                          ? bet?.result?.isRefund
                            ? "Abandoned"
                            : bet?.result?.result
                          : bet?.result?.isRefund
                          ? "Abandoned"
                          : bet?.result?.winnerName}
                      </td>

                      <td className="px-6 py-4 text-left text-xl">
                        {bet?.isResettleAllow ? (
                          <AiFillEdit
                            className="cursor-pointer"
                            onClick={() => {
                              setActionModalOpen({
                                status: true,
                                value: bet,
                              });
                              setResult(
                                bet?.type === "Fancy" &&
                                  bet?.gtype !== "session"
                                  ? "yes"
                                  : ""
                              );
                            }}
                          />
                        ) : (
                          ""
                        )}
                      </td>
                      <td
                        onClick={() =>
                          setInfoModalOpen({
                            status: true,
                            value: bet,
                          })
                        }
                        className="px-6 py-4 text-left text-xl cursor-pointer"
                      >
                        <IoMdInformationCircleOutline />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* pagination */}
          {pages && pages.length > 0 && (
            <div className="mt-5 self-start lg:self-center flex flex-wrap items-center justify-center gap-3 w-full">
              {parseInt(pageNo) !== 1 && (
                <p
                  onClick={() => {
                    if (pages[0]?.url !== null) {
                      const pN = parseInt(pages[0]?.url.split("=")[1]);
                      setPagNo(pN);
                    }
                  }}
                  className={`border-2  px-2 rounded-md cursor-pointer ${
                    mode === "light"
                      ? "border-black text-black"
                      : "border-white  text-white"
                  }`}
                >
                  Prev
                </p>
              )}
              {pages.slice(1, -1).map((page, i) => {
                return (
                  <p
                    className={`border-2  px-2 rounded-md cursor-pointer ${
                      pageNo == page?.label
                        ? mode === "light"
                          ? "bg-black text-white border-white shadow-2xl scale-105"
                          : "bg-slate-300 text-black border-slate-200 shadow-2xl scale-105"
                        : mode === "light"
                        ? "text-black border-black"
                        : "text-white"
                    }`}
                    onClick={() => {
                      setPagNo(parseInt(page?.label));
                    }}
                    key={i}
                  >
                    {page?.label}
                  </p>
                );
              })}
              {parseInt(pageNo) !== lastPage && (
                <p
                  onClick={() => {
                    if (pages[pages.length - 1]?.url !== null) {
                      const pN = parseInt(
                        pages[pages.length - 1]?.url.split("=")[1]
                      );
                      setPagNo(pN);
                    }
                  }}
                  className={`border-2  px-2 rounded-md cursor-pointer ${
                    mode === "light"
                      ? "border-black text-black"
                      : "border-white  text-white"
                  }`}
                >
                  Next
                </p>
              )}
            </div>
          )}
        </div>

        {/* info modal */}
        {infoModalOpen.status && (
          <div
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
            }}
            className={`w-[95%] mx-auto lg:w-[500px] h-fit pb-5  rounded fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 ${
              mode === "light"
                ? "bg-white border-2 border-black"
                : "bg-slate-800 border-2 border-white"
            }`}
          >
            <div
              className={`py-2 px-3 flex justify-between items-center rounded ${
                mode === "light"
                  ? "bg-gray-300 text-black"
                  : "bg-slate-800 text-white"
              }`}
            >
              <p>Settlement Information</p>
              <p
                onClick={() => setInfoModalOpen({ status: false, value: {} })}
                className="bg-red-500 hover:bg-red-600 transition-all duration-300 ease-in px-2 py-0.5 rounded-md cursor-pointer text-white"
              >
                Close
              </p>
            </div>

            <div className="mt-3 px-3 py-3 flex flex-col rounded-md overflow-hidden">
              <div
                className={`flex justify-between items-center font-bold text-sm  p-2 rounded-tl-md rounded-tr-md ${
                  mode === "light"
                    ? "bg-gray-400 text-black"
                    : "bg-slate-700 text-white"
                }`}
              >
                <div className="w-full text-left">Settled Date</div>
                <div className="w-full text-left">Settled By</div>
                <div className="w-full text-left">Result</div>
              </div>
              <div className="flex justify-between items-left text-sm p-2 rounded-bl-md rounded-br-md bg-gray-300">
                <div className="w-full text-left">
                  {formateDate(infoModalOpen?.value?.settleTime)}
                </div>
                <div className="w-full text-left">
                  {infoModalOpen?.value?.userBy}
                </div>
                <div className="w-full text-left">
                  {infoModalOpen?.value?.result?.result
                    ? infoModalOpen?.value?.type === "Fancy"
                      ? infoModalOpen?.value?.result?.result
                      : infoModalOpen?.value?.result?.winnerName
                    : "-"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* action modal */}
        {actionModalOpen.status && (
          <div
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
            }}
            className={`w-[95%] mx-auto lg:w-[400px] h-fit pb-5 rounded fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 ${
              mode === "light"
                ? "bg-white"
                : "bg-black border-2 border-gray-400"
            }`}
          >
            <div
              className={`py-4 px-3 flex justify-between items-center rounded ${
                mode === "light"
                  ? "bg-gray-300 text-black"
                  : "bg-black border-b-2 border-slate-600 text-white"
              }`}
            >
              <p>Resettle Bet</p>
              <p
                onClick={() => {
                  setActionModalOpen({ status: false, value: {} });
                  handleNoChange();
                }}
                className="bg-red-500 hover:bg-red-600 transition-all duration-300 ease-in px-3 py-1 rounded-md cursor-pointer text-white"
              >
                Close
              </p>
            </div>

            <div className="mt-3 px-3 flex flex-col gap-y-4 ">
              {/* event name */}
              <div className="flex flex-col justify-between gap-2">
                <label
                  htmlFor="eventtitle"
                  className={mode === "light" ? "text-black" : "text-white"}
                >
                  Event Title
                </label>
                <input
                  // onChange={(e) => setAmount(e.target.value)}
                  value={actionModalOpen?.value?.eventTitle}
                  readOnly
                  type="text"
                  className={`border border-gray-700 w-[95%] px-5 py-2  rounded-md ${
                    mode === "light"
                      ? "bg-white text-black"
                      : "bg-slate-800 text-white"
                  }`}
                  placeholder="eventtitle"
                />
              </div>
              {/* selection name */}
              <div className="flex flex-col justify-between gap-2">
                <label
                  htmlFor="username"
                  className={mode === "light" ? "text-black" : "text-white"}
                >
                  Selection Name
                </label>
                <input
                  // onChange={(e) => setAmount(e.target.value)}
                  value={actionModalOpen?.value?.selectionName}
                  readOnly
                  type="text"
                  className={`border border-gray-700 w-[95%] px-5 py-2  rounded-md ${
                    mode === "light"
                      ? "bg-white text-black"
                      : "bg-slate-800 text-white"
                  }`}
                  placeholder="Selection Name"
                />
              </div>
              {/* refund */}
              <div className="flex flex-col justify-between gap-1">
                <label
                  htmlFor="refund"
                  className={`${
                    mode === "light" ? "text-black" : "text-white"
                  } text-sm tracking-wider`}
                >
                  Refund
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      onChange={handleYesChange}
                      className="w-3 h-3 rounded-md cursor-pointer"
                      type="checkbox"
                      name=""
                      id=""
                      checked={isRefundYesChecked}
                    />
                    <p
                      className={mode === "light" ? "text-black" : "text-white"}
                    >
                      Yes
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      onChange={handleNoChange}
                      className="w-3 h-3 rounded-md cursor-pointer"
                      type="checkbox"
                      name=""
                      id=""
                      checked={isRefundNoChecked}
                    />
                    <p
                      className={mode === "light" ? "text-black" : "text-white"}
                    >
                      No
                    </p>
                  </div>
                </div>
              </div>

              {isRefund === "yes" ? (
                isOTPSent ? (
                  <div className="flex flex-col justify-between gap-2">
                    <label
                      htmlFor="otp"
                      className={mode === "light" ? "text-black" : "text-white"}
                    >
                      Enter OTP
                      <p className="text-red-500 font-bold inline">*</p>
                    </label>
                    <div
                      className={`${
                        mode === "light" ? "bg-white" : "bg-slate-800"
                      } flex items-center border border-gray-700 w-[95%] px-5 py-2  rounded-md`}
                    >
                      <input
                        onChange={(e) => setOTP(parseInt(e.target.value))}
                        type="text"
                        className={`flex-grow outline-none ${
                          mode === "light"
                            ? "bg-white text-black"
                            : "bg-slate-800 text-white"
                        }`}
                        placeholder="Enter OTP"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col justify-between gap-2">
                    <label
                      htmlFor="otp"
                      className={mode === "light" ? "text-black" : "text-white"}
                    >
                      Send OTP
                      <p className="text-red-500 font-bold inline">*</p>
                    </label>
                    <div
                      className={`${
                        mode === "light" ? "bg-white" : "bg-slate-800"
                      } flex items-center border border-gray-700 w-[95%] px-5 py-2  rounded-md`}
                    >
                      <input
                        // onChange={(e) => setOTP(parseInt(e.target.value))}
                        type="text"
                        className={`flex-grow outline-none ${
                          mode === "light"
                            ? "bg-white text-black"
                            : "bg-slate-800 text-white"
                        }`}
                        placeholder=""
                      />
                      <p
                        onClick={handleSendOTP}
                        className="bg-purple-600 px-3 py-1 rounded-md text-white"
                      >
                        Send
                      </p>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex flex-col gap-y-4">
                  {actionModalOpen.value.type === "Fancy" ? (
                    actionModalOpen.value.gtype === "session" ? (
                      <div className="flex flex-col justify-between gap-2">
                        <label
                          htmlFor="run_or_wickets"
                          className={
                            mode === "light" ? "text-black" : "text-white"
                          }
                        >
                          Run or Wickets
                          <p className="inline text-red-500">*</p>
                        </label>
                        <input
                          type="text"
                          onChange={(e) => setResult(parseInt(e.target.value))}
                          className={`border border-gray-700 w-[95%] px-5 py-2 rounded-md ${
                            mode === "light"
                              ? "bg-white text-black"
                              : "bg-slate-800 text-white"
                          }`}
                          placeholder="Enter Runs or Wickets"
                        />
                      </div>
                    ) : actionModalOpen.value.gtype === "oddeven" ||
                      actionModalOpen.value.gtype === "fancy1" ? (
                      <div className="flex flex-col justify-between gap-1 mt-2">
                        <label
                          htmlFor="refund"
                          className={`${
                            mode === "light" ? "text-black" : "text-white"
                          } tracking-wider`}
                        >
                          IsWon?
                        </label>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <input
                              onChange={handleWinYesChange}
                              className={`w-3 h-3 rounded-md cursor-pointer ${
                                mode === "light"
                                  ? "bg-white text-black"
                                  : "bg-slate-800 text-white"
                              }`}
                              type="checkbox"
                              name="isWonYes"
                              id="isWonYes"
                              checked={isWinYesChecked}
                            />
                            <p
                              className={
                                mode === "light" ? "text-black" : "text-white"
                              }
                            >
                              Yes
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              onChange={handleWinNoChange}
                              className={`w-3 h-3 rounded-md cursor-pointer ${
                                mode === "light"
                                  ? "bg-white text-black"
                                  : "bg-slate-800 text-white"
                              }`}
                              type="checkbox"
                              name="isWonNo"
                              id="isWonNo"
                              checked={isWinNoChecked}
                            />
                            <p
                              className={
                                mode === "light" ? "text-black" : "text-white"
                              }
                            >
                              No
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : null
                  ) : null}

                  {(actionModalOpen.value.type === "Match Odds" ||
                    actionModalOpen.value.type === "Sports Book" ||
                    actionModalOpen.value.type === "Bookmaker") && (
                    <div className="flex flex-col justify-between gap-2">
                      <label
                        htmlFor="winner_team"
                        className={`${
                          mode === "light" ? "text-black" : "text-white"
                        } text-sm tracking-wider`}
                      >
                        Select Winner Team
                      </label>
                      <select
                        onChange={(e) => setResult(parseInt(e.target.value))}
                        className={`border border-gray-700 w-[95%] px-5 py-2 rounded-md ${
                          mode === "light"
                            ? "bg-white text-black"
                            : "bg-slate-800 text-white"
                        }`}
                        placeholder="Enter amount"
                      >
                        <option
                          className={
                            mode === "light"
                              ? "bg-white text-black"
                              : "bg-slate-800 text-white"
                          }
                          value=""
                        >
                          Select Winner
                        </option>
                        {actionModalOpen.value.teams.map((team) => (
                          <option key={team?._id} value={team._id}>
                            {team.name}
                          </option>
                        ))}
                        {/* <option value={actionModalOpen?.value?.teams[0].name}>
                            {actionModalOpen?.value?.teams[0].name}
                          </option>
                          <option value={actionModalOpen?.value?.teams[1].name}>
                            {actionModalOpen?.value?.teams[1].name}
                          </option>
                          {actionModalOpen.value?.sport === "soccer" && (
                            <option value="draw">Draw</option>
                          )} */}
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-10 flex justify-center items-center gap-x-5">
              <button
                onClick={handleDoSettle}
                className="bg-teal-500 px-6 py-2 rounded-md cursor-pointer text-white hover:scale-105 hover:tracking-widest transition-all duration-300 ease-in"
              >
                {isBetPlaceLoading ? (
                  <p className="text-white font-bold text-lg">Loading..</p>
                ) : isOTPSent ? (
                  <p>Refund</p>
                ) : (
                  <p>Submit</p>
                )}
              </button>
              <button
                onClick={() => {
                  setActionModalOpen({ status: false, value: {} });
                  handleNoChange();
                }}
                className="bg-teal-500 px-6 py-2 rounded-md cursor-pointer text-white hover:scale-105 hover:tracking-widest transition-all duration-300 ease-in"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SetteBet;
