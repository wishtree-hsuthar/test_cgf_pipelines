import React, { useEffect, useRef } from "react";
import Slider from "./Slider";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { privateAxios, publicAxios } from "../api/axios";
import { CONFIRM_PASSWORD, SET_PASSWORD_VERIFY_TOKEN } from "../api/Url";
import Toaster from "../components/Toaster";
import useCallbackState from "../utils/useCallBackState";
import { useNavigate, useParams } from "react-router-dom";
const schema = yup.object().shape({
    password: yup
        .string()
        .matches(
            /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
            "Password must contain at least 8 characters, one uppercase, one number and one special case character"
        )
        .required("Password required"),
    confirmPassword: yup
        .string()
        .required("Please enter confirm password")
        .oneOf([yup.ref("password"), null], "Passwords don't match."),
});
const SetPassword = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
    // useEffect(() => {
    //     try {
    //         console.log("In set password");
    //     } catch (error) {}
    // }, []);
    useEffect(() => {
        let controller = new AbortController();
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
                console.log("error from verify token", error);
                if (error?.response?.status == 400) {
                    console.log("Invalid Token");
                    setToasterDetails(
                        {
                            titleMessage: "Oops!",
                            descriptionMessage: error?.response?.data?.message,
                            messageType: "error",
                        },
                        () => toasterRef.current()
                    );
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
    const [toasterDetails, setToasterDetails] = useCallbackState({
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
    const toasterRef = useRef();
    const params = useParams();
    const handleClickShowNewPassword = () => {
        setValues({
            ...values,
            showNewPassword: !values.showNewPassword,
        });
    };
    const submitForm = async (data) => {
        try {
            const response = await privateAxios.post(
                CONFIRM_PASSWORD + params.id,
                data
            );
            console.log("response from confirm passowrd", response);
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
                    navigate("/login");
                }, 3000);
            }
        } catch (error) {
            console.log("error from confirm password", error);
            setToasterDetails(
                {
                    titleMessage: "Oops!",
                    descriptionMessage: error?.response?.data?.error,
                    messageType: "error",
                },
                () => toasterRef.current()
            );
            setTimeout(() => {
                navigate("/login");
            }, 3000);
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
        <div class="page-wrapper login-page-wrap">
            <Toaster
                myRef={toasterRef}
                titleMessage={toasterDetails.titleMessage}
                descriptionMessage={toasterDetails.descriptionMessage}
                messageType={toasterDetails.messageType}
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
                                    Set Password
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
                                                    // value={values.password}
                                                    // onChange={handleChange('password')}
                                                    placeholder="Enter password"
                                                    className={`input-field ${
                                                        errors.password &&
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
                                                                {!values.showNewPassword ? (
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
                                                    {...register("password")}
                                                    error={
                                                        errors.password
                                                            ? true
                                                            : false
                                                    }
                                                />
                                                <p className={`password-error`}>
                                                    {errors.password
                                                        ? errors.password
                                                              .message
                                                        : " "}
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
                                                                {!values.showConfirmPassword ? (
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
                                                    error={
                                                        errors.confirmPassword
                                                            ? true
                                                            : false
                                                    }
                                                />
                                                <p className={`password-error`}>
                                                    {errors.confirmPassword
                                                        ? errors.confirmPassword
                                                              .message
                                                        : " "}
                                                </p>
                                            </div>
                                        </div>
                                        <div class="form-btn flex-between">
                                            <button class="primary-button">
                                                Submit
                                            </button>
                                            {/* <div class="tertiary-btn-blk mr-10">Back to login</div> */}
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

export default SetPassword;
