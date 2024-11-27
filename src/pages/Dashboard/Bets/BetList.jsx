import { useEffect, useRef, useState } from "react";
import Layout from "../../../components/Layout/Layout";
import { baseUrl } from "../../../../config";
import Cookies from "js-cookie";
import { Circles } from "react-loader-spinner";
import toast from "react-hot-toast";
import useStore from "../../../zustand/useStore";
import InputDate from "../../../components/Shared/InputDate";

const BetList = () => {
  const [betList, setBetList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [isBetPlaceLoading, setIsBetPlaceLoading] = useState(false);
  // const [actionModalOpen, setActionModalOpen] = useState({
  //   status: false,
  //   value: {},
  // });
  const [pageNo, setPagNo] = useState(1);
  const [pages, setPages] = useState([]);
  const [lastPage, setLastPage] = useState();
  // const [isRefundYesChecked, setIsRefundYesChecked] = useState(false);
  // const [isRefundNoChecked, setIsRefundNoChecked] = useState(true);
  // const [isWinYesChecked, setIsWinYesChecked] = useState(true);
  // const [isWinNoChecked, setIsWinNoChecked] = useState(false);
  // const [isRefund, setIsRefund] = useState("no");
  // const [result, setResult] = useState("");
  // const [OTP, setOTP] = useState(0);
  // const [isOTPSent, setIsOTPSent] = useState(false);

  const [initialStartDate, setInitialStartDate] = useState("");
  const [selectedBetStatus, setSelectedBetStatus] = useState("");
  const [selectedSportType, setSelectedSportType] = useState("");
  const [startDate, setStartDate] = useState(initialStartDate);
  const [startDate2, setStartDate2] = useState(new Date());
  const [singleDate, setSingleDate] = useState("");
  const [searchBetId, setSearchBetId] = useState("");
  const [searchSettledAt, setSearchSettledAt] = useState("");
  const [searchSelectionName, setSearchSelectionName] = useState("");
  const [searchMarketId, setSearchMarketId] = useState("");
  const [searchBetType, setSearchBetType] = useState("");
  const [searchEventTitle, setSearchEventTitle] = useState("");

  const [datePeriod, setDatePeriod] = useState("");
  const [queryParamss, setQueryParamss] = useState("");

  const inputDateRef1 = useRef();
  const inputDateRef2 = useRef();

  // get cookies value
  const token = Cookies.get("token");

  const { mode } = useStore();
  // const mode = localStorage.getItem("mode");

  const getInitialStartDate = () => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() - 7);
    setInitialStartDate(newDate);
    setStartDate(newDate);
  };

  const fetchBetList = async (withClear) => {
    try {
      const response = await fetch(
        `${baseUrl}/api/admin/get-bet-lists?page=${pageNo}&${
          withClear ? "" : queryParamss
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
        setBetList(data?.data?.data);
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
    fetchBetList();
    handleSearch();
  }, [pageNo]);

  useEffect(() => {
    getInitialStartDate();
  }, []);

  // const handleYesChange = () => {
  //   setIsRefundYesChecked(true);
  //   setIsRefundNoChecked(false);
  //   setIsRefund("yes");
  // };

  // const handleNoChange = () => {
  //   setIsRefundYesChecked(false);
  //   setIsRefundNoChecked(true);
  //   setIsRefund("no");
  // };

  // const handleWinYesChange = () => {
  //   setIsWinYesChecked(true);
  //   setIsWinNoChecked(false);
  //   // setIsWin("yes");
  //   setResult("yes");
  // };

  // const handleWinNoChange = () => {
  //   setIsWinYesChecked(false);
  //   setIsWinNoChecked(true);
  //   // setIsWin("no");
  //   setResult("no");
  // };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // const handleSendOTP = async () => {
  //   await axios
  //     .get(`${baseUrl}/api/admin/send-otp`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((res) => {
  //       // console.log(res);

  //       if (res?.data?.status) {
  //         // console.log("asce");
  //         toast.success("Successfully sent the OTP. Please check your device.");
  //         setIsOTPSent(true);
  //       }
  //     });
  // };

  // const handleDoSettle = async () => {
  //   setIsBetPlaceLoading(true);
  //   const betData = {
  //     eventId: actionModalOpen.value.eventId,
  //     marketId: actionModalOpen.value.marketId,
  //     selectionName: actionModalOpen.value.selectionName
  //       ? actionModalOpen.value.selectionName
  //       : actionModalOpen.value.eventTitle,
  //     isRefund: isRefund,
  //     type: actionModalOpen?.value?.type,
  //     gtype:
  //       actionModalOpen?.value?.type === "Fancy"
  //         ? actionModalOpen?.value?.gtype
  //         : null,
  //     result: isRefund === "yes" ? null : result,
  //     otp: isRefund === "yes" && OTP,
  //   };

  //   // const response = await fetch(`${baseUrl}/api/admin/do-settle`, {
  //   //   method: "POST",
  //   //   body: JSON.stringify(betData),
  //   //   headers: {
  //   //     Authorization: `Bearer ${token}`,
  //   //   },
  //   // });

  //   // const data = await response.json();

  //   try {
  //     await axios
  //       .post(`${baseUrl}/api/admin/do-settle`, betData, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           Accept: "application/json",
  //           "Content-Type": "application/json",
  //         },
  //       })
  //       .then((res) => {
  //         if (res?.data?.status) {
  //           toast.success("Successfull");

  //           setActionModalOpen({
  //             status: false,
  //             value: {},
  //           });
  //           fetchUnSettledBets();
  //         }
  //       });
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message);
  //   } finally {
  //     setIsBetPlaceLoading(false);
  //     setResult("");
  //     setIsRefund("no");
  //     setOTP(0);
  //     setIsOTPSent(false);
  //     setIsRefundYesChecked(false);
  //     setIsRefundNoChecked(true);
  //     setIsWinYesChecked(true);
  //     setIsWinNoChecked(false);
  //   }
  // };

  const handleSearch = async () => {
    setIsLoading(true);

    const queryParams = new URLSearchParams();

    if (selectedSportType !== "")
      queryParams.append("sport", selectedSportType);
    if (selectedBetStatus !== "")
      queryParams.append("status", selectedBetStatus);
    if (searchMarketId) queryParams.append("marketId", searchMarketId);
    if (singleDate !== "")
      queryParams.append("singleDate", formatDate(singleDate));
    if (startDate !== "") queryParams.append("starDate", formatDate(startDate));
    if (startDate2 !== "")
      queryParams.append("endDate", formatDate(startDate2));
    if (searchEventTitle) queryParams.append("eventTitle", searchEventTitle);
    if (searchBetId) queryParams.append("betId", searchBetId);
    if (searchSettledAt) queryParams.append("betSettledAt", searchSettledAt);
    if (searchBetType) queryParams.append("type", searchBetType);
    if (searchSelectionName)
      queryParams.append("selectionName", searchSelectionName);

    setQueryParamss(queryParams.toString());

    try {
      const response = await fetch(
        `${baseUrl}/api/admin/get-bet-lists?page=${pageNo}&${queryParams.toString()}`,
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
        setBetList(data?.data?.data);
        if (data?.data?.data.length <= 0) {
          setPages([]);
        } else {
          setPages(data?.data?.links);
          setLastPage(data?.data?.last_page);
        }
      } else {
        setBetList(data?.data?.data);
        setPages([]);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = (e) => {
    e.preventDefault();

    setQueryParamss("");
    setSearchMarketId("");
    setSearchEventTitle("");
    setSearchSelectionName("");
    setSelectedSportType("");
    setSelectedBetStatus("");
    setStartDate("");
    setStartDate2("");
    setSingleDate("");
    setDatePeriod("");
    setSearchBetId("");
    setSelectedSportType("");
    setSearchBetId("");
    setSearchBetType("");
    setSearchSettledAt("");

    fetchBetList(true);
  };

  return (
    <Layout>
      <div className="relative w-full h-full mt-6 xl:mt-16">
        <div className=" flex items-center justify-between">
          <h1
            className={`text-xl  font-bold border-l-8 border-purple-600 px-3 py-2 uppercase ${
              mode === "light" ? "text-black" : "text-white"
            }`}
          >
            Bet List
          </h1>
        </div>
        {/* search box */}
        <div
          className={`mt-5 flex flex-col gap-4 ${
            mode === "light" ? "bg-blue-50" : "bg-gray-700"
          } p-5 rounded`}
        >
          {/* sport type */}
          <div className={mode === "light" ? "text-black" : "text-white"}>
            <div className="flex items-center gap-4">
              {/* all sport */}
              <div className="flex items-center gap-x-2">
                <div
                  onClick={() => setSelectedSportType("")}
                  className={`w-5 h-5 rounded-full border border-black flex justify-center items-center cursor-pointer ${
                    selectedSportType === "" && "bg-red-700"
                  }`}
                >
                  {selectedSportType === "" && (
                    <button
                      className={`w-2 h-2 rounded-3xl border border-black bg-white`}
                    />
                  )}
                </div>
                <p>All</p>
              </div>
              {/* cricket */}
              <div className="flex items-center gap-x-2">
                <div
                  onClick={() => setSelectedSportType("Cricket")}
                  className={`w-5 h-5 rounded-full border border-black flex justify-center items-center cursor-pointer ${
                    selectedSportType === "Cricket" && "bg-red-700"
                  }`}
                >
                  {selectedSportType === "Cricket" && (
                    <button
                      className={`w-2 h-2 rounded-3xl border border-black bg-white`}
                    />
                  )}
                </div>
                <p>Cricket</p>
              </div>
              {/* soccer */}
              <div className="flex items-center gap-x-2">
                <div
                  onClick={() => setSelectedSportType("Soccer")}
                  className={`w-5 h-5 rounded-full border border-black flex justify-center items-center cursor-pointer ${
                    selectedSportType === "Soccer" && "bg-red-700"
                  }`}
                >
                  {selectedSportType === "Soccer" && (
                    <button
                      className={`w-2 h-2 rounded-3xl border border-black bg-white`}
                    />
                  )}
                </div>
                <p>Soccer</p>
              </div>
              {/* Tennis */}
              <div className="flex items-center gap-x-2">
                <div
                  onClick={() => setSelectedSportType("Tennis")}
                  className={`w-5 h-5 rounded-full border border-black flex justify-center items-center cursor-pointer ${
                    selectedSportType === "Tennis" && "bg-red-700"
                  }`}
                >
                  {selectedSportType === "Tennis" && (
                    <button
                      className={`w-2 h-2 rounded-3xl border border-black bg-white`}
                    />
                  )}
                </div>
                <p>Tennis</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-row flex-wrap xl:items-center gap-3">
              <div className="flex flex-col xl:flex-row  gap-2 w-full">
                <div className="flex items-center gap-2 w-full xl:w-fit">
                  {/* bet status */}
                  <div className="w-full">
                    <select
                      onChange={(e) => setSelectedBetStatus(e.target.value)}
                      value={selectedBetStatus}
                      className={`w-full xl:w-40 px-3 py-2 text-xs xl:text-sm rounded-sm  outline-none border-2 border-slate-600 focus:border-teal-500 ${
                        mode === "light"
                          ? "text-black bg-transparent"
                          : "text-white bg-[#201F1F]"
                      }`}
                    >
                      <option value="">Select Bet Status</option>
                      <option value="Unmatched">Unmatched</option>
                      <option value="Matched">Matched</option>
                      <option value="Settled">Settled</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Voided">Voided</option>
                    </select>
                  </div>
                  {/* bet type */}
                  <div className="w-full">
                    <select
                      onChange={(e) => setSearchBetType(e.target.value)}
                      value={searchBetType}
                      className={`w-full xl:w-40 px-3 py-2 text-xs xl:text-sm rounded-sm  outline-none border-2 border-slate-600 focus:border-teal-500 ${
                        mode === "light"
                          ? "text-black bg-transparent"
                          : "text-white bg-[#201F1F]"
                      }`}
                    >
                      <option value="">Select Market</option>
                      <option value="Match Odds">Match Odds</option>
                      <option value="Fancy">Fancy</option>
                      <option value="Bookmaker">Bookmaker</option>
                      <option value="Sports Book">Sports Book</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full xl:w-fit">
                  {/* search bet id */}
                  <div className="w-full xl:w-fit">
                    <input
                      onChange={(e) => setSearchBetId(e.target.value)}
                      value={searchBetId}
                      className={`w-full xl:w-40 px-3 py-2 text-xs xl:text-sm rounded-sm  outline-none border-2 border-slate-600 focus:border-teal-500 ${
                        mode === "light"
                          ? "text-black bg-transparent"
                          : "text-white bg-[#201F1F]"
                      }`}
                      placeholder="Search Bet Id"
                      type="text"
                    />
                  </div>
                  {/* bet settled at */}
                  <div className="w-full xl:w-fit">
                    <input
                      onChange={(e) => setSearchSettledAt(e.target.value)}
                      value={searchSettledAt}
                      className={`w-full xl:w-40 px-3 py-2 text-xs xl:text-sm rounded-sm  outline-none border-2 border-slate-600 focus:border-teal-500 ${
                        mode === "light"
                          ? "text-black bg-transparent"
                          : "text-white bg-[#201F1F]"
                      }`}
                      placeholder="Search Settled Time"
                      type="text"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full xl:w-fit">
                  {/* selection name */}
                  <div className="w-full xl:w-fit">
                    <input
                      onChange={(e) => setSearchSelectionName(e.target.value)}
                      value={searchSelectionName}
                      className={`w-full xl:w-40 px-3 py-2 text-xs xl:text-sm rounded-sm  outline-none border-2 border-slate-600 focus:border-teal-500 ${
                        mode === "light"
                          ? "text-black bg-transparent"
                          : "text-white bg-[#201F1F]"
                      }`}
                      placeholder="Search Selection Name"
                      type="text"
                    />
                  </div>
                  {/* event title */}
                  <div className="w-full xl:w-fit">
                    <input
                      onChange={(e) => setSearchEventTitle(e.target.value)}
                      value={searchEventTitle}
                      className={`w-full xl:w-40 px-3 py-2 text-xs xl:text-sm rounded-sm  outline-none border-2 border-slate-600 focus:border-teal-500 ${
                        mode === "light"
                          ? "text-black bg-transparent"
                          : "text-white bg-[#201F1F]"
                      }`}
                      placeholder="Search Event Title"
                      type="text"
                    />
                  </div>
                </div>
              </div>
              {/* date period */}
              <div className="flex flex-col xl:flex-row xl:items-center gap-2 w-full">
                <div className="flex items-center gap-2 w-full xl:w-fit">
                  {/* start */}
                  <div
                    className={`flex flex-col xl:flex-row xl:items-center xl:border-2 xl:border-slate-600 xl:px-3 2xl:justify-between gap-2 w-full xl:w-fit ${
                      mode === "light"
                        ? "text-black xl:bg-transparent"
                        : "text-white xl:bg-[#201F1F]"
                    }`}
                  >
                    <p className="xl:w-fit">Period</p>
                    {/* date */}
                    <div
                      onClick={() => {
                        setDatePeriod("period");
                      }}
                      className="w-full xl:w-fit"
                    >
                      <InputDate
                        className="w-fit"
                        ref={inputDateRef1}
                        startDate={startDate}
                        setStartDate={setStartDate}
                      />
                    </div>
                  </div>
                  {/* end */}
                  <div
                    className={`flex flex-col xl:flex-row xl:items-center xl:border-2 xl:border-slate-600 xl:px-3 2xl:justify-between gap-2 w-full ${
                      mode === "light"
                        ? "text-black xl:bg-transparent"
                        : "text-white xl:bg-[#201F1F]"
                    }`}
                  >
                    <p className="xl:w-fit">To</p>
                    {/* date */}
                    <div
                      onClick={() => {
                        setDatePeriod("period");
                      }}
                      className="relative w-full xl:w-fit"
                    >
                      <InputDate
                        ref={inputDateRef2}
                        startDate={startDate2}
                        setStartDate={setStartDate2}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full xl:w-fit">
                  {/* Just for today button */}
                  <div className="w-full xl:w-fit">
                    <button
                      onClick={() => {
                        setStartDate("");
                        setStartDate2("");
                        setDatePeriod("today");
                        setSingleDate(new Date());
                      }}
                      className={`${
                        datePeriod === "today"
                          ? "bg-teal-400"
                          : "border-2 border-teal-400"
                      } ${
                        mode === "light" ? "text-black" : "text-white"
                      } w-full xl:w-40 px-2 py-1 rounded`}
                    >
                      Just For Today
                    </button>
                  </div>
                  {/* Yesterday button */}
                  <div className="w-full xl:w-fit">
                    <button
                      onClick={() => {
                        setSingleDate("");
                        setDatePeriod("yesterday");
                        const yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1);
                        setStartDate(yesterday);
                        setStartDate2(new Date());
                      }}
                      className={`${
                        datePeriod === "yesterday"
                          ? "bg-teal-400"
                          : "border-2 border-teal-400"
                      } ${
                        mode === "light" ? "text-black" : "text-white"
                      } w-full xl:w-40 px-2 py-1 rounded`}
                    >
                      From Yesterday
                    </button>
                  </div>
                </div>

                {/* buttons */}
                <div className="flex items-center gap-2 w-full">
                  <button
                    style={{
                      boxShadow:
                        "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset",
                    }}
                    className="inline bg-teal-500 text-white font-bold px-3 py-1 rounded cursor-pointer hover:bg-teal-400"
                    onClick={handleSearch}
                  >
                    Get P & L
                  </button>
                  <button
                    style={{
                      boxShadow:
                        "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset",
                    }}
                    className="bg-teal-500 text-white font-bold px-3 py-1 rounded cursor-pointer hover:bg-teal-400"
                    onClick={(e) => {
                      handleClear(e);
                    }}
                  >
                    Clear Filter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center overflow-hidden pb-3">
          {/* Users table */}
          <div className="relative h-[800px] overflow-y-auto overflow-x-auto my-5 w-full">
            <table className="w-full text-xs sm:text-sm text-left text-white">
              <thead
                className={`sticky top-0 uppercase ${
                  mode === "light"
                    ? "bg-blue-300 text-black"
                    : "bg-black text-white"
                } border-2 border-black`}
              >
                <tr>
                  <th scope="col" className="px-2 py-2 whitespace-nowrap">
                    Pl Id
                  </th>
                  <th scope="col" className="px-2 py-2 whitespace-nowrap">
                    Bet Id
                  </th>
                  <th scope="col" className="px-2 py-2 whitespace-nowrap">
                    Bet Taken
                  </th>
                  <th scope="col" className="px-2 py-2 whitespace-nowrap">
                    Bet settled
                  </th>
                  <th scope="col" className="px-2 py-2 whitespace-nowrap">
                    Event
                  </th>
                  <th scope="col" className="px-2 py-2 whitespace-nowrap">
                    Selection Name
                  </th>
                  <th scope="col" className="px-2 py-2 whitespace-nowrap">
                    Market
                  </th>
                  <th scope="col" className="px-2 py-2 whitespace-nowrap">
                    Type
                  </th>
                  <th scope="col" className="px-2 py-2 whitespace-nowrap">
                    Odds Req.
                  </th>
                  <th scope="col" className="px-2 py-2 whitespace-nowrap">
                    Stake
                  </th>
                  <th scope="col" className="px-2 py-2 whitespace-nowrap">
                    Profit/Loss
                  </th>
                  <th scope="col" className="px-2 py-2 whitespace-nowrap">
                    Status
                  </th>
                  <th scope="col" className="px-2 py-2 whitespace-nowrap">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody className="w-full">
                {isLoading ? (
                  <tr className="text-center text-sm">
                    <td colSpan={13} align="center">
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
                ) : betList.length <= 0 ? (
                  <tr>
                    <td colSpan={13} className="py-5 text-center">
                      <p
                        className={`${
                          mode === "light" ? "text-black" : "text-white"
                        }`}
                      >
                        No data to show
                      </p>
                    </td>
                  </tr>
                ) : (
                  betList.map((bet, i) => (
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
                      } text-xs sm:text-sm transition-all duration-500 ease-in border-2 border-slate-700`}
                    >
                      <td className="px-2 py-4 whitespace-nowrap text-xs">
                        {bet?.plId ? bet?.plId : "--"}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-xs">
                        {bet?.betId ? bet?.betId : "--"}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-xs">
                        {bet?.betTakenAt ? bet?.betTakenAt : "--"}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-xs">
                        {bet?.betSettledAt ? bet?.betSettledAt : "--"}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-xs">
                        {bet?.eventTitle || "--"}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-xs">
                        {bet?.selectionName ? bet?.selectionName : "--"}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-xs">
                        {bet?.market ? bet?.market : "--"}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-xs">
                        {bet?.type ? bet?.type : "--"}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-xs">
                        {bet?.odd ? bet?.odd.toFixed(2) : "--"}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-xs">
                        {bet?.stake ? bet?.stake : "--"}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-xs">
                        {bet?.profitLoss ? bet?.profitLoss.toFixed(2) : "--"}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-xs">
                        {bet?.status ? bet?.status : "--"}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-xs">
                        {"---"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pages && pages.length > 0 && (
            <div className="mt-5 self-center xl:self-center flex items-center gap-2 flex-wrap justify-center">
              {parseInt(pageNo) !== 1 && (
                <p
                  onClick={() => {
                    if (pages[0]?.url) {
                      const pN = parseInt(pages[0]?.url.split("=")[1]);
                      setPagNo(pN);
                    }
                  }}
                  className={`border px-2 rounded-md cursor-pointer ${
                    mode === "light"
                      ? "border-black text-black"
                      : "border-white text-white"
                  }`}
                >
                  Prev
                </p>
              )}
              {pages.slice(1, -1).map((page, i) => (
                <p
                  key={i}
                  onClick={() => setPagNo(parseInt(page?.label))}
                  className={`border px-2 rounded-md cursor-pointer ${
                    pageNo == page?.label
                      ? mode === "light"
                        ? "bg-black text-white border-white shadow-xl"
                        : "bg-slate-300 text-black border-slate-200 shadow-xl"
                      : mode === "light"
                      ? "text-black border-black"
                      : "text-white border-white"
                  }`}
                >
                  {page?.label}
                </p>
              ))}
              {parseInt(pageNo) !== lastPage && (
                <p
                  onClick={() => {
                    if (pages[pages.length - 1]?.url) {
                      const pN = parseInt(
                        pages[pages.length - 1]?.url.split("=")[1]
                      );
                      setPagNo(pN);
                    }
                  }}
                  className={`border px-2 rounded-md cursor-pointer ${
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

        {/* action modal */}
        {/* {actionModalOpen.status && (
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
                <div className="flex flex-col justify-between gap-2">
                  <label
                    htmlFor="username"
                    className={mode === "light" ? "text-black" : "text-white"}
                  >
                    Selection Name
                  </label>
                  <input
                   
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
        )} */}
      </div>
    </Layout>
  );
};

export default BetList;
