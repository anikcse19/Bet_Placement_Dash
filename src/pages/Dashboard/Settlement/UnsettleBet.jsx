import { useEffect, useState } from "react";
import Layout from "../../../components/Layout/Layout";
import { baseUrl } from "../../../../config";
import Cookies from "js-cookie";
import { Circles } from "react-loader-spinner";
import { AiFillEdit } from "react-icons/ai";
import { IoMdInformationCircleOutline } from "react-icons/io";
import toast from "react-hot-toast";
import axios from "axios";

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

  const token = Cookies.get("token");

  const fetchUnSettledBets = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/api/admin/get-unsettle-list?page=${pageNo}`,
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

  console.log(result, "re");
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
    console.log("reslt in act", result);

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

    console.log(betData, "result data");

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

  return (
    <Layout>
      <div className="relative w-full h-full pt-6">
        <div className=" flex items-center justify-between">
          <h1 className="text-xl text-rose-600 font-bold tracking-widest">
            Unsettle Bets List
          </h1>
        </div>
        {/* search box */}
        <div className="mt-3">
          <input
            // onChange={(e) => setSearchValue(e.target.value)}
            type="text"
            placeholder="Search Event Name"
            className=" w-52 px-2 py-2 text-sm rounded-md outline-none border-2 border-black focus:border-teal-500"
          />
        </div>
        {/* users table */}
        <div className="relative overflow-x-auto max-h-screen overflow-y-auto my-5">
          <table className="w-full text-sm text-left rtl:text-right text-white  ">
            <thead className="sticky top-0 text-xs text-black uppercase bg-red-50  border-b-2 border-t-2 border-black rounded-md">
              <tr>
                <th scope="col" className="px-6 py-3 text-center">
                  Sport
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Event Id
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Market Date
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Event Name
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Selection Name
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Bet Type
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Action
                </th>
                <th scope="col" className="px-6 py-3 text-center">
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
              ) : (
                unSettleBets.map((bet) => (
                  <tr
                    key={bet.id}
                    className="bg-red-50 hover:bg-red-200 text-sm cursor-pointer transition-all duration-500 ease-in text-black border-b-2 border-slate-700 "
                  >
                    <td className="px-6 py-4 text-center text-xs">
                      {bet?.sport}
                    </td>
                    <td className="px-6 py-4 text-center text-xs">
                      {bet?.eventId}
                    </td>
                    <td className="px-6 py-4 text-center text-xs">
                      {formateDate(bet?.marketDate)}
                    </td>
                    <td className="px-6 py-4 text-center text-xs">
                      {bet?.eventTitle}
                    </td>
                    <td className="px-6 py-4 text-center text-xs">
                      {bet?.selectionName ? bet?.selectionName : "--"}
                    </td>
                    <td className="px-6 py-4 text-center text-xs">
                      {bet?.type}
                    </td>
                    <td className="px-6 py-4 text-center text-xl">
                      <AiFillEdit
                        onClick={() => {
                          setActionModalOpen({
                            status: true,
                            value: bet,
                          });
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 text-center text-xl">
                      <IoMdInformationCircleOutline />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* pagination */}
        <div className="mt-5 flex items-center justify-center gap-x-3">
          {pageNo !== 1 && (
            <p
              onClick={() => {
                if (pages[0]?.url !== null) {
                  const pN = parseInt(pages[0]?.url.split("=")[1]);
                  setPagNo(pN);
                }
              }}
              className="border-2 border-black px-2 rounded-md cursor-pointer"
            >
              Prev
            </p>
          )}
          <div className="flex items-center gap-3">
            {pages.slice(1, -1).map((page, i) => {
              return (
                <p
                  className={`border-2 border-black px-2 rounded-md cursor-pointer ${
                    pageNo == page?.label && "bg-black text-white"
                  }`}
                  onClick={() => {
                    console.log(page?.label, "a");

                    setPagNo(page?.label);
                  }}
                  key={i}
                >
                  {page?.label}
                </p>
              );
            })}
          </div>
          {pageNo !== lastPage && (
            <p
              onClick={() => {
                if (pages[pages.length - 1]?.url !== null) {
                  const pN = parseInt(
                    pages[pages.length - 1]?.url.split("=")[1]
                  );
                  setPagNo(pN);
                }
              }}
              className="border-2 border-black px-2 rounded-md cursor-pointer"
            >
              Next
            </p>
          )}
        </div>

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
              className="w-[400px] h-fit pb-5 bg-white rounded"
            >
              <div className="py-4 px-3 flex justify-between items-center rounded bg-gray-300 text-black">
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
                  <label htmlFor="username" className="text-black">
                    Selection Name
                  </label>
                  <input
                    // onChange={(e) => setAmount(e.target.value)}
                    value={actionModalOpen?.value?.selectionName}
                    type="text"
                    className="border border-gray-700 w-[95%] px-5 py-2  rounded-md"
                    placeholder="Selection Name"
                  />
                </div>
                {/* refund */}
                <div className="flex flex-col justify-between gap-1">
                  <label
                    htmlFor="refund"
                    className="text-black text-sm tracking-wider"
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
                      <p>Yes</p>
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
                      <p>No</p>
                    </div>
                  </div>
                </div>

                {isRefund === "yes" ? (
                  isOTPSent ? (
                    <div className="flex flex-col justify-between gap-2">
                      <label htmlFor="otp" className="text-black">
                        Enter OTP
                        <p className="text-red-500 font-bold inline">*</p>
                      </label>
                      <div className="bg-white flex items-center border border-gray-700 w-[95%] px-5 py-2  rounded-md">
                        <input
                          onChange={(e) => setOTP(parseInt(e.target.value))}
                          type="text"
                          className="flex-grow outline-none"
                          placeholder="Enter OTP"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col justify-between gap-2">
                      <label htmlFor="otp" className="text-black">
                        Send OTP
                        <p className="text-red-500 font-bold inline">*</p>
                      </label>
                      <div className="bg-white flex items-center border border-gray-700 w-[95%] px-5 py-2  rounded-md">
                        <input
                          // onChange={(e) => setOTP(parseInt(e.target.value))}
                          type="text"
                          className="flex-grow outline-none"
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
                            className="text-black"
                          >
                            Run or Wickets
                            <p className="inline text-red-500">*</p>
                          </label>
                          <input
                            type="text"
                            onChange={(e) =>
                              setResult(parseInt(e.target.value))
                            }
                            className="border border-gray-700 w-[95%] px-5 py-2 rounded-md"
                            placeholder="Enter Runs or Wickets"
                          />
                        </div>
                      ) : actionModalOpen.value.gtype === "oddeven" ||
                        actionModalOpen.value.gtype === "fancy1" ? (
                        <div className="flex flex-col justify-between gap-1 mt-2">
                          <label
                            htmlFor="refund"
                            className="text-black tracking-wider"
                          >
                            IsWon?
                          </label>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <input
                                onChange={handleWinYesChange}
                                className="w-3 h-3 rounded-md cursor-pointer"
                                type="checkbox"
                                name="isWonYes"
                                id="isWonYes"
                                checked={isWinYesChecked}
                              />
                              <p>Yes</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                onChange={handleWinNoChange}
                                className="w-3 h-3 rounded-md cursor-pointer"
                                type="checkbox"
                                name="isWonNo"
                                id="isWonNo"
                                checked={isWinNoChecked}
                              />
                              <p>No</p>
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
                          className="text-black text-sm tracking-wider"
                        >
                          Select Winner Team
                        </label>
                        <select
                          onChange={(e) => setResult(parseInt(e.target.value))}
                          className="border border-gray-700 w-[95%] px-5 py-2 rounded-md"
                          placeholder="Enter amount"
                        >
                          <option value="">Select Winner</option>
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
                    <p className="text-white font-bold text-2xl">Loading..</p>
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
