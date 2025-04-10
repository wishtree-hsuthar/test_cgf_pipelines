import React, { useEffect, useRef, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import axios from "axios";
import { set, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate,useParams } from "react-router-dom";
import * as yup from "yup";
import { Logger } from "../Logger/Logger";
import { GET_USER, LOGIN_URL, OTP_VERIFY, RESEND_OTP } from "../api/Url";
import { publicAxios } from "../api/axios";
import Toaster from "../components/Toaster";
import { setPrivileges, setUser } from "../redux/UserSlice";
import CustomInputAdornment from "../utils/CustomInputAdornment";
import useCallbackState from "../utils/useCallBackState";
import { useDocumentTitle } from "../utils/useDocumentTitle";
import Slider from "./Slider";
const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .required("Please enter the One Time Password sent to your email")
});
const OneTimePassword = (prop) => {
  //custom hook to set title of page
  useDocumentTitle("OTP-Verification");
  const [loginToasterDetails, setLoginToasterDetails] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "error",
  });
  const otpToasterRef = useRef();
  const dispatch = useDispatch();
  const location = useLocation();
  const {id} = useParams();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(10);
  const [isActive, setIsActive] = useState(false);
  const [hideInitialTime, setHideInitialTime] = useState(true)
  const [regenrateCodeDisable, setRegenrateCodeDisable] = useState(false);
  const [fetchOnce, setFetchOnce] = useState(false)
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(otpSchema),
  });
  useEffect(() => {
    document.body.classList.add("login-page");

    const controller = new AbortController();

   

    // startTimer();
   
const fetchUser = async () => {
  setFetchOnce(true)
    Logger.info("Login - Fetch user handler");
    try {
      const { status, data } = await axios.get(GET_USER, {
        withCredentials: true,
        signal: controller.signal,
      });
      if (status == 200) {
        navigate("/home");
      }
    } catch (error) {
      if (error?.response?.status == 401) {
        Logger.info("Login - Fetch user hanller catch error");
      }
    }
  };
  if (!fetchOnce) {

  fetchUser();
  }

  let timer;
  if (isActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
  } else if (timeLeft === 0) {
      setIsActive(false);
      setRegenrateCodeDisable(false);
  }
  if (hideInitialTime && timeLeft>0) {
    timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
  } else {
    setHideInitialTime(false);
  }
    

    return () => {
      document.body.classList.remove("login-page");
      clearTimeout(timer);
      controller.abort();
    };
  }, [isActive, timeLeft]);

  

  const startTimer = () => {
    setTimeLeft(30);
    setIsActive(true);
};

  const [values, setValues] = React.useState({
    otp: "",
   });

 
 
 
  const submitOtp = async (data) => {
    Logger.info("Otp - Submit otp data handler");
    try {
      const response = await publicAxios.post(OTP_VERIFY, {...data,userId:id}, {
        withCredentials: true,
      });
      if (response.status == 201) {
        dispatch(setUser(response?.data?.user));
        dispatch(setPrivileges(response?.data?.user?.role));
        navigate("/home");
      }
    } catch (error) {
      Logger.info(
        `Login - Submit login data handler catch error - ${error?.response?.data?.message}`
      );
      if (error.response.status === 429) {
        // setInterval(() => {
          
        //   navigate("/login");
        // }, 2000);

        return setLoginToasterDetails(
          {
            titleMessage: "Too Many Requests",
            descriptionMessage: "Too many attempts. Redirecting to login...",
            messageType: "error",
          },
          () => otpToasterRef.current()
        );
        
      }
      if (
        error.response.status == 401 &&
        error.response.data.message === "Unauthorized"
      ) {
        return setLoginToasterDetails(
          {
            titleMessage: "Invalid Credentials",
            descriptionMessage: "Invalid email or password!",
            messageType: "error",
          },
          () => otpToasterRef.current()
        );
      }
      if (
        error.response.status == 401 &&
        error.response.data.message ===
          "Access denied. Kindly contact system admin."
      ) {
        return setLoginToasterDetails(
          {
            titleMessage: "Invalid Credentials",
            descriptionMessage: error?.response?.data?.message,
            messageType: "error",
          },
          () => otpToasterRef.current()
        );
      }
      if (error.response.status == 400) {
        return setLoginToasterDetails(
          {
            titleMessage: "Session Active",
            descriptionMessage: error?.response?.data?.message,
            messageType: "error",
          },
          () => otpToasterRef.current()
        );
      }
    }
  };

  const resendOtp = async (id) => {
    Logger.info("Otp - Submit otp data handler");
    try {
      const response = await publicAxios.post(RESEND_OTP, {userId:id}, {
        withCredentials: true,
      });
      if (response.status == 201) {
        setRegenrateCodeDisable(true);
        setIsActive(true);
        setTimeLeft(30);
       
        setLoginToasterDetails(
          {
            titleMessage: "Success",
            descriptionMessage: "OTP sent to your email",
            messageType: "success",
          },
          () => otpToasterRef.current()
        );
      }
    } catch (error) {
      Logger.info(
        `Login - Submit login data handler catch error - ${error?.response?.data?.message}`
      );
    
      if (
        error.response.status == 401 &&
        error.response.data.message === "Unauthorized"
      ) {
        return setLoginToasterDetails(
          {
            titleMessage: "Invalid Credentials",
            descriptionMessage: "Invalid email or password!",
            messageType: "error",
          },
          () => otpToasterRef.current()
        );
      }
      if (
        error.response.status == 401 &&
        error.response.data.message ===
          "Access denied. Kindly contact system admin."
      ) {
        return setLoginToasterDetails(
          {
            titleMessage: "Invalid Credentials",
            descriptionMessage: error?.response?.data?.message,
            messageType: "error",
          },
          () => otpToasterRef.current()
        );
      }
      if (error.response.status == 400) {
        return setLoginToasterDetails(
          {
            titleMessage: "Session Active",
            descriptionMessage: error?.response?.data?.message,
            messageType: "error",
          },
          () => otpToasterRef.current()
        );
      }
      
      if (error?.response?.status === 429) {
        setInterval(() => {
          
          navigate("/login");
        }, 3000);

        return setLoginToasterDetails(
          {
            titleMessage: "Too Many Requests",
            descriptionMessage: "Too many attempts. Redirecting to login...",
            messageType: "error",
          },
          () => otpToasterRef.current()
        );
        
      }
    }
  };

  return (
    <div className="page-wrapper login-page-wrap">
      <Toaster
        myRef={otpToasterRef}
        titleMessage={loginToasterDetails.titleMessage}
        descriptionMessage={loginToasterDetails.descriptionMessage}
        messageType={loginToasterDetails.messageType}
      />
      <div className="login-section">
        <div className="container">
          <div className="login-wrapper">
            <div className="login-leftblk">
              <div className="login-slider">
                <Slider />
              </div>
            </div>
            <div className="login-rightblk">
              <div className="login-blk">
                <div className="logo">
                  <img
                    src={process.env.PUBLIC_URL + "/images/logo.png"}
                    alt=""
                    className="img-fluid"
                  />
                </div>
                <h2 className="heading1 text-uppercase">Verification Code</h2>
                <div className="login-form">
                  <form onSubmit={handleSubmit(submitOtp)}>
                    <div className="form-group">
                      <label htmlFor="emailid">
                        One Time Password <span className="mandatory">*</span>
                      </label>
                      <TextField
                        className={`input-field ${
                          errors.otp && "input-error"
                        }`}
                        id="outlined-basic"
                        placeholder="789456"
                        variant="outlined"
                        inputProps={{
                          maxLength: 6,
                        }}
                        
                        {...register("otp")}
                        onBlur={(e) => setValue("otp", e.target.value.trim())}
                        helperText={errors.otp ? errors.otp.message : " "}
                      />
                    </div>
                    
                    
                    <div className="form-btn flex-between">
                      <button type="submit" className="primary-button">
                        Submit
                      </button>
                      {
                        !hideInitialTime
                      &&
                      <div
                        className="tertiary-btn-blk"
                        style={{cursor: isActive ? 'not-allowed' : 'pointer'}}
                        onClick={() => {
                          if (regenrateCodeDisable) {
                            return
                          } else {
                            resendOtp(id)
                            // setRegenrateCodeDisable(true);
                            // startTimer();
                            // setIsActive(true);
                          }
                          
                        }}
                      >
                        <span style={{color: isActive ? 'black' : 'orange'}} aria-disabled={isActive}>
                          Resend Verification Code
                        </span>
                      </div>
                      }
                     
                      
                    </div>
                    <div className="flex-between ">
                      <span></span>
                       <span> 0:{timeLeft}</span>
                        </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneTimePassword;
