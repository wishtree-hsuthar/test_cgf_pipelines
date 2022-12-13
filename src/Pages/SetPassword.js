import React, { useEffect, useRef } from "react";
import Slider from "./Slider";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { publicAxios } from "../api/axios";
import { CONFIRM_PASSWORD, SET_PASSWORD_VERIFY_TOKEN } from "../api/Url";
import Toaster from "../components/Toaster";
import useCallbackState from "../utils/useCallBackState";
import { useNavigate, useParams } from "react-router-dom";
import { useDocumentTitle } from "../utils/useDocumentTitle";
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
useDocumentTitle("Set Password")
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
            document.body.classList.remove("login-page");
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
            const response = await publicAxios.post(
                CONFIRM_PASSWORD + params.id,
                data
            );
            console.log("response from confirm passowrd", response);
            if (response.status == 201) {
                setToasterDetails(
                    {
                        titleMessage: "Hurray!",
                        descriptionMessage: "Your password has been set successfully!",
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
                    descriptionMessage: error?.response?.data?.message,
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
        <div className="page-wrapper login-page-wrap">
            <Toaster
                myRef={toasterRef}
                titleMessage={toasterDetails.titleMessage}
                descriptionMessage={toasterDetails.descriptionMessage}
                messageType={toasterDetails.messageType}
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
                                    Set Password
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
                                                    // value={values.password}
                                                    // onChange={handleChange('password')}
                                                    placeholder="Enter new password"
                                                    className={`input-field ${
                                                        errors.password &&
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
                                                                {!values.showNewPassword ? (
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
                                                    {...register("password")}
                                                    error={
                                                        errors.password
                                                            ? true
                                                            : false
                                                    }
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
                                                                {!values.showConfirmPassword ? (
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
                                                    error={
                                                        errors.confirmPassword
                                                            ? true
                                                            : false
                                                    }
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
                                            <button className="primary-button">
                                                Submit
                                            </button>
                                            {/* <div className="tertiary-btn-blk mr-10">Back to login</div> */}
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
