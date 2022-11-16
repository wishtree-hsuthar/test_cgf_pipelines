import React, { useEffect, useState, useRef } from "react";

import Slider from "./Slider";
import { TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import {
    FORGOT_PASSWORD,
    FORGOT_PASSWORD_VERIFY_TOKEN,
    RESET_PASSWORD,
} from "../api/Url";
import Toaster from "../components/Toaster";
import { useParams, useNavigate } from "react-router-dom";
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
    const {
        register,
        handleSubmit,
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
    const toasterRef = useRef();
    const params = useParams();
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
                console.log("error from verify token", error);
                if (error?.response?.status == 400) {
                    setTimeout(() => {
                        toasterRef.current();
                    }, 1000);

                    console.log("Invalid Token");
                    setMessageType("error");
                    setMessageTitle("Invalid token");
                    setMessageDescription(error?.response?.data?.message);
                    setTimeout(() => {
                        navigate("/login");
                    }, 3000);
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
    const [messageType, setMessageType] = useState("");
    const [messageTitle, setMessageTitle] = useState("");
    const [messageDescription, setMessageDescription] = useState("");

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };
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
    console.log("params", params);
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
                setMessageType("success");
                setMessageTitle("Success");
                setMessageDescription(
                    "Your password has been successfully updated!"
                );
                setTimeout(() => {
                    toasterRef.current();
                }, 1000);
                reset();
            }
        } catch (error) {
            console.log("error from reset password submit method", error);
            if (error?.response?.status == 400) {
                setMessageType("error");
                setMessageTitle("Password Reset Failure");
                setMessageDescription(error?.response?.data?.message);
                reset();
                setTimeout(() => {
                    toasterRef.current();
                }, 1000);
            }
        }
    };

    return (
        <div className="page-wrapper login-page-wrap">
            <Toaster
                messageType={messageType}
                titleMessage={messageTitle}
                myRef={toasterRef}
                descriptionMessage={messageDescription}
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
                                <h2 className="heading1 text-uppercase">
                                    Reset Password
                                </h2>
                                <div className="login-form">
                                    <form onSubmit={handleSubmit(submitForm)}>
                                        <div className="form-group">
                                            <label for="password">
                                                New Password{" "}
                                                <span className="mandatory">*</span>
                                            </label>
                                            <div className="password-field">
                                                <OutlinedInput
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
                                                        <InputAdornment position="end">
                                                            <IconButton
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
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    {...register("newPassword")}
                                                />
                                                <p className={`password-error`}>
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
                                            <label for="password">
                                                Confirm Password{" "}
                                                <span className="mandatory">*</span>
                                            </label>
                                            <div className="password-field">
                                                <OutlinedInput
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
                                                        <InputAdornment position="end">
                                                            <IconButton
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
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    {...register(
                                                        "confirmPassword"
                                                    )}
                                                />
                                                <p className={`password-error`}>
                                                    {errors?.confirmPassword ? (
                                                        errors.confirmPassword
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
