import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TextField, Autocomplete, Paper } from "@mui/material";
// import "react-phone-number-input/style.css";
import { useForm, Controller as AddSubAdminController } from "react-hook-form";
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
import Loader from "../../utils/Loader";
import { Logger } from "../../Logger/Logger";
import { catchError } from "../../utils/CatchError";
const helperTextForCGFAdmin = {
  countryCode: {
    validate: "Select the country code",
  },
  phoneNumber: {
    maxLength: "Max digits limit exceed",
    minLength: "Enter valid number",
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
  const [disableSubmit, setDisableSubmit] = useState(false);

  const authUser = useSelector((state) => state.user.userObj);
  const navigate = useNavigate();
  const {
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
  Logger.debug(location);
  const [roleSelected, setRoleSelected] = useState("");
  const [countriesAddCGFAdmin, setCountriesAddCGFAdmin] = useState([]);
  const [rolesAddCGFAdmin, setRolesAddCGFAdmin] = useState([]);
  const [isCgfAdminLoading, setIsCgfAdminLoading] = useState(false);
  const toasterRef = useRef();
  const [toasterDetails, setToasterDetails] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "error",
  });

  const phoneNumberChangeHandlerAddCGFAdmin = (e, name, code) => {
    Logger.debug("inside on Change");
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
        Logger.debug("Response from fetch rolesAddCGFAdmin - ", response);
        setRolesAddCGFAdmin(response.data);
        response.data.filter(
          (data) => data.name === "CGF Admin" && reset({ subRoleId: data._id })
        );
      } catch (error) {
        if (error?.code === "ERR_CANCELED") return;
        Logger.debug("Error from fetch rolesAddCGFAdmin", error);
        catchError(error, setToasterDetails, toasterRef, navigate);
        // if (error?.response?.status === 401) {
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
        //     setTimeout(() => {
        //         navigate("/login");
        //     }, 3000);
        // }
      }
    };
    let addCGFAdminFetchCountries = async () => {
      try {
        const response = await axios.get(COUNTRIES, {
          signal: controller.signal,
        });
        Logger.debug("response from countries API-", response);
        if (isMounted) {
          let tempCountryCode = response?.data.map(
            (country) => country.countryCode
          );
          let tempCountryCodeSet = new Set(tempCountryCode);
          setCountriesAddCGFAdmin([...tempCountryCodeSet]);
        }
      } catch (error) {
        if (error?.code === "ERR_CANCELED") return;
        Logger.debug("error from countries api", error);

        // isMounted &&
        //     setToasterDetails(
        //         {
        //             titleMessage: "Oops!",
        //             descriptionMessage: error?.response?.data?.message,
        //             messageType: "error",
        //         },
        //         () => toasterRef.current()
        //     );
        // navigate("/login");
        // }
      }
    };
    fetchRoles();
    addCGFAdminFetchCountries();
  }, []);
  Logger.debug("countriess----", countriesAddCGFAdmin);

  const handleRoleSelection = (e) => {
    setRoleSelected(e.target.value);
  };

  const addSubAdminData = async (data) => {
    setIsCgfAdminLoading(true);
    setDisableSubmit(true);
    try {
      const response = await axios.post(ADD_SUB_ADMIN, data);
      if (response.status == 201) {
        setIsCgfAdminLoading(false);

        setToasterDetails(
          {
            titleMessage: "Hurray!",
            descriptionMessage: response.data.message,
            messageType: "success",
          },
          () => toasterRef.current()
        );
        setDisableSubmit(false);
        reset();
      }
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      Logger.debug("error from add sub admin page", error);
      setIsCgfAdminLoading(false);
      setDisableSubmit(false);
      catchError(error, setToasterDetails, toasterRef, navigate);
      // if (error?.response?.status === 401) {
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
  const handleOnsubmitAddCGFAdmin = async (data) => {
    // data.countryCode = data.countryCode.slice(
    //     data.countryCode.indexOf("+")
    // );

    Logger.debug("new phone number", data);
    addSubAdminData(data);
    setTimeout(() => {
      navigate("/users/cgf-admin/");
    }, 3000);
  };

  const handleSaveAndMoreAddCGFAdmin = (data) => {
    // data.countryCode = data.countryCode.slice(
    //     data.countryCode.indexOf("+")
    // );

    addSubAdminData(data);
    Logger.debug(data);
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
            onSubmit={handleSubmit(handleOnsubmitAddCGFAdmin)}
            // onKeyDown={handleSubmit(handleOnsubmitAddCGFAdmin)}
          >
            <div className="form-header flex-between">
              <h2 className="heading2">Add CGF Admin</h2>
              <div className="form-header-right-txt">
                <div
                  className="tertiary-btn-blk"
                  onClick={handleSubmit(handleSaveAndMoreAddCGFAdmin)}
                >
                  <span className="addmore-icon">
                    <i className="fa fa-plus"></i>
                  </span>
                  <span className="addmore-txt">Save & Add More</span>
                </div>
              </div>
            </div>
            {isCgfAdminLoading ? (
              <Loader />
            ) : (
              <div className="card-wrapper">
                <div className="card-blk flex-between">
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="name">
                        CGF Admin Name <span className="mandatory">*</span>
                      </label>
                      <Input
                        name={"name"}
                        onBlur={(e) => setValue("name", e.target.value?.trim())}
                        control={control}
                        placeholder={"Enter CGF admin name"}
                        myHelper={helperTextForCGFAdmin}
                        rules={{
                          required: true,
                          maxLength: 50,
                          minLength: 3,
                          pattern: /^[a-zA-Z][a-zA-Z ]*$/,
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
                        Email <span className="mandatory">*</span>
                      </label>
                      <Input
                        name={"email"}
                        onBlur={(e) =>
                          setValue("email", e.target.value?.trim())
                        }
                        control={control}
                        placeholder={"example@domain.com"}
                        myHelper={helperTextForCGFAdmin}
                        rules={{
                          required: true,
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
                          <AddSubAdminController
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
                              <Autocomplete
                                {...field}
                                className={`${error && "autocomplete-error"}`}
                                PaperComponent={({ children }) => (
                                  <Paper
                                    className={
                                      countriesAddCGFAdmin?.length > 5
                                        ? "autocomplete-option-txt autocomplete-option-limit"
                                        : "autocomplete-option-txt"
                                    }
                                  >
                                    {children}
                                  </Paper>
                                )}
                                popupIcon={<KeyboardArrowDownRoundedIcon />}
                                onChange={(event, newValue) => {
                                  Logger.debug("inside autocomplete onchange");
                                  Logger.debug("new Value ", newValue);
                                  newValue && typeof newValue === "object"
                                    ? setValue("countryCode", newValue.name)
                                    : setValue("countryCode", newValue);
                                  trigger("countryCode");
                                  trigger("phoneNumber");
                                }}
                                autoHighlight
                                options={
                                  countriesAddCGFAdmin
                                    ? countriesAddCGFAdmin
                                    : []
                                }
                                // placeholder="Select country code"
                                getOptionLabel={(country) => country}
                                renderOption={(props, option) => (
                                  <li {...props}>{option}</li>
                                )}
                                renderInput={(params) => (
                                  <TextField
                                    // className={`input-field ${
                                    //   error && "input-error"
                                    // }`}
                                    {...params}
                                    inputProps={{
                                      ...params.inputProps,
                                    }}
                                    placeholder={"+91"}
                                    onChange={() => trigger("countryCode")}
                                    // onSubmit={() => setValue("countryCode", "")}

                                    helperText={
                                      error
                                        ? helperTextForCGFAdmin.countryCode[
                                            error?.type
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
                          placeholder={"1234567890"}
                          myOnChange={(e) =>
                            phoneNumberChangeHandlerAddCGFAdmin(
                              e,
                              "phoneNumber",
                              "countryCode"
                            )
                          }
                          onBlur={(e) =>
                            setValue("phoneNumber", e.target.value?.trim())
                          }
                          myHelper={helperTextForCGFAdmin}
                          rules={{
                            maxLength: 15,
                            minLength: 7,
                            validate: (value) => {
                              if (!watch("phoneNumber") && watch("countryCode"))
                                return "invalid input";
                              if (value && !Number(value))
                                return "Invalid input";
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="role">
                        Role <span className="mandatory">*</span>
                      </label>

                      <div>
                        <Dropdown
                          name="subRoleId"
                          control={control}
                          options={rolesAddCGFAdmin}
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
                      disabled={disableSubmit}
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
};

export default AddSubAdmin;
