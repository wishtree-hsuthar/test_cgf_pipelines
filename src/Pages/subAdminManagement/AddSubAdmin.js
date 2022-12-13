import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    TextField,
    Select,
    MenuItem,
    Box,
    Autocomplete,
    Paper,
} from "@mui/material";
import "react-phone-number-input/style.css";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";
import axios from "axios";
import { privateAxios } from "../../api/axios";
import { ADD_SUB_ADMIN, COUNTRIES, FETCH_ROLES } from "../../api/Url";
import { useSelector } from "react-redux";
import Toaster from "../../components/Toaster";
import useCallbackState from "../../utils/useCallBackState";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import Input from "../../components/Input";
import Dropdown from "../../components/Dropdown";
import { useDocumentTitle } from "../../utils/useDocumentTitle";

const helperTextForCGFAdmin = {
    countryCode: {
        validate: "Select the country code",
    },
    phoneNumber: {
        maxLength: "Max digits limit exceed",
        minLength: "minimum 3 characters required",
        validate: "Enter the phone number",
        pattern: "Invalid format",
    },
    name: {
        required: "Enter the CGF admin name",
        maxLength: "Max char limit exceed",
        minLength: "minimum 3 characters required",
        pattern: "Invalid format",
    },
    email: {
        required: "Enter the email",
        pattern: "Invalid format",
        minLength: "minimum 3 characters required",
    },
    subRoleId: {
        required: "Select the role",
    },
};

const AddSubAdmin = () => {
    //custom hook to set title of page
    useDocumentTitle("Add CGF Admin");

    const authUser = useSelector((state) => state.user.userObj);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
        control,
        trigger,
        setValue,
    } = useForm({
        defaultValues: {
            name: "",
            email: "",
            subRoleId: "",
            phoneNumber: "",
            countryCode: "",
        },
    });
    const location = useLocation();
    console.log(location);
    // const [value, setValue] = useState({});
    const [roleSelected, setRoleSelected] = useState("");
    const [countries, setCountries] = useState([]);
    const [roles, setRoles] = useState([]);
    const [defaultRole, setDefaultRole] = useState("");
    const toasterRef = useRef();
    const [toasterDetails, setToasterDetails] = useCallbackState({
        titleMessage: "",
        descriptionMessage: "",
        messageType: "error",
    });

    const phoneNumberChangeHandler = (e, name, code) => {
        console.log("inside on Change");
        setValue(name, e.target.value);
        trigger(name);
        trigger(code);
    };
    useEffect(() => {
        let isMounted = true;
        let controller = new AbortController();
        let fetchRoles = async () => {
            try {
                const response = await privateAxios.get(FETCH_ROLES, {
                    signal: controller.signal,
                });
                console.log("Response from fetch roles - ", response);
                setRoles(response.data);
                response.data.filter(
                    (data) =>
                        data.name === "CGF Admin" &&
                        reset({ subRoleId: data._id })
                );
            } catch (error) {
                if (error?.code === "ERR_CANCELED") return;
                console.log("Error from fetch roles", error);
                if (error?.response?.status === 401) {
                    isMounted &&
                        setToasterDetails(
                            {
                                titleMessage: "Oops!",
                                descriptionMessage: "Session timeout",
                                messageType: "error",
                            },
                            () => toasterRef.current()
                        );
                    setTimeout(() => {
                        navigate("/login");
                    }, 3000);
                } else {
                    isMounted &&
                        setToasterDetails(
                            {
                                titleMessage: "Oops!",
                                descriptionMessage:
                                    error?.response?.data?.message,
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
        let fetchCountries = async () => {
            try {
                const response = await axios.get(COUNTRIES, {
                    signal: controller.signal,
                });
                console.log("response from countries API-", response);
                if (isMounted) {
                    let tempCountryCode = response?.data.map(
                        (country) => country.countryCode
                    );
                    let tempCountryCodeSet = new Set(tempCountryCode);
                    setCountries([...tempCountryCodeSet]);
                }
                // isMounted &&
                //     setCountries(
                //         response?.data.map((country) => country.countryCode)
                //     );
            } catch (error) {
                if (error?.code === "ERR_CANCELED") return;
                console.log("error from countries api", error);
                // if (error?.response?.status === 401) {
                //     setToasterDetails(
                //         {
                //             titleMessage: "Oops!",
                //             descriptionMessage: "Session timeout",
                //             messageType: "error",
                //         },
                //         () => toasterRef.current()
                //     );
                //     setTimeout(() => {
                //         navigate("/login");
                //     }, 3000);
                // }
                // else
                //  {
                isMounted &&
                    setToasterDetails(
                        {
                            titleMessage: "Oops!",
                            descriptionMessage: error?.response?.data?.message,
                            messageType: "error",
                        },
                        () => toasterRef.current()
                    );
                navigate("/login");
                // }
            }
        };
        fetchRoles();
        fetchCountries();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);
    console.log("countriess----", countries);

    const handleRoleSelection = (e) => {
        setRoleSelected(e.target.value);
    };

    const addSubAdminData = async (data) => {
        try {
            const response = await axios.post(ADD_SUB_ADMIN, data);
            if (response.status == 201) {
                setToasterDetails(
                    {
                        titleMessage: "Hurray!",
                        descriptionMessage: "New CGF admin added successfully!",
                        messageType: "success",
                    },
                    () => toasterRef.current()
                );

                reset();
            }
        } catch (error) {
            if (error?.code === "ERR_CANCELED") return;
            console.log("error from add sub admin page", error);
            if (error?.response?.status === 401) {
                setToasterDetails(
                    {
                        titleMessage: "Oops!",
                        descriptionMessage: "Session timeout",
                        messageType: "error",
                    },
                    () => toasterRef.current()
                );
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            } else {
                setToasterDetails(
                    {
                        titleMessage: "Oops!",
                        descriptionMessage: error?.response?.data?.message,
                        messageType: "error",
                    },
                    () => toasterRef.current()
                );
            }
        }
    };
    const handleOnSubmit = async (data) => {
        data.countryCode = data.countryCode.slice(
            data.countryCode.indexOf("+")
        );
        data = {
            ...data,
            phoneNumber: data.phoneNumber ? parseInt(data.phoneNumber) : "",
            // roleId: authUser.roleId._id,
        };

        console.log("new phone number", data);
        addSubAdminData(data);
        // navigate("/users/cgf-admin/");
        setTimeout(() => {
            navigate("/users/cgf-admin/");
        }, 3000);
    };

    const handleSaveAndMore = (data) => {
        data.countryCode = data.countryCode.slice(
            data.countryCode.indexOf("+")
        );
        data = {
            ...data,
            phoneNumber: Number(data.phoneNumber),
            // roleId: authUser.roleId._id,
        };

        addSubAdminData(data);
        console.log(data);
        reset();
        setValue("");
        setRoleSelected("");
    };
    const handleCancel = () => {
        navigate("/users/cgf-admin/");
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
                            <Link to="/users/cgf-admin/">CGF Admins</Link>
                        </li>
                        <li>Add CGF Admin</li>
                    </ul>
                </div>
            </div>
            <section>
                <div className="container">
                    <form
                        onSubmit={handleSubmit(handleOnSubmit)}
                        // onKeyDown={handleSubmit(handleOnSubmit)}
                    >
                        <div className="form-header flex-between">
                            <h2 className="heading2">Add CGF Admin</h2>
                            <div className="form-header-right-txt">
                                <div
                                    className="tertiary-btn-blk"
                                    onClick={handleSubmit(handleSaveAndMore)}
                                >
                                    <span className="addmore-icon">
                                        <i className="fa fa-plus"></i>
                                    </span>
                                    <span className="addmore-txt">
                                        Save & Add More
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="card-wrapper">
                            <div className="card-blk flex-between">
                                <div className="card-form-field">
                                    <div className="form-group">
                                        <label htmlFor="name">
                                            CGF Admin Name{" "}
                                            <span className="mandatory">*</span>
                                        </label>
                                        <Input
                                            name={"name"}
                                            onBlur={(e) =>
                                                setValue(
                                                    "name",
                                                    e.target.value?.trim()
                                                )
                                            }
                                            control={control}
                                            placeholder={"Enter CGF admin name"}
                                            myHelper={helperTextForCGFAdmin}
                                            rules={{
                                                required: true,
                                                maxLength: 50,
                                                minLength: 3,
                                                pattern:
                                                    /^[A-Za-z]+[A-Za-z ]*$/,
                                            }}
                                        />

                                        {/* <TextField
                                            id="outlined-basic"
                                            placeholder="Enter sub admin name"
                                            variant="outlined"
                                            className={`input-field ${
                                                errors.name && "input-error"
                                            }`}
                                            inputProps={{
                                                maxLength: 50,
                                            }}
                                            {...register("name")}
                                            helperText={
                                                errors.name
                                                    ? errors.name?.message
                                                    : " "
                                            }
                                        /> */}
                                    </div>
                                </div>
                                <div className="card-form-field">
                                    <div className="form-group">
                                        <label htmlFor="email">
                                            Email{" "}
                                            <span className="mandatory">*</span>
                                        </label>
                                        <Input
                                            name={"email"}
                                            onBlur={(e) =>
                                                setValue(
                                                    "email",
                                                    e.target.value?.trim()
                                                )
                                            }
                                            control={control}
                                            placeholder={"example@domain.com"}
                                            myHelper={helperTextForCGFAdmin}
                                            rules={{
                                                required: true,
                                                maxLength: 50,
                                                minLength: 3,
                                                pattern:
                                                    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="card-form-field">
                                    <div className="form-group">
                                        <label htmlFor="phoneNumber">
                                            Phone Number
                                        </label>
                                        <div className="phone-number-field">
                                            <div className="select-field country-code">
                                                <Controller
                                                    control={control}
                                                    name="countryCode"
                                                    rules={{
                                                        validate: () => {
                                                            if (
                                                                !watch(
                                                                    "countryCode"
                                                                ) &&
                                                                watch(
                                                                    "phoneNumber"
                                                                )
                                                            )
                                                                return "Invalid input";
                                                        },
                                                    }}
                                                    render={({
                                                        field,
                                                        fieldState: { error },
                                                    }) => (
                                                        <Autocomplete
                                                            className={`${
                                                                error &&
                                                                "autocomplete-error"
                                                            }`}
                                                            PaperComponent={({
                                                                children,
                                                            }) => (
                                                                <Paper
                                                                    className={
                                                                        countries?.length >
                                                                        5
                                                                            ? "autocomplete-option-txt autocomplete-option-limit"
                                                                            : "autocomplete-option-txt"
                                                                    }
                                                                >
                                                                    {children}
                                                                </Paper>
                                                            )}
                                                            popupIcon={
                                                                <KeyboardArrowDownRoundedIcon />
                                                            }
                                                            {...field}
                                                            onChange={(
                                                                event,
                                                                newValue
                                                            ) => {
                                                                console.log(
                                                                    "inside autocomplete onchange"
                                                                );
                                                                console.log(
                                                                    "new Value ",
                                                                    newValue
                                                                );
                                                                newValue &&
                                                                typeof newValue ===
                                                                    "object"
                                                                    ? setValue(
                                                                          "countryCode",
                                                                          newValue.name
                                                                      )
                                                                    : setValue(
                                                                          "countryCode",
                                                                          newValue
                                                                      );
                                                                trigger(
                                                                    "countryCode"
                                                                );
                                                                trigger(
                                                                    "phoneNumber"
                                                                );
                                                            }}
                                                            options={
                                                                countries
                                                                    ? countries
                                                                    : []
                                                            }
                                                            autoHighlight
                                                            // placeholder="Select country code"
                                                            getOptionLabel={(
                                                                country
                                                            ) => country}
                                                            renderOption={(
                                                                props,
                                                                option
                                                            ) => (
                                                                <li {...props}>
                                                                    {option}
                                                                </li>
                                                            )}
                                                            renderInput={(
                                                                params
                                                            ) => (
                                                                <TextField
                                                                    // className={`input-field ${
                                                                    //   error && "input-error"
                                                                    // }`}
                                                                    {...params}
                                                                    inputProps={{
                                                                        ...params.inputProps,
                                                                    }}
                                                                    onChange={() =>
                                                                        trigger(
                                                                            "countryCode"
                                                                        )
                                                                    }
                                                                    // onSubmit={() => setValue("countryCode", "")}
                                                                    placeholder={
                                                                        "+91"
                                                                    }
                                                                    helperText={
                                                                        error
                                                                            ? helperTextForCGFAdmin
                                                                                  .countryCode[
                                                                                  error
                                                                                      ?.type
                                                                              ]
                                                                            : " "
                                                                    }
                                                                />
                                                            )}
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <Input
                                                name={"phoneNumber"}
                                                myOnChange={(e) =>
                                                    phoneNumberChangeHandler(
                                                        e,
                                                        "phoneNumber",
                                                        "countryCode"
                                                    )
                                                }
                                                onBlur={(e) =>
                                                    setValue(
                                                        "phoneNumber",
                                                        e.target.value?.trim()
                                                    )
                                                }
                                                control={control}
                                                myHelper={helperTextForCGFAdmin}
                                                placeholder={"1234567890"}
                                                rules={{
                                                    maxLength: 15,
                                                    minLength: 3,
                                                    validate: (value) => {
                                                        if (
                                                            !watch(
                                                                "phoneNumber"
                                                            ) &&
                                                            watch("countryCode")
                                                        )
                                                            return "invalid input";
                                                        if (
                                                            value &&
                                                            !Number(value)
                                                        )
                                                            return "Invalid input";
                                                    },
                                                    // validate: (value) => {
                                                    //     if (
                                                    //         watch(
                                                    //             "phoneNumber"
                                                    //         ) &&
                                                    //         !watch(
                                                    //             "countryCode"
                                                    //         )
                                                    //     )
                                                    //         return "Enter Country code";
                                                    // else if (
                                                    //     value &&
                                                    //     !Number(value)
                                                    // )
                                                    //     return "Please enter valid phone number";
                                                    // },
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="card-form-field">
                                    <div className="form-group">
                                        <label htmlFor="role">
                                            Role{" "}
                                            <span className="mandatory">*</span>
                                        </label>

                                        <div>
                                            <Dropdown
                                                name="subRoleId"
                                                control={control}
                                                options={roles}
                                                rules={{
                                                    required: true,
                                                }}
                                                myHelper={helperTextForCGFAdmin}
                                                placeholder={"Select role"}
                                            />

                                            <p className={`password-error`}>
                                                {errors.subRoleId?.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-btn flex-between add-members-btn">
                                    <button
                                        type="reset"
                                        onClick={handleCancel}
                                        className="secondary-button mr-10"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="primary-button add-button"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default AddSubAdmin;
