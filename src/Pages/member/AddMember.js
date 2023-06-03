import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import {
  Autocomplete,
  FormControlLabel,
  RadioGroup as MemberRadio,
  Paper,
  Radio,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Logger } from "../../Logger/Logger";
import {
  CITES,
  COUNTRIES,
  FETCH_ROLES,
  MEMBER,
  PARENT_COMPINES,
  REGIONCOUNTRIES,
  REGIONS,
  STATES
} from "../../api/Url";
import { privateAxios } from "../../api/axios";
import Dropdown from "../../components/Dropdown";
import Input from "../../components/Input";
import Toaster from "../../components/Toaster";
import Loader from "../../utils/Loader";
import {
  defaultValues,
  getCGFOffices,
  getCategories,
} from "../../utils/MemberModuleUtil";
import { memberHelper } from "../../utils/helpertext";
import useCallbackState from "../../utils/useCallBackState";
import { useDocumentTitle } from "../../utils/useDocumentTitle";

//Parent company (Ideally get from backend)
//CGF Categories (Ideally get from backend)

//Suggestion from het implement it later
// const categories = {
//   "Manufacture": ["Activity 1", "Activity 2"],
//   "Retauiler": []
// }

// Object.keys(categories)
// categories[category] = Array of activities[]
let ADD_MEMBER_LOOKUP = {};
let CGF_OFFICES = [];

const AddMember = () => {
  //custom hook to set title of page
  useDocumentTitle("Add Member");
  const navigate = useNavigate();
  // Refr for Toaster
  const myRef = React.useRef();
  //Toaster Message setter
  let tempDefaultValues = defaultValues;
  const [toasterDetailsAddMember, setToasterDetailsAddMember] =
    useCallbackState({
      titleMessage: "",
      descriptionMessage: "",
      messageType: "success",
    });
  //   const [ADD_MEMBER_LOOKUP, SET_ADD_MEMBER_LOOKUP] = useState({})

  //method to call all error toaster from this method
  const [disableAddMemberButton, setdisableAddMemberButton] = useState(false);
  const setErrorToaster = (error) => {
    Logger.debug("error", error);
    setToasterDetailsAddMember(
      {
        titleMessage: "Error",
        descriptionMessage:
          error?.response?.data?.message &&
          typeof error.response.data.message === "string"
            ? error.response.data.message
            : "Oops! Something went wrong. Please try again later.",
        messageType: "error",
      },
      () => myRef.current()
    );
  };

  //to hold all regions
  const [arrOfRegionsAddMember, setArrOfRegionsAddMember] = useState([]);
  //to hold array of countries for perticular region for Company Adress
  const [arrOfCountryRegionsAddMember, setArrOfCountryRegionsAddMember] =
    useState([]);
  //to hold array of Country states
  const [arrOfStateCountryAddMember, setArrOfStateCountryAddMember] = useState(
    []
  );
  const [arrOfCountryCodeAddMember, setArrOfCountryCodeAddMember] = useState(
    []
  );
  const [arrOfParentCompanyAddMember, setArrOfParentCompanyAddMember] =
    useState([]);
  const [arrOfCitesAddMember, setArrOfCitesAddMember] = useState([]);

  //to hold array of countries for perticular region for CGF Office details
  const [
    arrOfCgfOfficeCountryRegionsAddMember,
    setArrOfCgfOfficeCountryRegionsAddMember,
  ] = useState([]);

  // To fetch and set addMemberRoles
  const [addMemberRoles, addMemberSetRoles] = useState([]);

  const [isMemberLoading, setIsMemberLoading] = useState(false);

  const { control, reset, setValue, watch, trigger, handleSubmit } = useForm({
    reValidateMode: "onChange",
    defaultValues: tempDefaultValues,
  });
  Logger.debug("Category:- ", watch("cgfCategory"));
  const onSubmitFunctionCallAddMember = async (data) => {
    setIsMemberLoading(true);
    setdisableAddMemberButton(true);
    Logger.debug("data", data);
    try {
      let backendObjectAddMember = {
        parentCompany: data.parentCompany,
        countryCode: data.countryCode,
        phoneNumber: data.phoneNumber,
        website: data.websiteUrl ? data.websiteUrl : undefined,
        state: data.state,
        city: data.city,
        companyName: data.memberCompany,
        companyType: data.companyType,
        cgfCategory: data.cgfCategory,
        cgfActivity: data.cgfActivity ? data.cgfActivity : "N/A",
        corporateEmail: data.corporateEmail,
        region: data.region,
        country: data.country,
        address: data.address,
        cgfOfficeRegion: data.cgfOfficeRegion,
        cgfOfficeCountry: data.cgfOfficeCountry,
        cgfOffice: data.cgfOffice,
        memberRepresentative: {
          title: data.title,
          department: data.department,
          salutation: data.memberContactSalutation,
          name: data.memberContactFullName,
          email: data.memberContactEmail,
          countryCode: data.memberContactCountryCode,
          phoneNumber: data.memberContactPhoneNuber,
          roleId: data.roleId,
        },
      };
      const response = await axios.post(MEMBER, {
        ...backendObjectAddMember,
      });
      Logger.debug("response : ", response);
      if (response.status === 201) {
        setIsMemberLoading(false);

        setToasterDetailsAddMember(
          {
            titleMessage: "Success!",
            descriptionMessage: response?.data?.message,
            messageType: "success",
          },
          () => myRef.current()
        );
        Logger.debug("Default values: ", tempDefaultValues);
        reset({ ...tempDefaultValues });
        setdisableAddMemberButton(false);
        return true;
      }
    } catch (error) {
      setIsMemberLoading(false);

      if (error?.response?.status === 401) {
        setToasterDetailsAddMember(
          {
            titleMessage: "Error",
            descriptionMessage: "Session Timeout: Please login again",
            messageType: "error",
          },
          () => myRef.current()
        );
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else if (error?.response?.status === 403) {
        setToasterDetailsAddMember(
          {
            titleMessage: "Error",
            descriptionMessage: error?.response?.data?.message
              ? error?.response?.data?.message
              : "Oops! Something went wrong. Please try again later.",
            messageType: "error",
          },
          () => myRef.current()
        );
        setTimeout(() => {
          navigate("/home");
        }, 3000);
      } else {
        setErrorToaster(error);
        setdisableAddMemberButton(false);

        return false;
      }
    }
  };
  // On Click cancel handler
  const onClickCancelHandlerAddMember = () => {
    reset({ tempDefaultValues });
    navigate("/users/members");
  };
  const onSubmitAddMember = async (data) => {
    Logger.debug("data", data);
    const isSubmited = await onSubmitFunctionCallAddMember(data);
    Logger.debug("is Submited", isSubmited);
    isSubmited && setTimeout(() => navigate("/users/members"), 3000);
  };
  //method to handle on add more button click handler
  const onAddMoreButtonClickHandlerAddMember = async (data) => {
    const isSubmited = await onSubmitFunctionCallAddMember(data);
    if (isSubmited) getParentCompanyAddMember();
  };
  //method to handle region change for cgf office

  const formatRegionCountriesAddMember = (regionCountries) => {
    regionCountries.forEach(
      (country, id) =>
        (regionCountries[id] = country.hasOwnProperty("_id")
          ? country.name
          : country)
    );
    Logger.debug("arr of country ", regionCountries);
    return regionCountries;
  };

  //method to handle country change
  const onCountryChangeHandlerAddMember = async (e) => {
    Logger.debug("Inside Country Change ", e.target.value);
    setValue("country", e.target.value);
    const stateCountries = await axios.get(STATES + `/${e.target.value}`);
    setArrOfStateCountryAddMember(stateCountries.data);
    Logger.debug("state countries: ", stateCountries);
    setValue("state", "");
    setValue("city", "");
    getCitesAddMember();
    trigger("country");
  };
  const getCitesAddMember = async () => {
    try {
      let url =
        CITES + `/?region=${watch("region")}&country=${watch("country")}`;
      if (watch("state")) {
        url += `&state=${watch("state")}`;
      }
      const response = await axios.get(url);
      setArrOfCitesAddMember(response.data);
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      Logger.debug("Error in getCitiesAddmember");
    }
  };
  //method to handle state change
  const onStateChangeHandlerAddMember = async (e) => {
    setValue("state", e.target.value);
    setValue("city", "");
    getCitesAddMember();
  };
  //method to handle office Region Change Handler
  const cgfOfficeRegionChangeHandlerAddMember = async (e) => {
    setValue("cgfOfficeRegion", e.target.value);
    setValue("cgfOfficeCountry", "");
    trigger("cgfOfficeRegion");
    const countriesOnRegion = await getCountriesAddMember(
      watch("cgfOfficeRegion")
    );
    const arrOfCgfOfficeCountryRegionsTemp = formatRegionCountriesAddMember(
      countriesOnRegion.data
    );
    setArrOfCgfOfficeCountryRegionsAddMember([
      ...arrOfCgfOfficeCountryRegionsTemp,
      ,
    ]);
  };
  //method to set region and update other fields accordingly
  const onRegionChangeHandlerAddMember = async (e) => {
    Logger.debug("region: ", e.target.value);
    setValue("country", "");
    setValue("state", "");
    setValue("city", "");
    setValue("region", e.target.value);
    trigger("region");
    const countriesOnRegion = await getCountriesAddMember(watch("region"));
    Logger.debug("countries", countriesOnRegion);
    const arrOfCountryRegionsTemp = formatRegionCountriesAddMember(
      countriesOnRegion.data
    );
    setArrOfCountryRegionsAddMember([...arrOfCountryRegionsTemp]);
  };

  const getCountryCodeAddMember = async (controller) => {
    try {
      const response = await axios.get(COUNTRIES, {
        signal: controller.signal,
      });
      let arrOfCountryCodeTemp = [];
      response.data.forEach((code, id) => {
        if (!code.countryCode) return;
        arrOfCountryCodeTemp.push(code.countryCode);
      });
      const countryCodeSet = new Set(arrOfCountryCodeTemp);
      setArrOfCountryCodeAddMember([...countryCodeSet]);
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;

      Logger.debug("Error from getCountryCodeAddMember");
    }
  };
  const getCountriesAddMember = async (region) => {
    try {
      return await axios.get(REGIONCOUNTRIES + `/${region}`);
      // return regionCountries;
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;

      Logger.debug("Error from getCountriesAddMember ");
      return [];
    }
  };
  const getRegionsAddMember = async (controller, isMounted) => {
    try {
      const regions = await axios.get(REGIONS, {
        signal: controller.signal,
      });
      setArrOfRegionsAddMember(regions.data);
      return arrOfRegionsAddMember;
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      if (error?.response?.status == 401) {
        isMounted &&
          setToasterDetailsAddMember(
            {
              titleMessage: "Error",
              descriptionMessage: "Session Timeout: Please login again",
              messageType: "error",
            },
            () => myRef.current()
          );
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else if (error?.response?.status === 403) {
        isMounted &&
          setToasterDetailsAddMember(
            {
              titleMessage: "Error",
              descriptionMessage: error?.response?.data?.message
                ? error?.response?.data?.message
                : "Oops! Something went wrong. Please try again later.",
              messageType: "error",
            },
            () => myRef.current()
          );
        setTimeout(() => {
          navigate("/home");
        }, 3000);
      } else {
        setErrorToaster(error);
        return [];
      }
    }
  };

  // Fetch addMemberRoles
  let fetchRolesAddMember = async () => {
    try {
      const response = await privateAxios.get(FETCH_ROLES);

      addMemberSetRoles(response.data);
      response.data.filter((data) => {
        if (data.name === "Member Representative") {
          reset({ ...tempDefaultValues, roleId: data._id });
          tempDefaultValues.roleId = data?._id;
        }
      });
    } catch (error) {
      Logger.debug("Error from fetch addMemberRoles", error);
    }
  };

  const getParentCompanyAddMember = async (
    controller = new AbortController()
  ) => {
    try {
      const response = await axios.get(PARENT_COMPINES, {
        signal: controller.signal,
      });
      setArrOfParentCompanyAddMember(response?.data);
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      Logger.debug("error from getParentCompanyAddMember");
    }
  };

  //prevent form submission on press of enter key
  const checkKeyDown = (e) => {
    if (e.code === "Enter") e.preventDefault();
  };

  const categoryChangeHandlerAddMember = (e) => {
    setValue("cgfCategory", e.target.value);
    trigger("cgfCategory");
    trigger("cgfActivity");
    setValue("cgfActivity", "");
  };
  const activityChangeHandler = (e) => {
    setValue("cgfActivity", e.target.value);
    trigger("cgfActivity");
  };
  const phoneNumberChangeHandlerAddMember = (e, name, code) => {
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
  const callGetOffices = async () => {
    CGF_OFFICES = await getCGFOffices();
  };

  const callGetCategories = async () => {
    ADD_MEMBER_LOOKUP = await getCategories();
    Logger.debug("MEMBER LOOKUP", ADD_MEMBER_LOOKUP);
  };
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    Object.keys(ADD_MEMBER_LOOKUP)?.length === 0 && callGetCategories();
    CGF_OFFICES?.length === 0 && callGetOffices();
    arrOfRegionsAddMember.length === 0 &&
      getRegionsAddMember(controller, isMounted);
    arrOfCountryCodeAddMember.length === 0 &&
      getCountryCodeAddMember(controller);
    arrOfParentCompanyAddMember?.length === 0 &&
      getParentCompanyAddMember(controller);
    addMemberRoles.length === 0 && fetchRolesAddMember();
    // isMounted && getCategories()

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  Logger.debug("arrOfparentCompnies", arrOfParentCompanyAddMember);
  return (
    <div className="page-wrapper">
      <Toaster
        myRef={myRef}
        titleMessage={toasterDetailsAddMember.titleMessage}
        descriptionMessage={toasterDetailsAddMember.descriptionMessage}
        messageType={toasterDetailsAddMember.messageType}
      />
      <div className="breadcrumb-wrapper">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link to="/users/members">Members</Link>
            </li>
            <li>Add Member</li>
          </ul>
        </div>
      </div>
      <section>
        <div className="container">
          <div className="form-header flex-between">
            <h2 className="heading2">Add Member</h2>
            <div className="form-header-right-txt">
              <div
                className="tertiary-btn-blk"
                onClick={handleSubmit(onAddMoreButtonClickHandlerAddMember)}
              >
                <span
                  //   onClick={handleSubmit(onAddMoreButtonClickHandlerAddMember)}
                  className="addmore-icon"
                >
                  <i className="fa fa-plus"></i>
                </span>
                <span
                  className="addmore-txt"
                  //   onClick={handleSubmit(onAddMoreButtonClickHandlerAddMember)}
                >
                  Save & Add More
                </span>
              </div>
            </div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmitAddMember)}
            onKeyDown={(e) => checkKeyDown(e)}
          >
            {isMemberLoading ? (
              <Loader />
            ) : (
              <div className="card-wrapper">
                <div className="card-inner-wrap">
                  <h2 className="sub-heading1">Company Detail</h2>
                  <div className="card-blk flex-between">
                    <div className="card-form-field">
                      <div className="form-group">
                        <label htmlFor="memberCompany">
                          Member Company <span className="mandatory">*</span>
                        </label>
                        <Input
                          control={control}
                          name="memberCompany"
                          placeholder="Enter member company"
                          onBlur={(e) =>
                            setValue("memberCompany", e.target.value?.trim())
                          }
                          myHelper={memberHelper}
                          rules={{
                            required: true,
                            maxLength: 50,
                            minLength: 3,
                          }}
                        />
                      </div>
                    </div>

                    <div className="card-form-field">
                      <div className="form-group">
                        <label htmlFor="companyType">
                          Company Type <span className="mandatory">*</span>
                        </label>
                        <div className="radio-btn-field">
                          <Controller
                            name="companyType"
                            control={control}
                            render={({ field }) => (
                              <MemberRadio
                                {...field}
                                aria-labelledby="demo-radio-buttons-group-label"
                                name="radio-buttons-group"
                                className="radio-btn"
                              >
                                <FormControlLabel
                                  value="Partner"
                                  control={<Radio />}
                                  label="Partner"
                                />
                                <FormControlLabel
                                  value="Member"
                                  control={<Radio />}
                                  label="Member"
                                />
                              </MemberRadio>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="card-form-field">
                      <div className="form-group">
                        <label htmlFor="parentCompany">Parent Company</label>
                        <Controller
                          name="parentCompany"
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <Autocomplete
                              disableClearable
                              // open={true}
                              // openOnFocus={true}
                              // noOptionsText={"No options"}
                              {...field}
                              PaperComponent={({ children }) =>
                                watch("parentCompany")?.length > 0 && (
                                  <Paper
                                    className={
                                      arrOfParentCompanyAddMember?.length > 5
                                        ? "autocomplete-option-txt autocomplete-option-limit"
                                        : "autocomplete-option-txt"
                                    }
                                  >
                                    {children}
                                  </Paper>
                                )
                              }
                              className="searchable-input"
                              onBlur={(e) =>
                                setValue(
                                  "parentCompany",
                                  e.target.value?.trim()
                                )
                              }
                              onSubmit={() => setValue("parentCompany", "")}
                              onChange={(event, newValue) => {
                                Logger.debug("new Value ", newValue);
                                if (newValue) {
                                  typeof newValue === "object"
                                    ? setValue("parentCompany", newValue.name)
                                    : setValue("parentCompany", newValue);
                                }
                              }}
                              selectOnFocus
                              handleHomeEndKeys
                              id="free-solo-with-text-demo"
                              options={arrOfParentCompanyAddMember}
                              // getOptionLabel={(option) => {

                              renderOption={(props, option) => (
                                <li className="searchable-inputlist" {...props}>
                                  {option}
                                </li>
                              )}
                              //   sx={{ width: 300 }}
                              freeSolo
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  onChange={(e) =>
                                    setValue("parentCompany", e.target.value)
                                  }
                                  onSubmit={() => setValue("parentCompany", "")}
                                  placeholder="Enter parent company"
                                />
                              )}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="card-form-field">
                      <div className="form-group">
                        {/* <div className="select-field"> */}
                        <label htmlFor="cgfCategory">
                          CGF Category <span className="mandatory">*</span>
                        </label>
                        <Dropdown
                          control={control}
                          name="cgfCategory"
                          placeholder="Select category"
                          myHelper={memberHelper}
                          rules={{ required: true }}
                          myOnChange={categoryChangeHandlerAddMember}
                          options={
                            Object.keys(ADD_MEMBER_LOOKUP)?.length > 0 &&
                            Object.keys(ADD_MEMBER_LOOKUP)
                          }
                        />
                      </div>
                      {/* </div> */}
                    </div>
                    <div className="card-form-field">
                      <div className="form-group">
                        {/* <div className="select-field"> */}
                        <label htmlFor="cgfActivity">
                          CGF Activity <span className="mandatory">*</span>
                        </label>
                        <Dropdown
                          control={control}
                          name="cgfActivity"
                          placeholder="Select activity"
                          myOnChange={activityChangeHandler}
                          myHelper={memberHelper}
                          rules={{
                            validate: (value) => {
                              if (
                                !value &&
                                (watch("cgfCategory") === "Manufacturer" ||
                                  watch("cgfCategory") === "Retailer")
                              )
                                return "Select activity";
                            },
                          }}
                          options={
                            Object.keys(MEMBER).length > 0 &&
                            ADD_MEMBER_LOOKUP[watch("cgfCategory")]
                          }
                          isDisabled={watch("cgfCategory") === "Other"}
                        />
                      </div>
                      {/* </div> */}
                    </div>
                  </div>
                </div>
                {/* <div className="card-inner-wrap">
                  <h2 className="sub-heading1">Contact Detail</h2>
                  <div className="flex-between card-blk">
                    <div className="card-form-field">
                      <div className="form-group">
                        <label htmlFor="corporateEmail">Corporate Email</label>
                        <Input
                          name="corporateEmail"
                          control={control}
                          onBlur={(e) =>
                            setValue("corporateEmail", e.target.value?.trim())
                          }
                          rules={{
                            maxLength: 50,
                            minLength: 3,
                            pattern:
                              /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                          }}
                          myHelper={memberHelper}
                          placeholder="example@domain.com"
                        />
                      </div>
                    </div>
                    <div className="card-form-field">
                      <div className="form-group">
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <div className="phone-number-field">
                          <div className="select-field country-code">
                            <Controller
                              name="countryCode"
                              control={control}
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
                                  popupIcon={<KeyboardArrowDownRoundedIcon />}
                                  {...field}
                                  className={`${error && "autocomplete-error"}`}
                                  onChange={(event, newValue) => {
                                    Logger.debug(
                                      "inside autocomplete onchange"
                                    );
                                    Logger.debug("new Value ", newValue);
                                    newValue && typeof newValue === "object"
                                      ? setValue("countryCode", newValue.name)
                                      : setValue("countryCode", newValue);
                                    trigger("countryCode");
                                    trigger("phoneNumber");
                                  }}
                                  PaperComponent={({ children }) => (
                                    <Paper
                                      className={
                                        arrOfCountryCodeAddMember?.length > 5
                                          ? "autocomplete-option-txt autocomplete-option-limit"
                                          : "autocomplete-option-txt"
                                      }
                                    >
                                      {children}
                                    </Paper>
                                  )}
                                  autoHighlight
                                  options={arrOfCountryCodeAddMember}
                                  // placeholder="Select country code"
                                  // getOptionLabel={(country) => country.name + " " + country}
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
                                      // onChange={() => trigger("phoneNumber")}
                                      // onSubmit={() => setValue("countryCode", "")}
                                      placeholder={"+91"}
                                      helperText={
                                        error
                                          ? memberHelper.countryCode[
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
                            control={control}
                            name="phoneNumber"
                            placeholder="1234567890"
                            myHelper={memberHelper}
                            myOnChange={(e) =>
                              phoneNumberChangeHandlerAddMember(
                                e,
                                "phoneNumber",
                                "countryCode"
                              )
                            }
                            onBlur={(e) =>
                              setValue("phoneNumber", e.target.value.trim())
                            }
                            rules={{
                              maxLength: 15,
                              minLength: 7,
                              validate: (value) => {
                                if (
                                  !watch("phoneNumber") &&
                                  watch("countryCode")
                                )
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
                        <label htmlFor="websiteUrl">Website URL</label>
                        <Input
                          control={control}
                          name="websiteUrl"
                          placeholder="www.google.com"
                          onBlur={(e) =>
                            setValue("websiteUrl", e.target.value?.trim())
                          }
                          myHelper={memberHelper}
                          rules={{
                            maxLength: 50,
                            minLength: 3,
                            pattern:
                              /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className="card-inner-wrap">
                  <h2 className="sub-heading1">Company Address Detail</h2>
                  <div className="flex-between card-blk">
                    <div className="card-form-field">
                      <div className="form-group">
                        <label htmlFor="region">Region</label>
                        <Dropdown
                          control={control}
                          myOnChange={onRegionChangeHandlerAddMember}
                          name="region"
                          placeholder="Select region"
                          myHelper={memberHelper}
                          options={arrOfRegionsAddMember}
                        />
                      </div>
                    </div>
                    <div className="card-form-field">
                      <div className="form-group">
                        <label htmlFor="country">Country</label>
                        <Dropdown
                          isDisabled={!watch("region")}
                          control={control}
                          name="country"
                          myOnChange={onCountryChangeHandlerAddMember}
                          placeholder="Select country"
                          myHelper={memberHelper}
                          options={arrOfCountryRegionsAddMember}
                        />
                      </div>
                    </div>
                    <div className="card-form-field">
                      <div className="form-group">
                        <label htmlFor="state">State</label>
                        <Dropdown
                          isDisabled={!watch("country")}
                          control={control}
                          name="state"
                          myOnChange={onStateChangeHandlerAddMember}
                          placeholder="Select state"
                          myHelper={memberHelper}
                          options={arrOfStateCountryAddMember}
                        />
                      </div>
                    </div>
                    <div className="card-form-field">
                      <div className="form-group">
                        <label htmlFor="city">City</label>
                        <Controller
                          name="city"
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <Autocomplete
                              className="searchable-input"
                              {...field}
                              PaperComponent={({ children }) =>
                                watch("city") && (
                                  <Paper
                                    className={
                                      arrOfCitesAddMember?.length > 5
                                        ? "autocomplete-option-txt autocomplete-option-limit"
                                        : "autocomplete-option-txt"
                                    }
                                  >
                                    {children}
                                  </Paper>
                                )
                              }
                              onSubmit={() => setValue("city", "")}
                              disabled={!watch("country")}
                              onChange={(event, newValue) => {
                                if (newValue) {
                                  typeof newValue === "object"
                                    ? setValue("city", newValue.name)
                                    : setValue("city", newValue);
                                }
                              }}
                              onBlur={(e) =>
                                setValue("city", e.target.value?.trim())
                              }
                              handleHomeEndKeys
                              id="free-solo-with-text-demo"
                              options={arrOfCitesAddMember}
                              selectOnFocus
                              renderOption={(props, option) => (
                                <li {...props}>{option}</li>
                              )}
                              //   sx={{ width: 300 }}
                              freeSolo
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  onChange={(e) =>
                                    setValue("city", e.target.value)
                                  }
                                  placeholder="Enter city"
                                  onSubmit={() => setValue("city", "")}
                                />
                              )}
                            />
                          )}
                        />
                      </div>
                    </div>

                    <div className="card-form-field">
                      <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <Controller
                          control={control}
                          name="address"
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
                              placeholder="Enter address"
                              id="outlined-basic"
                              helperText={
                                error ? memberHelper.address[error.type] : " "
                              }
                              variant="outlined"
                            />
                          )}
                        />
                        {/* Add Address Text Area field here */}
                        {/* <Input control={control} name="city" placeholder="Enter state"/> */}
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="card-inner-wrap">
                  <h2 className="sub-heading1">CGF Office Detail</h2>
                  <div className="flex-between card-blk">
                    <div className="card-form-field">
                      <div className="form-group">
                        <label htmlFor="cgfOfficeRegion">Region</label>
                        <Dropdown
                          control={control}
                          name="cgfOfficeRegion"
                          myOnChange={cgfOfficeRegionChangeHandlerAddMember}
                          placeholder="Select region"
                          myHelper={memberHelper}
                          options={arrOfRegionsAddMember}
                        />
                      </div>
                    </div>
                    <div className="card-form-field">
                      <div className="form-group">
                        <label htmlFor="cgfOfficeCountry">Country</label>
                        <Dropdown
                          isDisabled={!watch("cgfOfficeRegion")}
                          control={control}
                          name="cgfOfficeCountry"
                          placeholder="Select country"
                          myHelper={memberHelper}
                          options={arrOfCgfOfficeCountryRegionsAddMember}
                        />
                      </div>
                    </div>
                    <div className="card-form-field">
                      <div className="form-group">
                        <label htmlFor="cgfOffice">Office</label>
                        <Dropdown
                          control={control}
                          placeholder="Select office"
                          name="cgfOffice"
                          options={CGF_OFFICES}
                          myHelper={memberHelper}
                        />
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className="card-inner-wrap">
                  <h2 className="sub-heading1">
                    Representative Contact Detail
                  </h2>
                  <div className="flex-between card-blk">
                    <div className="card-form-field">
                      <div className="form-group">
                        <div className="salutation-wrap">
                          <div className="salutation-blk">
                            <label htmlFor="memberContactSalutation">
                              Salutation <span className="mandatory">*</span>
                            </label>
                            <Dropdown
                              name="memberContactSalutation"
                              control={control}
                              // placeholder="Mr."
                              myHelper={memberHelper}
                              rules={{
                                required: true,
                              }}
                              options={["Mr.", "Mrs.", "Ms."]}
                            />
                          </div>
                          <div className="salutation-inputblk">
                            <label htmlFor="memberContactFullName">
                              Full Name <span className="mandatory">*</span>
                            </label>
                            <Input
                              myHelper={memberHelper}
                              control={control}
                              rules={{
                                required: true,
                                maxLength: 50,
                                minLength: 3,
                                pattern: /^[a-zA-Z][a-zA-Z ]*$/,
                              }}
                              name="memberContactFullName"
                              onBlur={(e) =>
                                setValue(
                                  "memberContactFullName",
                                  e.target.value?.trim()
                                )
                              }
                              placeholder="Enter full name"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-form-field">
                      <div className="form-group">
                        <label htmlFor="title">Job Title</label>
                        <Input
                          myHelper={memberHelper}
                          control={control}
                          rules={{
                            maxLength: 50,
                            minLength: 3,
                          }}
                          name="title"
                          placeholder="Enter job title"
                          onBlur={(e) =>
                            setValue("title", e.target.value?.trim())
                          }
                        />
                      </div>
                    </div>
                    <div className="card-form-field">
                      <div className="form-group">
                        <label htmlFor="department">Department</label>
                        <Input
                          control={control}
                          myHelper={memberHelper}
                          rules={{
                            maxLength: 50,
                            minLength: 3,
                          }}
                          name="department"
                          onBlur={(e) =>
                            setValue("department", e.target.value?.trim())
                          }
                          placeholder="Enter department"
                        />
                      </div>
                    </div>
                    <div className="card-form-field">
                      <div className="form-group">
                        <label htmlFor="memberContactEmail">
                          Email <span className="mandatory">*</span>
                        </label>
                        <Input
                          control={control}
                          myHelper={memberHelper}
                          rules={{
                            required: true,
                            maxLength: 50,
                            minLength: 3,
                            pattern:
                              /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                          }}
                          name="memberContactEmail"
                          onBlur={(e) =>
                            setValue(
                              "memberContactEmail",
                              e.target.value?.trim()
                            )
                          }
                          placeholder="example@domain.com"
                        />
                      </div>
                    </div>
                    <div className="card-form-field">
                      <div className="form-group">
                        <label htmlFor="memberContactPhoneNumber">
                          Phone Number
                        </label>
                        <div className="phone-number-field">
                          <div className="select-field country-code">
                            <Controller
                              name="memberContactCountryCode"
                              control={control}
                              rules={{
                                validate: () => {
                                  if (
                                    !watch("memberContactCountryCode") &&
                                    watch("memberContactPhoneNuber")
                                  )
                                    return "Invalid input";
                                },
                              }}
                              render={({ field, fieldState: { error } }) => (
                                <Autocomplete
                                  popupIcon={<KeyboardArrowDownRoundedIcon />}
                                  className={`${error && "autocomplete-error"}`}
                                  PaperComponent={({ children }) => (
                                    <Paper
                                      className={
                                        arrOfCountryCodeAddMember?.length > 5
                                          ? "autocomplete-option-txt autocomplete-option-limit"
                                          : "autocomplete-option-txt"
                                      }
                                    >
                                      {children}
                                    </Paper>
                                  )}
                                  {...field}
                                  onChange={(event, newValue) => {
                                    newValue && typeof newValue === "object"
                                      ? setValue(
                                          "memberContactCountryCode",
                                          newValue.name
                                        )
                                      : setValue(
                                          "memberContactCountryCode",
                                          newValue
                                        );
                                    trigger("memberContactCountryCode");
                                    trigger("memberContactPhoneNuber");
                                  }}
                                  // sx={{ width: 200 }}
                                  options={arrOfCountryCodeAddMember}
                                  autoHighlight
                                  placeholder="+91"
                                  // getOptionLabel={(country) => country.name + " " + country}
                                  renderOption={(props, option) => (
                                    <li {...props}>{option}</li>
                                  )}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      inputProps={{
                                        ...params.inputProps,
                                      }}
                                      // onChange={() =>{trigger("memberContactCountryCode")}}
                                      // onSubmit={() =>
                                      //   setValue("memberContactCountryCode", "")
                                      // }
                                      placeholder={"+91"}
                                      helperText={
                                        error
                                          ? memberHelper
                                              .memberContactCountryCode[
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
                            control={control}
                            name="memberContactPhoneNuber"
                            myOnChange={(e) =>
                              phoneNumberChangeHandlerAddMember(
                                e,
                                "memberContactPhoneNuber",
                                "memberContactCountryCode"
                              )
                            }
                            onBlur={(e) =>
                              setValue(
                                "memberContactPhoneNuber",
                                e.target.value?.trim()
                              )
                            }
                            myHelper={memberHelper}
                            rules={{
                              minLength: 7,
                              maxLength: 15,
                              validate: (value) => {
                                if (
                                  watch("memberContactCountryCode") &&
                                  !watch("memberContactPhoneNuber")
                                )
                                  return "invalid input";
                                if (value && !Number(value))
                                  return "Invalid input";
                              },
                            }}
                            placeholder="1234567890"
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
                            name="roleId"
                            control={control}
                            options={addMemberRoles}
                            rules={{
                              required: true,
                            }}
                            myHelper={memberHelper}
                            placeholder={"Select role"}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-btn flex-between add-members-btn">
                  <button
                    type="reset"
                    onClick={onClickCancelHandlerAddMember}
                    className="secondary-button mr-10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    //   onClick={}
                    disabled={disableAddMemberButton}
                    className="primary-button add-button"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  );
};

export default AddMember;
