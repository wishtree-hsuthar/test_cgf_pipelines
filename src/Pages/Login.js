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
import Toaster from "../components/Toasters";
import { LOGIN_URL } from "../api/Url";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/UserSlice";
const loginFormSchema = yup.object().shape({
    email: yup
        .string()
        .email("Please enter valid email")
        .required("Email address required"),
    password: yup
        .string()
        .matches(
            /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
            "Password must contain at least 8 characters, one uppercase, one number and one special case character"
        )
        .required("Password required"),
});
const Login = (prop) => {
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

    const submitLoginData = (data) => {
        console.log(data);
        toasterRef.current();
        // "http://localhost:3000/api/auth/login",
        axios
            .post(LOGIN_URL, data, { withCredentials: true })
            .then((response) => {
                console.log(
                    "response from login",
                    response?.data?.access_token
                );
                localStorage.setItem("a_token", response?.data?.access_token);
                localStorage.setItem("uuid", response?.data?.user?.uuid);
                console.log("DATA", response?.data?.user);
                dispatch(setUser(response?.data?.user));
                navigate("/dashboard");
            });
    };

    return (
        <div class="page-wrapper login-page-wrap">
            <Toaster
                myRef={toasterRef}
                titleMessage={"Success"}
                descriptionMessage={"Login successful"}
                messageType={"success"}
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
                                        <div class="form-group">
                                            <label for="emailid">
                                                Email Id{" "}
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
                                            {/* <p className={`input-error-msg`}>{errors.email?.message}</p> */}
                                        </div>
                                        <div class="form-group">
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
                                                                {values.showPassword ? (
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
                                                />
                                                <p
                                                    className={`input-error-msg`}
                                                >
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
