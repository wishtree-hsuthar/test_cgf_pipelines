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
import { setUser } from "../redux/UserSlice";
import useCallbackState from "../utils/useCallBackState";
import { privateAxios, publicAxios } from "../api/axios";
const loginFormSchema = yup.object().shape({
    email: yup
        .string()
        .email("Please enter valid email")
        .required("Email address required"),
    password: yup.string().required("Password required"),
});
const Login = (prop) => {
    const [toasterDetails, setToasterDetails] = useCallbackState({
        titleMessage: "",
        descriptionMessage: "",
        messageType: "error",
    });
    const toasterRef = useRef();
    const dispatch = useDispatch();
    Logger.info(prop);
    const location = useLocation();
    console.log("location", location);
    console.log("---------", prop);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginFormSchema),
    });
    useEffect(() => {
        document.body.classList.add("login-page");

        let isMounted = true;
        const controller = new AbortController();
        const fetchUser = async () => {
            try {
                const { status, data } = await axios.get(GET_USER, {
                    withCredentials: true,
                    signal: controller.signal,
                });
                console.log("data from app fetcuser method app file", data);
                if (status == 200) {
                    navigate("/home");
                }
                // isMounted && setUserPresent(true);
            } catch (error) {
                if (error?.response?.status == 401) {
                    // setUserPresent(false);
                    console.log("Error from app file useEffect", error);
                    // navigate("/login");
                }
            }
        };
        fetchUser();

        return () => {
            document.body.classList.remove("login-page");
            isMounted = false;
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
        console.log(data);
        try {
            const response = await publicAxios.post(LOGIN_URL, data, {
                withCredentials: true,
            });
            if (response.status == 201) {
                console.log("DATA", response?.data?.user);
                dispatch(setUser(response?.data?.user));
                navigate("/home");
            }
        } catch (error) {
            console.log("error from submit login method", error);

            if (error.response.status == 401) {
                setToasterDetails(
                    {
                        titleMessage: "Invalid Credentials",
                        descriptionMessage: "Incorrect email or password",
                        messageType: "error",
                    },
                    () => toasterRef.current()
                );
            }
            if (error.response.status == 400) {
                setToasterDetails(
                    {
                        titleMessage: "Session Active",
                        descriptionMessage: error?.response?.data?.message,
                        messageType: "error",
                    },
                    () => toasterRef.current()
                );
            }
        }
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
                                <h2 class="heading1 text-uppercase">Log in</h2>
                                <div class="login-form">
                                    <form
                                        onSubmit={handleSubmit(submitLoginData)}
                                    >
                                        <div class="form-group mb-40">
                                            <label for="emailid">
                                                Username or Email Id{" "}
                                                <span class="mandatory">*</span>
                                            </label>
                                            <TextField
                                                className={`input-field ${
                                                    errors.email &&
                                                    "input-error"
                                                }`}
                                                id="outlined-basic"
                                                placeholder="Enter email id"
                                                variant="outlined"
                                                {...register("email")}
                                                helperText={
                                                    errors.email
                                                        ? errors.email.message
                                                        : ""
                                                }
                                            />
                                        </div>
                                        <div class="form-group mb-40">
                                            <label for="password">
                                                Password{" "}
                                                <span class="mandatory">*</span>
                                            </label>
                                            <div className="password-field">
                                                <OutlinedInput
                                                    fullWidth
                                                    id="outlined-adornment-password"
                                                    type={
                                                        values.showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
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
                                                                    handleClickShowPassword
                                                                }
                                                                onMouseDown={
                                                                    handleMouseDownPassword
                                                                }
                                                                edge="end"
                                                                className="eye-btn"
                                                            >
                                                                {!values.showPassword ? (
                                                                    <img
                                                                        src={
                                                                            process
                                                                                .env
                                                                                .PUBLIC_URL +
                                                                            "/images/non-visibleicon.svg"
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
                                                                            "/images/visibleicon.svg"
                                                                        }
                                                                        alt=""
                                                                        class="img-fluid"
                                                                    />
                                                                )}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    {...register("password")}
                                                />
                                                <p className={`password-error`}>
                                                    {errors.password?.message}
                                                </p>
                                            </div>
                                        </div>
                                        <div class="form-btn flex-between">
                                            <button
                                                type="submit"
                                                class="primary-button"
                                            >
                                                Log In
                                            </button>
                                            <div
                                                class="tertiary-btn-blk mr-10"
                                                onClick={
                                                    navigateToforgetPasswordPage
                                                }
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
