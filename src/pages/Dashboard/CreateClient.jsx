import { useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { baseUrl } from "../../../config";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import useStore from "../../zustand/useStore";

const CreateClient = () => {
  const [name, setName] = useState("");
  const [ip, setIP] = useState("");
  const [uri, setURI] = useState("");
  const [xApiKey, setXApiKey] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  const token = Cookies.get("token");

  const { mode } = useStore();

  const handleCreateClient = () => {
    const createClientData = {
      name,
      clientIp: ip,
      clientCred: {
        base_uri: uri,
        xApiKey: xApiKey,
        clientId: clientId,
        clientSecretKey: clientSecret,
      },
    };

    axios
      .post(`${baseUrl}/api/admin/clients`, createClientData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res?.data?.status) {
          toast.success("Successfully Created");
        }
      });
  };
  return (
    <Layout>
      <div className="w-full h-full flex justify-center items-center min-h-screen">
        <div
          style={{
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset",
          }}
          className={`w-[30%] mx-auto h-fit  border-4 rounded-lg ${
            mode === "light"
              ? "border-slate-600 bg-white"
              : "bg-slate-600 border-white"
          } p-5`}
        >
          <p className="text-center font-bold text-blue-500 text-xl">
            Create Client
          </p>

          {/* form */}
          <div className="my-8 w-full flex flex-col gap-y-5">
            {/* name */}
            <div className="w-full  flex flex-col items-center gap-y-2">
              {/* <label htmlFor="name">Name</label> */}
              <input
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                type="text"
                className={`w-[80%] mx-auto ${
                  mode === "light"
                    ? "bg-gray-300 text-black"
                    : "bg-slate-800 text-white"
                } py-2 px-3 italic outline-none border-b-2 rounded border-slate-600 focus:border-blue-600`}
              />
            </div>
            {/* Ip */}
            <div className="w-full  flex flex-col items-center gap-y-2">
              {/* <label htmlFor="name">Name</label> */}
              <input
                onChange={(e) => setIP(e.target.value)}
                placeholder="Enter your IP"
                type="text"
                className={`w-[80%] mx-auto ${
                  mode === "light"
                    ? "bg-gray-300 text-black"
                    : "bg-slate-800 text-white"
                } py-2 px-3 italic outline-none border-b-2 rounded border-slate-600 focus:border-blue-600`}
              />
            </div>
            {/* URI */}
            <div className="w-full  flex flex-col items-center gap-y-2">
              {/* <label htmlFor="name">Name</label> */}
              <input
                onChange={(e) => setURI(e.target.value)}
                placeholder="Enter your URI"
                type="text"
                className={`w-[80%] mx-auto ${
                  mode === "light"
                    ? "bg-gray-300 text-black"
                    : "bg-slate-800 text-white"
                } py-2 px-3 italic outline-none border-b-2 rounded border-slate-600 focus:border-blue-600`}
              />
            </div>
            {/* xApiKey */}
            <div className="w-full  flex flex-col items-center gap-y-2">
              {/* <label htmlFor="name">Name</label> */}
              <input
                onChange={(e) => setXApiKey(e.target.value)}
                placeholder="Enter your XApiKey"
                type="text"
                className={`w-[80%] mx-auto ${
                  mode === "light"
                    ? "bg-gray-300 text-black"
                    : "bg-slate-800 text-white"
                } py-2 px-3 italic outline-none border-b-2 rounded border-slate-600 focus:border-blue-600`}
              />
            </div>
            {/* clientid */}
            <div className="w-full  flex flex-col items-center gap-y-2">
              {/* <label htmlFor="name">Name</label> */}
              <input
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Enter your Client ID"
                type="text"
                className={`w-[80%] mx-auto ${
                  mode === "light"
                    ? "bg-gray-300 text-black"
                    : "bg-slate-800 text-white"
                } py-2 px-3 italic outline-none border-b-2 rounded border-slate-600 focus:border-blue-600`}
              />
            </div>
            {/* client secret */}
            <div className="w-full  flex flex-col items-center gap-y-2">
              {/* <label htmlFor="name">Name</label> */}
              <input
                onChange={(e) => setClientSecret(e.target.value)}
                placeholder="Enter your Client Secret"
                type="text"
                className={`w-[80%] mx-auto ${
                  mode === "light"
                    ? "bg-gray-300 text-black"
                    : "bg-slate-800 text-white"
                } py-2 px-3 italic outline-none border-b-2 rounded border-slate-600 focus:border-blue-600`}
              />
            </div>
            {/* create button */}
            <div className="flex justify-center">
              <button
                onClick={handleCreateClient}
                className="bg-blue-400 hover:bg-blue-500 px-6 py-2 rounded-md"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateClient;
