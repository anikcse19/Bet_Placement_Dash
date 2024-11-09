import { useEffect, useState } from "react";
import Layout from "../../../components/Layout/Layout";
import { baseUrl } from "../../../../config";
import Cookies from "js-cookie";
import { Circles } from "react-loader-spinner";
import { AiFillEdit } from "react-icons/ai";
import { IoMdInformationCircleOutline } from "react-icons/io";
import toast from "react-hot-toast";
import axios from "axios";
import useStore from "../../../zustand/useStore";

const UnsettleBet = () => {
  const [unSettleBets, setUnSettleBets] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isBetPlaceLoading, setIsBetPlaceLoading] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState({
    status: false,
    value: {},
  });
  const [pageNo, setPagNo] = useState(1);
  const [pages, setPages] = useState([]);
  const [lastPage, setLastPage] = useState();
  const [isRefundYesChecked, setIsRefundYesChecked] = useState(false);
  const [isRefundNoChecked, setIsRefundNoChecked] = useState(true);
  const [isWinYesChecked, setIsWinYesChecked] = useState(true);
  const [isWinNoChecked, setIsWinNoChecked] = useState(false);
  const [isRefund, setIsRefund] = useState("no");
  // const [isWin, setIsWin] = useState("yes");
  const [result, setResult] = useState("");
  const [OTP, setOTP] = useState(0);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [searchEventName, setSearchEventName] = useState("");
  const [searchEventId, setSearchEventId] = useState("");
  const [searchSelectionName, setSearchSelectionName] = useState("");
  const [selectSportType, setSelectSportType] = useState("");
  const [queryParams, setQueryParams] = useState("");

  const token = Cookies.get("token");

  const { mode } = useStore();
  // const mode = localStorage.getItem("mode");

  console.log(queryParams, "pp");

  const fetchUnSettledBets = async () => {
    console.log("hello vai");
    console.log(queryParams);

    try {
      const response = await fetch(
        `${baseUrl}/api/admin/get-unsettle-list?page=${pageNo}&${queryParams}`,
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
        console.log(data?.data, "res");

        setUnSettleBets(data?.data?.data);
        setPages(data?.data?.links);
        setLastPage(data?.data?.last_page);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
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

  const handleSendOTP = async () => {
    await axios
      .get(`${baseUrl}/api/admin/send-otp`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);

        if (res?.data?.status) {
          // console.log("asce");
          toast.success("Successfully sent the OTP. Please check your device.");
          setIsOTPSent(true);
        }
      });
  };

  const handleDoSettle = async () => {
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

    // const response = await fetch(`${baseUrl}/api/admin/do-settle`, {
    //   method: "POST",
    //   body: JSON.stringify(betData),
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // });

    // const data = await response.json();

    try {
      await axios
        .post(`${baseUrl}/api/admin/do-settle`, betData, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res?.data?.status) {
            toast.success("Successfull");

            setActionModalOpen({
              status: false,
              value: {},
            });
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
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    // Build the query string based on non-empty search inputs
    const queryParams = new URLSearchParams();

    if (searchEventName) queryParams.append("marketId", searchEventName);
    if (searchEventId) queryParams.append("eventId", searchEventId);
    if (searchSelectionName)
      queryParams.append("selectionName", searchSelectionName);
    if (selectSportType) queryParams.append("sport", selectSportType);

    setQueryParams(queryParams.toString());

    try {
      const response = await fetch(
        `${baseUrl}/api/admin/get-unsettle-list?page=${pageNo}&${queryParams.toString()}`,
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
        setUnSettleBets(data?.data?.data);
        if (data?.data?.data.length <= 0) {
          setPages([]);
        } else {
          setPages(data?.data?.links);
          setLastPage(data?.data?.last_page);
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };
  console.log(pages, "pages");

  const handleClear = () => {
    setQueryParams("");
    setSearchEventName("");
    setSearchEventId("");
    setSearchSelectionName("");
    setSelectSportType("");
    fetchUnSettledBets(); // or call this in an effect
  };

  useEffect(() => {
    // Run any effect needed when `queryParams` changes.
    if (!queryParams) {
      fetchUnSettledBets();
    }
  }, [queryParams]);

  return (
    <Layout>
      <div className="relative w-full h-full mt-16">
        <div className=" flex items-center justify-between">
          <h1
            className={`text-xl  font-bold border-l-8 border-purple-600 px-3 py-2 ${
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
              className={`w-52 px-3 py-2 text-sm rounded-sm bg-transparent outline-none border-2 border-slate-600 focus:border-teal-500 ${
                mode === "light" ? "text-black" : "text-white"
              }`}
            />
            <input
              onChange={(e) => setSearchEventId(e.target.value)}
              value={searchEventId}
              type="text"
              placeholder="Search Event Id"
              className={`w-52 px-3 py-2 text-sm rounded-sm bg-transparent outline-none border-2 border-slate-600 focus:border-teal-500 ${
                mode === "light" ? "text-black" : "text-white"
              }`}
            />
            <input
              onChange={(e) => setSearchSelectionName(e.target.value)}
              value={searchSelectionName}
              type="text"
              placeholder="Search Selection Name"
              className={`w-52 px-3 py-2 text-sm rounded-sm bg-transparent outline-none border-2 border-slate-600 focus:border-teal-500 ${
                mode === "light" ? "text-black" : "text-white"
              }`}
            />
            <select
              onChange={(e) => setSelectSportType(e.target.value)}
              value={selectSportType}
              className={`w-52 px-3 py-2 text-sm rounded-sm bg-transparent outline-none border-2 border-slate-600 focus:border-teal-500 ${
                mode === "light" ? "text-black" : "text-white"
              }`}
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
              onClick={handleSearch}
            >
              Get Bets
            </p>

            <p
              style={{
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset",
              }}
              className="bg-teal-500 text-white font-bold px-3 py-1 rounded cursor-pointer hover:bg-teal-400"
              onClick={handleClear}
            >
              Clear Filter
            </p>
          </div>
        </div>

        {/* users table */}
        <div className="relative overflow-x-auto max-h-screen overflow-y-auto my-5">
          <table className="w-full text-sm text-left rtl:text-right text-white  ">
            <thead
              className={`sticky top-0 text-xs  uppercase ${
                mode === "light"
                  ? "bg-blue-300 text-black"
                  : "bg-black text-white"
              }  border-b-2 border-t-2 border-black rounded-md border-l-2 border-r-2 `}
            >
              <tr>
                <th scope="col" className="px-6 py-3 text-left">
                  Sport
                </th>
                <th scope="col" className="px-6 py-3 text-left">
                  Event Id
                </th>
                <th scope="col" className="px-6 py-3 text-left">
                  Market Id
                </th>
                <th scope="col" className="px-6 py-3 text-left">
                  Market Date
                </th>
                <th scope="col" className="px-6 py-3 text-left">
                  Event Name
                </th>
                <th scope="col" className="px-6 py-3 text-left">
                  Selection Name
                </th>
                <th scope="col" className="px-6 py-3 text-left">
                  Bet Type
                </th>
                <th scope="col" className="px-6 py-3 text-left">
                  Action
                </th>
                <th scope="col" className="px-6 py-3 text-left">
                  Info
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
              ) : unSettleBets.length <= 0 ? (
                <tr className="text-center text-sm">
                  <td colSpan={12} align="center">
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
                unSettleBets.map((bet, i) => (
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
                    }  text-sm cursor-pointer transition-all duration-500 ease-in  border-b-2 border-slate-700 border-l-2 border-r-2 border-black`}
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
                      {formateDate(bet?.marketDate)}
                    </td>
                    <td className="px-6 py-4 text-left text-xs">
                      {bet?.eventTitle}
                    </td>
                    <td className="px-6 py-4 text-left text-xs">
                      {bet?.selectionName ? bet?.selectionName : "--"}
                    </td>
                    <td className="px-6 py-4 text-left text-xs">{bet?.type}</td>
                    <td className="px-6 py-4 text-left text-xl">
                      <AiFillEdit
                        onClick={() => {
                          setActionModalOpen({
                            status: true,
                            value: bet,
                          });
                        }}
                        className=""
                      />
                    </td>
                    <td className="px-6 py-4 text-center text-xl">
                      <IoMdInformationCircleOutline className="" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        {pages && pages.length > 0 && (
          <div className="mt-5 flex items-center justify-center gap-x-3">
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
            <div className="flex items-center gap-3">
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
            </div>
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

        {/* action modal */}
        {actionModalOpen.status && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setActionModalOpen({ status: false, value: {} });
              }
            }}
            className="w-full min-h-[100vh] bg-black bg-opacity-80 fixed top-0 right-0 flex justify-center items-center cursor-pointer"
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              style={{
                boxShadow:
                  "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
              }}
              className={`w-[400px] h-fit pb-5 rounded ${
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
                <p>Settle Bet</p>
                <p
                  onClick={() =>
                    setActionModalOpen({ status: false, value: {} })
                  }
                  className="bg-red-500 hover:bg-red-600 transition-all duration-300 ease-in px-3 py-1 rounded-md cursor-pointer text-white"
                >
                  Close
                </p>
              </div>

              <div className="mt-3 px-3 flex flex-col gap-y-4 ">
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
                        className={
                          mode === "light" ? "text-black" : "text-white"
                        }
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
                        className={
                          mode === "light" ? "text-black" : "text-white"
                        }
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
                        className={
                          mode === "light" ? "text-black" : "text-white"
                        }
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
                        className={
                          mode === "light" ? "text-black" : "text-white"
                        }
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
                            onChange={(e) =>
                              setResult(parseInt(e.target.value))
                            }
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
                  onClick={() =>
                    setActionModalOpen({ status: false, value: {} })
                  }
                  className="bg-teal-500 px-6 py-2 rounded-md cursor-pointer text-white hover:scale-105 hover:tracking-widest transition-all duration-300 ease-in"
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

export default UnsettleBet;
