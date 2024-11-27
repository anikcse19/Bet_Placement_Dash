import axios from "axios";
import { RiLoginCircleLine } from "react-icons/ri";
import { baseUrl } from "../../../config";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import useStore from "../../zustand/useStore";

const CheckInCheckOut = () => {
  const { setCheckInOut } = useStore();
  const token = Cookies.get("token");

  const handleCheckIn = async () => {
    try {
      await axios
        .get(`${baseUrl}/api/admin/hr/staff/check-in`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res?.data?.status) {
            toast.success("Checked in successfully");
            setCheckInOut("checkin");
          } else {
            toast.error(res?.data?.message);
          }
        });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleCheckOut = async () => {
    try {
      await axios
        .get(`${baseUrl}/api/admin/hr/staff/check-out`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res?.data?.status) {
            toast.success("Checked out successfully");
            setCheckInOut("checkout");
          } else {
            toast.error(res?.data?.message);
          }
        });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <div className="flex items-center justify-end gap-5 w-full h-full">
      <button
        onClick={handleCheckIn}
        className="flex items-center gap-2 bg-teal-500 text-white px-5 py-2 rounded-md"
      >
        <RiLoginCircleLine />
        <p>Check In</p>
      </button>
      <button
        onClick={handleCheckOut}
        className="flex items-center gap-2 bg-rose-500 text-white px-5 py-2 rounded-md"
      >
        <RiLoginCircleLine className="rotate-180" />
        <p>Check Out</p>
      </button>
    </div>
  );
};

export default CheckInCheckOut;
