import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Autocomplete as EditCGFAdminAutoComplete,
  RadioGroup as EditCGFAdminRadioGroup,
  FormControlLabel,
  Radio,
  Paper,
} from "@mui/material";

import axios from "axios";
import { Controller as EditSubAdminController, useForm } from "react-hook-form";
import Toaster from "../../components/Toaster";
import useCallbackState from "../../utils/useCallBackState";
import {
  COUNTRIES,
  FETCH_ROLES,
  FETCH_SUB_ADMIN_BY_ADMIN,
  UPDATE_SUB_ADMIN,
} from "../../api/Url";
import { privateAxios } from "../../api/axios";
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
  },
  subRoleId: {
    required: "Select the role",
  },
};

const EditSubAdmin = () => {
  //custom hook to set title of page
  useDocumentTitle("Edit CGF Admin");
  // state to manage loaders
  const [isEditCgfAdminLoading, setIsEditCgfAdminLoading] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const toasterRef = useRef();

  const [countries, setCountries] = useState([]);
  const [disableEditCgfAdminButton, setDisableEditCgfAdminButton] =
    useState(false);
  const [roles, setRoles] = useState([]);
  const [toasterDetails, setToasterDetails] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "error",
  });
  const [fetchSubAdminDetailsForEdit, setFetchSubAdminDetailsForEdit] =
    useState({});
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
    trigger,
  } = useForm({
    defaultValues: {
      name: "",
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
  });

  const phoneNumberChangeHandler = (e, name, code) => {
    Logger.debug("inside on Change");
    setValue(name, e.target.value);
    trigger(name);
    trigger(code);
  };
  useEffect(() => {
    let isMounted = true;
    let controller = new AbortController();
    let fetchCountries = async () => {
      try {
        const response = await axios.get(COUNTRIES, {
          signal: controller.signal,
        });
        Logger.debug("response", response);
        if (isMounted) {
          let tempCountryCode = response?.data.map(
            (country) => country.countryCode
          );
          let tempCountryCodeSet = new Set(tempCountryCode);
          setCountries([...tempCountryCodeSet]);
        }
      } catch (error) {
        Logger.debug("error from countries api of edit sub-admin", error);
        if (error?.code === "ERR_CANCELED") return;
        catchError(error, setToasterDetails, toasterRef, navigate);
      }
    };
    fetchCountries();
    const fetchSubAdmin = async () => {
      try {
        setIsEditCgfAdminLoading(true);
        const response = await privateAxios.get(
          FETCH_SUB_ADMIN_BY_ADMIN + params.id,
          {
            signal: controller.signal,
          }
        );
        setIsEditCgfAdminLoading(false);
        Logger.debug("response from sub admin view page fetch api", response);
        isMounted && setFetchSubAdminDetailsForEdit(response.data);
        reset({
          name: response.data.name,
          email: response.data.email,
          countryCode: response.data.countryCode,
          phoneNumber: response.data.phoneNumber,
          status: response.data.isActive ? "active" : "inactive",
          subRoleId: response?.data?.subRoleId?._id ?? "",
        });
      } catch (error) {
        if (error?.code === "ERR_CANCELED") return;
        setIsEditCgfAdminLoading(false);
        Logger.debug("error from sub admin view page fetch api", error);
        catchError(
          error,
          setToasterDetails,
          toasterRef,
          navigate,
          "/users/cgf-admin"
        );
      }
    };
    fetchSubAdmin();
    let fetchRoles = async () => {
      try {
        const response = await privateAxios.get(FETCH_ROLES);
        Logger.debug("Response from fetch roles - ", response);
        setRoles(response.data);
      } catch (error) {
        Logger.debug("Error from fetch roles", error);
        catchError(error, setToasterDetails, toasterRef, navigate);
      }
    };
    fetchRoles();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  Logger.debug("fetchdetails in edit sub admin", fetchSubAdminDetailsForEdit);

  const location = useLocation();
  Logger.debug(location);

  const handleOnSubmit = async (data) => {
    Logger.debug("data from handle submit edit", data);
    setDisableEditCgfAdminButton(true);
    setIsEditCgfAdminLoading(true);
    try {
      const response = await privateAxios.put(UPDATE_SUB_ADMIN + params.id, {
        name: data.name,
        subRoleId: data.subRoleId,
        phoneNumber: data.phoneNumber,
        countryCode: data.countryCode,
        isActive: data.status === "active" ? true : false,
      });
      Logger.debug("response from edit sub admin method", response);
      if (response.status == 200) {
        setIsEditCgfAdminLoading(false);

        setToasterDetails(
          {
            titleMessage: "Success!",
            descriptionMessage: response.data.message,
            messageType: "success",
          },
          () => toasterRef.current()
        );

        setTimeout(() => {
          navigate(`/users/cgf-admin/`);
        }, 2000);
      }
    } catch (error) {
      Logger.debug("error from edit sub admin submit method");
      setIsEditCgfAdminLoading(false);
      setDisableEditCgfAdminButton(false);
      catchError(error, toasterDetails, toasterRef, navigate);
    }
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
              <Link to="/users/cgf-admin">CGF Admins</Link>
            </li>
            <li>
              <Link to={`/users/cgf-admin/view-cgf-admin/${params.id}`}>
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
          </div>
          {isEditCgfAdminLoading ? (
            <Loader />
          ) : (
            <div className="card-wrapper">
              <form onSubmit={handleSubmit(handleOnSubmit)}>
                <div className="card-blk flex-between">
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="subAdminName">
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
                        isDisabled
                        control={control}
                        placeholder={"Enter email address"}
                        myHelper={helperTextForCGFAdmin}
                        rules={{
                          required: true,
                          maxLength: 50,
                          minLength: 3,
                          pattern:
                            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        }}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="phoneNumber">Phone Number</label>
                      <div className="phone-number-field">
                        <div className="select-field country-code">
                          <EditSubAdminController
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
                              <EditCGFAdminAutoComplete
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
                                {...field}
                                onChange={(event, newValue) => {
                                  Logger.debug("inside autocomplete onchange");
                                  Logger.debug("new Value ", newValue);
                                  newValue && typeof newValue === "object"
                                    ? setValue("countryCode", newValue.name)
                                    : setValue("countryCode", newValue);
                                  trigger("countryCode");
                                  trigger("phoneNumber");
                                }}
                                options={countries ? countries : []}
                                autoHighlight
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
                                    onChange={() => trigger("countryCode")}
                                    // onSubmit={() => setValue("countryCode", "")}
                                    placeholder={"+91"}
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
                          myHelper={helperTextForCGFAdmin}
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

                      <div className="select-field">
                        <Dropdown
                          name="subRoleId"
                          control={control}
                          options={roles}
                          rules={{
                            required: true,
                          }}
                          // isDisabled
                          myHelper={helperTextForCGFAdmin}
                          placeholder={"Select role"}
                        />
                      </div>
                      <p className={`input-error-msg`}>
                        {errors.role?.message}
                      </p>
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="cgfAdmin-status">Status</label>
                      <div className="radio-btn-field">
                        <EditSubAdminController
                          name="status"
                          control={control}
                          render={({ field }) => (
                            <EditCGFAdminRadioGroup
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
                            </EditCGFAdminRadioGroup>
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
                      disabled={disableEditCgfAdminButton}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default EditSubAdmin;
