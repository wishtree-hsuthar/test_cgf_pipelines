import {
  Autocomplete,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  COUNTRIES,
  MEMBER,
  REGIONCOUNTRIES,
  REGIONS,
  STATES,
} from "../../api/Url";
import Dropdown from "../../components/Dropdown";
import Input from "../../components/Input";
import Toaster from "../../components/Toaster";
import useCallbackState from "../../utils/useCallBackState";

//CGF Categories (Ideally get from backend)
const cgfCategories = ["Manufacturer", "Retailer", "Other"];
const cgfActivitiesManufacturer = [
  "None",
  "Apparel",
  "Food Manufacturer",
  "Personal care & beauty",
];
const cgfActivitiesRetailer = [
  "Department Store",
  "Ecommerce",
  "Food/Non food retailer",
  "food retailer",
  "food service",
  "Grocery",
  "Health/beaty drugstore",
  "Non food retailer",
  "Wholesaler",
];
const myHelper = {
  memberCompany: {
    maxLength: "Max char limit exceed",
    minLength: "Input must contain atleast 3 characters",
    required: "Enter member company",
  },
  cgfActivity: {
    required: "Select Activity",
  },
  corporateEmail: {
    required: "Enter Email",
    maxLength: "Max char limit exceed",
    minLength: "Input must contain atleast 3 characters",
    pattern: "Invalid Input",
  },
  countryCode: {
    validate: "Invalid input",
  },
  phoneNumber: {
    maxLength: "Max char limit exceed",
    minLength: "Input must contain atleast 3 characters",
    pattern: "Invalid Input",
    validate: "Invalid Input",
  },
  websiteUrl: {
    maxLength: "Max char limit exceed",
    minLength: "Input must contain atleast 3 characters",
    pattern: "Invalid Input",
  },
  region: {
    required: "Select region",
  },
  country: {
    required: "Select country",
  },
  state: {
    required: "Select state",
  },
  city: {
    maxLength: "Max char limit exceed",
    minLength: "Input must contain atleast 3 charcters",
  },
  address: {
    required: "Enter the address",
    maxLength: "Max char limit exceed",
    minLength: "Input must contain atleast 3 characters",
  },
  memberContactSalutation: {
    required: "Select the Salutation",
  },
  memberContactFullName: {
    required: "Enter the name",
    minLength: "Input must contain atleast 3 charcters",
    maxLength: "Max char limit exceed",
    pattern: "Invalid Input",
  },
  title: {
    minLength: "Input must contain atleast 3 charcters",
    maxLength: "Max char limit exceed",
    pattern: "Invalid Input",
  },
  department: {
    minLength: "Input must contain atleast 3 charcters",
    maxLength: "Max char limit exceed",
    pattern: "Invalid Input",
  },
  memberContactCountryCode: {},
  memberContactPhoneNuber: {
    maxLength: "Max char limit exceed",
    minLength: "Input must contain atleast 3 characters",
    pattern: "Invalid Input",
    validate: "Invalid Input",
  },
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
  status: "active",
};
const EditMember = () => {
  const params = useParams();
  const navigate = useNavigate();
  // Refr for Toaster
  const myRef = React.useRef();
  //Toaster Message setter
  const [toasterDetails, setToasterDetails] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "success",
  });
  //to hold all regions
  const [arrOfRegions, setArrOfRegions] = useState([]);
  //to hold array of countries for perticular region for Company Adress
  const [arrOfCountryRegions, setArrOfCountryRegions] = useState([]);
  //to hold array of Country states
  const [arrOfStateCountry, setArrOfStateCountry] = useState([]);
  //to hold array of countries for perticular region for CGF Office details
  const [arrOfCgfOfficeCountryRegions, setArrOfCgfOfficeCountryRegions] =
    useState([]);
  const [arrOfCountryCode, setArrOfCountryCode] = useState([]);
  const [member, setMember] = useState({});
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
        phoneNumber: parseInt(data.phoneNumber),
        website: data.websiteUrl,
        state: data.state,
        city: data.state,
        companyName: data.memberCompany,
        companyType: data.companyType,
        cgfCategory: data.cgfCategory,
        cgfActivity: data.cgfActivity,
        corporateEmail: data.corporateEmail,
        region: data.region,
        country: data.country,
        address: data.address,
        cgfOfficeRegion: data.cgfOfficeRegion,
        cgfOfficeCountry: data.cgfOfficeCountry,
        cgfOffice: data.cgfOffice,
        memberRepresentativeId: {
          id: member?.memberRepresentativeId?._id,
          title: data.title,
          department: data.department,
          salutation: data.memberContactSalutation,
          name: data.memberContactFullName,
          email: data.memberContactEmail,
          countryCode: data.memberContactCountryCode,
          phoneNumber: parseInt(data.memberContactPhoneNuber),
          isActive: data.status === "active" ? true : false,
        },
      };

      console.log("Member Representative Id", member.createdBy);

      const response = await axios.put(MEMBER + `/${params.id}`, {
        ...backendObject,
      });
      // console.log("response : ", response);
      setToasterDetails(
        {
          titleMessage: "Success!",
          descriptionMessage: "Member updated successfully!",
          messageType: "success",
        },
        () => myRef.current()
      );
      // console.log("Default values: ", defaultValues);
      reset({ defaultValues });
    } catch (error) {
      setToasterDetails(
        {
          titleMessage: "Error",
          descriptionMessage:
            error?.response?.data?.message &&
            typeof error.response.data.message === "string"
              ? error.response.data.message
              : "Something Went Wrong!",
          messageType: "error",
        },
        () => myRef.current()
      );
    }
  };
  // On Click cancel handler
  const onClickCancelHandler = () => {
    reset({ defaultValues });
    navigate("/members");
  };
  const onSubmit = (data) => {
    console.log("data", data);
    onSubmitFunctionCall(data);
    setTimeout(() => navigate("/members"), 3000);
  };
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
    // console.log("Inside Country Change ", e.target.value);
    setValue("country", e.target.value);
    setValue("state", "");
    trigger("country");
    try {
      const stateCountries = await axios.get(STATES + `/${watch("country")}`);
      setArrOfStateCountry(stateCountries.data);
    } catch (error) {
      console.log("error");
    }
  };

  //method to set region and update other fields accordingly
  const onRegionChangeHandler = async (e) => {
    // console.log("region: ", e.target.value);
    setValue("country", "");
    setValue("state", "");
    setValue("city", "");
    setValue("region", e.target.value);
    trigger("region");
    const countriesOnRegion = await getCountries(watch("region"));
    // console.log("countries", countriesOnRegion);
    const arrOfCountryRegionsTemp = formatRegionCountries(
      countriesOnRegion.data
    );
    setArrOfCountryRegions([...arrOfCountryRegionsTemp]);
  };

  const categoryChangeHandler = (e) => {
    setValue("cgfCategory", e.target.value);
    setValue("cgfActivity", "");
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
      setToasterDetails(
        {
          titleMessage: "Error",
          descriptionMessage:
            error?.response?.data?.message &&
            typeof error.response.data.message === "string"
              ? error.response.data.message
              : "Something Went Wrong!",
          messageType: "error",
        },
        () => myRef.current()
      );
    }
  };
  const getCountries = async (region) => {
    try {
      const regionCountries = await axios.get(REGIONCOUNTRIES + `/${region}`);
      return regionCountries;
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      setToasterDetails(
        {
          titleMessage: "Error",
          descriptionMessage:
            error?.response?.data?.message &&
            typeof error.response.data.message === "string"
              ? error.response.data.message
              : "Something Went Wrong!",
          messageType: "error",
        },
        () => myRef.current()
      );
      return [];
    }
  };
  const getRegions = async (controller) => {
    try {
      const regions = await axios.get(REGIONS, { signal: controller.signal });
      // console.log("regions ", regions.data);
      setArrOfRegions(regions.data);
      const countriesOnRegion1 = await getCountries(watch("region"));
      // console.log("countries", countriesOnRegion1);
      const arrOfCountryRegionsTemp1 = formatRegionCountries(
        countriesOnRegion1.data
      );
      setArrOfCountryRegions([...arrOfCountryRegionsTemp1]);
      const countriesOnRegion2 = await getCountries(watch("cgfOfficeRegion"));
      console.log("countriesOnRegion2", countriesOnRegion2);
      const arrOfCgfOfficeCountryRegionsTemp1 = await formatRegionCountries(
        countriesOnRegion2.data
      );
      setArrOfCgfOfficeCountryRegions([...arrOfCgfOfficeCountryRegionsTemp1]);
      const stateCountries = await axios.get(STATES + `/${watch("country")}`);
      console.log("stateCountries",stateCountries,"country",watch("country"))
      setArrOfStateCountry(stateCountries.data);

      // getCountries()
      return arrOfRegions;
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      setToasterDetails(
        {
          titleMessage: "Error",
          descriptionMessage:
            error?.response?.data?.message &&
            typeof error.response.data.message === "string"
              ? error.response.data.message
              : "Something Went Wrong!",
          messageType: "error",
        },
        () => myRef.current()
      );
      return [];
    }
  };
  const getCgfOfficeCountryRegion = async () => {
    console.log("Inside office change function: ", watch("cgfOfficeRegion"));
    const countriesOnRegion = await getCountries(watch("cgfOfficeRegion"));
    console.log("countries region", countriesOnRegion);
    const arrOfCgfOfficeCountryRegionsTemp = formatRegionCountries(
      countriesOnRegion.data
    );
    setArrOfCgfOfficeCountryRegions([...arrOfCgfOfficeCountryRegionsTemp]);
  };
  const getMemberByID = async () => {
    const response = await axios.get(MEMBER + `/${params.id}`);
    // console.log("response for member: ", response);
    const data = response.data;
    reset({
      memberCompany: data?.companyName,
      companyType: data?.companyType,
      parentCompany: data?.parentCompany,
      cgfCategory: data?.cgfCategory,
      cgfActivity: data?.cgfActivity,
      corporateEmail: data?.corporateEmail,
      countryCode: data?.countryCode,
      phoneNumber: data?.phoneNumber.toString(),
      websiteUrl: data?.website,
      region: data?.region,
      country: data?.country,
      state: data?.state,
      city: data?.city,
      address: data?.address,
      cgfOfficeRegion: data?.cgfOfficeRegion,
      cgfOfficeCountry: data?.cgfOfficeCountry,
      cgfOffice: data?.cgfOffice,
      memberContactSalutation: "Mr.",
      memberContactFullName: data?.memberRepresentativeId?.name,
      title: data?.memberRepresentativeId?.title,
      department: data?.memberRepresentativeId?.department,
      memberContactCountryCode: data?.memberRepresentativeId?.countryCode,
      memberContactEmail: data?.memberRepresentativeId?.email,
      memberContactPhoneNuber:
        data?.memberRepresentativeId?.phoneNumber?.toString(),
      status: data?.memberRepresentativeId?.isActive ? "active" : "inactive",
    });
    setMember(response.data);
  };
  //prevent form submission on press of enter key
  const checkKeyDown = (e) => {
    if (e.code === "Enter") e.preventDefault();
  };
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    arrOfRegions.length === 0 && getRegions(controller);
    arrOfCountryCode.length === 0 && getCountryCode(controller);
    isMounted && getMemberByID();
    // console.log("member",member)

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [watch]);
  console.log("member: ", member);
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
              <Link to="/members">Members</Link>
            </li>
            <li>
              <Link to={`/members/view-member/${params.id}`}>View Member</Link>
            </li>
            <li>Edit Member</li>
          </ul>
        </div>
      </div>
      <section>
        <div className="container">
          <div className="form-header flex-between">
            <h2 className="heading2">Edit Member</h2>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={(e) => checkKeyDown(e)}
          >
            <div className="card-wrapper">
              <div className="card-inner-wrap">
                <h2 className="sub-heading1">Company Details</h2>
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
                        myHelper={myHelper}
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
                            <RadioGroup
                              {...field}
                              aria-labelledby="demo-radio-buttons-group-label"
                              name="radio-buttons-group"
                              className="radio-btn"
                            >
                              <FormControlLabel
                                disabled
                                value="Internal"
                                control={<Radio />}
                                label="Internal"
                              />
                              <FormControlLabel
                                disabled
                                value="External"
                                control={<Radio />}
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
                      <label htmlFor="parentCompany">Parent Company</label>
                      <Controller
                        name="parentCompany"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <Autocomplete
                            disabled
                            className="searchable-input"
                            {...field}
                            onSubmit={() => setValue("parentCompany", "")}
                            onChange={(event, newValue) => {
                              console.log("new Value ", newValue);
                              if (newValue) {
                                typeof newValue === "object"
                                  ? setValue("parentCompany", newValue.name)
                                  : setValue("parentCompany", newValue);
                              }
                            }}
                            selectOnFocus
                            handleHomeEndKeys
                            id="free-solo-with-text-demo"
                            options={[
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
                            ]}
                            getOptionLabel={(option) => {
                              // Value selected with enter, right from the input
                              if (typeof option === "string") {
                                // console.log("option inside type string",option)
                                return option;
                              }
                              return option;
                            }}
                            renderOption={(props, option) => (
                              <li {...props}>{option}</li>
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
                                placeholder="NA"
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
                        myOnChange={categoryChangeHandler}
                        options={cgfCategories}
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
                        myHelper={myHelper}
                        rules={{ required: true }}
                        options={
                          watch("cgfCategory") === "Manufacturer"
                            ? cgfActivitiesManufacturer
                            : cgfActivitiesRetailer
                        }
                        isDisabled={watch("cgfCategory") === "Other"}
                      />
                    </div>
                    {/* </div> */}
                  </div>
                </div>
              </div>
              <div className="card-inner-wrap">
                <h2 className="sub-heading1">Contact Details</h2>
                <div className="flex-between card-blk">
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="corporateEmail">
                        Corporate Email <span className="mandatory">*</span>
                      </label>
                      <Input
                        control={control}
                        name="corporateEmail"
                        placeholder="Enter email"
                        myHelper={myHelper}
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
                      <label htmlFor="phoneNumber">Phone Number</label>
                      <div className="phone-number-field">
                        <div className="select-field country-code">
                          <Controller
                            control={control}
                            name="countryCode"
                            // rules={{
                            //   validate: () => {
                            //     if (watch("phoneNumber") && !watch("countryCode"))
                            //       return "Invalid Input";
                            //   },
                            // }}
                            render={({ field, fieldState: { error } }) => (
                              <Autocomplete
                                {...field}
                                onChange={(event, newValue) => {
                                  console.log("inside autocomplete onchange");
                                  console.log("new Value ", newValue);
                                  newValue && typeof newValue === "object"
                                    ? setValue("countryCode", newValue.name)
                                    : setValue("countryCode", newValue);
                                  trigger("phoneNumber");
                                }}
                                // sx={{ width: 200 }}
                                options={arrOfCountryCode}
                                autoHighlight
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
                                    onChange={() => trigger("phoneNumber")}
                                    // onSubmit={() => setValue("countryCode", "")}
                                    placeholder={"Select country code"}
                                    helperText={
                                      error
                                        ? myHelper.countryCode["validate"]
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
                          placeholder="Enter phone number"
                          myHelper={myHelper}
                          rules={{
                            maxLength: 15,
                            minLength: 3,
                            validate: (value) => {
                              if (watch("phoneNumber") && !watch("countryCode"))
                                return "Invalid input";
                              else if (value && !Number(value))
                                return "Invalid Input";
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
                        placeholder="NA"
                        myHelper={myHelper}
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
                <h2 className="sub-heading1">Company Address Details</h2>
                <div className="flex-between card-blk">
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="region">
                        Region <span className="mandatory">*</span>
                      </label>
                      <Dropdown
                        control={control}
                        myOnChange={onRegionChangeHandler}
                        name="region"
                        placeholder="Select region"
                        myHelper={myHelper}
                        rules={{ required: true }}
                        options={arrOfRegions ? arrOfRegions : []}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="country">
                        Conuntry <span className="mandatory">*</span>
                      </label>
                      <Dropdown
                        isDisabled={!watch("region")}
                        control={control}
                        name="country"
                        myOnChange={onCountryChangeHandler}
                        placeholder="Select country"
                        myHelper={myHelper}
                        rules={{ required: true }}
                        options={arrOfCountryRegions ? arrOfCountryRegions : []}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="state">
                        State <span className="mandatory">*</span>
                      </label>
                      <Dropdown
                        isDisabled={!watch("country")}
                        control={control}
                        name="state"
                        placeholder="Enter state"
                        myHelper={myHelper}
                        rules={{ required: true }}
                        options={arrOfStateCountry ? arrOfStateCountry : []}
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
                            {...field}
                            className="searchable-input"
                            disabled={!watch("state")}
                            onSubmit={() => setValue("city", "")}
                            onChange={(event, newValue) => {
                              console.log("new Value ", newValue);
                              if (newValue) {
                                typeof newValue === "object"
                                  ? setValue("city", newValue.name)
                                  : setValue("city", newValue);
                              }
                            }}
                            selectOnFocus
                            handleHomeEndKeys
                            id="free-solo-with-text-demo"
                            options={[
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
                            ]}
                            getOptionLabel={(option) => {
                              // Value selected with enter, right from the input
                              if (typeof option === "string") {
                                // console.log("option inside type string",option)
                                return option;
                              }
                              return option;
                            }}
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
                                onSubmit={() => setValue("city", "")}
                                placeholder="NA"
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
                        Address <span className="mandatory">*</span>
                      </label>
                      <Controller
                        name="address"
                        control={control}
                        rules={{
                          required: true,
                          minLength: 3,
                          maxLength: 250,
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            multiline
                            {...field}
                            inputProps={{
                              maxLength: 250,
                            }}
                            className={`input-textarea ${
                              error && "input-textarea-error"
                            }`}
                            id="outlined-basic"
                            placeholder="Enter address"
                            helperText={
                              error ? myHelper.address[error.type] : " "
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
                <h2 className="sub-heading1">CGF Office Details</h2>
                <div className="flex-between card-blk">
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="cgfOfficeRegion">
                        Region <span className="mandatory">*</span>
                      </label>
                      <Dropdown
                        isDisabled
                        control={control}
                        name="cgfOfficeRegion"
                        // myOnChange={cgfOfficeRegionChangeHandler}
                        placeholder="Select Region"
                        myHelper={myHelper}
                        rules={{ required: true }}
                        options={arrOfRegions ? arrOfRegions : []}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="cgfOfficeCountry">
                        Country <span className="mandatory">*</span>
                      </label>
                      <Dropdown
                        isDisabled
                        control={control}
                        name="cgfOfficeCountry"
                        placeholder="Select country"
                        myHelper={myHelper}
                        rules={{ required: true }}
                        options={arrOfCgfOfficeCountryRegions ? arrOfCgfOfficeCountryRegions : []}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="cgfOffice">
                        Office <span className="mandatory">*</span>
                      </label>
                      <Dropdown
                        isDisabled
                        control={control}
                        name="cgfOffice"
                        placeholder="Select office"
                        myHelper={myHelper}
                        rules={{ required: true }}
                        options={["Mumbai", "Delhi", "Vadodara"]}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-inner-wrap">
                <h2 className="sub-heading1">Member Contact Details</h2>
                <div className="flex-between card-blk">
                  <div className="card-form-field">
                    <div className="form-group">
                      <div className="salutation-wrap">
                        <div className="salutation-blk">
                          <label htmlFor="memberContactSalutation">
                            Salutation <span className="mandatory">*</span>
                          </label>
                          <Dropdown
                            control={control}
                            name="memberContactSalutation"
                            placeholder="Mr."
                            myHelper={myHelper}
                            rules={{ required: true }}
                            options={["Mr.", "Mrs.", "Ms."]}
                          />
                        </div>
                        <div className="salutation-inputblk">
                          <label htmlFor="memberContactFullName">
                            Full Name <span className="mandatory">*</span>
                          </label>
                          <Input
                            control={control}
                            myHelper={myHelper}
                            rules={{
                              required: true,
                              maxLength: 50,
                              minLength: 3,
                              pattern: /^[A-Za-z]+[A-Za-z ]*$/,
                            }}
                            name="memberContactFullName"
                            placeholder="NA"
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
                        myHelper={myHelper}
                        rules={{ maxLength: 50, minLength: 3 }}
                        name="title"
                        placeholder="NA"
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="department">Department</label>
                      <Input
                        control={control}
                        myHelper={myHelper}
                        rules={{ maxLength: 50, minLength: 3 }}
                        name="department"
                        placeholder="NA"
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="memberContactEmail">
                        Email <span className="mandatory">*</span>
                      </label>
                      <Input
                        isDisabled
                        control={control}
                        myHelper={myHelper}
                        rules={{
                          required: true,
                          maxLength: 50,
                          minLength: 3,
                          pattern:
                            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                        }}
                        name="memberContactEmail"
                        placeholder="NA"
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
                            render={({ field }) => (
                              <Autocomplete
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
                                  trigger("memberContactPhoneNuber");
                                }}
                                // sx={{ width: 200 }}
                                options={arrOfCountryCode}
                                autoHighlight
                                placeholder="Select country code"
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
                                    onChange={() =>
                                      trigger("memberContactPhoneNuber")
                                    }
                                    // onSubmit={() =>
                                    //   setValue("memberContactCountryCode", "")
                                    // }
                                    placeholder={"NA"}
                                  />
                                )}
                              />
                            )}
                          />
                        </div>
                        <Input
                          control={control}
                          name="memberContactPhoneNuber"
                          myHelper={myHelper}
                          rules={{
                            maxLength: 15,
                            minLength: 3,
                            validate: (value) => {
                              if (
                                watch("memberContactPhoneNuber") &&
                                !watch("memberContactCountryCode")
                              )
                                return "Invalid Input";
                              else if (value && !Number(value))
                                return "Invalid input";
                            },
                          }}
                          placeholder="NA"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="status">
                        Status <span className="mandatory">*</span>
                      </label>
                      <div className="radio-btn-field">
                        <Controller
                          name="status"
                          control={control}
                          render={({ field }) => (
                            <RadioGroup
                              {...field}
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
                            </RadioGroup>
                          )}
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
                  Edit
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default EditMember;
