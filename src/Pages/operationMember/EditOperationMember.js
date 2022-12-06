import {
    Autocomplete,
    FormControlLabel,
    Paper,
    Radio,
    RadioGroup,
    // FormControlLabel,
    // MenuItem,
    // Radio,
    // RadioGroup,
    // Select,
    TextField,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Loader2 from "../../assets/Loader/Loader2.svg";
import { Link, useNavigate, useParams } from "react-router-dom";
// import { Controller } from "react-hook-form";
import { useForm, Controller } from "react-hook-form";
import Input from "../../components/Input";
import Dropdown from "../../components/Dropdown";
import { privateAxios } from "../../api/axios";
// import { useNavigate } from "react-router-dom";
import useCallbackState from "../../utils/useCallBackState";
import Toaster from "../../components/Toaster";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import axios from "axios";
import {
    ADD_OPERATION_MEMBER,
    COUNTRIES,
    FETCH_OPERATION_MEMBER,
    FETCH_REPORTING_MANAGER,
    FETCH_ROLES,
    GET_OPERATION_MEMBER_BY_ID,
    MEMBER,
    UPDATE_OPERATION_MEMBER,
} from "../../api/Url";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
const defaultValues = {
    memberCompany: "",
    companyType: "Internal",
    countryCode: "",
    phoneNumber: "",
    salutation: "",
    title: "",
    department: "",
    email: "",
    operationType: "",
    memberId: {
        _id: "",
        companyName: "",
        companyType: "",
    },
    address: "",
    reportingManager: "",
    isActive: "",
    isCGFStaff: "",
};
const helperTextForAddOperationMember = {
    salutation: {
        required: "Select salutation",
    },
    name: {
        required: "Enter the operation member name",
        maxLength: "Max char limit exceed",
        minLength: "minimum 3 characters required",
        pattern: "Invalid format",
    },
    department: {
        // required: "Enter the role name",
        maxLength: "Max char limit exceed",
        minLength: "minimum 3 characters required",
        pattern: "Invalid format",
    },
    title: {
        // required: "Enter the role name",
        maxLength: "Max char limit exceed",
        minLength: "minimum 3 characters required",
        pattern: "Invalid format",
    },
    email: {
        required: "Enter the email",
        // maxLength: "Max char limit exceed",
        // minLength: "Role must contain atleast 3 characters",
        pattern: "Invalid format",
    },
    countryCode: {
        required: "Enter country code",
        validate: "Select country code",
    },
    phoneNumber: {
        required: "Enter the phone number",
        maxLength: "Max digits limit exceed",
        minLength: "minimum 3 characters required",
        validate: "Enter phone number",
        // pattern: "Invalid format",
    },
    memberCompany: {
        required: "Select member company",
    },
    operationType: {
        required: "Select the operation type",
        // maxLength: "Max char limit exceed",
        // minLength: "Role must contain atleast 3 characters",
        // pattern: "Invalid format",
    },
    memberId: {
        required: "Select the member company",
        validate: "Select the member company",
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
        minLength: "minimum 3 characters required",
        pattern: "Invalid format",
    },
    reportingManager: {
        required: "Select the reporting manager ",
        // maxLength: "Max char limit exceed",
        // minLength: "Role must contain atleast 3 characters",
        // pattern: "Invalid format",
    },
    roleId: {
        required: "Select the role",
    },
    isCGFStaff: {
        required: "Select the CGFSTaff",
    },
};
function EditOperationMember() {
    //custom hook to set title of page
    useDocumentTitle("Edit Operation Member");
    // state to manage loaders
    const [isLoading, setIsLoading] = useState(true);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
        setValue,
        trigger,
        watch,
    } = useForm({
        defaultValues: defaultValues,
    });
    // watch('')
    const navigate = useNavigate();
    const params = useParams();
    const [memberCompanies, setMemberCompanies] = useState([]);
    const [disableReportingManager, setDisableReportingManager] =
        useState(true);
    const [countries, setCountries] = useState([]);
    const [reportingManagers, setReportingManagers] = useState([]);
    const [operationMember, setOperationMember] = useState({});
    const toasterRef = useRef();
    const [toasterDetails, setToasterDetails] = useCallbackState({
        titleMessage: "",
        descriptionMessage: "",
        messageType: "error",
    });
    const [roles, setRoles] = useState([]);
    console.log("operationMember", operationMember);
    console.log("watch country code", watch("countryCode"));
    const fetchReportingManagers = async (id) => {
        try {
            const response = await privateAxios.get(
                FETCH_OPERATION_MEMBER + id
            );
            if (response.status == 200) {
                setReportingManagers(
                    response?.data.map((data) => ({
                        _id: data?._id,
                        name: data?.name,
                    }))
                );
                console.log(
                    "reporting managersssss",
                    response?.data.map((data) => ({
                        _id: data?._id,
                        name: data?.name,
                    }))
                );
            }
        } catch (error) {
            console.log("error from fetching reporting managers", error);
        }
    };
    // fetch all countries and its objects
    const fetchCountries = async (controller) => {
        try {
            const response = await privateAxios.get(COUNTRIES, {
                signal: controller.signal,
            });
            console.log("response from countries", response);
            // isMounted &&
            setCountries(response.data.map((country) => country?.countryCode));
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
    // Fetch all member comapanies
    const fetchMemberComapany = async (controller) => {
        try {
            const response = await privateAxios.get(MEMBER + "/list", {
                signal: controller.signal,
            });
            console.log(
                "member company---",
                response.data.map((data) => {
                    console.log("member company=", data?.companyName);
                })
            );

            if (response.status == 200) {
                // isMounted &&
                setMemberCompanies(
                    response.data.map((data) => ({
                        _id: data?._id,
                        companyName: data?.companyName,
                        companyType: data?.companyType,
                    }))
                );
            }

            console.log("member company---", memberCompanies);
        } catch (error) {
            console.log("error from fetch member company", error);
        }
    };

    // Fetch reporting managers of all member companies
    const fetchRm = async (id, isCGFStaff) => {
        console.log("operation member----", operationMember);
        try {
            const response = await privateAxios.get(
                // FETCH_REPORTING_MANAGER + id
                // + isCGFStaff
                //     ? "/master/external"
                //     : "/master/internal"
                // // operationMember?.memberId?._id +
                isCGFStaff
                    ? FETCH_OPERATION_MEMBER + id + "/master/external"
                    : FETCH_OPERATION_MEMBER + id + "/master/internal"
            );
            console.log("response from rm", response);
            setReportingManagers(
                response.data
                    .filter((data) => data._id !== params.id)
                    .map((data) => ({
                        _id: data?._id,
                        name: data?.name,
                    }))
            );
        } catch (error) {
            console.log("Error from fetching rm reporting manager", error);
        }
    };

    // fetch operation member by id
    console.log("reporting managers", reportingManagers);

    const fetchOperationMember = async (controller, isMounted) => {
        try {
            setIsLoading(true);
            const response = await privateAxios.get(
                GET_OPERATION_MEMBER_BY_ID + params.id,
                {
                    signal: controller.signal,
                }
            );
            setIsLoading(false);
            isMounted &&
                reset({
                    memberId: {
                        _id: response?.data?.memberId?._id,
                        companyName: response?.data?.memberId?.companyName,
                        companyType: response?.data?.memberId?.companyType,
                    },
                    companyType: response?.data?.memberId?.companyType,
                    countryCode: response?.data?.countryCode,
                    phoneNumber: response?.data?.phoneNumber,
                    address: response?.data?.address,
                    title: response?.data?.title ? response.data.title : "",
                    department: response?.data?.department
                        ? response?.data?.department
                        : "",
                    email: response?.data?.email,
                    operationType: response?.data?.operationType
                        ? response?.data?.operationType
                        : "",
                    reportingManager: response?.data?.reportingManager[0]?._id,
                    salutation: response?.data?.salutation,
                    name: response?.data?.name,
                    isActive:
                        response?.data?.isActive === true ? "true" : "false",
                    roleId: response?.data?.roleId,
                    isCGFStaff:
                        response?.data?.isCGFStaff === true ? "true" : "false",
                    // reportingManagerId:
                    //     response?.data?.reportingManager?._id,
                });
            setOperationMember(response.data);
            console.log("response data ----", operationMember);
            let isCGFStaff = response?.data?.isCGFStaff ? true : false;
            fetchRm(response?.data?.memberId?._id, isCGFStaff);
            // fetchReportingManagers(operationMember?.memberId?._id);
        } catch (error) {
            if (error?.code === "ERR_CANCELED") return;
            setIsLoading(false);
            console.log("error from edit operation members", error);
        }
    };

    // fetch & set Roles
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
    const phoneNumberChangeHandler = (e, name, code) => {
        console.log(
            "on number change",
            e.target.value,
            "name: ",
            name,
            "code",
            code
        );
        setValue(name, e.target.value);
        trigger(name);
        trigger(code);
    };
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        countries.length === 0 && fetchCountries(controller);
        memberCompanies.length === 0 && fetchMemberComapany(controller);
        roles.length === 0 && fetchRoles();

        fetchOperationMember(controller, isMounted);

        // fetchReportingManagers(operationMember?.memberId?._id);
        // fetchRm();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);
    console.log("countries----", countries);
    console.log("members companies----", memberCompanies);

    const editOperationMember = async (data, navigateToListPage) => {
        data = {
            ...data,
            phoneNumber: Number(data?.phoneNumber),
            isActive: data?.isActive === "true" ? true : false,
        };
        try {
            const response = await privateAxios.put(
                UPDATE_OPERATION_MEMBER + params.id,
                data
            );
            if (response.status == 200) {
                setToasterDetails(
                    {
                        titleMessage: "Hurray!",
                        descriptionMessage:
                            "Operation member details updated successfully!",
                        messageType: "success",
                    },
                    () => toasterRef.current()
                );

                setTimeout(() => {
                    navigate("/users/operation-members");
                }, 3000);
            }
        } catch (error) {
            console.log(
                "error in submit data  add operation member method",
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
            if (error?.response?.status == 401) {
                navigate("/login");
            }
        }
    };

    const handleOnSubmit = async (data) => {
        console.log("data from onsubmit", data);
        // addOperationMember(data, false);
        editOperationMember(data);
    };
    const handleSaveAndMore = (data) => {
        console.log("data from handleSaveAndMore", data);

        editOperationMember(data);

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
                            <Link to="/users/operation-members">
                                Operation Members
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={`/users/operation-member/view-operation-member/${params.id}`}
                            >
                                View Operation Members
                            </Link>
                        </li>
                        <li>Edit Operation Member</li>
                    </ul>
                </div>
            </div>
            <section>
                <div className="container">
                    <form onSubmit={handleSubmit(handleOnSubmit)}>
                        <div className="form-header flex-between">
                            <h2 className="heading2">Edit Operation Member</h2>
                            <div className="form-header-right-txt">
                                {/* <div
                                    className="tertiary-btn-blk"
                                    onClick={handleSubmit(handleSaveAndMore)}
                                >
                                    <span className="addmore-icon">
                                        <i className="fa fa-plus"></i>
                                    </span>
                                    <span className="addmore-txt">
                                        Save & Add More
                                    </span>
                                </div> */}
                            </div>
                        </div>
                        {isLoading ? (
                            <div className="loader-blk">
                                <img src={Loader2} alt="Loading" />
                            </div>
                        ) : (
                            <div className="card-wrapper">
                                <div className="card-blk flex-between">
                                    <div className="card-form-field">
                                        <div className="form-group">
                                            <div className="salutation-wrap">
                                                <div className="salutation-blk">
                                                    <label htmlFor="salutation">
                                                        Salutation{" "}
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
                                                    <label htmlFor="name">
                                                        Full Name{" "}
                                                        <span className="mandatory">
                                                            *
                                                        </span>
                                                    </label>
                                                    <Input
                                                        name={"name"}
                                                        control={control}
                                                        onBlur={(e) =>
                                                            setValue(
                                                                "name",
                                                                e.target.value?.trim()
                                                            )
                                                        }
                                                        placeholder="Enter full name"
                                                        myHelper={
                                                            helperTextForAddOperationMember
                                                        }
                                                        rules={{
                                                            required: true,
                                                            pattern:
                                                                /^[A-Za-z]+[A-Za-z ]*$/,
                                                            maxLength: 50,
                                                            minLength: 3,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-form-field">
                                        <div className="form-group">
                                            <label htmlFor="email">
                                                Title{" "}
                                            </label>
                                            <Input
                                                name={"title"}
                                                placeholder="Enter title"
                                                control={control}
                                                onBlur={(e) =>
                                                    setValue(
                                                        "title",
                                                        e.target.value?.trim()
                                                    )
                                                }
                                                myHelper={
                                                    helperTextForAddOperationMember
                                                }
                                                rules={{
                                                    maxLength: 50,
                                                    minLength: 3,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="card-form-field">
                                        <div className="form-group">
                                            <label htmlFor="email">
                                                Department{" "}
                                            </label>
                                            <Input
                                                name={"department"}
                                                placeholder="Enter department"
                                                control={control}
                                                onBlur={(e) =>
                                                    setValue(
                                                        "department",
                                                        e.target.value?.trim()
                                                    )
                                                }
                                                myHelper={
                                                    helperTextForAddOperationMember
                                                }
                                                rules={{
                                                    maxLength: 50,
                                                    minLength: 3,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="card-form-field">
                                        <div className="form-group">
                                            <label htmlFor="email">
                                                Email{" "}
                                                <span className="mandatory">
                                                    *
                                                </span>
                                            </label>
                                            <Input
                                                name={"email"}
                                                control={control}
                                                onBlur={(e) =>
                                                    setValue(
                                                        "email",
                                                        e.target.value?.trim()
                                                    )
                                                }
                                                placeholder="NA"
                                                isDisabled
                                                myHelper={
                                                    helperTextForAddOperationMember
                                                }
                                                rules={{ required: true }}
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
                                                            fieldState: {
                                                                error,
                                                            },
                                                        }) => (
                                                            <Autocomplete
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
                                                                        {
                                                                            children
                                                                        }
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
                                                                    countries.length >
                                                                    0
                                                                        ? countries
                                                                        : [
                                                                              "+91",
                                                                          ]
                                                                }
                                                                autoHighlight
                                                                // placeholder="Select country code"
                                                                // getOptionLabel={(
                                                                //     country
                                                                // ) => country}
                                                                renderOption={(
                                                                    props,
                                                                    option
                                                                ) => (
                                                                    <li
                                                                        {...props}
                                                                    >
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
                                                                        // name="countryCode"
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
                                                                                ? helperTextForAddOperationMember
                                                                                      .countryCode[
                                                                                      error
                                                                                          .type
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
                                                    placeholder="1234567890"
                                                    myHelper={
                                                        helperTextForAddOperationMember
                                                    }
                                                    rules={{
                                                        maxLength: 15,
                                                        minLength: 3,
                                                        validate: (value) => {
                                                            if (
                                                                !watch(
                                                                    "phoneNumber"
                                                                ) &&
                                                                watch(
                                                                    "countryCode"
                                                                )
                                                            )
                                                                return "invalid input";
                                                            if (
                                                                value &&
                                                                !Number(value)
                                                            )
                                                                return "Invalid input";
                                                        },
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-form-field">
                                        <div className="form-group">
                                            <label htmlFor="">
                                                Operation Type{" "}
                                                {!operationMember?.isMemberRepresentative && (
                                                    <span className="mandatory">
                                                        *
                                                    </span>
                                                )}
                                            </label>
                                            <Dropdown
                                                control={control}
                                                name="operationType"
                                                placeholder="Select operation type"
                                                myHelper={
                                                    helperTextForAddOperationMember
                                                }
                                                rules={{
                                                    required:
                                                        !operationMember?.isMemberRepresentative,
                                                }}
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
                                            <label htmlFor="">
                                                CGF Staff{" "}
                                                <span className="mandatory">
                                                    *
                                                </span>
                                            </label>
                                            <div className="radio-btn-field">
                                                <Controller
                                                    name="isCGFStaff"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <RadioGroup
                                                            {...field}
                                                            onChange={(e) => {
                                                                field.onChange(
                                                                    e
                                                                );
                                                                e.target
                                                                    .value ===
                                                                "true"
                                                                    ? setValue(
                                                                          "companyType",
                                                                          "Internal"
                                                                      )
                                                                    : setValue(
                                                                          "companyType",
                                                                          "External"
                                                                      );
                                                            }}
                                                            // value={field.name}
                                                            // value={field.isCGFStaff}
                                                            aria-labelledby="demo-radio-buttons-group-label"
                                                            name="radio-buttons-group"
                                                            className="radio-btn"
                                                        >
                                                            <FormControlLabel
                                                                value="true"
                                                                control={
                                                                    <Radio
                                                                        disabled
                                                                    />
                                                                }
                                                                label="Yes"
                                                            />
                                                            <FormControlLabel
                                                                value="false"
                                                                control={
                                                                    <Radio
                                                                        disabled
                                                                    />
                                                                }
                                                                label="No"
                                                            />
                                                        </RadioGroup>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-form-field">
                                        <div className="form-group">
                                            <label htmlFor="">
                                                Member Company{" "}
                                                <span className="mandatory">
                                                    *
                                                </span>
                                            </label>
                                            <div className="country-code-auto-search">
                                                <Controller
                                                    control={control}
                                                    name="memberId"
                                                    rules={{ required: true }}
                                                    render={({
                                                        field,
                                                        fieldState: { error },
                                                    }) => (
                                                        <Autocomplete
                                                            {...field}
                                                            PaperComponent={({
                                                                children,
                                                            }) => (
                                                                <Paper
                                                                    className={
                                                                        memberCompanies?.length >
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
                                                            disableClearable
                                                            disabled
                                                            // value={
                                                            //     memberCompanies?._id
                                                            // }
                                                            onChange={(
                                                                event,
                                                                newValue
                                                            ) => {
                                                                newValue &&
                                                                typeof newValue ===
                                                                    "object"
                                                                    ? setValue(
                                                                          "memberId",
                                                                          {
                                                                              _id: newValue?._id,
                                                                              companyName:
                                                                                  newValue.companyName,
                                                                          }
                                                                      )
                                                                    : setValue(
                                                                          "memberId",
                                                                          newValue
                                                                      );
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
                                                                trigger(
                                                                    "memberId"
                                                                );
                                                                setDisableReportingManager(
                                                                    false
                                                                );
                                                                // call fetch Reporting managers here
                                                                fetchReportingManagers(
                                                                    newValue._id
                                                                );
                                                                setValue(
                                                                    "companyType",
                                                                    newValue.companyType
                                                                );
                                                            }}
                                                            // sx={{ width: 200 }}
                                                            options={
                                                                memberCompanies
                                                            }
                                                            placeholder="Select country code"
                                                            getOptionLabel={(
                                                                company
                                                            ) =>
                                                                company.companyName
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
                                                                    {...params}
                                                                    inputProps={{
                                                                        ...params.inputProps,
                                                                    }}
                                                                    placeholder={
                                                                        "Select member company"
                                                                    }
                                                                    onChange={() =>
                                                                        trigger(
                                                                            "memberId"
                                                                        )
                                                                    }
                                                                    helperText={
                                                                        error
                                                                            ? helperTextForAddOperationMember
                                                                                  .memberId[
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
                                        </div>
                                    </div>
                                    <div className="card-form-field">
                                        <div className="form-group">
                                            <label htmlFor="status">
                                                Company Type
                                            </label>
                                            <Input
                                                isDisabled={true}
                                                name={"companyType"}
                                                placeholder="NA"
                                                control={control}
                                                myHelper={
                                                    helperTextForAddOperationMember
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="card-form-field">
                                        <div className="form-group">
                                            <label htmlFor="">Address</label>
                                            <Controller
                                                name="address"
                                                control={control}
                                                rules={{
                                                    minLength: 3,
                                                    maxLength: 250,
                                                }}
                                                render={({
                                                    field,
                                                    fieldState: { error },
                                                }) => (
                                                    <TextField
                                                        multiline
                                                        {...field}
                                                        onBlur={(e) =>
                                                            setValue(
                                                                "address",
                                                                e.target.value?.trim()
                                                            )
                                                        }
                                                        inputProps={{
                                                            maxLength: 250,
                                                        }}
                                                        className={`input-textarea ${
                                                            error &&
                                                            "input-textarea-error"
                                                        }`}
                                                        id="outlined-basic"
                                                        placeholder="Enter address"
                                                        helperText={
                                                            error
                                                                ? helperTextForAddOperationMember
                                                                      .address[
                                                                      error.type
                                                                  ]
                                                                : " "
                                                        }
                                                        variant="outlined"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="card-form-field">
                                        <div className="form-group">
                                            <label htmlFor="">
                                                Reporting Manager{" "}
                                                {!operationMember?.isMemberRepresentative && (
                                                    <span className="mandatory">
                                                        *
                                                    </span>
                                                )}
                                            </label>
                                            <Dropdown
                                                control={control}
                                                name="reportingManager"
                                                // myHelper={myHelper}
                                                placeholder={
                                                    "Select reporting manager "
                                                }
                                                // isDisabled={disableReportingManager}
                                                myHelper={
                                                    helperTextForAddOperationMember
                                                }
                                                rules={{
                                                    required:
                                                        !operationMember?.isMemberRepresentative,
                                                }}
                                                options={reportingManagers}
                                            />
                                        </div>
                                    </div>
                                    <div className="card-form-field">
                                        <div className="form-group">
                                            <label htmlFor="role">
                                                Role{" "}
                                                <span className="mandatory">
                                                    *
                                                </span>
                                            </label>

                                            <div>
                                                <Dropdown
                                                    name="roleId"
                                                    control={control}
                                                    options={roles}
                                                    rules={{
                                                        required: true,
                                                    }}
                                                    myHelper={
                                                        helperTextForAddOperationMember
                                                    }
                                                    placeholder={"Select role"}
                                                />

                                                <p className={`password-error`}>
                                                    {errors.subRoleId?.message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card-form-field">
                                        <div className="form-group">
                                            <label htmlFor="status">
                                                Status
                                            </label>
                                            <div className="radio-btn-field">
                                                <Controller
                                                    name="isActive"
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
                                                                value="true"
                                                                control={
                                                                    <Radio />
                                                                }
                                                                label="Active"
                                                            />
                                                            <FormControlLabel
                                                                value="false"
                                                                control={
                                                                    <Radio />
                                                                }
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
                                            type={"reset"}
                                            onClick={() =>
                                                navigate(
                                                    "/users/operation-members"
                                                )
                                            }
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
                            </div>
                        )}
                    </form>
                </div>
            </section>
        </div>
    );
}

export default EditOperationMember;
