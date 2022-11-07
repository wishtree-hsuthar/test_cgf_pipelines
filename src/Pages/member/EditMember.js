import {
  Autocomplete,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import axios from "axios";
import Loader2 from "../../assets/Loader/Loader2.svg";
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
import { memberHelper } from "../../utils/helpertext";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

//CGF Categories (Ideally get from backend)
const cgfCategories1 = ["Manufacturer", "Retailer", "Other"];
const cgfActivitiesManufacturer1 = [
  "None",
  "Apparel",
  "Food Manufacturer",
  "Non-food manufacturer",
  "Household care",
  "Personal care & beauty",
];
const cgfActivitiesRetailer1 = [
  "Department Store",
  "Ecommerce",
  "Food/Non food retailer",
  "food retailer",
  "food service",
  "Grocery",
  "Health/beauty drugstore",
  "Non food retailer",
  "Wholesaler",
];

const EditMember = () => {
  const defaultValues1 = {
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

  const param = useParams();
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
  const setErrorToaster1 = (error) => {
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
  //to hold all regions
  const [arrOfRegions, setArrOfRegions] = useState([]);
  //to hold array of countries for perticular region for Company Adress
  const [arrOfCountryRegions, setArrOfCountryRegions] = useState([]);
  //to hold array of Country states
  const [arrOfStateCountry, setArrOfStateCountry] = useState([]);
  //to hold array of countries for perticular region for CGF Office details
  const [arrOfCgfOfficeCountryRegions, setArrOfCgfOfficeCountryRegions] =
    useState([]);
  // state to manage loader
  const [isLoading, setIsLoading] = useState(false);
  const [arrOfCountryCode, setArrOfCountryCode] = useState([]);
  const [member, setMember] = useState({});
  const { control, reset, setValue, watch, trigger, handleSubmit } = useForm({
    reValidateMode: "onChange",
    defaultValues: defaultValues1,
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
        memberRepresentative: {
          id: member?.memberRepresentativeId[0]?._id,
          title: data.title,
          department: data.department,
          salutation: data.memberContactSalutation,
          name: data.memberContactFullName,
          email: data.memberContactEmail,
          countryCode: data.memberContactCountryCode,
          phoneNumber: parseInt(data?.memberContactPhoneNuber ?? 0),
          isActive: data.status === "active" ? true : false,
        },
      };

      console.log("Member Representative Id", member.createdBy);
      await axios.put(MEMBER + `/${param.id}`, {
        ...backendObject,
      });
      reset(defaultValues1);
      // console.log("response : ", response);
      setToasterDetails(
        {
          titleMessage: "Success!",
          descriptionMessage: "Member updated successfully!",
          messageType: "success",
        },
        () => myRef.current()
      );
      console.log("Default values: ", defaultValues1);
    } catch (error) {
      setErrorToaster1(error);
    }
  };
  // On Click cancel handler
  const onClickCancelHandler = () => {
    reset({ defaultValues1 });
    navigate("/users/members");
  };
  const onSubmit = (data) => {
    console.log("data", data);
    onSubmitFunctionCall(data);
    setTimeout(() => navigate("/users/members"), 3000);
  };
  const formatRegionCountries1 = (regionCountries) => {
    regionCountries &&
      regionCountries.forEach(
        (country, id) =>
          (regionCountries[id] = country.hasOwnProperty("_id")
            ? country?.name
            : country)
      );
    console.log("arr of country ", regionCountries);
    return regionCountries;
  };

  //method to handle country change
  const onCountryChangeHandler1 = async (e) => {
    // console.log("Inside Country Change ", e.target.value);
    setValue("country", e.target.value);
    setValue("state", "");
    trigger("country");
    try {
      if (watch("country")) {
        const stateCountries = await axios.get(STATES + `/${watch("country")}`);
        setArrOfStateCountry(stateCountries.data);
      }
    } catch (error) {
      console.log("error");
    }
  };

  //method to set region and update other fields accordingly
  const onRegionChangeHandler1 = async (e) => {
    // console.log("region: ", e.target.value);
    setValue("country", "");
    setValue("state", "");
    setValue("city", "");
    setValue("region", e.target.value);
    trigger("region");
    const countriesOnRegion = await getCountries1(watch("region"));
    // console.log("countries", countriesOnRegion);
    const arrOfCountryRegionsTemp = formatRegionCountries1(
      countriesOnRegion?.data
    );
    arrOfCountryRegionsTemp &&
      setArrOfCountryRegions([...arrOfCountryRegionsTemp]);
  };

  const categoryChangeHandler1 = (e) => {
    setValue("cgfCategory", e.target.value);
    trigger("cgfCategory");
    setValue("cgfActivity", "");
  };
  const getCountryCode1 = async (controller) => {
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
      setErrorToaster1(error);
    }
  };
  const getCountries1 = async (region) => {
    try {
      if (region) {
        return await axios.get(REGIONCOUNTRIES + `/${region}`);
      }
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      setErrorToaster1(error);
      return [];
    }
  };
  const getRegions1 = async (controller) => {
    try {
      const regions = await axios.get(REGIONS, {
        signal: controller.signal,
      });
      // console.log("regions ", regions.data);
      setArrOfRegions(regions?.data);
      const countriesOnRegion1 = await getCountries1(watch("region"));
      // console.log("countries", countriesOnRegion1);
      const arrOfCountryRegionsTemp1 = formatRegionCountries1(
        countriesOnRegion1.data
      );
      setArrOfCountryRegions([...arrOfCountryRegionsTemp1]);
      const countriesOnRegion2 = await getCountries1(watch("cgfOfficeRegion"));
      console.log("countriesOnRegion2", countriesOnRegion2);
      const arrOfCgfOfficeCountryRegionsTemp1 = await formatRegionCountries1(
        countriesOnRegion2.data
      );
      setArrOfCgfOfficeCountryRegions([...arrOfCgfOfficeCountryRegionsTemp1]);
      const stateCountries = await axios.get(STATES + `/${watch("country")}`);
      console.log(
        "stateCountries",
        stateCountries,
        "country",
        watch("country")
      );
      setArrOfStateCountry(stateCountries.data);

      // getCountries1()
      return arrOfRegions;
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      setErrorToaster1(error);
      return [];
    }
  };
  // const getCgfOfficeCountryRegion = async () => {
  //   console.log("Inside office change function: ", watch("cgfOfficeRegion"));
  //   const countriesOnRegion = await getCountries1(watch("cgfOfficeRegion"));
  //   console.log("countries region", countriesOnRegion);
  //   const arrOfCgfOfficeCountryRegionsTemp = formatRegionCountries1(
  //     countriesOnRegion.data
  //   );
  //   setArrOfCgfOfficeCountryRegions([...arrOfCgfOfficeCountryRegionsTemp]);
  // };
  const getMemberByID1 = async (isMounted) => {
    try {
      setIsLoading(true);
      const response = await axios.get(MEMBER + `/${param.id}`);
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
        phoneNumber: data?.phoneNumber?.toString(),
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
        memberContactFullName: data?.memberRepresentativeId[0]?.name,
        title: data?.memberRepresentativeId[0]?.title,
        department: data?.memberRepresentativeId[0]?.department,
        memberContactCountryCode: data?.memberRepresentativeId[0]?.countryCode,
        memberContactEmail: data?.memberRepresentativeId[0]?.email,
        memberContactPhoneNuber:
          data?.memberRepresentativeId[0]?.phoneNumber?.toString(),
        status: data?.memberRepresentativeId[0]?.isActive
          ? "active"
          : "inactive",
      });
      setMember(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("error", error);
      if (error?.code === "ERR_CANCELED") return;
      isMounted && setErrorToaster1(error);
    }
  };
  //prevent form submission on press of enter key
  const checkKeyDown = (e) => {
    if (e.code === "Enter") e.preventDefault();
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
    (async () => {
      isMounted && (await getMemberByID1(isMounted));
      isMounted && (await getRegions1(controller));
      isMounted && (await getCountryCode1(controller));
    })();
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
              <Link to="/users/members">Members</Link>
            </li>
            <li>
              <Link to={`/users/members/view-member/${param.id}`}>
                View Member
              </Link>
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
            {isLoading ? (
              <div className="loader-blk">
                <img src={Loader2} alt="Loading" />
              </div>
            ) : (
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
                          onBlur={(e) =>
                            setValue("memberCompany", e.target.value?.trim())
                          }
                          placeholder="Enter member company"
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
                              onBlur={(e) =>
                                setValue(
                                  "parentCompany",
                                  e.target.value?.trim()
                                )
                              }
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
                              // getOptionLabel={(option) => {
                              //   // Value selected with enter, right from the input
                              //   if (typeof option === "string") {
                              //     // console.log("option inside type string",option)
                              //     return option;
                              //   }
                              //   return option;
                              // }}
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
                                  placeholder="N/A"
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
                          myOnChange={categoryChangeHandler1}
                          options={cgfCategories1}
                        />
                      </div>
                      {/* </div> */}
                    </div>
                    <div className="card-form-field">
                      <div className="form-group">
                        {/* <div className="select-field"> */}
                        <label htmlFor="cgfActivity">
                          CGF Activity{" "}
                          {watch("cgfCategory") !== "Other" && (
                            <span className="mandatory">*</span>
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
                                (watch("cgfCategory") === "Manufacturer" ||
                                  watch("cgfCategory") === "Retailer")
                              )
                                return "Select activity";
                            },
                          }}
                          options={
                            watch("cgfCategory") === "Manufacturer"
                              ? cgfActivitiesManufacturer1
                              : cgfActivitiesRetailer1
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
                          onBlur={(e) =>
                            setValue("corporateEmail", e.target.value?.trim())
                          }
                          placeholder="Enter email"
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
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <div className="phone-number-field">
                          <div className="select-field country-code">
                            <Controller
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
                              // rules={{
                              //   validate: () => {
                              //     if (watch("phoneNumber") && !watch("countryCode"))
                              //       return "Invalid Input";
                              //   },
                              // }}
                              render={({ field, fieldState: { error } }) => (
                                <Autocomplete
                                  popupIcon={<KeyboardArrowDownRoundedIcon />}
                                  PaperComponent={({ children }) => (
                                    <Paper className="autocomplete-option-txt">
                                      {children}
                                    </Paper>
                                  )}
                                  {...field}
                                  className={`${error && "autocomplete-error"}`}
                                  onChange={(event, newValue) => {
                                    console.log("inside autocomplete onchange");
                                    console.log("new Value ", newValue);
                                    newValue && typeof newValue === "object"
                                      ? setValue("countryCode", newValue.name)
                                      : setValue("countryCode", newValue);
                                    trigger("countryCode");
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
                                      onChange={() => trigger("countryCode")}
                                      // onSubmit={() => setValue("countryCode", "")}
                                      placeholder={"Select country code"}
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
                            placeholder="Enter phone number"
                            myHelper={memberHelper}
                            rules={{
                              maxLength: 15,
                              minLength: 3,
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
                          onBlur={(e) =>
                            setValue("websiteUrl", e.target.value?.trim())
                          }
                          placeholder="N/A"
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
                  <h2 className="sub-heading1">Company Address Details</h2>
                  <div className="flex-between card-blk">
                    <div className="card-form-field">
                      <div className="form-group">
                        <label htmlFor="region">
                          Region <span className="mandatory">*</span>
                        </label>
                        <Dropdown
                          control={control}
                          myOnChange={onRegionChangeHandler1}
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
                          Country <span className="mandatory">*</span>
                        </label>
                        <Dropdown
                          isDisabled={!watch("region")}
                          control={control}
                          name="country"
                          myOnChange={onCountryChangeHandler1}
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
                          placeholder="Enter state"
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
                              onBlur={(e) =>
                                setValue("city", e.target.value?.trim())
                              }
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
                              // getOptionLabel={(option) => {
                              //   // Value selected with enter, right from the input
                              //   if (typeof option === "string") {
                              //     // console.log("option inside type string",option)
                              //     return option;
                              //   }
                              //   return option;
                              // }}
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
                                  placeholder="N/A"
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
                          myHelper={memberHelper}
                          rules={{ required: true }}
                          options={arrOfRegions}
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
                          myHelper={memberHelper}
                          rules={{ required: true }}
                          options={
                            arrOfCgfOfficeCountryRegions
                              ? arrOfCgfOfficeCountryRegions
                              : []
                          }
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
                              placeholder=""
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
                              control={control}
                              myHelper={memberHelper}
                              rules={{
                                required: true,
                                maxLength: 50,
                                minLength: 3,
                                pattern: /^[A-Za-z]+[A-Za-z ]*$/,
                              }}
                              name="memberContactFullName"
                              onBlur={(e) =>
                                setValue(
                                  "memberContactFullName",
                                  e.target.value?.trim()
                                )
                              }
                              placeholder="N/A"
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
                            setValue("title", e.target.value?.trim())
                          }
                          placeholder="N/A"
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
                          placeholder="N/A"
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
                          placeholder="N/A"
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
                                    !watch("memberContactCountryCode") &&
                                    watch("memberContactPhoneNuber")
                                  )
                                    return "Invalid input";
                                },
                              }}
                              render={({ field, fieldState: { error } }) => (
                                <Autocomplete
                                  {...field}
                                  className={`${error && "autocomplete-error"}`}
                                  popupIcon={<KeyboardArrowDownRoundedIcon />}
                                  PaperComponent={({ children }) => (
                                    <Paper className="autocomplete-option-txt">
                                      {children}
                                    </Paper>
                                  )}
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
                                      placeholder={"N/A"}
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
                            name="memberContactPhoneNuber"
                            myOnChange={(e) => phoneNumberChangeHandler(e,"memberContactPhoneNuber","memberContactCountryCode")}
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
                                  !watch("memberContactPhoneNuber") &&
                                  watch("memberContactCountryCode")
                                )
                                  return "invalid input";
                                if (value && !Number(value))
                                  return "Invalid input";
                              },
                            }}
                            placeholder="N/A"
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
                    Update
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

export default EditMember;
