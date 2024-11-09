import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { baseUrl } from "../../../config";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import useStore from "../../zustand/useStore";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaLeftLong } from "react-icons/fa6";

const UpdateUser = () => {
  const [currentState, setCurrentState] = useState("update");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [conNewPass, setConNewPass] = useState("");

  const [showedOldPass, setShowedOldPass] = useState(false);
  const [showedNewPass, setShowedNewPass] = useState(false);
  const [showedConNewPass, setShowedConNewPass] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;

  const token = Cookies.get("token");
  const { mode } = useStore();

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/admin/get-user-data/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      .then((res) => {
        if (res?.data?.status) {
          setFullName(res?.data?.data?.name);
          setEmail(res?.data?.data?.email);
          setRole(res?.data?.data?.user_type);
        }
      });
  }, []);

  const handleChangePassword = async () => {
    try {
      const changePassData = {
        old_password: oldPass,
        new_password: newPass,
        new_password_confirmation: conNewPass,
      };

      axios
        .post(`${baseUrl}/api/admin/change-password`, changePassData, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
        .then((res) => {
          if (res?.data?.status) {
            toast.success(res?.data?.message);
            navigate("/dashboard/users-list");
          } else {
            toast.error(res?.data?.message);
          }
        });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setFullName("");
      setEmail("");
      // setPassword("");
      setRole("");
    }
  };

  const handleUpdateUser = async () => {
    try {
      const createUserData = {
        email,
        full_name: fullName,
        role_type: parseInt(role),
      };

      axios
        .post(`${baseUrl}/api/admin/get-user-data/${id}`, createUserData, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
        .then((res) => {
          if (res?.data?.status) {
            toast.success(res?.data?.message);
            navigate("/dashboard/users-list");
          } else {
            toast.error(res?.data?.message);
          }
        });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setFullName("");
      setEmail("");
      // setPassword("");
      setRole("");
    }
  };
  return (
    <Layout>
      <div className="w-full h-screen flex justify-center mt-20 ">
        <div
          style={{
            boxShadow: "rgba(0.35, 0, 0, 0.35) 0px 5px 15px",
          }}
          className={`p-3  flex flex-col h-fit rounded-md ${
            mode === "light"
              ? "bg-blue-200 border-2 border-black"
              : "bg-slate-800 border-2 border-white"
          }`}
        >
          <div
            style={{
              boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
            }}
            className={`p-3  flex flex-col h-fit rounded-md ${
              mode === "light"
                ? "bg-blue-200 border-2 border-black"
                : "bg-slate-800 border-2 border-white"
            }`}
          >
            <div
              style={{
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
              }}
              className={`flex flex-col gap-y-5 h-fit p-10 rounded-md  w-[500px] ${
                mode === "light"
                  ? "bg-blue-50  border-2 border-black"
                  : "bg-slate-600  border-2 border-white"
              }`}
            >
              <div className="flex justify-between">
                <p
                  onClick={() => {
                    if (currentState === "update") {
                      navigate("/dashboard/users-list");
                    } else {
                      setCurrentState("update");
                    }
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${
                    mode === "light"
                      ? "bg-blue-200 text-black"
                      : " bg-black text-white"
                  }`}
                >
                  <FaLeftLong />
                </p>
                {currentState === "update" && (
                  <p
                    onClick={() => {
                      setCurrentState("changePassword");
                    }}
                    className={
                      mode === "light"
                        ? "text-black border-2 border-black px-2 py-0.5 rounded-md hover:bg-blue-300  transition-all duration-300 ease-in cursor-pointer"
                        : "text-white border-2 border-white px-2 py-0.5 cursor-pointer"
                    }
                  >
                    Change Password
                  </p>
                )}
              </div>
              <div className="flex justify-center">
                <h1
                  className={`font-bold ${
                    mode === "light" ? "text-black" : "text-white"
                  }`}
                >
                  {currentState === "update"
                    ? " Update User"
                    : "Re Type New Password"}
                </h1>
              </div>

              {currentState === "update" ? (
                <div className="flex flex-col gap-y-2 mt-5">
                  <label
                    htmlFor="fullname"
                    className={`font-bold ${
                      mode === "light" ? "text-black" : "text-white"
                    }`}
                  >
                    Fullname
                  </label>
                  <input
                    onChange={(e) => setFullName(e.target.value)}
                    value={fullName}
                    type="text"
                    className={`w-[90%] py-3 px-3 rounded-md outline-none  ${
                      mode === "light"
                        ? "bg-white border-2 border-black"
                        : "bg-slate-500 text-white border-2 border-white"
                    }`}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-y-2 mt-5">
                  <label
                    htmlFor="old_pass"
                    className={`font-bold ${
                      mode === "light" ? "text-black" : "text-white"
                    }`}
                  >
                    Old Password
                  </label>
                  <div className="relative">
                    <input
                      onChange={(e) => setOldPass(e.target.value)}
                      value={oldPass}
                      type={showedOldPass ? "text" : "password"}
                      className={`w-[90%] py-3 px-3 rounded-md outline-none  ${
                        mode === "light"
                          ? "bg-white border-2 border-black"
                          : "bg-slate-500 text-white border-2 border-white"
                      }`}
                    />
                    {showedOldPass ? (
                      <FaEye
                        onClick={() => setShowedOldPass(false)}
                        className="absolute right-14 top-[50%] -translate-y-1/2 text-white cursor-pointer"
                      />
                    ) : (
                      <FaEyeSlash
                        onClick={() => setShowedOldPass(true)}
                        className="absolute right-14 top-[50%] -translate-y-1/2 text-white cursor-pointer"
                      />
                    )}
                  </div>
                </div>
              )}

              {currentState === "update" ? (
                <div className="flex flex-col gap-y-2 ">
                  <label
                    htmlFor="email"
                    className={`font-bold ${
                      mode === "light" ? "text-black" : "text-white"
                    }`}
                  >
                    Email
                  </label>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    className={`w-[90%] py-3 px-3 rounded-md outline-none  ${
                      mode === "light"
                        ? "bg-white border-2 border-black"
                        : "bg-slate-500 text-white border-2 border-white"
                    }`}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-y-2 ">
                  <label
                    htmlFor="new_pass"
                    className={`font-bold ${
                      mode === "light" ? "text-black" : "text-white"
                    }`}
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      onChange={(e) => setNewPass(e.target.value)}
                      value={newPass}
                      type={showedNewPass ? "text" : "password"}
                      className={`w-[90%] py-3 px-3 rounded-md outline-none  ${
                        mode === "light"
                          ? "bg-white border-2 border-black"
                          : "bg-slate-500 text-white border-2 border-white"
                      }`}
                    />
                    {showedNewPass ? (
                      <FaEye
                        onClick={() => setShowedNewPass(false)}
                        className="absolute right-14 top-[50%] -translate-y-1/2 text-white cursor-pointer"
                      />
                    ) : (
                      <FaEyeSlash
                        onClick={() => setShowedNewPass(true)}
                        className="absolute right-14 top-[50%] -translate-y-1/2 text-white cursor-pointer"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* <div className="flex flex-col gap-y-2">
            <label htmlFor="password">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              className="w-[90%] py-3 px-3 rounded-md outline-none border-2 border-black"
            />
          </div> */}

              {currentState === "update" ? (
                <div className="flex flex-col gap-y-2">
                  <label
                    htmlFor="role"
                    className={`font-bold ${
                      mode === "light" ? "text-black" : "text-white"
                    }`}
                  >
                    Role
                  </label>
                  <select
                    onChange={(e) => setRole(e.target.value)}
                    value={role}
                    name=""
                    id="role"
                    className={`w-[90%] py-3 px-3 rounded-md outline-none  ${
                      mode === "light"
                        ? "bg-white border-2 border-black"
                        : "bg-slate-500 text-white border-2 border-white"
                    }`}
                  >
                    <option value="">Select Role---</option>
                    <option value="1">Administrator</option>
                    <option value="2">Editor</option>
                  </select>
                </div>
              ) : (
                <div className="flex flex-col gap-y-2 ">
                  <label
                    htmlFor="con_new_pass"
                    className={`font-bold ${
                      mode === "light" ? "text-black" : "text-white"
                    }`}
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      onChange={(e) => setConNewPass(e.target.value)}
                      value={conNewPass}
                      type={showedConNewPass ? "text" : "password"}
                      className={`w-[90%] py-3 px-3 rounded-md outline-none  ${
                        mode === "light"
                          ? "bg-white border-2 border-black"
                          : "bg-slate-500 text-white border-2 border-white"
                      }`}
                    />
                    {showedConNewPass ? (
                      <FaEye
                        onClick={() => setShowedConNewPass(false)}
                        className="absolute right-14 top-[50%] -translate-y-1/2 text-white cursor-pointer"
                      />
                    ) : (
                      <FaEyeSlash
                        onClick={() => setShowedConNewPass(true)}
                        className="absolute right-14 top-[50%] -translate-y-1/2 text-white cursor-pointer"
                      />
                    )}
                  </div>
                </div>
              )}

              {currentState === "update" ? (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleUpdateUser}
                    className="bg-blue-200 text-blue-700 px-5 py-2 rounded-md"
                  >
                    Update User
                  </button>
                </div>
              ) : (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleChangePassword}
                    className="bg-blue-200 text-blue-700 px-5 py-2 rounded-md"
                  >
                    Change Password
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateUser;
