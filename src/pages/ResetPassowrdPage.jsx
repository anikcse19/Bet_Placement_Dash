import axios from "axios";
import { useState } from "react";
import { baseUrl } from "../../config";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ResetPassowrdPage = () => {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  const navigate = useNavigate();

  const sendVerificationEmail = () => {
    axios
      .post(
        `${baseUrl}/api/admin/password-recovery`,
        { email },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res?.data.status) {
          toast.success("Sent Email Successfully");
          navigate("/admin/password-recovery");
          setIsEmailSent(true);
        }
      });
  };
  return (
    <div className="login-bg w-ful min-h-screen bg-gray-200 flex items-center justify-center py-20">
      <div className="login-div w-[90vw] lg:w-[40vw] bg-white p-10 rounded-md">
        {/* logo */}
        {/* <div className="flex justify-center mb-5">
            <img className="w-40 h-14" src="/logo.png" alt="" />
          </div> */}
        {!isEmailSent && (
          <div className="flex items-center justify-center">
            <p className="font-bold text-black">
              Enter your email to get verification link
            </p>
          </div>
        )}

        {isEmailSent ? (
          <p className="py-10 text-2xl text-purple-500 font-bold">
            Please Check Your Email For Verification Link
          </p>
        ) : (
          <>
            <div className="mt-5">
              <div className="flex flex-col gap-2 text-sm">
                {/* email */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="email">Email</label>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    placeholder="alex@gmail.com"
                    className="px-5 py-2 outline-none rounded bg-gray-200 focus:border-2 focus:border-primary"
                    type="email"
                    name="email"
                    id="email"
                  />
                </div>

                {/* <div>
                <p className="text-xs text-red-700 font-bold">{error}</p>
              </div> */}
              </div>
            </div>

            {/* button */}
            <div className="mt-3 flex justify-center">
              <button
                // disabled={mutation.isLoading}
                onClick={sendVerificationEmail}
                className="bg-primary hover:bg-purple-900  transition-all duration-500 ease-in px-6 py-1 rounded text-black hover:text-white font-bold border border-black"
              >
                Sent Code
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassowrdPage;
