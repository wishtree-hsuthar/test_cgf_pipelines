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
import Toaster from "../components/Toasters";
import { useParams, useNavigate } from "react-router-dom";
const schema = yup.object().shape({
    newPassword: yup
        .string()
        .matches(
            /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
            "Password must contain at least 8 characters, one uppercase, one number and one special case character"
        )
        .required("Password required"),
    confirmPassword: yup
        .string()
        .required("Please enter confirm password")
        .oneOf([yup.ref("newPassword"), null], "Passwords don't match."),
});
const ResetPassword = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
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
            const { response } = await axios.post(
                `${FORGOT_PASSWORD}${params.id}`,
                {
                    password: data.newPassword,
                    confirmPassword: data.confirmPassword,
                }
            );
            if (response?.status == 200) {
                setMessageType("success");
                setMessageTitle("Password Reset");
                setMessageDescription("Password reset successfull");
                toasterRef.current();
            }
        } catch (error) {
            console.log("error from reset password submit method", error);
            if (error?.response?.status == 400) {
                setMessageType("error");
                setMessageTitle("Password Reset Failure");
                setMessageDescription("Password reset unsuccessfull");
                toasterRef.current();
            }
        }
    };

    return (
        <div class="page-wrapper login-page-wrap">
            <Toaster
                messageType={messageType}
                titleMessage={messageTitle}
                myRef={toasterRef}
                descriptionMessage={messageDescription}
            />
            <div class="login-section">
                <div class="container">
                    <div class="login-wrapper">
                        <div class="login-leftblk">
                            <div class="login-slider">
                                <Slider />
                            </div>
                        </div>
                        <div class="login-rightblk">
                            <div class="login-blk">
                                <div class="logo">
                                    <img
                                        src={
                                            process.env.PUBLIC_URL +
                                            "/images/logo.png"
                                        }
                                        alt=""
                                        class="img-fluid"
                                    />
                                </div>
                                <h2 class="heading1 text-uppercase">
                                    Reset Password
                                </h2>
                                <div class="login-form">
                                    <form onSubmit={handleSubmit(submitForm)}>
                                        <div class="form-group">
                                            <label for="password">
                                                New Password{" "}
                                                <span class="mandatory">*</span>
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
                                                    placeholder="Enter password"
                                                    className={`input-field ${
                                                        errors.newPassword &&
                                                        "input-error"
                                                    }`}
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
                                                                            "/images/non-visibleicon.png"
                                                                        }
                                                                        alt=""
                                                                        class="img-fluid"
                                                                    />
                                                                ) : (
                                                                    <img
                                                                        src={
                                                                            process
                                                                                .env
                                                                                .PUBLIC_URL +
                                                                            "/images/visibleicon.png"
                                                                        }
                                                                        alt=""
                                                                        class="img-fluid"
                                                                    />
                                                                )}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    {...register("newPassword")}
                                                />
                                                <p
                                                    className={`input-error-msg`}
                                                >
                                                    {
                                                        errors.newPassword
                                                            ?.message
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label for="password">
                                                Confirm Password{" "}
                                                <span class="mandatory">*</span>
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
                                                    placeholder="Enter password"
                                                    className={`input-field ${
                                                        errors.confirmPassword &&
                                                        "input-error"
                                                    }`}
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
                                                                            "/images/non-visibleicon.png"
                                                                        }
                                                                        alt=""
                                                                        class="img-fluid"
                                                                    />
                                                                ) : (
                                                                    <img
                                                                        src={
                                                                            process
                                                                                .env
                                                                                .PUBLIC_URL +
                                                                            "/images/visibleicon.png"
                                                                        }
                                                                        alt=""
                                                                        class="img-fluid"
                                                                    />
                                                                )}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    {...register(
                                                        "confirmPassword"
                                                    )}
                                                />
                                                <p
                                                    className={`input-error-msg`}
                                                >
                                                    {
                                                        errors.confirmPassword
                                                            ?.message
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <div class="form-btn flex-between">
                                            <button
                                                type="submit"
                                                class="primary-button"
                                            >
                                                Reset
                                            </button>
                                            <div
                                                onClick={() =>
                                                    navigate("/login")
                                                }
                                                class="tertiary-btn-blk mr-10"
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
