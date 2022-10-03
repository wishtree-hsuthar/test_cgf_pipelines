import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
    TextField,
    Select,
    MenuItem,
    Autocomplete,
    Box,
    RadioGroup,
    FormControlLabel,
    Radio,
} from "@mui/material";

import "react-phone-number-input/style.css";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Toaster from "../../components/Toaster";
import useCallbackState from "../../utils/useCallBackState";
import {
    FETCH_ROLES,
    FETCH_SUB_ADMIN_BY_ADMIN,
    UPDATE_SUB_ADMIN,
} from "../../api/Url";
import { privateAxios } from "../../api/axios";
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

const editSubAdminSchema = yup.object().shape({
    subAdminName: yup.string().required("Sub admin name required"),
    email: yup
        .string()
        .email("Enter valid email address")
        .required("Email address requried"),
    role: yup.string().required("Role required"),
    phoneNumber: yup
        .string()
        .min(3, "Minimum 3 digits required")
        .max(15, "Maximum 15 digits required"),
    countryCode: yup.string(),
});

const EditSubAdmin = () => {
    const navigate = useNavigate();
    const params = useParams();
    const toasterRef = useRef();
    const [values, setValues] = useState({
        subAdminName: "madhav",
        email: "madhav@yopmail.com",
        role: "manager",
        phoneNumber: "+917350378900",
    });
    const [value, setValue] = useState({
        name: "India",
        countryCode: "+91",
    });
    const [countries, setCountries] = useState([]);
    const [roles, setRoles] = useState([]);
    const [toasterDetails, setToasterDetails] = useCallbackState({
        titleMessage: "",
        descriptionMessage: "",
        messageType: "error",
    });
    const [fetchSubAdminDetailsForEdit, setFetchSubAdminDetailsForEdit] =
        useState({});
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            subAdminName: "",
            email: "",
            subRoleId: "",
            phoneNumber: "",
            countryCode: {
                name: "India",
                countryCode: "+91",
            },
            status: "",
            role: "",
        },
        resolver: yupResolver(editSubAdminSchema),
    });
    useEffect(() => {
        let isMounted = true;
        let controller = new AbortController();
        let fetchCountries = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/api/master/country/list",
                    {
                        signal: controller.signal,
                    }
                );
                console.log("response", response);
                isMounted && setCountries(response.data);
            } catch (error) {
                console.log(
                    "error from countries api of edit sub-admin",
                    error
                );
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
        fetchCountries();
        const fetchSubAdmin = async () => {
            try {
                const response = await privateAxios.get(
                    FETCH_SUB_ADMIN_BY_ADMIN + params.id,
                    {
                        signal: controller.signal,
                    }
                );
                console.log(
                    "response from sub admin view page fetch api",
                    response
                );
                isMounted && setFetchSubAdminDetailsForEdit(response.data);
                console.log("role from edit", response.data.subRoleId.name);
                reset({
                    subAdminName: response.data.name,
                    email: response.data.email,
                    countryCode: response.data.countryCode,
                    phoneNumber: response.data.phoneNumber,
                    status: response.data.isActive ? "active" : "inactive",
                    role: response?.data?.subRoleId._id,
                });
            } catch (error) {
                console.log("error from sub admin view page fetch api", error);
                setToasterDetails(
                    {
                        titleMessage: "Oops!",
                        descriptionMessage: error?.response?.data?.message,
                        messageType: "error",
                    },
                    () => toasterRef.current()
                );
                navigate("/sub-admins");
            }
        };
        fetchSubAdmin();
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
                }, 2000);
            }
        };
        fetchRoles();
        return () => {
            // isMounted = false;
            // controller.abort();
        };
    }, []);

    console.log("fetchdetails in edit sub admin", fetchSubAdminDetailsForEdit);
    const [defaultPhone, setDefaultPhone] = useState("+91123456789");

    const location = useLocation();
    console.log(location);

    const handleOnSubmit = async (data) => {
        console.log("data from handle submit edit", data);

        try {
            const response = await privateAxios.put(
                UPDATE_SUB_ADMIN + params.id,
                {
                    name: data.subAdminName,
                    subRoleId: data.role,
                    phoneNumber: parseInt(data.phoneNumber),
                    countryCode: data.countryCode,
                    isActive: data.status === "active" ? true : false,
                }
            );
            console.log("response from edit sub admin method", response);
            if (response.status == 200) {
                setToasterDetails(
                    {
                        titleMessage: "Success!",
                        descriptionMessage: response?.data?.message,
                        messageType: "success",
                    },
                    () => toasterRef.current()
                );
                setTimeout(() => {
                    navigate(`/sub-admins/view-sub-admin/${params.id}`);
                }, 2000);
            }
        } catch (error) {
            console.log("error from edit sub admin submit method");
            if (error?.response?.status == 400) {
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

    const handleCancel = () => {
        navigate("/sub-admins/view-sub-admin/" + params.id);
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
                        <li>
                            <Link
                                to={`/sub-admins/view-sub-admin/${params.id}`}
                            >
                                View CGF Admin
                            </Link>
                        </li>
                        <li>Edit CGF Admin</li>
                    </ul>
                </div>
            </div>
            <section>
                <div className="container">
                    <div className="form-header flex-between">
                        <h2 className="heading2">Edit CGF Admin</h2>
                        {/* <div className="form-header-right-txt">
                    <div className="tertiary-btn-blk">
                        <span class="addmore-icon"><i className='fa fa-plus'></i></span>
                        <span className="addmore-txt">Save & Add More</span>
                    </div>
                </div> */}
                    </div>
                    <div className="card-wrapper">
                        <form onSubmit={handleSubmit(handleOnSubmit)}>
                            <div className="card-blk flex-between">
                                <div className="card-form-field">
                                    <div className="form-group">
                                        <label for="subAdminName">
                                            CGF Admin Name{" "}
                                            <span className="mandatory">*</span>
                                        </label>
                                        <TextField
                                            id="outlined-basic"
                                            placeholder="Enter sub admin name"
                                            variant="outlined"
                                            className={`input-field ${
                                                errors.subAdminName &&
                                                "input-error"
                                            }`}
                                            {...register("subAdminName")}
                                            helperText={
                                                errors.subAdminName
                                                    ? errors.subAdminName
                                                          ?.message
                                                    : " "
                                            }
                                        />
                                        {/* <p className={`input-error-msg`}>{errors.subAdminName?.message}</p> */}
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
                                            disabled={true}
                                            helperText={
                                                errors.email
                                                    ? errors.email?.message
                                                    : " "
                                            }
                                        />
                                        {/* <p className={`input-error-msg`}>{errors.email?.message}</p> */}
                                    </div>
                                </div>
                                <div className="card-form-field">
                                    <div className="form-group">
                                        <label htmlFor="phoneNumber">
                                            Phone Number
                                        </label>
                                        <div className="phone-number-field">
                                            <div className="select-field country-code">
                                                <Autocomplete
                                                popupIcon={<KeyboardArrowDownRoundedIcon />}
                                                    options={countries}
                                                    // autoHighlight
                                                    autoComplete={false}
                                                    value={value}
                                                    getOptionLabel={(country) =>
                                                        country["countryCode"]
                                                            ? country[
                                                                  "countryCode"
                                                              ]
                                                            : country
                                                    }
                                                    renderOption={(
                                                        props,
                                                        option
                                                    ) => (
                                                        <Box
                                                            component="li"
                                                            sx={{
                                                                "& > img": {
                                                                    mr: 2,
                                                                    flexShrink: 0,
                                                                },
                                                            }}
                                                            {...props}
                                                        >
                                                            {option.name + " "}
                                                            {option.countryCode}
                                                        </Box>
                                                    )}
                                                    onChange={(e, v) =>
                                                        setValue(v)
                                                    }
                                                    // onSelect={(e, v) => setValue(v)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            inputProps={{
                                                                ...params.inputProps,
                                                                autoComplete:
                                                                    "", // disable autocomplete and autofill
                                                            }}
                                                            // value={value.name}
                                                            // onChange={(e, v) =>
                                                            //     setValue(v)
                                                            // }
                                                            // onSelect={(e) =>
                                                            //     setValue(e.target.value)
                                                            // }
                                                            {...register(
                                                                "countryCode"
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
                                            />

                                            <p className={`input-error-msg`}>
                                                {errors.phoneNumber?.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-form-field">
                                    <div className="form-group">
                                        <label for="role">
                                            Select role{" "}
                                            <span className="mandatory">*</span>
                                        </label>

                                        <div className="select-field">
                                            <Controller
                                                name="role"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                    IconComponent={(props) => <KeyboardArrowDownRoundedIcon {...props}/>}
                                                        {...field}
                                                        // value={
                                                        //     fetchSubAdminDetailsForEdit
                                                        //         .subRoleId.name
                                                        // }
                                                        className={`input-field ${
                                                            errors.role &&
                                                            "input-error"
                                                        }`}
                                                    >
                                                        {roles.map((role) => (
                                                            <MenuItem
                                                                value={role._id}
                                                            >
                                                                {role.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                )}
                                            />

                                            <p className={`input-error-msg`}>
                                                {errors.role?.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-form-field">
                                    <div className="form-group">
                                        <label htmlFor="status">Status</label>
                                        <div className="radio-btn-field">
                                            <Controller
                                                name="status"
                                                control={control}
                                                render={({ field }) => (
                                                    <RadioGroup
                                                        {...field}
                                                        // value={editDefault && editDefault.status}
                                                        aria-labelledby="demo-radio-buttons-group-label"
                                                        name="radio-buttons-group"
                                                        className="radio-btn"
                                                    >
                                                        <FormControlLabel
                                                            value="active"
                                                            control={<Radio />}
                                                            label="Active"
                                                        />
                                                        <FormControlLabel
                                                            value="inactive"
                                                            control={<Radio />}
                                                            label="Inactive"
                                                        />
                                                    </RadioGroup>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-btn flex-between add-members-btn">
                                    <button
                                        onClick={handleCancel}
                                        type={"reset"}
                                        className="secondary-button mr-10"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="primary-button add-button"
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default EditSubAdmin;
