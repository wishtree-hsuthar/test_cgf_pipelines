import React, { useEffect, useState, useRef } from "react";

import Slider from "./Slider";
import {
    IconButton as ResetPasswordIconButton,
    OutlinedInput as ResetPasswordOutlinedInput,
    InputAdornment as ResetPasswordInputAdornment,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { FORGOT_PASSWORD, FORGOT_PASSWORD_VERIFY_TOKEN } from "../api/Url";
import Toaster from "../components/Toaster";
import { useParams, useNavigate } from "react-router-dom";
import { useDocumentTitle } from "../utils/useDocumentTitle";
import { Logger } from "../Logger/Logger";

const schema = yup.object().shape({
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
const ResetPassword = () => {
    //custom hook to set title of page
    useDocumentTitle("Reset Password");
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });
    const navigate = useNavigate();
    const resetPasswordToasterRef = useRef();
    const params = useParams();
    const [showInvalidTokenMessage, setShowInvalidTokenMessage] =
        useState(false);
    useEffect(() => {
        document.body.classList.add("login-page");
        let controller = new AbortController();
        const verifyForgotToken = async () => {
            try {
                const { response } = await axios.get(
                    FORGOT_PASSWORD_VERIFY_TOKEN + params.id,
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
                    // setTimeout(() => {
                    //     resetPasswordToasterRef.current();
                    // }, 1000);

                    Logger.debug("Invalid Token");
                    // setResetPassordMessageType("error");
                    // setResetPasswordMessageTitle("Invalid token");
                    // setResetPasswordMessageDescription(
                    //     error?.response?.data?.message
                    // );
                    // setTimeout(() => {
                    //     navigate("/login");
                    // }, 3000);
                    setShowInvalidTokenMessage(true);
                }
            }
        };
        verifyForgotToken();
        return () => {
            controller.abort();
            document.body.classList.remove("login-page");
        };
    }, []);

    const [values, setValues] = React.useState({
        newPassword: "",
        showNewPassword: false,
        confirmPassword: "",
        showConfirmPassword: false,
    });
    const [resetPasswordMessageType, setResetPassordMessageType] = useState("");
    const [resetPasswordMessageTitle, setResetPasswordMessageTitle] =
        useState("");
    const [
        resetPasswordMessageDescription,
        setResetPasswordMessageDescription,
    ] = useState("");

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
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    Logger.debug("params", params);
    const submitForm = async (data) => {
        try {
            const response = await axios.post(
                `${FORGOT_PASSWORD}${params.id}`,
                {
                    password: data.newPassword,
                    confirmPassword: data.confirmPassword,
                }
            );
            if (response?.status == 201) {
                setResetPassordMessageType("success");
                setResetPasswordMessageTitle("Success");
                setResetPasswordMessageDescription(
                    "Your password has been successfully updated!"
                );
                setTimeout(() => {
                    resetPasswordToasterRef.current();
                }, 1000);
                reset();
            }
        } catch (error) {
            Logger.debug("error from reset password submit method", error);
            if (error?.response?.status == 400) {
                setResetPassordMessageType("error");
                setResetPasswordMessageTitle("Password Reset Failure");
                setResetPasswordMessageDescription(
                    error?.response?.data?.message
                );
                reset();
                setTimeout(() => {
                    resetPasswordToasterRef.current();
                }, 1000);
            }
        }
    };

    const message = `Oops! The link to reset password is expired or looks like you're trying using an invalid link.
        \nIf you don't remember your password, please click on \"Forgot Password\" button below to reset your password.`;

    return (
        <div className="page-wrapper login-page-wrap">
            <Toaster
                messageType={resetPasswordMessageType}
                titleMessage={resetPasswordMessageTitle}
                myRef={resetPasswordToasterRef}
                descriptionMessage={resetPasswordMessageDescription}
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
                                        src={
                                            process.env.PUBLIC_URL +
                                            "/images/logo.png"
                                        }
                                        alt=""
                                        className="img-fluid"
                                    />
                                </div>
                                <h2
                                    className={`${
                                        showInvalidTokenMessage
                                            ? "warning-message"
                                            : "heading1 text-uppercase"
                                    }`}
                                >
                                    {showInvalidTokenMessage ? (
                                        <>
                                            <div>
                                                Oops! The link to reset password
                                                is expired or looks like you're
                                                trying using an invalid link.
                                            </div>
                                            <br />
                                            <p>
                                                If you don't remember your
                                                password, please click on
                                                "Forgot Password" button below
                                                to reset your password.
                                            </p>
                                        </>
                                    ) : (
                                        "Reset Password"
                                    )}
                                </h2>
                                <div className="login-form">
                                    {showInvalidTokenMessage ? (
                                        <div
                                            className="form-btn flex-between"
                                            // style={{
                                            //     justifyContent: "flex-end",
                                            // }}
                                        >
                                            <button
                                                type="submit"
                                                className="primary-button"
                                                onClick={() =>
                                                    navigate("/forget-password")
                                                }
                                            >
                                                Forgot password
                                            </button>
                                            {/* <div
                                                onClick={() =>
                                                    navigate("/forget-password")
                                                }
                                                className="tertiary-btn-blk mr-10"
                                            >
                                                Forget password?
                                            </div> */}
                                        </div>
                                    ) : (
                                        <form
                                            onSubmit={handleSubmit(submitForm)}
                                        >
                                            <div className="form-group">
                                                <label htmlFor="password">
                                                    New Password{" "}
                                                    <span className="mandatory">
                                                        *
                                                    </span>
                                                </label>
                                                <div className="password-field">
                                                    <ResetPasswordOutlinedInput
                                                        fullWidth
                                                        id="outlined-adornment-password"
                                                        type={
                                                            values.showNewPassword
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        // value={values.newPassword}
                                                        // onChange={handleChange('newPassword')}
                                                        placeholder="Enter new password"
                                                        className={`input-field ${
                                                            errors.newPassword &&
                                                            "input-error"
                                                        }`}
                                                        inputProps={{
                                                            maxLength: 15,
                                                        }}
                                                        endAdornment={
                                                            <ResetPasswordInputAdornment position="end">
                                                                <ResetPasswordIconButton
                                                                    aria-label="toggle password visibility"
                                                                    onClick={
                                                                        handleClickShowNewPassword
                                                                    }
                                                                    onMouseDown={
                                                                        handleMouseDownPassword
                                                                    }
                                                                    edge="end"
                                                                    className="eye-btn"
                                                                >
                                                                    {values.showNewPassword ? (
                                                                        <img
                                                                            src={
                                                                                process
                                                                                    .env
                                                                                    .PUBLIC_URL +
                                                                                "/images/non-visibleicon.svg"
                                                                            }
                                                                            alt=""
                                                                            className="img-fluid"
                                                                        />
                                                                    ) : (
                                                                        <img
                                                                            src={
                                                                                process
                                                                                    .env
                                                                                    .PUBLIC_URL +
                                                                                "/images/visibleicon.svg"
                                                                            }
                                                                            alt=""
                                                                            className="img-fluid"
                                                                        />
                                                                    )}
                                                                </ResetPasswordIconButton>
                                                            </ResetPasswordInputAdornment>
                                                        }
                                                        {...register(
                                                            "newPassword"
                                                        )}
                                                        onBlur={(e) =>
                                                            setValue(
                                                                "newPassword",
                                                                e.target.value.trim()
                                                            )
                                                        }
                                                    />
                                                    <p
                                                        className={`password-error`}
                                                    >
                                                        {errors?.newPassword ? (
                                                            errors.newPassword
                                                                ?.message
                                                        ) : (
                                                            <span>&nbsp;</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="password">
                                                    Confirm Password{" "}
                                                    <span className="mandatory">
                                                        *
                                                    </span>
                                                </label>
                                                <div className="password-field">
                                                    <ResetPasswordOutlinedInput
                                                        fullWidth
                                                        id="outlined-adornment-password"
                                                        type={
                                                            values.showConfirmPassword
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        // value={values.confirmPassword}
                                                        // onChange={handleChange('confirmPassword')}
                                                        placeholder="Enter confirm password"
                                                        className={`input-field ${
                                                            errors.confirmPassword &&
                                                            "input-error"
                                                        }`}
                                                        inputProps={{
                                                            maxLength: 15,
                                                        }}
                                                        endAdornment={
                                                            <ResetPasswordInputAdornment position="end">
                                                                <ResetPasswordIconButton
                                                                    aria-label="toggle password visibility"
                                                                    onClick={
                                                                        handleClickShowConfirmPassword
                                                                    }
                                                                    onMouseDown={
                                                                        handleMouseDownPassword
                                                                    }
                                                                    edge="end"
                                                                    className="eye-btn"
                                                                >
                                                                    {values.showConfirmPassword ? (
                                                                        <img
                                                                            src={
                                                                                process
                                                                                    .env
                                                                                    .PUBLIC_URL +
                                                                                "/images/non-visibleicon.svg"
                                                                            }
                                                                            alt=""
                                                                            className="img-fluid"
                                                                        />
                                                                    ) : (
                                                                        <img
                                                                            src={
                                                                                process
                                                                                    .env
                                                                                    .PUBLIC_URL +
                                                                                "/images/visibleicon.svg"
                                                                            }
                                                                            alt=""
                                                                            className="img-fluid"
                                                                        />
                                                                    )}
                                                                </ResetPasswordIconButton>
                                                            </ResetPasswordInputAdornment>
                                                        }
                                                        {...register(
                                                            "confirmPassword"
                                                        )}
                                                        onBlur={(e) =>
                                                            setValue(
                                                                "confirmPassword",
                                                                e.target.value.trim()
                                                            )
                                                        }
                                                    />
                                                    <p
                                                        className={`password-error`}
                                                    >
                                                        {errors?.confirmPassword ? (
                                                            errors
                                                                .confirmPassword
                                                                .message
                                                        ) : (
                                                            <span>&nbsp;</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="form-btn flex-between">
                                                <button
                                                    type="submit"
                                                    className="primary-button"
                                                >
                                                    Reset
                                                </button>
                                                <div
                                                    onClick={() =>
                                                        navigate("/login")
                                                    }
                                                    className="tertiary-btn-blk mr-10"
                                                >
                                                    Back to login
                                                </div>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
