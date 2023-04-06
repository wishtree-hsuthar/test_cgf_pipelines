import React, { useEffect, useRef } from "react";

import Slider from "./Slider";
import { TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { Logger } from "../Logger/Logger";
import Toaster from "../components/Toaster";
import { GET_USER, LOGIN_URL } from "../api/Url";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser, setPrivileges } from "../redux/UserSlice";
import useCallbackState from "../utils/useCallBackState";
import { publicAxios } from "../api/axios";
import { useDocumentTitle } from "../utils/useDocumentTitle";
const loginFormSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid input")
    .required("Enter the email address"),
  password: yup.string().required("Enter the password"),
});
const Login = (prop) => {
  //custom hook to set title of page
  useDocumentTitle("Login");
  const [loginToasterDetails, setLoginToasterDetails] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "error",
  });
  const loginToasterRef = useRef();
  const dispatch = useDispatch();
  Logger.info(prop);
  const location = useLocation();
  Logger.debug("location", location);
  Logger.debug("---------", prop);
  const navigate = useNavigate();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginFormSchema),
  });
  useEffect(() => {
    document.body.classList.add("login-page");

    const controller = new AbortController();
    const fetchUser = async () => {
      try {
        const { status, data } = await axios.get(GET_USER, {
          withCredentials: true,
          signal: controller.signal,
        });
        Logger.debug("data from app fetcuser method app file", data);
        if (status == 200) {
          navigate("/home");
        }
      } catch (error) {
        if (error?.response?.status == 401) {
          Logger.debug("Error from app file useEffect", error);
        }
      }
    };
    fetchUser();

    return () => {
      document.body.classList.remove("login-page");
      controller.abort();
    };
  }, []);

  const [values, setValues] = React.useState({
    password: "",
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const navigateToforgetPasswordPage = () => {
    navigate("/forget-password");
  };
  const submitLoginData = async (data) => {
    Logger.debug(data);
    try {
      const response = await publicAxios.post(LOGIN_URL, data, {
        withCredentials: true,
      });
      if (response.status == 201) {
        Logger.debug("DATA", response?.data?.user);
        dispatch(setUser(response?.data?.user));
        dispatch(setPrivileges(response?.data?.user?.role));
        navigate("/home");
      }
    } catch (error) {
      Logger.debug("error from submit login method", error);

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
          () => loginToasterRef.current()
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
          () => loginToasterRef.current()
        );
      }
      if (error.response.status == 400) {
        return setLoginToasterDetails(
          {
            titleMessage: "Session Active",
            descriptionMessage: error?.response?.data?.message,
            messageType: "error",
          },
          () => loginToasterRef.current()
        );
      }
    }
  };

  return (
    <div className="page-wrapper login-page-wrap">
      <Toaster
        myRef={loginToasterRef}
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
                <h2 className="heading1 text-uppercase">Log in</h2>
                <div className="login-form">
                  <form onSubmit={handleSubmit(submitLoginData)}>
                    <div className="form-group">
                      <label htmlFor="emailid">
                        Email <span className="mandatory">*</span>
                      </label>
                      <TextField
                        className={`input-field ${
                          errors.email && "input-error"
                        }`}
                        id="outlined-basic"
                        placeholder="example@domain.com"
                        variant="outlined"
                        {...register("email")}
                        onBlur={(e) => setValue("email", e.target.value.trim())}
                        helperText={errors.email ? errors.email.message : " "}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">
                        Password <span className="mandatory">*</span>
                      </label>
                      <div className="password-field">
                        <OutlinedInput
                          fullWidth
                          id="outlined-adornment-password"
                          type={values.showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          className={`input-field ${
                            errors.password && "input-error"
                          }`}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                className="eye-btn"
                              >
                                {!values.showPassword ? (
                                  <img
                                    src={
                                      process.env.PUBLIC_URL +
                                      "/images/non-visibleicon.svg"
                                    }
                                    alt=""
                                    className="img-fluid"
                                  />
                                ) : (
                                  <img
                                    src={
                                      process.env.PUBLIC_URL +
                                      "/images/visibleicon.svg"
                                    }
                                    alt=""
                                    className="img-fluid"
                                  />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                          {...register("password")}
                          onBlur={(e) =>
                            setValue("password", e.target.value.trim())
                          }
                        />
                        <p className={`password-error`}>
                          {errors?.password ? (
                            errors.password?.message
                          ) : (
                            <span>&nbsp;</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="form-btn flex-between">
                      <button type="submit" className="primary-button">
                        Log In
                      </button>
                      <div
                        className="tertiary-btn-blk"
                        onClick={navigateToforgetPasswordPage}
                      >
                        Forgot Password?
                      </div>
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

export default Login;
