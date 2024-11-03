/* eslint-disable react/prop-types */
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = Cookies.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Return `null` or a loading state if the user is being redirected
  if (!token) return null;

  return <div>{children}</div>;
};

export default PrivateRoute;
