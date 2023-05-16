import React, { useEffect, useRef } from "react";
import { privateAxios } from "../api/axios";
import { useDocumentTitle } from "../utils/useDocumentTitle";
import { useNavigate } from "react-router-dom";
import { GET_USER } from "../api/Url";
import { useDispatch, useSelector } from "react-redux";
import useCallbackState from "../utils/useCallBackState";
import Toaster from "../components/Toaster";
import { Logger } from "../Logger/Logger";
import { setUser, setPrivileges } from "../redux/UserSlice";
import HomePageTrainingSilder from "./HomePageTrainingSilder";

const Dashboard = (props) => {
  //custom hook to set title of page
  const dispatch = useDispatch();
  useDocumentTitle("Home");
  const checkPrivilege = useSelector(
    (state) => state?.user?.privilege?.privileges
  );
  //   const checkUser = useSelector(
  //     (state) => state?.user
  //   );
  const checkUser = useSelector((state) => state?.user?.userObj);
  console.log("checkPrvilege = ", checkPrivilege);
  console.log("user = ", checkUser);

  //   console.log(
  //     "check user = ",
  //     Object.keys(checkUser?.role?.privileges).length === 0
  //   );
  let userRoleDeleted =
    Object.keys(checkUser.role).length === 0 ||
    (Object.keys(checkPrivilege).length === 0 &&
      checkUser?.role?.name !== "Super Admin");
  // checkPrivilege !== undefined &&
  // Object.keys(checkPrivilege).length === 0 &&
  // checkUser?.role?.name !== "Super Admin";
  Logger.debug("user role is deleted  =  ", userRoleDeleted);
  Logger.debug(
    "user is  super Admin = ",
    checkPrivilege != undefined &&
      Object.keys(checkPrivilege).length === 0 &&
      checkUser?.role?.name === "Super Admin"
  );
  const navigate = useNavigate();
  const homeRef = useRef();

  useEffect(() => {
    let isMounted = true;
    let controller = new AbortController();
    isMounted && fetchHomeUser(isMounted, controller);
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const [homeToasterDetails, setHomeToasterDetails] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "success",
  });

  const fetchHomeUser = async (isMounted, controller) => {
    try {
      const { data } = await privateAxios.get(GET_USER, {
        signal: controller.signal,
      });
      dispatch(setUser(data));
      dispatch(setPrivileges(data?.role));

      Logger.debug("in userloggedin - ", data);
    } catch (error) {
      if (error?.response?.status == 401) {
        setHomeToasterDetails(
          {
            titleMessage: "Error",
            descriptionMessage: "Session Timeout: Please login again",
            messageType: "error",
          },
          () => homeRef.current()
        );
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else if (error?.response?.status === 403) {
        setHomeToasterDetails({
          titleMessage: "Error",
          descriptionMessage: error?.response?.data?.message
            ? error?.response?.data?.message
            : "Something went wrong",
          messageType: "error",
        });
        setTimeout(() => {
          navigate("/home");
        }, 3000);
      } else {
        setHomeToasterDetails({
          titleMessage: "Error",
          descriptionMessage: error?.response?.data?.message
            ? error?.response?.data?.message
            : "Something went wrong",
          messageType: "error",
        });
      }
    }
  };
  return (
    <div className="page-wrapper">
      <Toaster
        messageType={homeToasterDetails.messageType}
        descriptionMessage={homeToasterDetails.descriptionMessage}
        myRef={homeRef}
        titleMessage={homeToasterDetails.titleMessage}
      />
      <section>
        <div className="container">
          <div className="dashboard-sect">
            {/* <img
              src={
                process.env.PUBLIC_URL +
                "/images/WorkInProgress-removebg-preview.png"
              }
              className="mb-30"
            />
            <h1 className="coming-soon-txt">
              {userRoleDeleted
                ? "You are not authorized, Please contact System Administrator"
                : "Coming Soon..."}
            </h1> */}

            <p className="dashboard-header-message">
              Welcome to the CGF Human Rights Coalition HRDD Dashboard! We are
              delighted to have you here. This powerful tool empowers you to
              navigate and fill in the Human Rights Due Diligence (HRDD)
              assessment. As you familiarize yourself with this dashboard, below
              are some resources that can help you to get started. We encourage
              you to explore its features and fill in the assessment.
            </p>
            <HomePageTrainingSilder />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
