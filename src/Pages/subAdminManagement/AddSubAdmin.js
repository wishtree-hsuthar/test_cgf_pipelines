import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TextField, Select, MenuItem, Box, Autocomplete } from "@mui/material";
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
const AddSubAdminSchema = yup.object().shape({
    name: yup.string().required("Sub admin name required"),
    email: yup
        .string()
        .email("Enter valid email address")
        .required("Email address requried"),
    subRoleId: yup.string().required("Role required"),
    phoneNumber: yup
        .number("please add valid number")
        .min(3, "Minimum 3 digits required"),
    countryCode: yup.string().required("Code required"),
});
const AddSubAdmin = () => {
    const authUser = useSelector((state) => state.user.userObj);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
        trigger,
        setValue,
    } = useForm({
        resolver: yupResolver(AddSubAdminSchema),
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
    const toasterRef = useRef();
    const [toasterDetails, setToasterDetails] = useCallbackState({
        titleMessage: "",
        descriptionMessage: "",
        messageType: "error",
    });
    useEffect(() => {
        let isMounted = true;
        let controller = new AbortController();
        let fetchRoles = async () => {
            try {
                const response = await privateAxios.get(FETCH_ROLES);
                console.log("Response from fetch roles - ", response);
                setRoles(response.data);
            } catch (error) {
                console.log("Error from fetch roles", error);
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
        let fetchCountries = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/api/master/country/list",
                    {
                        signal: controller.signal,
                    }
                );
                console.log("response from countries API-", response);
                isMounted &&
                    setCountries(
                        response?.data.map((country) => country.countryCode)
                    );
            } catch (error) {
                console.log("error from countries api", error);
                setToasterDetails(
                    {
                        titleMessage: "Oops!",
                        descriptionMessage: error?.response?.data?.message,
                        messageType: "error",
                    },
                    () => toasterRef.current()
                );
                navigate("/login");
            }
        };
        fetchRoles();
        fetchCountries();

        return () => {
            isMounted = false;
            // controller.abort();
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
                        descriptionMessage: response.data.message,
                        messageType: "success",
                    },
                    () => toasterRef.current()
                );

                reset();
            }
        } catch (error) {
            console.log("error from add sub admin page", error);
            setToasterDetails(
                {
                    titleMessage: "Oops!",
                    descriptionMessage: error?.response?.data?.message,
                    messageType: "error",
                },
                () => toasterRef.current()
            );
        }
    };
    const handleOnSubmit = async (data) => {
        data.countryCode = data.countryCode.slice(
            data.countryCode.indexOf("+")
        );
        data = {
            ...data,
            phoneNumber: Number(data.phoneNumber),
            roleId: authUser.roleId._id,
        };

        console.log("new phone number", data);
        addSubAdminData(data);
        // navigate("/sub-admins");
        setTimeout(() => {
            navigate("/sub-admins");
        }, 3000);
    };

    const handleSaveAndMore = (data) => {
        data.countryCode = data.countryCode.slice(
            data.countryCode.indexOf("+")
        );
        data = {
            ...data,
            phoneNumber: Number(data.phoneNumber),
            roleId: authUser.roleId._id,
        };

        addSubAdminData(data);
        console.log(data);
        reset();
        setValue("");
        setRoleSelected("");
    };
    const handleCancel = () => {
        navigate("/sub-admins");
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
                            <Link to="/sub-admins">CGF Admin</Link>
                        </li>
                        <li>Add CGF Admin</li>
                    </ul>
                </div>
            </div>
            <section>
                <div className="container">
                    <form onSubmit={handleSubmit(handleOnSubmit)}>
                        <div className="form-header flex-between">
                            <h2 className="heading2">Add CGF Admin</h2>
                            <div className="form-header-right-txt">
                                <div
                                    className="tertiary-btn-blk"
                                    onClick={handleSubmit(handleSaveAndMore)}
                                >
                                    <span class="addmore-icon">
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
                                        <label for="name">
                                            CGF Admin Name{" "}
                                            <span className="mandatory">*</span>
                                        </label>
                                        <TextField
                                            id="outlined-basic"
                                            placeholder="Enter sub admin name"
                                            variant="outlined"
                                            className={`input-field ${
                                                errors.name && "input-error"
                                            }`}
                                            {...register("name")}
                                            helperText={
                                                errors.name
                                                    ? errors.name?.message
                                                    : " "
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="card-form-field">
                                    <div className="form-group">
                                        <label for="email">
                                            Email Id{" "}
                                            <span className="mandatory">*</span>
                                        </label>
                                        <TextField
                                            className={`input-field ${
                                                errors.email && "input-error"
                                            }`}
                                            id="outlined-basic"
                                            placeholder="Enter email address"
                                            variant="outlined"
                                            {...register("email")}
                                            helperText={
                                                errors.email
                                                    ? errors?.email?.message
                                                    : ""
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="card-form-field">
                                    <div className="form-group">
                                        <label for="phoneNumber">
                                            Phone Number
                                        </label>
                                        <div className="phone-number-field">
                                            <div className="select-field country-code">
                                                <Controller
                                                    control={control}
                                                    name="countryCode"
                                                    rules={{ required: true }}
                                                    render={({
                                                        field,
                                                        fieldState: { error },
                                                    }) => (
                                                        <Autocomplete
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
                                                            }}
                                                            // sx={{ width: 200 }}
                                                            options={countries}
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
                                                                        "eg. +91"
                                                                    }
                                                                    helperText={
                                                                        error
                                                                            ? "Select country code"
                                                                            : " "
                                                                    }
                                                                />
                                                            )}
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <TextField
                                                className={`input-field ${
                                                    errors.email &&
                                                    "input-error"
                                                }`}
                                                id="outlined-basic"
                                                placeholder="Enter phone number"
                                                variant="outlined"
                                                {...register("phoneNumber")}
                                                helperText={
                                                    errors.phoneNumber
                                                        ? errors.phoneNumber
                                                              .message
                                                        : " "
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="card-form-field">
                                    <div className="form-group">
                                        <label for="role">
                                            Select Role{" "}
                                            <span className="mandatory">*</span>
                                        </label>

                                        <div className="select-field">
                                            <Controller
                                                name="subRoleId"
                                                control={control}
                                                render={({
                                                    field,
                                                    fieldState: { error },
                                                }) => (
                                                    <>
                                                        <Select
                                                            {...field}
                                                            className={`input-field ${
                                                                errors.subRoleId &&
                                                                "input-error"
                                                            }`}
                                                            // {...register(
                                                            //     "subRoleId"
                                                            // )}
                                                            // value={roleSelected}
                                                            // onChange={(e) =>
                                                            //     handleRoleSelection(
                                                            //         e
                                                            //     )
                                                            // }
                                                        >
                                                            {roles.map(
                                                                (role) => (
                                                                    <MenuItem
                                                                        value={
                                                                            role._id
                                                                        }
                                                                    >
                                                                        {
                                                                            role.name
                                                                        }
                                                                    </MenuItem>
                                                                )
                                                            )}
                                                        </Select>
                                                    </>
                                                )}
                                            />

                                            <p className={`password-error`}>
                                                {errors.subRoleId?.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-btn flex-between add-members-btn">
                                    <button
                                        onClick={handleCancel}
                                        className="secondary-button mr-10"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="primary-button add-button"
                                    >
                                        Add
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
