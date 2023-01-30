import React, { useEffect, useRef } from "react";
import { privateAxios } from "../api/axios";
import { useDocumentTitle } from "../utils/useDocumentTitle";
import { useNavigate } from "react-router-dom";
import { GET_USER } from "../api/Url";
import { useDispatch, useSelector } from "react-redux";
import useCallbackState from "../utils/useCallBackState";
import Toaster from "../components/Toaster";
const Dashboard = (props) => {
    //custom hook to set title of page
    useDocumentTitle("Home");
    const checkPrivilege = useSelector(
        (state) => state?.user?.privilege?.privileges
    );
    const checkUser = useSelector((state) => state?.user?.userObj);
    let userRoleDeleted =
        Object.keys(checkPrivilege).length === 0 &&
        checkUser?.role?.name !== "Super Admin";
    console.log("user role is deleted  =  ", userRoleDeleted);
    console.log(
        "user is  super Admin = ",
        Object.keys(checkPrivilege).length === 0 &&
            checkUser?.role?.name === "Super Admin"
    );
    const navigate = useNavigate();
    const homeRef = useRef();

    // const dispatch = useDispatch();
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
            const response = await privateAxios.get(GET_USER, {
                signal: controller.signal,
            });

            // isMounted && dispatch(setUser(response.data));
            // isMounted && dispatch(setPrivileges(response.data?.role));
            console.log("in userloggedin - ", response);
        } catch (error) {
            if (error?.response?.status == 401) {
                setHomeToasterDetails(
                    {
                        titleMessage: "Error",
                        descriptionMessage:
                            "Session Timeout: Please login again",
                        messageType: "error",
                    },
                    () => homeRef.current()
                );
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
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
                        <img
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
                        </h1>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
