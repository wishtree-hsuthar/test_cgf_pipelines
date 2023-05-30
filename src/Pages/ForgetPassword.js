import React, { useEffect, useRef } from "react";

import { TextField } from "@mui/material";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { Logger } from "../Logger/Logger";
import { FORGET_PASSWORD } from "../api/Url";
import { privateAxios } from "../api/axios";
import Toaster from "../components/Toaster";
import useCallbackState from "../utils/useCallBackState";
import { useDocumentTitle } from "../utils/useDocumentTitle";
import Slider from "./Slider";
const forgetPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid input")
    .required("Enter the email address"),
});
const ForgetPassword = () => {
  //custom hook to set title of page
  useDocumentTitle("Forgot Password");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(forgetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  useEffect(() => {
    document.body.classList.add("login-page");
    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);
  const forgetPasswordToasterRef = useRef();

  const [toasterDetails, setToasterDetails] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "error",
  });

  const submitEmail = async (data) => {
    try {
      const response = await privateAxios.get(
        `${FORGET_PASSWORD}${data.email}`
      );
      Logger.debug("response from forgot password", response);

      if (response.status === 200) {
        setToasterDetails(
          {
            titleMessage: "Hurray!",
            descriptionMessage:
              "Reset password link has been successfully sent on the entered email address! Kindly check your email to reset your password.",
            messageType: "success",
          },
          () => forgetPasswordToasterRef.current()
        );

        setTimeout(() => {
          navigate("/login");
        }, 3000);
        reset();
      }
    } catch (error) {
      if (error?.response?.status === 400) {
        let errorMsg = error?.response?.data?.message;
        Logger.debug("error message", errorMsg);
        Logger.debug("error body", error.response);

        setToasterDetails(
          {
            titleMessage: "Error!",
            descriptionMessage: errorMsg,
            messageType: "error",
          },
          () => forgetPasswordToasterRef.current()
        );

        reset();
      }
    }
    Logger.debug(data);
  };

  return (
    <div className="page-wrapper login-page-wrap">
      <Toaster
        messageType={toasterDetails.messageType}
        titleMessage={toasterDetails.titleMessage}
        myRef={forgetPasswordToasterRef}
        descriptionMessage={toasterDetails.descriptionMessage}
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
                <h2 className="heading1 text-uppercase mb-40">
                  Forgot password
                </h2>
                <p className="forget-password-message">
                  Enter you registered email address and we'll <br /> send you a
                  link to reset your password
                </p>
                <div className="login-form">
                  <form onSubmit={handleSubmit(submitEmail)}>
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
                        error={errors.email ? true : false}
                        helperText={errors.email ? errors.email.message : " "}
                      />
                    </div>

                    <div className="form-btn flex-between">
                      <button type="submit" className="primary-button">
                        Submit
                      </button>
                      <div
                        onClick={() => navigate("/login")}
                        className="tertiary-btn-blk mr-10"
                      >
                        Back to login
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

export default ForgetPassword;
