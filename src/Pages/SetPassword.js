import React, { useEffect } from "react";
import Slider from "./Slider";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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
const SetPassword = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
    useEffect(() => {
        document.body.classList.add("login-page");
    }, []);

    const [values, setValues] = React.useState({
        newPassword: "",
        showNewPassword: false,
        confirmPassword: "",
        showConfirmPassword: false,
    });
    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };
    const handleClickShowNewPassword = () => {
        setValues({
            ...values,
            showNewPassword: !values.showNewPassword,
        });
    };
    const submitForm = (data) => {
        console.log(data);
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
                                                    error={
                                                        errors.newPassword
                                                            ? true
                                                            : false
                                                    }
                                                />
                                                <p
                                                    className={`input-error-msg`}
                                                >
                                                    {errors.newPassword
                                                        ? errors.newPassword
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
                                                    error={
                                                        errors.confirmPassword
                                                            ? true
                                                            : false
                                                    }
                                                />
                                                <p
                                                    className={`input-error-msg`}
                                                >
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
