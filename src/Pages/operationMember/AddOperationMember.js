import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import {
  Autocomplete as AddOperationMemberAutocomplete,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import {
  Controller as AddOperationMemberController,
  useForm,
} from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { privateAxios } from "../../api/axios";
import {
  ADD_OPERATION_MEMBER,
  COUNTRIES,
  FETCH_OPERATION_MEMBER,
  FETCH_ROLES,
  MEMBER_DROPDOWN,
} from "../../api/Url";
import Dropdown from "../../components/Dropdown";
import Input from "../../components/Input";
import Toaster from "../../components/Toaster";
import {
  getOperationTypes,
  helperText,
} from "../../utils/OperationMemberModuleUtil";
import useCallbackState from "../../utils/useCallBackState";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import Loader from "../../utils/Loader";

import { Logger } from "../../Logger/Logger";
import { catchError } from "../../utils/CatchError";
let OPERATION_TYPES = [];
function AddOperationMember() {
  //custom hook to set title of page
  useDocumentTitle("Add Operation Member");
  const defaultValues = {
    salutation: "Mr.",
    memberId: "",

    // memberId: "",
    // companyType: "",
    countryCode: "",
    address: "",
    isCGFStaff: false,
    roleId: "",
  };
  const {
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

  const navigate = useNavigate();
  const [memberComapniesLabelsOnly, setMemberComapniesLabelsOnly] = useState(
    []
  );
  const [memberCompanies, setMemberCompanies] = useState([
    {
      companyName: "",
      _id: "",
      companyType: "",
    },
  ]);
  const [disableAddOperationMemberButton, setDisableAddOperationMemberButton] =
    useState(false);
  const [disableReportingManager, setDisableReportingManager] = useState(true);
  const [countries, setCountries] = useState([]);
  const [isAddOperationMemberLoading, setIsAddOperationMemberLoading] =
    useState(false);
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
      Logger.debug("Response from fetch roles - ", response);
      setRoles(response.data);
      response.data.filter(
        (data) =>
          data.name === "Operation Member" && reset({ roleId: data._id })
      );
    } catch (error) {
      Logger.debug("Error from fetch roles", error);
    }
  };

  const phoneNumberChangeHandler = (e, name, code) => {
    Logger.debug(
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
  const callGetOperationType = async () => {
    OPERATION_TYPES = await getOperationTypes();
  };
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    OPERATION_TYPES?.length === 0 && callGetOperationType();
    const fetchMemberComapany = async () => {
      try {
        const response = await privateAxios.get(MEMBER_DROPDOWN, {
          signal: controller.signal,
        });
        Logger.debug(
          "member company---",
          response.data.map((data) => {
            Logger.debug("member company=", data?.companyName);
          })
        );

        setCgfMember(
          response.data.filter(
            (data) => data.companyName === "The Consumer Goods Forum"
          )
        );

        if ((response.status = 200)) {
          isMounted &&
            setMemberCompanies(
              response?.data
                .map((data) => ({
                  companyName: data?.companyName,
                  _id: data?._id,
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
          setMemberComapniesLabelsOnly(
            response?.data.map((data) => data.companyName)
          );
        }

        Logger.debug("member company---", memberCompanies);
        Logger.debug(
          "member company labels only = ",
          memberComapniesLabelsOnly
        );
      } catch (error) {
        Logger.debug("error from fetch member company", error);
        catchError(error, setToasterDetails, toasterRef, navigate);
        // if (error?.response?.status == 401) {
        //     isMounted &&
        //         setToasterDetails(
        //             {
        //                 titleMessage: "Oops!",
        //                 descriptionMessage:
        //                     "Session Timeout: Please login again",
        //                 messageType: "error",
        //             },
        //             () => toasterRef.current()
        //         );
        //     setTimeout(() => {
        //         navigate("/login");
        //     }, 3000);
        // } else if (error?.response?.status === 403) {
        //     isMounted &&
        //         setToasterDetails(
        //             {
        //                 titleMessage: "Oops!",
        //                 descriptionMessage: error?.response?.data
        //                     ?.message
        //                     ? error?.response?.data?.message
        //                     : "Oops! Something went wrong. Please try again later.",
        //                 messageType: "error",
        //             },
        //             () => toasterRef.current()
        //         );
        //     setTimeout(() => {
        //         navigate("/home");
        //     }, 3000);
        // } else {
        //     isMounted &&
        //         setToasterDetails(
        //             {
        //                 titleMessage: "Oops!",
        //                 descriptionMessage:
        //                     error?.response?.data?.message,
        //                 messageType: "error",
        //             },
        //             () => toasterRef.current()
        //         );
        // }
      }
    };
    let fetchCountries = async () => {
      try {
        const response = await privateAxios.get(COUNTRIES, {
          signal: controller.signal,
        });
        Logger.debug("response", response);
        if (isMounted) {
          let tempCountryCode = response.data.map(
            (country) => country?.countryCode
          );
          let conutryCodeSet = new Set(tempCountryCode);
          setCountries([...conutryCodeSet]);
        }
      } catch (error) {
        Logger.debug("error from countries api", error);
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
      Logger.debug("error from fetching reporting managers", error);
      catchError(error, setToasterDetails, toasterRef, navigate);
      // if (error?.response?.status == 401) {
      //     setToasterDetails(
      //         {
      //             titleMessage: "Oops!",
      //             descriptionMessage:
      //                 "Session Timeout: Please login again",
      //             messageType: "error",
      //         },
      //         () => toasterRef.current()
      //     );
      //     setTimeout(() => {
      //         navigate("/login");
      //     }, 3000);
      // } else if (error?.response?.status === 403) {
      //     setToasterDetails(
      //         {
      //             titleMessage: "Oops!",
      //             descriptionMessage: error?.response?.data?.message
      //                 ? error?.response?.data?.message
      //                 : "Oops! Something went wrong. Please try again later.",
      //             messageType: "error",
      //         },
      //         () => toasterRef.current()
      //     );
      //     setTimeout(() => {
      //         navigate("/home");
      //     }, 3000);
      // } else {
      //     setToasterDetails(
      //         {
      //             titleMessage: "Oops!",
      //             descriptionMessage: error?.response?.data?.message
      //                 ? error?.response?.data?.message
      //                 : "Oops! Something went wrong. Please try again later.",
      //             messageType: "error",
      //         },
      //         () => toasterRef.current()
      //     );
      // }
    }
  };
  const addOperationMember = async (data, navigateToListPage) => {
    let selectedMemberCompany = memberCompanies.filter(
      (company) => company.companyName === data.memberId
    );
    Logger.debug("Selected member company = ", selectedMemberCompany);
    setDisableAddOperationMemberButton(true);
    data = {
      ...data,
      isCGFStaff: data.isCGFStaff === "true" ? true : false,
      memberId:
        data.isCGFStaff === "true"
          ? cgfMember[0]._id
          : selectedMemberCompany[0]._id,
    };
    Logger.debug("Data while adding operation member - ", data);
    setIsAddOperationMemberLoading(true);
    try {
      const response = await privateAxios.post(ADD_OPERATION_MEMBER, data);
      if (response.status == 201) {
        setIsAddOperationMemberLoading(false);
        let defaultRoleId = roles.filter(
          (role) => role.name == "Operation Member"
        );
        reset({
          ...defaultValues,
          roleId:
            defaultRoleId.length > 0 && defaultRoleId[0]._id
              ? defaultRoleId[0]._id
              : "",
        });
        setDisableAddOperationMemberButton(false);
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
      Logger.debug(
        "error in submit data for add operation member method",
        error
      );
      console.log("error from handle submit", error);
      setDisableAddOperationMemberButton(false);
      setIsAddOperationMemberLoading(false);
      catchError(error, setToasterDetails, toasterRef, navigate);
      // if (error?.response?.status == 401) {
      //     setToasterDetails(
      //         {
      //             titleMessage: "Oops!",
      //             descriptionMessage:
      //                 "Session Timeout: Please login again",
      //             messageType: "error",
      //         },
      //         () => toasterRef.current()
      //     );
      //     setTimeout(() => {
      //         navigate("/login");
      //     }, 3000);
      // } else if (error?.response?.status === 403) {
      //     setToasterDetails(
      //         {
      //             titleMessage: "Oops!",
      //             descriptionMessage: error?.response?.data?.message
      //                 ? error?.response?.data?.message
      //                 : "Oops! Something went wrong. Please try again later.",
      //             messageType: "error",
      //         },
      //         () => toasterRef.current()
      //     );
      //     setTimeout(() => {
      //         navigate("/home");
      //     }, 3000);
      // } else {
      //     setToasterDetails(
      //         {
      //             titleMessage: "Oops!",
      //             descriptionMessage: error?.response?.data?.message,
      //             messageType: "error",
      //         },
      //         () => toasterRef.current()
      //     );
      // }
    }
  };

  const handleOnSubmit = async (data) => {
    Logger.debug("data from onsubmit", data);
    addOperationMember(data, false);
  };
  const handleSaveAndMore = async (data) => {
    Logger.debug("data from handleSaveAndMore", data);
    await addOperationMember(data, true);
    setShowTextField(false);
    let role = roles.filter((role) => role.name === "Operation Member");
    reset({
      ...defaultValues,
      roleId: role.length > 0 && role[0]._id ? role[0]._id : "",
    });
  };

  const handleCGFStaffChange = (e) => {
    let cgfCompany = memberCompanies?.filter(
      (company) => company.companyName === "The Consumer Goods Forum"
    );
    Logger.debug(e);
    Logger.debug(cgfCompany[0]._id);
    if (e.target.value === "true") {
      setValue("companyType", "Partner");
      setValue("memberId", cgfCompany[0].companyName);
      setShowTextField(true);
      setDisableReportingManager(false);
      fetchReportingManagers("", true);
      setValue("reportingManager", "");
    } else {
      setValue("companyType", "N/A");
      setValue("memberId", undefined);
      setShowTextField(false);
      setReportingManagers();
      setValue("reportingManager", "");

      setDisableReportingManager(true);
    }
    trigger("memberId");
  };
  Logger.debug("member Id", memberCompanies?._id);
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
              <Link to="/users/operation-members">Operation Members</Link>
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
                  <span className="addmore-txt">Save & Add More</span>
                </div>
              </div>
            </div>
            {isAddOperationMemberLoading ? (
              <Loader />
            ) : (
              <div className="card-wrapper">
                <div className="card-blk flex-between">
                  <div className="card-form-field">
                    <div className="form-group">
                      <div className="salutation-wrap">
                        <div className="salutation-blk">
                          <label htmlFor="salutation">
                            Salutation <span className="mandatory">*</span>
                          </label>

                          <Dropdown
                            control={control}
                            name="salutation"
                            // placeholder="Mr."
                            myHelper={helperText}
                            rules={{
                              required: true,
                            }}
                            options={["Mr.", "Mrs.", "Ms."]}
                          />
                        </div>
                        <div className="salutation-inputblk">
                          <label htmlFor="name">
                            Full Name <span className="mandatory">*</span>
                          </label>
                          <Input
                            name={"name"}
                            onBlur={(e) =>
                              setValue("name", e.target.value?.trim())
                            }
                            control={control}
                            placeholder={"Enter full name"}
                            myHelper={helperText}
                            rules={{
                              required: true,
                              maxLength: 50,
                              minLength: 3,
                              pattern: /^[a-zA-Z][a-zA-Z ]*$/,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="title">Job Title </label>
                      <Input
                        name={"title"}
                        onBlur={(e) =>
                          setValue("title", e.target.value?.trim())
                        }
                        myHelper={helperText}
                        control={control}
                        placeholder={"Enter job title"}
                        rules={{
                          maxLength: 50,
                          minLength: 3,
                        }}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="department">Department </label>
                      <Input
                        name={"department"}
                        onBlur={(e) =>
                          setValue("department", e.target.value?.trim())
                        }
                        control={control}
                        myHelper={helperText}
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
                        Email <span className="mandatory">*</span>
                      </label>
                      <Input
                        name={"email"}
                        onBlur={(e) =>
                          setValue("email", e.target.value?.trim())
                        }
                        control={control}
                        myHelper={helperText}
                        placeholder={"example@domain.com"}
                        rules={{
                          required: "true",
                          maxLength: 50,
                          minLength: 3,
                          pattern:
                            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        }}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="phoneNumber">Phone Number</label>
                      <div className="phone-number-field">
                        <div className="select-field country-code">
                          <AddOperationMemberController
                            control={control}
                            name="countryCode"
                            rules={{
                              validate: () => {
                                if (
                                  !watch("countryCode") &&
                                  watch("phoneNumber")
                                )
                                  return "Invalid input";
                              },
                            }}
                            render={({ field, fieldState: { error } }) => (
                              <AddOperationMemberAutocomplete
                                {...field}
                                className={`${error && "autocomplete-error"}`}
                                PaperComponent={({ children }) => (
                                  <Paper
                                    className={
                                      countries?.length > 5
                                        ? "autocomplete-option-txt autocomplete-option-limit"
                                        : "autocomplete-option-txt"
                                    }
                                  >
                                    {children}
                                  </Paper>
                                )}
                                popupIcon={<KeyboardArrowDownRoundedIcon />}
                                onChange={(event, newValue) => {
                                  Logger.debug(
                                    "inside autocomplete onchange of addoperation member"
                                  );
                                  Logger.debug(
                                    "new Value operation member",
                                    newValue
                                  );
                                  newValue && typeof newValue === "object"
                                    ? setValue("countryCode", newValue.name)
                                    : setValue("countryCode", newValue);
                                  trigger("countryCode");
                                  trigger("phoneNumber");
                                }}
                                autoHighlight
                                options={countries ? countries : []}
                                // placeholder="Select country code"

                                renderOption={(props, option) => (
                                  <li {...props}>{option}</li>
                                )}
                                getOptionLabel={(country) => country}
                                renderInput={(params) => (
                                  <TextField
                                    placeholder={"+91"}
                                    {...params}
                                    inputProps={{
                                      ...params.inputProps,
                                    }}
                                    onChange={() => trigger("countryCode")}
                                    helperText={
                                      error
                                        ? helperText.countryCode[error?.type]
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
                            setValue("phoneNumber", e.target.value?.trim())
                          }
                          control={control}
                          myHelper={helperText}
                          placeholder={"1234567890"}
                          rules={{
                            maxLength: 15,
                            minLength: 7,
                            validate: (value) => {
                              if (!watch("phoneNumber") && watch("countryCode"))
                                return "invalid input";
                              if (value && !Number(value))
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
                        Operation Type <span className="mandatory">*</span>
                      </label>
                      <Dropdown
                        control={control}
                        name="operationType"
                        myHelper={helperText}
                        placeholder={"Select operation type"}
                        rules={{ required: true }}
                        options={OPERATION_TYPES}
                      />
                    </div>
                  </div>

                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="">
                        CGF Staff <span className="mandatory">*</span>
                      </label>
                      <div className="radio-btn-field">
                        <AddOperationMemberController
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
                                handleCGFStaffChange(e);
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
                        Member Company <span className="mandatory">*</span>
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
                          <AddOperationMemberController
                            control={control}
                            name="memberId"
                            rules={{
                              required: true,
                            }}
                            render={({ field, fieldState: { error } }) => (
                              <AddOperationMemberAutocomplete
                                {...field}
                                className={`${error && "autocomplete-error"}`}
                                PaperComponent={({ children }) => (
                                  <Paper
                                    className={
                                      memberCompanies?.length > 5
                                        ? "autocomplete-option-txt autocomplete-option-limit"
                                        : "autocomplete-option-txt"
                                    }
                                  >
                                    {children}
                                  </Paper>
                                )}
                                popupIcon={<KeyboardArrowDownRoundedIcon />}
                                // value={
                                //     memberCompanies._id
                                // }
                                // clearIcon={false}

                                disableClearable
                                onChange={(event, newValue) => {
                                  let selectedMemberCompany =
                                    memberCompanies.filter(
                                      (company) =>
                                        company.companyName === newValue
                                    );
                                  Logger.debug(
                                    "Selected member company = ",
                                    selectedMemberCompany
                                  );
                                  newValue &&
                                    setValue(
                                      "memberId",
                                      // selectedMemberCompany[0]
                                      //     ._id
                                      newValue
                                    );
                                  Logger.debug("inside autocomplete onchange");
                                  Logger.debug("new Value ", newValue);
                                  setValue("reportingManager", "");
                                  trigger("memberId");
                                  setDisableReportingManager(false);
                                  // call fetch Reporting managers here
                                  fetchReportingManagers(
                                    selectedMemberCompany[0]._id,
                                    false
                                  );
                                  setValue(
                                    "companyType",
                                    selectedMemberCompany[0].companyType
                                  );
                                }}
                                // sx={{ width: 200 }}
                                options={
                                  memberComapniesLabelsOnly
                                    ? memberComapniesLabelsOnly.filter(
                                        (data) =>
                                          data !== "The Consumer Goods Forum"
                                      )
                                    : []
                                }
                                placeholder="Select country code"
                                getOptionLabel={(company) => company}
                                renderOption={(props, option) => (
                                  <li {...props}>{option}</li>
                                )}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    inputProps={{
                                      ...params.inputProps,
                                    }}
                                    placeholder={"Select member company"}
                                    // onChange={() =>
                                    //     trigger(
                                    //         "memberId"
                                    //     )
                                    // }
                                    helperText={
                                      error
                                        ? helperText.memberId[error?.type]
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
                      <label htmlFor="status">Company Type</label>
                      <Input
                        isDisabled={true}
                        control={control}
                        name={"companyType"}
                        onBlur={(e) =>
                          setValue("companyType", e.target.value?.trim())
                        }
                        myHelper={helperText}
                        placeholder={"Enter company type"}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="">Address</label>
                      <AddOperationMemberController
                        name="address"
                        control={control}
                        rules={{
                          minLength: 3,
                          maxLength: 250,
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            multiline
                            {...field}
                            onBlur={(e) =>
                              setValue("address", e.target.value?.trim())
                            }
                            inputProps={{
                              maxLength: 250,
                            }}
                            className={`input-textarea ${
                              error && "input-textarea-error"
                            }`}
                            id="outlined-basic"
                            placeholder="Enter address"
                            helperText={
                              error ? helperText.address[error.type] : " "
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
                        Reporting Manager <span className="mandatory">*</span>
                      </label>
                      <Dropdown
                        control={control}
                        name="reportingManager"
                        // myHelper={myHelper}
                        placeholder={"Select reporting manager "}
                        isDisabled={disableReportingManager}
                        myHelper={helperText}
                        rules={{ required: true }}
                        options={reportingManagers ? reportingManagers : []}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="role">
                        Role <span className="mandatory">*</span>
                      </label>

                      <div>
                        <Dropdown
                          name="roleId"
                          control={control}
                          options={roles}
                          rules={{
                            required: true,
                          }}
                          myHelper={helperText}
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
                      onClick={() => navigate("/users/operation-members")}
                      className="secondary-button mr-10"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="primary-button add-button"
                      disabled={disableAddOperationMemberButton}
                    >
                      Save
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

export default AddOperationMember;
