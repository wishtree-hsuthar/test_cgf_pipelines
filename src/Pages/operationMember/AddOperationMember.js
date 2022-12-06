import {
    Autocomplete,
    FormControlLabel,
    Paper,
    Radio,
    RadioGroup,
    TextField,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import Input from "../../components/Input";
import Dropdown from "../../components/Dropdown";
import { privateAxios } from "../../api/axios";
import useCallbackState from "../../utils/useCallBackState";
import Toaster from "../../components/Toaster";
import {
    ADD_OPERATION_MEMBER,
    COUNTRIES,
    FETCH_OPERATION_MEMBER,
    FETCH_ROLES,
    MEMBER,
    MEMBER_DROPDOWN,
} from "../../api/Url";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
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
        // validate: "Select the member company",
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
    roleId: {
        required: "Select the role",
    },
    reportingManager: {
        required: "Select the reporting manager ",
        // maxLength: "Max char limit exceed",
        // minLength: "Role must contain atleast 3 characters",
        // pattern: "Invalid format",
    },
};
function AddOperationMember() {
    //custom hook to set title of page
    useDocumentTitle("Add Operation Member");
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
        defaultValues: {
            salutation: "Mr.",
            // memberId: {
            //     _id: "",
            //     companyName: "",
            // },
            // memberId: "",
            // companyType: "",
            isCGFStaff: false,
            roleId: "",
        },
    });

    const navigate = useNavigate();
    const [memberCompanies, setMemberCompanies] = useState([]);
    const [disableReportingManager, setDisableReportingManager] =
        useState(true);
    const [countries, setCountries] = useState([]);
    const [reportingManagers, setReportingManagers] = useState();
    const toasterRef = useRef();
    const [toasterDetails, setToasterDetails] = useCallbackState({
        titleMessage: "",
        descriptionMessage: "",
        messageType: "error",
    });

    // conditionally render textfield or searchable textfield
    const [showTextField, setShowTextField] = useState(false);
    // cgf as member company
    const [cgfMember, setCgfMember] = useState([]);
    const [roles, setRoles] = useState([]);
    // Fetch and set roles
    let fetchRoles = async () => {
        try {
            const response = await privateAxios.get(FETCH_ROLES);
            console.log("Response from fetch roles - ", response);
            setRoles(response.data);
            response.data.filter(
                (data) =>
                    data.name === "Operation Member" &&
                    reset({ roleId: data._id })
            );
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
        const fetchMemberComapany = async () => {
            try {
                const response = await privateAxios.get(MEMBER_DROPDOWN, {
                    signal: controller.signal,
                });
                console.log(
                    "member company---",
                    response.data.map((data) => {
                        console.log("member company=", data?.companyName);
                    })
                );

                setCgfMember(
                    response.data.filter(
                        (data) =>
                            data.companyName === "The Consumer Goods Forum"
                    )
                );

                if ((response.status = 200)) {
                    isMounted &&
                        setMemberCompanies(
                            response?.data
                                .map((data) => ({
                                    _id: data?._id,
                                    companyName: data?.companyName,
                                    companyType: data?.companyType,
                                }))
                                .sort((a, b) =>
                                    a.companyName > b.companyName
                                        ? 1
                                        : b.companyName > a.companyName
                                        ? -1
                                        : 0
                                )
                        );
                }

                console.log("member company---", memberCompanies);
            } catch (error) {
                console.log("error from fetch member company", error);
            }
        };
        let fetchCountries = async () => {
            try {
                const response = await privateAxios.get(COUNTRIES, {
                    signal: controller.signal,
                });
                console.log("response", response);
                if (isMounted) {
                    let tempCountryCode = response.data.map(
                        (country) => country?.countryCode
                    );
                    let conutryCodeSet = new Set(tempCountryCode);
                    setCountries([...conutryCodeSet]);
                }
                // isMounted && setCountries(
                //         response.data.map((country) => country?.countryCode)
                //     );
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
        fetchRoles();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);
    const fetchReportingManagers = async (id, isCGF) => {
        try {
            const response = await privateAxios.get(
                isCGF
                    ? FETCH_OPERATION_MEMBER + cgfMember[0]?._id + "/master/rm"
                    : FETCH_OPERATION_MEMBER + id + "/master/internal"
            );
            if (response.status == 200) {
                setReportingManagers(
                    response.data.map((data) => ({
                        _id: data?._id,
                        name: data?.name,
                    }))
                );
            }
        } catch (error) {
            console.log("error from fetching reporting managers", error);
        }
    };
    const addOperationMember = async (data, navigateToListPage) => {
        data = {
            ...data,
            phoneNumber: data?.phoneNumber ? parseInt(data.phoneNumber) : "",
            isCGFStaff: data.isCGFStaff === "true" ? true : false,
            memberId:
                data.isCGFStaff === "true" ? cgfMember[0]._id : data.memberId,
        };
        try {
            const response = await privateAxios.post(
                ADD_OPERATION_MEMBER,
                data
            );
            if (response.status == 201) {
                reset();

                setToasterDetails(
                    {
                        titleMessage: "Hurray!",
                        descriptionMessage: response?.data?.message,
                        messageType: "success",
                    },
                    () => toasterRef.current()
                );
                navigateToListPage === false &&
                    setTimeout(() => {
                        navigate("/users/operation-members");
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
                    descriptionMessage: error?.response?.data?.message,
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

    const handleCGFStaffChange = (e) => {
        let cgfCompany = memberCompanies?.filter(
            (company) => company.companyName === "The Consumer Goods Forum"
        );
        console.log(e);
        console.log(cgfCompany[0]._id);
        if (e.target.value === "true") {
            setValue("companyType", "Internal");
            setValue("memberId", cgfCompany[0].companyName);
            setShowTextField(true);
            setDisableReportingManager(false);
            fetchReportingManagers("", true);
            setValue("reportingManager", "");
        } else {
            setValue("companyType", "External");
            setValue("memberId", "");
            // trigger("memberId");
            setShowTextField(false);
            setReportingManagers();
            setValue("reportingManager", "");

            setDisableReportingManager(true);
        }
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
                                                    // placeholder="Mr."
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
                                                    onBlur={(e) =>
                                                        setValue(
                                                            "name",
                                                            e.target.value?.trim()
                                                        )
                                                    }
                                                    control={control}
                                                    placeholder={
                                                        "Enter full name"
                                                    }
                                                    myHelper={
                                                        helperTextForAddOperationMember
                                                    }
                                                    rules={{
                                                        required: true,
                                                        maxLength: 50,
                                                        minLength: 3,
                                                        pattern:
                                                            /^[A-Za-z]+[A-Za-z ]*$/,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-form-field">
                                    <div className="form-group">
                                        <label htmlFor="title">Title </label>
                                        <Input
                                            name={"title"}
                                            onBlur={(e) =>
                                                setValue(
                                                    "title",
                                                    e.target.value?.trim()
                                                )
                                            }
                                            myHelper={
                                                helperTextForAddOperationMember
                                            }
                                            control={control}
                                            placeholder={"Enter title"}
                                            rules={{
                                                maxLength: 50,
                                                minLength: 3,
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="card-form-field">
                                    <div className="form-group">
                                        <label htmlFor="department">
                                            Department{" "}
                                        </label>
                                        <Input
                                            name={"department"}
                                            onBlur={(e) =>
                                                setValue(
                                                    "department",
                                                    e.target.value?.trim()
                                                )
                                            }
                                            control={control}
                                            myHelper={
                                                helperTextForAddOperationMember
                                            }
                                            placeholder={"Enter department"}
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
                                            myHelper={
                                                helperTextForAddOperationMember
                                            }
                                            placeholder={"example@domain.com"}
                                            rules={{
                                                required: "true",
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
                                                                            ? helperTextForAddOperationMember
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
                                                myHelper={
                                                    helperTextForAddOperationMember
                                                }
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
                                        <label htmlFor="">
                                            Operation Type{" "}
                                            <span className="mandatory">*</span>
                                        </label>
                                        <Dropdown
                                            control={control}
                                            name="operationType"
                                            myHelper={
                                                helperTextForAddOperationMember
                                            }
                                            placeholder={
                                                "Select operation type"
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
                                        <label htmlFor="">
                                            CGF Staff{" "}
                                            <span className="mandatory">*</span>
                                        </label>
                                        <div className="radio-btn-field">
                                            <Controller
                                                name="isCGFStaff"
                                                control={control}
                                                render={({ field }) => (
                                                    <RadioGroup
                                                        {...field}
                                                        // value={editDefault && editDefault.status}
                                                        aria-labelledby="demo-radio-buttons-group-label"
                                                        name="radio-buttons-group"
                                                        className="radio-btn"
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            handleCGFStaffChange(
                                                                e
                                                            );
                                                        }}
                                                    >
                                                        <FormControlLabel
                                                            value="true"
                                                            control={<Radio />}
                                                            label="Yes"
                                                        />
                                                        <FormControlLabel
                                                            value="false"
                                                            control={<Radio />}
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
                                            <span className="mandatory">*</span>
                                        </label>
                                        {showTextField ? (
                                            <Input
                                                control={control}
                                                name="memberId"
                                                isDisabled
                                                rules={{ required: true }}
                                            />
                                        ) : (
                                            <div className="select-field auto-search-blk">
                                                <Controller
                                                    control={control}
                                                    name="memberId"
                                                    rules={{ required: true }}
                                                    render={({
                                                        field,
                                                        fieldState: { error },
                                                    }) => (
                                                        <Autocomplete
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
                                                            className={`${
                                                                error &&
                                                                "autocomplete-error"
                                                            }`}
                                                            popupIcon={
                                                                <KeyboardArrowDownRoundedIcon />
                                                            }
                                                            {...field}
                                                            value={
                                                                memberCompanies?._id
                                                            }
                                                            // clearIcon={false}
                                                            disableClearable
                                                            onChange={(
                                                                event,
                                                                newValue
                                                            ) => {
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
                                                                    newValue._id,
                                                                    false
                                                                );
                                                                setValue(
                                                                    "companyType",
                                                                    newValue.companyType
                                                                );
                                                            }}
                                                            // sx={{ width: 200 }}
                                                            options={
                                                                memberCompanies
                                                                    ? memberCompanies
                                                                    : []
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
                                        )}
                                    </div>
                                </div>
                                <div className="card-form-field">
                                    <div className="form-group">
                                        <label htmlFor="status">
                                            Company Type
                                        </label>
                                        <Input
                                            isDisabled={true}
                                            control={control}
                                            name={"companyType"}
                                            onBlur={(e) =>
                                                setValue(
                                                    "companyType",
                                                    e.target.value?.trim()
                                                )
                                            }
                                            myHelper={
                                                helperTextForAddOperationMember
                                            }
                                            placeholder={"Enter company type"}
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
                                            <span className="mandatory">*</span>
                                        </label>
                                        <Dropdown
                                            control={control}
                                            name="reportingManager"
                                            // myHelper={myHelper}
                                            placeholder={
                                                "Select reporting manager "
                                            }
                                            isDisabled={disableReportingManager}
                                            myHelper={
                                                helperTextForAddOperationMember
                                            }
                                            rules={{ required: true }}
                                            options={
                                                reportingManagers
                                                    ? reportingManagers
                                                    : []
                                            }
                                        />
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

                                <div className="form-btn flex-between add-members-btn">
                                    <button
                                        type={"reset"}
                                        onClick={() =>
                                            navigate("/users/operation-members")
                                        }
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
}

export default AddOperationMember;
