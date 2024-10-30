import toast from "react-hot-toast";
import Layout from "../../../components/Layout/Layout";
import { useEffect, useState } from "react";
import { baseUrl } from "../../../../config";
import Cookies from "js-cookie";
import { Circles } from "react-loader-spinner";
import { IoMdInformationCircleOutline } from "react-icons/io";

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

  const token = Cookies.get("token");
  const fetchUnSettledBets = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/api/admin/get-settle-list?page=${pageNo}`,
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
  }, [pageNo]);
  return (
    <Layout>
      <div className="relative w-full h-full pt-6">
        <div className=" flex items-center justify-between">
          <h1 className="text-xl text-rose-600 font-bold tracking-widest">
            Settle Bets List
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
                  Resettle
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
                settleBetList.map((bet) => (
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
                    <td className="px-6 py-4 text-center text-xl"></td>
                    <td
                      onClick={() =>
                        setInfoModalOpen({
                          status: true,
                          value: bet,
                        })
                      }
                      className="px-6 py-4 text-center text-xl"
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

        {/* info modal */}
        {infoModalOpen.status && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setInfoModalOpen({ status: false, value: {} });
              }
            }}
            className="w-full min-h-[100vh] bg-black bg-opacity-80 fixed top-0 right-0 flex justify-center items-center cursor-pointer"
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="w-[500px] h-fit pb-5 bg-white rounded"
            >
              <div className="py-4 px-3 flex justify-between items-center rounded bg-gray-300 text-black">
                <p>Settlement Information</p>
                <p
                  onClick={() => setInfoModalOpen({ status: false, value: {} })}
                  className="bg-red-500 hover:bg-red-600 transition-all duration-300 ease-in px-2 py-0.5 rounded-md cursor-pointer text-white"
                >
                  Close
                </p>
              </div>

              <div className="mt-3 px-3 flex flex-col rounded-md overflow-hidden">
                <div className="flex justify-between items-center font-bold text-sm bg-gray-400 p-2 rounded-tl-md rounded-tr-md">
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
                      ? infoModalOpen?.value?.result?.result
                      : "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SetteBet;
