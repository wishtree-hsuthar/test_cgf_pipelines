import {
  Autocomplete,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Dropdown from "../../components/Dropdown";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import {
  COUNTRIES,
  FETCH_ROLES,
  MEMBER,
  REGIONCOUNTRIES,
  REGIONS,
  STATES,
} from "../../api/Url";
import axios from "axios";
import useCallbackState from "../../utils/useCallBackState";
import Toaster from "../../components/Toaster";
import { memberHelper } from "../../utils/helpertext";
import { privateAxios } from "../../api/axios";
import { useDocumentTitle } from "../../utils/useDocumentTitle";

//Parent company (Ideally get from backend)
const parentCompany = [
    "Google",
    "MicroSoft",
    "Nike",
    "Adobe",
    "Falcon",
    "Apple",
    "TSMC",
    "Relience",
    "Adani",
    "Ford",
    "Uber",
    "wishtree",
]

//City (Ideally get from backend)
const cityValue = [
    "Mumbai",
    "Paris",
    "London",
    "New york",
    "Sydney",
    "Melbourne",
    "Perth",
    "Toronto",
    "Vancour",
    "Texas",
    "Delhi",
    "Tokyo",
]

//CGF Categories (Ideally get from backend)
const cgfCategories = ["Manufacturer", "Retailer", "Other"];

//Suggestion from het implement it later
// const categories = {
//   "Manufacture": ["Activity 1", "Activity 2"],
//   "Retauiler": []
// }

// Object.keys(categories)
// categories[category] = Array of activities[]
const cgfActivitiesManufacturer = [
  "Apparel",
  "Food manufacturer",
  "Household care",
  "None",
  "Non-food manufacturer",
  "Personal care & beauty",
];
const cgfActivitiesRetailer = [
  "Department store",
  "Ecommerce",
  "Food/Non food retailer",
  "Food retailer",
  "Food service",
  "Grocery",
  "Health/beauty drugstore",
  "Non food retailer",
  "Wholesaler",
];

const AddMember = () => {
  //custom hook to set title of page
  useDocumentTitle("Add Member");
  const navigate = useNavigate();
  // Refr for Toaster
  const myRef = React.useRef();
  //Toaster Message setter
  const [toasterDetails, setToasterDetails] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "success",
  });
  //method to call all error toaster from this method
  const setErrorToaster = (error) => {
    console.log("error", error);
    setToasterDetails(
      {
        titleMessage: "Error",
        descriptionMessage:
          error?.response?.data?.message &&
          typeof error.response.data.message === "string"
            ? error.response.data.message
            : "Something went wrong!",
        messageType: "error",
      },
      () => myRef.current()
    );
  };
  const defaultValues = {
    memberCompany: "",
    companyType: "Internal",
    parentCompany: "",
    cgfCategory: "Manufacturer",
    cgfActivity: "",
    corporateEmail: "",
    countryCode: "",
    phoneNumber: "",
    websiteUrl: "",
    region: "",
    country: "",
    state: "",
    city: "",
    address: "",
    cgfOfficeRegion: "",
    cgfOfficeCountry: "",
    cgfOffice: "",
    memberContactSalutation: "Mr.",
    memberContactFullName: "",
    title: "",
    department: "",
    memberContactCountryCode: "",
    memberContactEmail: "",
    memberContactPhoneNuber: "",
    roleId: "",
  };
  //to hold all regions
  const [arrOfRegions, setArrOfRegions] = useState([]);
  //to hold array of countries for perticular region for Company Adress
  const [arrOfCountryRegions, setArrOfCountryRegions] = useState([]);
  //to hold array of Country states
  const [arrOfStateCountry, setArrOfStateCountry] = useState([]);
  const [arrOfCountryCode, setArrOfCountryCode] = useState([]);

  //to hold array of countries for perticular region for CGF Office details
  const [arrOfCgfOfficeCountryRegions, setArrOfCgfOfficeCountryRegions] =
    useState([]);

  // To fetch and set roles
  const [roles, setRoles] = useState([]);

  const { control, reset, setValue, watch, trigger, handleSubmit } = useForm({
    reValidateMode: "onChange",
    defaultValues: defaultValues,
  });
  const onSubmitFunctionCall = async (data) => {
    console.log("data", data);
    try {
      let backendObject = {
        parentCompany: data.parentCompany,
        countryCode: data.countryCode,
        phoneNumber: data.phoneNumber ? parseInt(data.phoneNumber) : "",
        website: data.websiteUrl ? data.websiteUrl : undefined,
        state: data.state,
        city: data.city,
        companyName: data.memberCompany,
        companyType: data.companyType,
        cgfCategory: data.cgfCategory,
        cgfActivity: data.cgfActivity ? data.cgfActivity : "NA",
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
          phoneNumber: data.memberContactPhoneNuber
            ? parseInt(data.memberContactPhoneNuber)
            : "",
          roleId: data.roleId,
        },
      };
      const response = await axios.post(MEMBER, { ...backendObject });
      console.log("response : ", response);
      setToasterDetails(
        {
          titleMessage: "Success!",
          descriptionMessage: "New member added successfully!",
          messageType: "success",
        },
        () => myRef.current()
      );
      console.log("Default values: ", defaultValues);
      reset({ defaultValues });
      return true;
    } catch (error) {
      setErrorToaster(error);
      return false;
    }
  };
  // On Click cancel handler
  const onClickCancelHandler = () => {
    reset({ defaultValues });
    navigate("/users/members");
  };
  const onSubmit = async (data) => {
    console.log("data", data);
    const isSubmited = await onSubmitFunctionCall(data);
    console.log("is Submited", isSubmited);
    isSubmited && setTimeout(() => navigate("/users/members"), 3000);
  };
  //method to handle on add more button click handler
  const onAddMoreButtonClickHandler = (data) => {
    onSubmitFunctionCall(data);
  };
  //method to handle region change for cgf office

  const formatRegionCountries = (regionCountries) => {
    regionCountries.forEach(
      (country, id) =>
        (regionCountries[id] = country.hasOwnProperty("_id")
          ? country.name
          : country)
    );
    console.log("arr of country ", regionCountries);
    return regionCountries;
  };

  //method to handle country change
  const onCountryChangeHandler = async (e) => {
    console.log("Inside Country Change ", e.target.value);
    setValue("country", e.target.value);
    const stateCountries = await axios.get(STATES + `/${e.target.value}`);
    setArrOfStateCountry(stateCountries.data);
    console.log("state countries: ", stateCountries);
    setValue("state", "");
    trigger("country");
  };
  //method to handle office Region Change Handler
  const cgfOfficeRegionChangeHandler = async (e) => {
    setValue("cgfOfficeRegion", e.target.value);
    setValue("cgfOfficeCountry", "");
    trigger("cgfOfficeRegion");
    const countriesOnRegion = await getCountries(watch("cgfOfficeRegion"));
    const arrOfCgfOfficeCountryRegionsTemp = formatRegionCountries(
      countriesOnRegion.data
    );
    setArrOfCgfOfficeCountryRegions([...arrOfCgfOfficeCountryRegionsTemp]);
  };
  //method to set region and update other fields accordingly
  const onRegionChangeHandler = async (e) => {
    console.log("region: ", e.target.value);
    setValue("country", "");
    setValue("state", "");
    setValue("city", "");
    setValue("region", e.target.value);
    trigger("region");
    const countriesOnRegion = await getCountries(watch("region"));
    console.log("countries", countriesOnRegion);
    const arrOfCountryRegionsTemp = formatRegionCountries(
      countriesOnRegion.data
    );
    setArrOfCountryRegions([...arrOfCountryRegionsTemp]);
  };

  const getCountryCode = async (controller) => {
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
      setArrOfCountryCode([...countryCodeSet]);
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      setErrorToaster(error);
    }
  };
  const getCountries = async (region) => {
    try {
      return await axios.get(REGIONCOUNTRIES + `/${region}`);
      // return regionCountries;
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      setErrorToaster(error);
      return [];
    }
  };
  const getRegions = async (controller) => {
    try {
      const regions = await axios.get(REGIONS, {
        signal: controller.signal,
      });
      // console.log("regions ", regions.data);
      setArrOfRegions(regions.data);
      return arrOfRegions;
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      setErrorToaster(error);
      return [];
    }
  };

  // Fetch roles
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
        () => myRef.current()
      );
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  };

  //prevent form submission on press of enter key
  const checkKeyDown = (e) => {
    if (e.code === "Enter") e.preventDefault();
  };

  const categoryChangeHandler = (e) => {
    setValue("cgfCategory", e.target.value);
    trigger("cgfCategory");
    setValue("cgfActivity", "");
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
    // let isMounted = true;
    const controller = new AbortController();
    arrOfRegions.length === 0 && getRegions(controller);
    arrOfCountryCode.length === 0 && getCountryCode(controller);
    roles.length === 0 && fetchRoles();

    return () => {
      // isMounted = false;
      controller.abort();
    };
  }, [watch]);
  // console.log("selected Region", watch("region"));
  return (
    <div className="page-wrapper">
      <Toaster
        myRef={myRef}
        titleMessage={toasterDetails.titleMessage}
        descriptionMessage={toasterDetails.descriptionMessage}
        messageType={toasterDetails.messageType}
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
              <div className="tertiary-btn-blk">
                <span className="addmore-icon">
                  <i className="fa fa-plus"></i>
                </span>
                <span
                  className="addmore-txt"
                  onClick={handleSubmit(onAddMoreButtonClickHandler)}
                >
                  Save & Add More
                </span>
              </div>
            </div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={(e) => checkKeyDown(e)}
          >
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
                                                Company Type{" "}
                                                <span className="mandatory">
                                                    *
                                                </span>
                                            </label>
                                            <div className="radio-btn-field">
                                                <Controller
                                                    name="companyType"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <RadioGroup
                                                            {...field}
                                                            aria-labelledby="demo-radio-buttons-group-label"
                                                            name="radio-buttons-group"
                                                            className="radio-btn"
                                                        >
                                                            <FormControlLabel
                                                                value="Internal"
                                                                control={
                                                                    <Radio />
                                                                }
                                                                label="Internal"
                                                            />
                                                            <FormControlLabel
                                                                value="External"
                                                                control={
                                                                    <Radio />
                                                                }
                                                                label="External"
                                                            />
                                                        </RadioGroup>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-form-field">
                                        <div className="form-group">
                                            <label htmlFor="parentCompany">
                                                Parent Company
                                            </label>
                                            <Controller
                                                name="parentCompany"
                                                control={control}
                                                render={({
                                                    field,
                                                    fieldState: { error },
                                                }) => (
                                                    <Autocomplete
                                                        disableClearable
                                                        // open={true}
                                                        // openOnFocus={true}
                                                        // noOptionsText={"No options"}
                                                        {...field}
                                                        PaperComponent={({
                                                            children,
                                                        }) => (
                                                            <Paper className={parentCompany?.length > 5 ? "autocomplete-option-txt autocomplete-option-limit" : "autocomplete-option-txt"}>
                                                                {children}
                                                            </Paper>
                                                        )}
                                                        className="searchable-input"
                                                        onBlur={(e) =>
                                                            setValue(
                                                                "parentCompany",
                                                                e.target.value?.trim()
                                                            )
                                                        }
                                                        onSubmit={() =>
                                                            setValue(
                                                                "parentCompany",
                                                                ""
                                                            )
                                                        }
                                                        onChange={(
                                                            event,
                                                            newValue
                                                        ) => {
                                                            console.log(
                                                                "new Value ",
                                                                newValue
                                                            );
                                                            if (newValue) {
                                                                typeof newValue ===
                                                                "object"
                                                                    ? setValue(
                                                                          "parentCompany",
                                                                          newValue.name
                                                                      )
                                                                    : setValue(
                                                                          "parentCompany",
                                                                          newValue
                                                                      );
                                                            }
                                                        }}
                                                        selectOnFocus
                                                        handleHomeEndKeys
                                                        id="free-solo-with-text-demo"
                                                        options={parentCompany}
                                                        // getOptionLabel={(option) => {

                                                        //   // Value selected with enter, right from the input
                                                        //   if (typeof option === "string") {
                                                        //     // console.log("option inside type string",option)
                                                        //     return option;
                                                        //   }
                                                        //   return option;
                                                        // }}
                                                        renderOption={(
                                                            props,
                                                            option
                                                        ) => (
                                                            <li
                                                                className="searchable-inputlist"
                                                                {...props}
                                                            >
                                                                {option}
                                                            </li>
                                                        )}
                                                        //   sx={{ width: 300 }}
                                                        freeSolo
                                                        renderInput={(
                                                            params
                                                        ) => (
                                                            <TextField
                                                                {...params}
                                                                onChange={(e) =>
                                                                    setValue(
                                                                        "parentCompany",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                onSubmit={() =>
                                                                    setValue(
                                                                        "parentCompany",
                                                                        ""
                                                                    )
                                                                }
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
                                                CGF Category{" "}
                                                <span className="mandatory">
                                                    *
                                                </span>
                                            </label>
                                            <Dropdown
                                                control={control}
                                                name="cgfCategory"
                                                placeholder="Select category"
                                                myHelper={memberHelper}
                                                rules={{ required: true }}
                                                myOnChange={
                                                    categoryChangeHandler
                                                }
                                                options={cgfCategories}
                                            />
                                        </div>
                                        {/* </div> */}
                                    </div>
                                    <div className="card-form-field">
                                        <div className="form-group">
                                            {/* <div className="select-field"> */}
                                            <label htmlFor="cgfActivity">
                                                CGF Activity{" "}
                                                {watch("cgfCategory") !==
                                                    "Other" && (
                                                    <span className="mandatory">
                                                        *
                                                    </span>
                                                )}
                                            </label>
                                            <Dropdown
                                                control={control}
                                                name="cgfActivity"
                                                placeholder="Select activity"
                                                myHelper={memberHelper}
                                                rules={{
                                                    validate: (value) => {
                                                        if (
                                                            !value &&
                                                            (watch(
                                                                "cgfCategory"
                                                            ) ===
                                                                "Manufacturer" ||
                                                                watch(
                                                                    "cgfCategory"
                                                                ) ===
                                                                    "Retailer")
                                                        )
                                                            return "Select activity";
                                                    },
                                                }}
                                                options={
                                                    watch("cgfCategory") ===
                                                    "Manufacturer"
                                                        ? cgfActivitiesManufacturer
                                                        : cgfActivitiesRetailer
                                                }
                                                isDisabled={
                                                    watch("cgfCategory") ===
                                                    "Other"
                                                }
                                            />
                                        </div>
                                        {/* </div> */}
                                    </div>
                                </div>
                            </div>
                            <div className="card-inner-wrap">
                                <h2 className="sub-heading1">Contact Detail</h2>
                                <div className="flex-between card-blk">
                                    <div className="card-form-field">
                                        <div className="form-group">
                                            <label htmlFor="corporateEmail">
                                                Corporate Email{" "}
                                                <span className="mandatory">
                                                    *
                                                </span>
                                            </label>
                                            <Input
                                                control={control}
                                                name="corporateEmail"
                                                onBlur={(e) =>
                                                    setValue(
                                                        "corporateEmail",
                                                        e.target.value?.trim()
                                                    )
                                                }
                                                placeholder="example@domain.com"
                                                myHelper={memberHelper}
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
                                                            // validate: () => {
                                                            //   if (watch("phoneNumber") && !watch("countryCode"))
                                                            //     return "Invalid Input";
                                                            // },
                                                        }}
                                                        render={({
                                                            field,
                                                            fieldState: {
                                                                error,
                                                            },
                                                        }) => (
                                                            <Autocomplete
                                                                popupIcon={
                                                                    <KeyboardArrowDownRoundedIcon />
                                                                }
                                                                {...field}
                                                                className={`${
                                                                    error &&
                                                                    "autocomplete-error"
                                                                }`}
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
                                                                PaperComponent={({
                                                                    children,
                                                                }) => (
                                                                    <Paper className={arrOfCountryCode?.length > 5 ? "autocomplete-option-txt autocomplete-option-limit" : "autocomplete-option-txt"}>
                                                                        {
                                                                            children
                                                                        }
                                                                    </Paper>
                                                                )}
                                                                options={
                                                                    arrOfCountryCode
                                                                }
                                                                autoHighlight
                                                                // placeholder="Select country code"
                                                                // getOptionLabel={(country) => country.name + " " + country}
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
                                                                        inputProps={{
                                                                            ...params.inputProps,
                                                                        }}
                                                                        // onChange={() => trigger("phoneNumber")}
                                                                        // onSubmit={() => setValue("countryCode", "")}
                                                                        placeholder={
                                                                            "+91"
                                                                        }
                                                                        helperText={
                                                                            error
                                                                                ? memberHelper
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
                                                    control={control}
                                                    name="phoneNumber"
                                                    placeholder="1234567890"
                                                    myHelper={memberHelper}
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
                                                            e.target.value.trim()
                                                        )
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
                                            <label htmlFor="websiteUrl">
                                                Website URL
                                            </label>
                                            <Input
                                                control={control}
                                                name="websiteUrl"
                                                placeholder="www.google.com"
                                                onBlur={(e) =>
                                                    setValue(
                                                        "websiteUrl",
                                                        e.target.value?.trim()
                                                    )
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
                            </div>
                            <div className="card-inner-wrap">
                                <h2 className="sub-heading1">
                                    Company Address Detail
                                </h2>
                                <div className="flex-between card-blk">
                                    <div className="card-form-field">
                                        <div className="form-group">
                                            <label htmlFor="region">
                                                Region{" "}
                                                <span className="mandatory">
                                                    *
                                                </span>
                                            </label>
                                            <Dropdown
                                                control={control}
                                                myOnChange={
                                                    onRegionChangeHandler
                                                }
                                                name="region"
                                                placeholder="Select region"
                                                myHelper={memberHelper}
                                                rules={{ required: true }}
                                                options={arrOfRegions}
                                            />
                                        </div>
                                    </div>
                                    <div className="card-form-field">
                                        <div className="form-group">
                                            <label htmlFor="country">
                                                Country{" "}
                                                <span className="mandatory">
                                                    *
                                                </span>
                                            </label>
                                            <Dropdown
                                                isDisabled={!watch("region")}
                                                control={control}
                                                name="country"
                                                myOnChange={
                                                    onCountryChangeHandler
                                                }
                                                placeholder="Select country"
                                                myHelper={memberHelper}
                                                rules={{ required: true }}
                                                options={arrOfCountryRegions}
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
                                                placeholder="Select state"
                                                myHelper={memberHelper}
                                                options={arrOfStateCountry}
                                            />
                                        </div>
                                    </div>
                                    <div className="card-form-field">
                                        <div className="form-group">
                                            <label htmlFor="city">City</label>
                                            <Controller
                                                name="city"
                                                control={control}
                                                render={({
                                                    field,
                                                    fieldState: { error },
                                                }) => (
                                                    <Autocomplete
                                                        className="searchable-input"
                                                        {...field}
                                                        PaperComponent={({
                                                            children,
                                                        }) => (
                                                            <Paper className={cityValue?.length > 5 ? "autocomplete-option-txt autocomplete-option-limit" : "autocomplete-option-txt"}>
                                                                {children}
                                                            </Paper>
                                                        )}
                                                        disabled={
                                                            !watch("state")
                                                        }
                                                        onSubmit={() =>
                                                            setValue("city", "")
                                                        }
                                                        onChange={(
                                                            event,
                                                            newValue
                                                        ) => {
                                                            console.log(
                                                                "new Value ",
                                                                newValue
                                                            );
                                                            if (newValue) {
                                                                typeof newValue ===
                                                                "object"
                                                                    ? setValue(
                                                                          "city",
                                                                          newValue.name
                                                                      )
                                                                    : setValue(
                                                                          "city",
                                                                          newValue
                                                                      );
                                                            }
                                                        }}
                                                        onBlur={(e) =>
                                                            setValue(
                                                                "city",
                                                                e.target.value?.trim()
                                                            )
                                                        }
                                                        selectOnFocus
                                                        handleHomeEndKeys
                                                        id="free-solo-with-text-demo"
                                                        options={cityValue}
                                                        // getOptionLabel={(option) => {
                                                        //   // Value selected with enter, right from the input
                                                        //   if (typeof option === "string") {
                                                        //     // console.log("option inside type string",option)
                                                        //     return option;
                                                        //   }
                                                        //   return option;
                                                        // }}
                                                        renderOption={(
                                                            props,
                                                            option
                                                        ) => (
                                                            <li {...props}>
                                                                {option}
                                                            </li>
                                                        )}
                                                        //   sx={{ width: 300 }}
                                                        freeSolo
                                                        renderInput={(
                                                            params
                                                        ) => (
                                                            <TextField
                                                                {...params}
                                                                onChange={(e) =>
                                                                    setValue(
                                                                        "city",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                onSubmit={() =>
                                                                    setValue(
                                                                        "city",
                                                                        ""
                                                                    )
                                                                }
                                                                placeholder="Enter city"
                                                            />
                                                        )}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="card-form-field">
                                        <div className="form-group">
                                            <label htmlFor="address">
                                                Address
                                            </label>
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
                                                                ? memberHelper
                                                                      .address[
                                                                      error.type
                                                                  ]
                                                                : " "
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
                            <div className="card-inner-wrap">
                                <h2 className="sub-heading1">
                                    CGF Office Detail
                                </h2>
                                <div className="flex-between card-blk">
                                    <div className="card-form-field">
                                        <div className="form-group">
                                            <label htmlFor="cgfOfficeRegion">
                                                Region{" "}
                                                <span className="mandatory">
                                                    *
                                                </span>
                                            </label>
                                            <Dropdown
                                                control={control}
                                                name="cgfOfficeRegion"
                                                myOnChange={
                                                    cgfOfficeRegionChangeHandler
                                                }
                                                placeholder="Select region"
                                                myHelper={memberHelper}
                                                rules={{ required: true }}
                                                options={arrOfRegions}
                                            />
                                        </div>
                                    </div>
                                    <div className="card-form-field">
                                        <div className="form-group">
                                            <label htmlFor="cgfOfficeCountry">
                                                Country{" "}
                                                <span className="mandatory">
                                                    *
                                                </span>
                                            </label>
                                            <Dropdown
                                                isDisabled={
                                                    !watch("cgfOfficeRegion")
                                                }
                                                control={control}
                                                name="cgfOfficeCountry"
                                                placeholder="Select country"
                                                myHelper={memberHelper}
                                                rules={{ required: true }}
                                                options={
                                                    arrOfCgfOfficeCountryRegions
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="card-form-field">
                                        <div className="form-group">
                                            <label htmlFor="cgfOffice">
                                                Office{" "}
                                                <span className="mandatory">
                                                    *
                                                </span>
                                            </label>
                                            <Dropdown
                                                control={control}
                                                name="cgfOffice"
                                                placeholder="Select office"
                                                myHelper={memberHelper}
                                                rules={{ required: true }}
                                                options={[
                                                    "Bogota",
                                                    "Paris",
                                                    "Shanghai",
                                                    "Washington",
                                                    "Tokyo",
                                                ]}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-inner-wrap">
                                <h2 className="sub-heading1">
                                    Member Contact Detail
                                </h2>
                                <div className="flex-between card-blk">
                                    <div className="card-form-field">
                                        <div className="form-group">
                                            <div className="salutation-wrap">
                                                <div className="salutation-blk">
                                                    <label htmlFor="memberContactSalutation">
                                                        Salutation{" "}
                                                        <span className="mandatory">
                                                            *
                                                        </span>
                                                    </label>
                                                    <Dropdown
                                                        control={control}
                                                        name="memberContactSalutation"
                                                        // placeholder="Mr."
                                                        myHelper={memberHelper}
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
                                                    <label htmlFor="memberContactFullName">
                                                        Full Name{" "}
                                                        <span className="mandatory">
                                                            *
                                                        </span>
                                                    </label>
                                                    <Input
                                                        control={control}
                                                        myHelper={memberHelper}
                                                        rules={{
                                                            required: true,
                                                            maxLength: 50,
                                                            minLength: 3,
                                                            pattern:
                                                                /^[A-Za-z]+[A-Za-z ]*$/,
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
                                            <label htmlFor="title">Title</label>
                                            <Input
                                                control={control}
                                                myHelper={memberHelper}
                                                rules={{
                                                    maxLength: 50,
                                                    minLength: 3,
                                                }}
                                                name="title"
                                                onBlur={(e) =>
                                                    setValue(
                                                        "title",
                                                        e.target.value?.trim()
                                                    )
                                                }
                                                placeholder="Enter title"
                                            />
                                        </div>
                                    </div>
                                    <div className="card-form-field">
                                        <div className="form-group">
                                            <label htmlFor="department">
                                                Department
                                            </label>
                                            <Input
                                                control={control}
                                                myHelper={memberHelper}
                                                rules={{
                                                    maxLength: 50,
                                                    minLength: 3,
                                                }}
                                                name="department"
                                                onBlur={(e) =>
                                                    setValue(
                                                        "department",
                                                        e.target.value?.trim()
                                                    )
                                                }
                                                placeholder="Enter department"
                                            />
                                        </div>
                                    </div>
                                    <div className="card-form-field">
                                        <div className="form-group">
                                            <label htmlFor="memberContactEmail">
                                                Email{" "}
                                                <span className="mandatory">
                                                    *
                                                </span>
                                            </label>
                                            <Input
                                                control={control}
                                                myHelper={memberHelper}
                                                rules={{
                                                    required: true,
                                                    maxLength: 50,
                                                    minLength: 3,
                                                    pattern:
                                                        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
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
                                                        control={control}
                                                        name="memberContactCountryCode"
                                                        rules={{
                                                            validate: () => {
                                                                if (
                                                                    !watch(
                                                                        "memberContactCountryCode"
                                                                    ) &&
                                                                    watch(
                                                                        "memberContactPhoneNuber"
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
                                                                popupIcon={
                                                                    <KeyboardArrowDownRoundedIcon />
                                                                }
                                                                className={`${
                                                                    error &&
                                                                    "autocomplete-error"
                                                                }`}
                                                                PaperComponent={({
                                                                    children,
                                                                }) => (
                                                                    <Paper className={arrOfCountryCode?.length > 5 ? "autocomplete-option-txt autocomplete-option-limit" : "autocomplete-option-txt"}>
                                                                        {
                                                                            children
                                                                        }
                                                                    </Paper>
                                                                )}
                                                                {...field}
                                                                onChange={(
                                                                    event,
                                                                    newValue
                                                                ) => {
                                                                    newValue &&
                                                                    typeof newValue ===
                                                                        "object"
                                                                        ? setValue(
                                                                              "memberContactCountryCode",
                                                                              newValue.name
                                                                          )
                                                                        : setValue(
                                                                              "memberContactCountryCode",
                                                                              newValue
                                                                          );
                                                                    trigger(
                                                                        "memberContactCountryCode"
                                                                    );
                                                                    trigger(
                                                                        "memberContactPhoneNuber"
                                                                    );
                                                                }}
                                                                // sx={{ width: 200 }}
                                                                options={
                                                                    arrOfCountryCode
                                                                }
                                                                autoHighlight
                                                                placeholder="+91"
                                                                // getOptionLabel={(country) => country.name + " " + country}
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
                                                                        {...params}
                                                                        inputProps={{
                                                                            ...params.inputProps,
                                                                        }}
                                                                        // onChange={() =>{trigger("memberContactCountryCode")}}
                                                                        // onSubmit={() =>
                                                                        //   setValue("memberContactCountryCode", "")
                                                                        // }
                                                                        placeholder={
                                                                            "+91"
                                                                        }
                                                                        helperText={
                                                                            error
                                                                                ? memberHelper
                                                                                      .memberContactCountryCode[
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
                                                    control={control}
                                                    name="memberContactPhoneNuber"
                                                    myOnChange={(e) =>
                                                        phoneNumberChangeHandler(
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
                                                        maxLength: 15,
                                                        minLength: 3,
                                                        validate: (value) => {
                                                            if (
                                                                !watch(
                                                                    "memberContactPhoneNuber"
                                                                ) &&
                                                                watch(
                                                                    "memberContactCountryCode"
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
                                                    placeholder="1234567890"
                                                />
                                            </div>
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
                  onClick={onClickCancelHandler}
                  className="secondary-button mr-10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  //   onClick={}
                  className="primary-button add-button"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default AddMember;
