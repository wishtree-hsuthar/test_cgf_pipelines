import {
    Autocomplete,
    FormControlLabel,
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
import { Link, useNavigate, useParams } from "react-router-dom";
// import { Controller } from "react-hook-form";
import { useForm, Controller } from "react-hook-form";
import Input from "../../components/Input";
import Dropdown from "../../components/Dropdown";
import { privateAxios } from "../../api/axios";
// import { useNavigate } from "react-router-dom";
import useCallbackState from "../../utils/useCallBackState";
import Toaster from "../../components/Toaster";
import axios from "axios";
import {
    ADD_OPERATION_MEMBER,
    COUNTRIES,
    FETCH_OPERATION_MEMBER,
    FETCH_REPORTING_MANAGER,
    GET_OPERATION_MEMBER_BY_ID,
    MEMBER,
    UPDATE_OPERATION_MEMBER,
} from "../../api/Url";
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
    reportingManager: {
        _id: "",
        name: "",
    },
    isActive: "",
};
const helperTextForAddOperationMember = {
    salutation: {
        required: "Select salutation",
    },
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
    memberCompany: {
        required: "Select member company",
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
function EditOperationMember() {
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
            const response = await privateAxios.get(
                COUNTRIES,
                {
                    signal: controller.signal,
                }
            );
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
            const response = await privateAxios.get(
                MEMBER,
                {
                    signal: controller.signal,
                }
            );
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
    const fetchRm = async (id) => {
        console.log("operation member----", operationMember);
        try {
            const response = await privateAxios.get(
                FETCH_REPORTING_MANAGER +
                    id +
                    // operationMember?.memberId?._id +
                    "/rm"
            );
            console.log("response from rm", response);
            setReportingManagers(
                response.data.map((data) => ({
                    _id: data?._id,
                    name: data?.name,
                }))
            );
        } catch (error) {
            console.log("Error from fetching rm reporting manager", error);
        }
    };

    // fetch operation member by id

    const fetchOperationMember = async (controller, isMounted) => {
        try {
            const response = await privateAxios.get(
                GET_OPERATION_MEMBER_BY_ID + params.id,
                {
                    signal: controller.signal,
                }
            );
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
                    title: response?.data?.title ? response.data.title : "N/A",
                    department: response?.data?.department
                        ? response?.data?.department
                        : "N/A",
                    email: response?.data?.email,
                    operationType: response?.data?.operationType
                        ? response?.data?.operationType
                        : "N/A",
                    reportingManager: response?.data?.reportingManager?._id,
                    salutation: response?.data?.salutation,
                    name: response?.data?.name,
                    isActive: response?.data?.isActive,
                    // reportingManagerId:
                    //     response?.data?.reportingManager?._id,
                });
            setOperationMember(response.data);
            console.log("response data ----", operationMember);
            fetchRm(response?.data?.memberId?._id);
            // fetchReportingManagers(operationMember?.memberId?._id);
        } catch (error) {
            console.log("error from edit operation members", error);
        }
    };

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        countries.length === 0 && fetchCountries(controller);
        memberCompanies.length === 0 && fetchMemberComapany(controller);

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
                        descriptionMessage: response.data.message,
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
                                    <span class="addmore-icon">
                                        <i className="fa fa-plus"></i>
                                    </span>
                                    <span className="addmore-txt">
                                        Save & Add More
                                    </span>
                                </div> */}
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
                                                    placeholder="NA"
                                                    myHelper={
                                                        helperTextForAddOperationMember
                                                    }
                                                    rules={{
                                                        required: true,
                                                        pattern:
                                                            /^[A-Za-z]+[A-Za-z ]*$/,
                                                        maxLength: 50,
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
                                            placeholder="NA"
                                            control={control}
                                            rules={{
                                                maxLength: 50,
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="card-form-field">
                                    <div className="form-group">
                                        <label for="email">Department </label>
                                        <Input
                                            name={"department"}
                                            placeholder="NA"
                                            control={control}
                                            myHelper={
                                                helperTextForAddOperationMember
                                            }
                                            rules={{
                                                maxLength: 50,
                                            }}
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
                                                            options={
                                                                countries.length >
                                                                0
                                                                    ? countries
                                                                    : ["+916"]
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
                                                                        "+91111"
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
                                                placeholder="NA"
                                                myHelper={
                                                    helperTextForAddOperationMember
                                                }
                                                rules={{
                                                    required: true,
                                                    maxLength: 15,
                                                    minLength: 3,
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
                                            placeholder="NA"
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
                                                rules={{ required: true }}
                                                render={({
                                                    field,
                                                    fieldState: { error },
                                                }) => (
                                                    <Autocomplete
                                                        {...field}
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
                                                            trigger("memberId");
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
                                        <label for="">
                                            Address
                                            <span className="mandatory">*</span>
                                        </label>
                                        <Input
                                            control={control}
                                            name={"address"}
                                            placeholder="NA"
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
                                            placeholder={
                                                "Select reporting manager "
                                            }
                                            // isDisabled={disableReportingManager}
                                            myHelper={
                                                helperTextForAddOperationMember
                                            }
                                            rules={{ required: true }}
                                            options={reportingManagers}
                                        />
                                    </div>
                                </div>
                                <div className="card-form-field">
                                    <div className="form-group">
                                        <label htmlFor="status">Status</label>
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
                                                            control={<Radio />}
                                                            label="Active"
                                                        />
                                                        <FormControlLabel
                                                            value="false"
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
                                        Update
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

export default EditOperationMember;
