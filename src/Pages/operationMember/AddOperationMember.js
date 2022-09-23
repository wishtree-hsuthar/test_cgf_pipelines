import {
    Autocomplete,
    // FormControlLabel,
    // MenuItem,
    // Radio,
    // RadioGroup,
    // Select,
    TextField,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { Controller } from "react-hook-form";
import { useForm, Controller } from "react-hook-form";
import Input from "../../components/Input";
import Dropdown from "../../components/Dropdown";
import { privateAxios } from "../../api/axios";
// import { useNavigate } from "react-router-dom";
import useCallbackState from "../../utils/useCallBackState";
import Toaster from "../../components/Toaster";
import axios from "axios";
import { ADD_OPERATION_MEMBER, FETCH_OPERATION_MEMBER } from "../../api/Url";
const helperTextForAddOperationMember = {
    name: {
        required: "Enter the full name",
        maxLength: "Max char limit exceed",
        minLength: "Role must contain atleast 3 characters",
        pattern: "Invalid format",
    },
    department: {
        // required: "Enter the role name",
        maxLength: "Max char limit exceed",
        minLength: "Role must contain atleast 3 characters",
        pattern: "Invalid format",
    },
    title: {
        // required: "Enter the role name",
        maxLength: "Max char limit exceed",
        minLength: "Role must contain atleast 3 characters",
        pattern: "Invalid format",
    },
    email: {
        required: "Enter email id",
        // maxLength: "Max char limit exceed",
        // minLength: "Role must contain atleast 3 characters",
        pattern: "Invalid format",
    },
    countryCode: {
        required: "Enter country code",
        // validate: "Enter country code",
    },
    phoneNumber: {
        required: "Enter the phone number",
        maxLength: "Max digits limit exceed",
        minLength: "Number must contain atleast 3 digits",
        // validate: "Enter country code first",
        // pattern: "Invalid format",
    },
    operationType: {
        required: "Enter operation type ",
        // maxLength: "Max char limit exceed",
        // minLength: "Role must contain atleast 3 characters",
        // pattern: "Invalid format",
    },
    memberId: {
        required: "Enter member company",
        // maxLength: "Max char limit exceed",
        // minLength: "Role must contain atleast 3 characters",
        // pattern: "Invalid format",
    },
    companyType: {
        required: "Enter company type",
        // maxLength: "Max char limit exceed",
        // minLength: "Role must contain atleast 3 characters",
        // pattern: "Invalid format",
    },
    address: {
        required: "Enter address",
        maxLength: "Max char limit exceed",
        minLength: "Role must contain atleast 3 characters",
        pattern: "Invalid format",
    },
    reportingManager: {
        required: "Select reporting manager ",
        // maxLength: "Max char limit exceed",
        // minLength: "Role must contain atleast 3 characters",
        // pattern: "Invalid format",
    },
};
function AddOperationMember() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
        setValue,
        trigger,
        watch,
    } = useForm({});

    const navigate = useNavigate();
    const [memberCompanies, setMemberCompanies] = useState();
    const [countries, setCountries] = useState();
    const [reportingManagers, setReportingManagers] = useState();
    const toasterRef = useRef();
    const [toasterDetails, setToasterDetails] = useCallbackState({
        titleMessage: "",
        descriptionMessage: "",
        messageType: "error",
    });
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const fetchMemberComapany = async () => {
            try {
                const response = await privateAxios.get(
                    "http://localhost:3000/api/members",
                    {
                        signal: controller.signal,
                    }
                );
                console.log(
                    "member company---",
                    response.data.map((data) => {
                        console.log("member company=", data.companyName);
                    })
                );

                if ((response.status = 200)) {
                    isMounted &&
                        setMemberCompanies(
                            response.data.map((data) => ({
                                _id: data._id,
                                companyName: data.companyName,
                                companyType: data.companyType,
                            }))
                        );
                }

                console.log("member company---", memberCompanies);
            } catch (error) {
                console.log("error from fetch member company", error);
            }
        };
        let fetchCountries = async () => {
            try {
                const response = await privateAxios.get(
                    "http://localhost:3000/api/master/country/list",
                    {
                        signal: controller.signal,
                    }
                );
                console.log("response", response);
                isMounted &&
                    setCountries(
                        response.data.map((country) => country.countryCode)
                    );
            } catch (error) {
                console.log("error from countries api", error);
                if (error?.response?.status == 401) {
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
            }
        };
        fetchCountries();
        fetchMemberComapany();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);
    const fetchReportingManagers = async (id) => {
        try {
            const response = await privateAxios.get(
                FETCH_OPERATION_MEMBER + id
            );
            if (response.status == 200) {
                setReportingManagers(
                    response.data.map((data) => ({
                        _id: data._id,
                        name: data.name,
                    }))
                );
            }
        } catch (error) {
            console.log("error from fetching reporting managers", error);
        }
    };
    const addOperationMember = async (data, navigateToListPage) => {
        data = { ...data, phoneNumber: Number(data.phoneNumber) };
        try {
            const response = await privateAxios.post(
                ADD_OPERATION_MEMBER,
                data
            );
            if (response.status == 201) {
                setToasterDetails(
                    {
                        titleMessage: "Hurray!",
                        descriptionMessage: response.data.message,
                        messageType: "success",
                    },
                    () => toasterRef.current()
                );
                navigateToListPage === false &&
                    setTimeout(() => {
                        navigate("/operation_members");
                    }, 3000);
            }
        } catch (error) {
            console.log(
                "error in submit data for add operation member method",
                error
            );
            setToasterDetails(
                {
                    titleMessage: "Oops!",
                    descriptionMessage: error?.response?.data.message,
                    messageType: "error",
                },
                () => toasterRef.current()
            );
        }
    };

    const handleOnSubmit = async (data) => {
        console.log("data from onsubmit", data);
        addOperationMember(data, false);
    };
    const handleSaveAndMore = (data) => {
        console.log("data from handleSaveAndMore", data);
        addOperationMember(data, true);
        reset();
    };

    return (
        <div className="page-wrapper">
            <Toaster
                messageType={toasterDetails.messageType}
                descriptionMessage={toasterDetails.descriptionMessage}
                myRef={toasterRef}
                titleMessage={toasterDetails.titleMessage}
            />
            <div className="breadcrumb-wrapper">
                <div className="container">
                    <ul className="breadcrumb">
                        <li>
                            <Link to="/operation_members">
                                Operation Members
                            </Link>
                        </li>
                        <li>Add Operation Member</li>
                    </ul>
                </div>
            </div>
            <section>
                <div className="container">
                    <form onSubmit={handleSubmit(handleOnSubmit)}>
                        <div className="form-header flex-between">
                            <h2 className="heading2">Add Operation Member</h2>
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
                                        <div className="salutation-wrap">
                                            <div className="salutation-blk">
                                                <label htmlFor="salutation">
                                                    Salutation
                                                    <span className="mandatory">
                                                        *
                                                    </span>
                                                </label>

                                                <Dropdown
                                                    control={control}
                                                    name="salutation"
                                                    placeholder="Mr."
                                                    myHelper={
                                                        helperTextForAddOperationMember
                                                    }
                                                    rules={{
                                                        required: true,
                                                    }}
                                                    options={[
                                                        "Mr.",
                                                        "Mrs.",
                                                        "Ms.",
                                                    ]}
                                                />
                                            </div>
                                            <div className="salutation-inputblk">
                                                <label for="name">
                                                    Full Name{" "}
                                                    <span className="mandatory">
                                                        *
                                                    </span>
                                                </label>
                                                <Input
                                                    name={"name"}
                                                    control={control}
                                                    myHelper={
                                                        helperTextForAddOperationMember
                                                    }
                                                    rules={{
                                                        required: true,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-form-field">
                                    <div className="form-group">
                                        <label for="email">Title </label>
                                        <Input
                                            name={"title"}
                                            control={control}
                                        />
                                    </div>
                                </div>
                                <div className="card-form-field">
                                    <div className="form-group">
                                        <label for="email">Department </label>
                                        <Input
                                            name={"department"}
                                            control={control}
                                            myHelper={
                                                helperTextForAddOperationMember
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
                                        <Input
                                            name={"email"}
                                            control={control}
                                            myHelper={
                                                helperTextForAddOperationMember
                                            }
                                            rules={{ required: true }}
                                        />
                                    </div>
                                </div>
                                <div className="card-form-field">
                                    <div className="form-group">
                                        <label htmlfor="phoneNumber">
                                            Phone Number
                                            <span className="mandatory">*</span>
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
                                                                            ? helperTextForAddOperationMember
                                                                                  .countryCode[
                                                                                  "required"
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
                                                control={control}
                                                myHelper={
                                                    helperTextForAddOperationMember
                                                }
                                                rules={{
                                                    required: true,
                                                    maxLength: 15,
                                                    minLength: 3,
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
                                        <label for="">
                                            Operation Type
                                            <span className="mandatory">*</span>
                                        </label>
                                        <Dropdown
                                            control={control}
                                            name="operationType"
                                            myHelper={
                                                helperTextForAddOperationMember
                                            }
                                            rules={{ required: true }}
                                            options={[
                                                "Warehousing and Distribution",
                                                "Manufacturing/Bottling/Roasting",
                                                "Logistics and Transport",
                                                "Retail/Franchise/Merchandisers",
                                            ]}
                                        />
                                    </div>
                                </div>
                                <div className="card-form-field">
                                    <div className="form-group">
                                        <label for="">
                                            Member Company
                                            <span className="mandatory">*</span>
                                        </label>
                                        <div className="country-code-auto-search">
                                            <Controller
                                                control={control}
                                                name="memberId"
                                                render={({
                                                    field,
                                                    fieldState: { error },
                                                }) => (
                                                    <Autocomplete
                                                        {...field}
                                                        value={
                                                            memberCompanies?._id
                                                        }
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
                                                            setValue(
                                                                "reportingManager",
                                                                ""
                                                            );
                                                            // call fetch Reporting managers here
                                                            fetchReportingManagers(
                                                                newValue._id
                                                            );
                                                            setValue(
                                                                "companyType",
                                                                newValue.companyType
                                                            );

                                                            newValue &&
                                                            typeof newValue ===
                                                                "object"
                                                                ? setValue(
                                                                      "memberId",
                                                                      newValue?._id
                                                                  )
                                                                : setValue(
                                                                      "memberId",
                                                                      newValue
                                                                  );
                                                        }}
                                                        // sx={{ width: 200 }}
                                                        options={
                                                            memberCompanies
                                                        }
                                                        autoHighlight
                                                        // placeholder="Select country code"
                                                        getOptionLabel={(
                                                            country
                                                        ) =>
                                                            country.companyName
                                                        }
                                                        renderOption={(
                                                            props,
                                                            option
                                                        ) => (
                                                            <li {...props}>
                                                                {
                                                                    option.companyName
                                                                }
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
                                                                // onChange={() =>
                                                                //     trigger(
                                                                //         "phoneNumber"
                                                                //     )
                                                                // }
                                                                // onSubmit={() => setValue("countryCode", "")}
                                                                placeholder={
                                                                    "Select member company"
                                                                }
                                                                helperText={
                                                                    error
                                                                        ?.helperTextForAddOperationMember?.[
                                                                        "memberId"
                                                                    ][
                                                                        error
                                                                            .type
                                                                    ]
                                                                }
                                                            />
                                                        )}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="card-form-field">
                                    <div className="form-group">
                                        <label htmlFor="status">
                                            Company Type
                                        </label>
                                        <Input
                                            name={"companyType"}
                                            control={control}
                                            myHelper={
                                                helperTextForAddOperationMember
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="card-form-field">
                                    <div className="form-group">
                                        <label for="">
                                            Address
                                            <span className="mandatory">*</span>
                                        </label>
                                        <Input
                                            control={control}
                                            name={"address"}
                                            rules={{ required: true }}
                                            myHelper={
                                                helperTextForAddOperationMember
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="card-form-field">
                                    <div className="form-group">
                                        <label for="">
                                            Reporting Manager
                                            <span className="mandatory">*</span>
                                        </label>
                                        <Dropdown
                                            control={control}
                                            name="reportingManager"
                                            // myHelper={myHelper}
                                            myHelper={
                                                helperTextForAddOperationMember
                                            }
                                            rules={{ required: true }}
                                            options={reportingManagers}
                                        />
                                    </div>
                                </div>

                                <div className="form-btn flex-between add-members-btn">
                                    <button
                                        onClick={() =>
                                            navigate("/operation_members")
                                        }
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
}

export default AddOperationMember;
