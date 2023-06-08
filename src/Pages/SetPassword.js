import { yupResolver } from "@hookform/resolvers/yup";
import OutlinedInput from "@mui/material/OutlinedInput";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { Logger } from "../Logger/Logger";
import { CONFIRM_PASSWORD, SET_PASSWORD_VERIFY_TOKEN } from "../api/Url";
import { publicAxios } from "../api/axios";
import Toaster from "../components/Toaster";
import CustomInputAdornment from "../utils/CustomInputAdornment";
import useCallbackState from "../utils/useCallBackState";
import { useDocumentTitle } from "../utils/useDocumentTitle";
import Slider from "./Slider";
const schema = yup.object().shape({
  password: yup
    .string()
    .required("Enter the new password")
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,15}$/,
      "Password must contain at least 6 characters, one uppercase, one number and one special case character"
    ),

  confirmPassword: yup
    .string()
    .required("Enter the confirm password")
    .oneOf([yup.ref("password"), null], "Password does not match."),
});
const SetPassword = () => {
  //custom hook to set title of page
  useDocumentTitle("Set Password");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [showExpiredLinkMessage, setShowExpiredLinkMessage] = useState(false);
  useEffect(() => {
    let controller = new AbortController();
    document.body.classList.add("login-page");
    const verifyForgotToken = async () => {
      try {
        const { response } = await publicAxios.get(
          SET_PASSWORD_VERIFY_TOKEN + params.id,
          {
            signal: controller.signal,
          }
        );
        if (response?.status == 200) {
          return null;
        }
      } catch (error) {
        Logger.debug("error from verify token", error);
        if (error?.response?.status == 400) {
          Logger.debug("Invalid Token");

          setShowExpiredLinkMessage(true);
        }
      }
    };
    verifyForgotToken();
    return () => {
      document.body.classList.remove("login-page");
      controller.abort();
    };
  }, []);
  const expiredLinkMessage =
    "Oops! The link to set password is expired or looks like you're trying using an invalid link. Please contact CGF Admin.";

  const [passwordToasterDetails, setPasswordToasterDetails] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "",
  });
  const [values, setValues] = React.useState({
    password: "",
    showNewPassword: false,
    confirmPassword: "",
    showConfirmPassword: false,
  });
  const navigate = useNavigate();
  const setPasswordToasterRef = useRef();
  const params = useParams();
  const handleClickShowNewPassword = () => {
    setValues({
      ...values,
      showNewPassword: !values.showNewPassword,
    });
  };
  const submitForm = async (data) => {
    try {
      const response = await publicAxios.post(
        CONFIRM_PASSWORD + params.id,
        data
      );
      Logger.debug("response from confirm passowrd", response);
      if (response.status == 201) {
        setPasswordToasterDetails(
          {
            titleMessage: "Hurray!",
            descriptionMessage: response.data.message,
            messageType: "success",
          },
          () => setPasswordToasterRef.current()
        );
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      Logger.debug("error from confirm password", error);
      if (error?.response?.status == 400) {
        Logger.debug("Invalid Token");

        setShowExpiredLinkMessage(true);
      } else {
        setPasswordToasterDetails(
          {
            titleMessage: "Oops!",
            descriptionMessage: error?.response?.data?.message,
            messageType: "error",
          },
          () => setPasswordToasterRef.current()
        );
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    }
  };
  const handleClickShowConfirmPassword = () => {
    setValues({
      ...values,
      showConfirmPassword: !values.showConfirmPassword,
    });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="page-wrapper login-page-wrap">
      <Toaster
        myRef={setPasswordToasterRef}
        titleMessage={passwordToasterDetails.titleMessage}
        descriptionMessage={passwordToasterDetails.descriptionMessage}
        messageType={passwordToasterDetails.messageType}
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
                <h2
                  className={`${
                    showExpiredLinkMessage
                      ? "warning-message"
                      : "heading1 text-uppercase"
                  } `}
                >
                  {showExpiredLinkMessage ? expiredLinkMessage : "Set Password"}
                </h2>
                {showExpiredLinkMessage ? null : (
                  <div className="login-form">
                    <form onSubmit={handleSubmit(submitForm)}>
                      <div className="form-group">
                        <label htmlFor="password">
                          New Password <span className="mandatory">*</span>
                        </label>
                        <div className="password-field">
                          <OutlinedInput
                            fullWidth
                            id="outlined-adornment-password"
                            type={values.showNewPassword ? "text" : "password"}
                            // value={values.password}
                            // onChange={handleChange('password')}
                            placeholder="Enter new password"
                            className={`input-field ${
                              errors.password && "input-error"
                            }`}
                            inputProps={{
                              maxLength: 15,
                            }}
                            endAdornment={
                              <CustomInputAdornment
                                show={values?.showNewPassword}
                                onClickHandler={handleClickShowNewPassword}
                                mouseDownHandler={handleMouseDownPassword}
                              />
                            }
                            {...register("password")}
                            error={errors.password ? true : false}
                          />
                          <p className={`password-error`}>
                            {errors?.password ? (
                              errors.password.message
                            ) : (
                              <span>&nbsp;</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="password">
                          Confirm Password <span className="mandatory">*</span>
                        </label>
                        <div className="password-field">
                          <OutlinedInput
                            fullWidth
                            id="outlined-adornment-password"
                            type={
                              values.showConfirmPassword ? "text" : "password"
                            }
                            // value={values.confirmPassword}
                            // onChange={handleChange('confirmPassword')}
                            placeholder="Enter confirm password"
                            className={`input-field ${
                              errors.confirmPassword && "input-error"
                            }`}
                            inputProps={{
                              maxLength: 15,
                            }}
                            endAdornment={
                              <CustomInputAdornment
                                show={values?.showConfirmPassword}
                                onClickHandler={handleClickShowConfirmPassword}
                                mouseDownHandler={handleMouseDownPassword}
                              />
                            }
                            {...register("confirmPassword")}
                            error={errors.confirmPassword ? true : false}
                          />
                          <p className={`password-error`}>
                            {errors?.confirmPassword ? (
                              errors.confirmPassword.message
                            ) : (
                              <span>&nbsp;</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="form-btn flex-between">
                        <button className="primary-button">Submit</button>
                        {/* <div className="tertiary-btn-blk mr-10">Back to login</div> */}
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
