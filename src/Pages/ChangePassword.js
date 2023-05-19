import React, { useRef } from "react";
import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import { IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { privateAxios } from "../api/axios";
import { CHANGE_PASSWORD } from "../api/Url";
import Toaster from "../components/Toaster";
import useCallbackState from "../utils/useCallBackState";
import { useDocumentTitle } from "../utils/useDocumentTitle";
import { Logger } from "../Logger/Logger";
import { catchError } from "../utils/CatchError";
const schema = yup.object().shape({
  oldPassword: yup
    .string()
    .required("Enter the old password")
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,15}$/,
      "Password must contain at least 6 characters, one uppercase, one number and one special case character"
    ),
  newPassword: yup
    .string()
    .required("Enter the new password")
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,15}$/,
      "Password must contain at least 6 characters, one uppercase, one number and one special case character"
    ),

  confirmPassword: yup
    .string()
    .required("Enter the confirm password")
    .oneOf([yup.ref("newPassword"), null], "Password does not match."),
});
const ChangePassword = () => {
  //custom hook to set title of page
  useDocumentTitle("Change Password");
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const toasterRef = useRef();
  const [toasterDetails, setToasterDetails] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "error",
  });
  const [values, setValues] = React.useState({
    oldPassword: "",
    showOldPassword: "",
    newPassword: "",
    showNewPassword: false,
    confirmPassword: "",
    showConfirmPassword: false,
  });
  const handleClickShowNewPassword = () => {
    setValues({
      ...values,
      showNewPassword: !values.showNewPassword,
    });
  };
  const handleClickShowConfirmPassword = () => {
    setValues({
      ...values,
      showConfirmPassword: !values.showConfirmPassword,
    });
  };
  const handleClickShowOldPassword = () => {
    setValues({
      ...values,
      showOldPassword: !values.showOldPassword,
    });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onSubmitChangePassword = async (data) => {
    Logger.debug("data", data);
    try {
      const response = await privateAxios.post(CHANGE_PASSWORD, {
        oldPassword: data.oldPassword,
        password: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      if (response.status == 201) {
        setToasterDetails(
          {
            titleMessage: "Hurray!",
            descriptionMessage: response.data.message,
            messageType: "success",
          },
          () => toasterRef.current()
        );
        setTimeout(() => {
          navigate("/home");
        }, 3000);
        reset();
      }
    } catch (error) {
      Logger.debug("Error from on change password data", error);
      reset();
      catchError(error, setToasterDetails, toasterRef, navigate);
      // if (error.response.status == 401) {
      //     setToasterDetails(
      //         {
      //             titleMessage: "Oops!",
      //             descriptionMessage:
      //                 "Session Timeout: Please login again",
      //             messageType: "error",
      //         },
      //         () => toasterRef.current()
      //     );
      //     setTimeout(() => {
      //         navigate("/login");
      //     }, 3000);
      // } else if (error.response.status === 403) {
      //     setToasterDetails(
      //         {
      //             titleMessage: "Oops!",
      //             descriptionMessage: error?.response?.data?.message
      //                 ? error?.response?.data?.message
      //                 : "Oops! Something went wrong. Please try again later.",
      //             messageType: "error",
      //         },
      //         () => toasterRef.current()
      //     );
      //     setTimeout(() => {
      //         navigate("/home");
      //     }, 3000);
      // } else {
      //     setToasterDetails(
      //         {
      //             titleMessage: "Oops!",
      //             descriptionMessage: error?.response?.data?.message
      //                 ? error?.response?.data?.message
      //                 : "Oops! Something went wrong. Please try again later.",
      //             messageType: "error",
      //         },
      //         () => toasterRef.current()
      //     );

      // }
    }
  };

  return (
    <div className="page-wrapper">
      <Toaster
        myRef={toasterRef}
        titleMessage={toasterDetails.titleMessage}
        descriptionMessage={toasterDetails.descriptionMessage}
        messageType={toasterDetails.messageType}
      />
      <div className="breadcrumb-wrapper">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>Change Password</li>
          </ul>
        </div>
      </div>
      <section className="container">
        <form onSubmit={handleSubmit(onSubmitChangePassword)}>
          <div className="form-header flex-between">
            <h2 className="heading2">Change Password</h2>
          </div>
          <div className="card-wrapper">
            <div className="card-blk flex-between">
              <div className="card-form-field">
                <div className="form-group">
                  <label htmlFor="oldPassword">
                    Old Password <span className="mandatory">*</span>
                  </label>
                  <div className="password-field">
                    <OutlinedInput
                      fullWidth
                      id="outlined-adornment-password"
                      type={values.showOldPassword ? "text" : "password"}
                      // value={values.confirmPassword}
                      // onChange={handleChange('confirmPassword')}
                      placeholder="Enter old password"
                      className={`input-field ${
                        errors.oldPassword && "input-error"
                      }`}
                      inputProps={{
                        maxLength: 15,
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowOldPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            className="eye-btn"
                          >
                            {!values.showOldPassword ? (
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
                      {...register("oldPassword")}
                      onBlur={(e) =>
                        setValue("oldPassword", e.target.value.trim())
                      }
                      error={errors.oldPassword ? true : false}
                    />
                    <p className={`password-error`}>
                      {errors?.oldPassword ? (
                        errors.oldPassword.message
                      ) : (
                        <span>&nbsp;</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-form-field">
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
                      errors?.newPassword && "input-error"
                    }`}
                    inputProps={{
                      maxLength: 15,
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowNewPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          className="eye-btn"
                        >
                          {!values.showNewPassword ? (
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
                    {...register("newPassword")}
                    onBlur={(e) =>
                      setValue("newPassword", e.target.value.trim())
                    }
                    error={errors.password ? true : false}
                  />
                  <p className={`password-error`}>
                    {errors?.newPassword ? (
                      errors.newPassword.message
                    ) : (
                      <span>&nbsp;</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="card-form-field">
              <div className="form-group">
                <label htmlFor="password">
                  Confirm Password <span className="mandatory">*</span>
                </label>
                <div className="password-field">
                  <OutlinedInput
                    fullWidth
                    id="outlined-adornment-password"
                    type={values.showConfirmPassword ? "text" : "password"}
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
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          className="eye-btn"
                        >
                          {!values.showConfirmPassword ? (
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
                    {...register("confirmPassword")}
                    onBlur={(e) =>
                      setValue("confirmPassword", e.target.value.trim())
                    }
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
            </div>
            <div className="form-btn flex-between add-members-btn">
              <button
                type="reset"
                onClick={() => navigate("/home")}
                className="secondary-button mr-10"
              >
                Cancel
              </button>
              <button type="submit" className="primary-button add-button">
                Save
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default ChangePassword;
