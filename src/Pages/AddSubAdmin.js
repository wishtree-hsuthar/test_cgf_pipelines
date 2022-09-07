import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TextField, Select, MenuItem, Box, Autocomplete } from "@mui/material";
import "react-phone-number-input/style.css";
// import PhoneInput from 'react-phone-number-input'
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PhoneInput from "react-phone-number-input/react-hook-form";

import * as yup from "yup";
import axios from "axios";

const AddSubAdminSchema = yup.object().shape({
    subAdminName: yup.string().required("Sub admin name required"),
    email: yup
        .string()
        .email("Enter valid email address")
        .required("Email address requried"),
    role: yup.string().required("Role required"),
    phoneNumber: yup.string().min(3, "Minimum 3 digits required"),
    countryCode: yup.string(),
});
const AddSubAdmin = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm({
        resolver: yupResolver(AddSubAdminSchema),
        defaultValues: {
            subAdminName: "",
            email: "",
            role: "",
            phoneNumber: "",
            countryCode: "",
        },
    });
    const location = useLocation();
    console.log(location);
    const [value, setValue] = useState({});
    const [roleSelected, setRoleSelected] = useState("");
    const [countries, setCountries] = useState([]);
    // const [value, setValue] = useState('')
    useEffect(() => {
        let isMounted = true;
        let controller = new AbortController();
        let fetchCountries = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/api/countries",
                    {
                        signal: controller.signal,
                    }
                );
                console.log("response", response);
                isMounted && setCountries(response.data);
            } catch (error) {
                console.log("error from countries api", error);
            }
        };
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
    const handleOnSubmit = (data) => {
        console.log("data", data);
        data.countryCode = data.countryCode.slice(
            data.countryCode.indexOf("+")
        );
        console.log("new phone number", data);
        // navigate("/sub-admins");
    };

    const handleSaveAndMore = (data) => {
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
            <div className="breadcrumb-wrapper">
                <div className="container">
                    <ul className="breadcrumb">
                        <li>
                            <Link to="/sub-admins">Sub Admin</Link>
                        </li>
                        <li>Add Sub Admin</li>
                    </ul>
                </div>
            </div>
            <section>
                <div className="container">
                    <form onSubmit={handleSubmit(handleOnSubmit)}>
                        <div className="form-header flex-between">
                            <h2 className="heading2">Add Sub Admin</h2>
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
                                        <label for="subAdminName">
                                            Sub Admin Name{" "}
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
                                        />
                                        <p className={`input-error-msg`}>
                                            {errors.subAdminName?.message}
                                        </p>
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
                                        />
                                        <p className={`input-error-msg`}>
                                            {errors.email?.message}
                                        </p>
                                    </div>
                                </div>
                                <div className="card-form-field">
                                    <div className="form-group">
                                        <label for="emailid">
                                            Phone Number
                                        </label>
                                        <Autocomplete
                                            sx={{ width: 200 }}
                                            options={countries}
                                            autoHighlight
                                            getOptionLabel={(country) =>
                                                country.name +
                                                " " +
                                                country.countryCode
                                            }
                                            renderOption={(props, option) => (
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
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    inputProps={{
                                                        ...params.inputProps,
                                                        autoComplete: "", // disable autocomplete and autofill
                                                    }}
                                                    value={value}
                                                    onChange={(e) =>
                                                        setValue(e.target.value)
                                                    }
                                                    onSelect={(e) =>
                                                        setValue(e.target.value)
                                                    }
                                                    {...register("countryCode")}
                                                />
                                            )}
                                        />

                                        <TextField
                                            className={`input-field ${
                                                errors.email && "input-error"
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
                                <div className="card-form-field">
                                    <div className="form-group">
                                        <label for="role">
                                            Select Role{" "}
                                            <span className="mandatory">*</span>
                                        </label>

                                        <div className="select-field">
                                            <Controller
                                                name="role"
                                                control={control}
                                                render={({
                                                    field,
                                                    fieldState: { error },
                                                }) => (
                                                    <>
                                                        <Select
                                                            className={`input-field ${
                                                                errors.role &&
                                                                "input-error"
                                                            }`}
                                                            {...register(
                                                                "role"
                                                            )}
                                                            value={roleSelected}
                                                            onChange={(e) =>
                                                                handleRoleSelection(
                                                                    e
                                                                )
                                                            }
                                                        >
                                                            <MenuItem
                                                                value={
                                                                    "Manager"
                                                                }
                                                            >
                                                                {"Manager"}
                                                            </MenuItem>
                                                            <MenuItem
                                                                value={
                                                                    "Assistent manager"
                                                                }
                                                            >
                                                                {
                                                                    "Assistent manager"
                                                                }
                                                            </MenuItem>
                                                            <MenuItem
                                                                value={
                                                                    "Supervisor"
                                                                }
                                                            >
                                                                {"Supervisor"}
                                                            </MenuItem>
                                                        </Select>
                                                    </>
                                                )}
                                            />

                                            <p className={`input-error-msg`}>
                                                {errors.role?.message}
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
