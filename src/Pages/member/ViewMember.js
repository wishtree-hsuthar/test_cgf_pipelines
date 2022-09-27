import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DownloadIcon from "@mui/icons-material/Download";

import DialogBox from "../../components/DialogBox";
import Toaster from "../../components/Toaster";
import useCallbackState from "../../utils/useCallBackState";
import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import Dropdown from "../../components/Dropdown";
import { useForm } from "react-hook-form";
import Input from "../../components/Input";
import axios from "axios";
import { COUNTRIES, MEMBER, REGIONCOUNTRIES, REGIONS, STATES } from "../../api/Url";
import TableComponent from "../../components/TableComponent";

//Ideally get those from backend
const allMembers = ["Erin", "John", "Maria", "Rajkumar"];

// CGF Categories (Ideally get from backend)
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
  "NA",
];

const ViewMember = () => {
  //Code for Operatiom Member List

  const tableHead = [
    {
      id: "companyName",
      // width: "10%",
      disablePadding: false,
      label: "Member Company",
    },
    {
      id: "name",
      disablePadding: false,
      label: "Member Name",
    },
    {
      id: "email",
      disablePadding: false,
      //   width: "30%",
      label: "Email",
    },
    {
      id: "companyType",
      disablePadding: false,
      label: "Company Type",
    },
    {
      id: "totalOperationMembers",
      disablePadding: false,
      // width: "5%",
      label: "Operation Members",
    },
    {
      id: "createdBy",
      disablePadding: false,
      // width: "20%",
      label: "Created By",
    },
    {
      id: "createdAt",
      disablePadding: false,
      label: "Onboarded On",
    },
    {
      id: "is Active",
      disablePadding: false,
      // width: "15%",
      label: "Status",
    },
    // {
    //   id: "action",
    //   disablePadding: false,
    //   label: "Action",
    // },
  ];
  const keysOrder = [
    "_id",
    "companyName",
    "name",
    "email",
    "companyType",
    "totalOperationMembers",
    "createdBy",
    "createdAt",
    "isActive",
  ];

  //code of tablecomponent
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [records, setRecords] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selected, setSelected] = useState([]);
  //State to hold selected Created by Member filter
  const [selectedCreatedBy, setSelectedCreatedBy] = useState(["none"]);
  //state to hold wheather to show placeholder or not
  const [showFilterPlaceholder, setShowFilterPlaceholder] = useState("");
  const isAllCreatedByMemberSelected =
    selectedCreatedBy.length > 1 &&
    selectedCreatedBy.length - 1 === allMembers.length;

  //state to hold search timeout delay
  const [searchTimeout, setSearchTimeout] = useState(null);
  //state to hold wheather to make api call or not
  const [makeApiCall, setMakeApiCall] = useState(true);

  //state to hold search keyword
  const [search, setSearch] = useState("");

  //State to hold filter values
  const [filters, setFilters] = useState({
    status: "none",
  });
  //format records as backend requires
  const updateRecords = (data) => {
    data.forEach((object) => {
      delete object["address"];
      delete object["cgfActivity"];
      delete object["cgfCategory"];
      delete object["cgfOffice"];
      delete object["cgfOfficeCountry"];
      delete object["cgfOfficeRegion"];
      delete object["city"];
      delete object["corporateEmail"];
      delete object["country"];
      delete object["countryCode"];
      delete object["parentCompany"];
      delete object["phoneNumber"];
      delete object["region"];
      delete object["state"];
      delete object["updatedAt"];
      delete object["updatedBy"];
      delete object["website"];
      delete object["isDeleted"];
      delete object["isReplaced"]
      delete object["__v"];

      object["createdAt"] = new Date(object["createdAt"]).toLocaleDateString(
        "en-GB"
      );
      if (typeof object["createdBy"] === "object") {
        object.createdBy = object["createdBy"]["name"];
      } else {
        object.createdBy = "NA";
      }
      if (object["representative"].length > 0) {
        object.email = object["representative"][0]?.email ?? "NA";
        object.name = object["representative"][0]?.name ?? "NA";
      } else {
        object.email = "NA";
        object.name = "NA";
      }

      object.totalOperationMembers = object["totalOperationMembers"].toString();
      delete object["representative"];
      // delete object["createdBy"];
      delete object["memberRepresentativeId"];
      keysOrder.forEach((k) => {
        const v = object[k];
        delete object[k];
        object[k] = v;
      });
    });
    setRecords([...data]);
  };
  const generateUrl = () => {
    console.log("filters", filters);
    let url = `${MEMBER}?page=${page}&size=${rowsPerPage}&orderBy=${orderBy}&order=${order}`;
    if (search?.length >= 3) url = url + `&search=${search}`;
    if (filters?.status !== "all" && filters?.status !== "none")
      url = url + `&status=${filters.status}`;
    return url;
  };

  const getMembers = async (isMounted, controller) => {
    try {
      let url = generateUrl();
      const response = await axios.get(url, { signal: controller.signal });
      setTotalRecords(parseInt(response.headers["x-total-count"]));
      console.log("response from backend", response);
      updateRecords(response.data);
    } catch (error) {
      console.log("Error from backend", error);
    }
  };
  //handle createdBy filter change handler
  const handleCreatedByFilter = (e) => {
    const { name, value } = e.target;
    console.log("name", name, "value", value);
    if (value[value.length - 1] === "")
      return selectedCreatedBy.length - 1 === allMembers.length
        ? setSelectedCreatedBy(["none"])
        : setSelectedCreatedBy(["none", ...allMembers]);
    setSelectedCreatedBy([...value]);
  };
  const onFilterFocusHandler = (filterValue) => {
    setShowFilterPlaceholder(filterValue);
  };

  //method for time based searching
  const onSearchChangeHandler = (e) => {
    console.log("event", e.key);
    if (searchTimeout) clearTimeout(searchTimeout);
    setMakeApiCall(false);
    console.log("search values", e.target.value);
    setSearch(e.target.value);
    setSearchTimeout(
      setTimeout(() => {
        setMakeApiCall(true);
        setPage(1);
      }, 1000)
    );
  };
  //handle sigle select filters
  const onFilterChangehandler = (e) => {
    const { name, value } = e.target;
    console.log("name", name, "Value ", value);
    setFilters({
      ...filters,
      [name]: value,
    });
  };
  const handleTablePageChange = (newPage) => {
    setPage(newPage);
  };
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };
  const onClickVisibilityIconHandler = (id) => {
    console.log("id", id);
    return navigate(`/users/members/view-member/${id}`);
  };

  //code to View Member Fields
  const myHelper = {};
  //Refr for Toaster
  const myRef = React.useRef();
  //Toaster Message setter
  const [toasterDetails, setToasterDetails] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "success",
  });
  const defaultValues = {
    memberCompany: "",
    companyType: "Internal",
    parentCompany: "",
    cgfCategory: "Manufacturer",
    cgfActivity: "",
    replacedMember: "",
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
    totalOperationMembers: "",
    createdBy: "",
  };
  //code to get id from url
  const params = useParams();
  //code form View Member
  const navigate = useNavigate();
  const [isActive, setActive] = useState(false);
  const handleToggle = () => {
    setActive(!isActive);
  };
  const [openDialog, setOpenDialog] = useState(false);
  const onDialogPrimaryButtonClickHandler = async () => {
    try {
        await axios.delete(MEMBER+`/${params.id}`);
        setToasterDetails(
          {
            titleMessage: "Success",
            descriptionMessage: `${member?.companyName || "Member"} deleted!`,
            messageType: "success",
          },
          () => myRef.current()
        );
        return setTimeout(() => navigate("/users/members"), 3000);
      } catch (error) {
        console.log("error on delete", error);
        if (error?.code === "ERR_CANCELED") return;
        console.log(toasterDetails);
        setToasterDetails(
          {
            titleMessage: "Error",
            descriptionMessage:
              error?.response?.data?.error &&
              typeof error.response.data.error === "string"
                ? error.response.data.error
                : "Something Went Wrong!",
            messageType: "error",
          },
          () => myRef.current()
        );
      } finally {
        setOpenDialog(false);
      }
  };
  const onDialogSecondaryButtonClickHandler = () => {
    navigate("/users/members");
  };
  //state to hold member data send by back end
  const [member, setMember] = useState({});
  //to hold all regions
  const [arrOfRegions, setArrOfRegions] = useState([]);
  //to hold array of countries for perticular region for Company Adress
  const [arrOfCountryRegions, setArrOfCountryRegions] = useState([]);
  //to hold array of Country states
  const [arrOfStateCountry, setArrOfStateCountry] = useState([])
  const [arrOfCountryCode, setArrOfCountryCode] = useState([]);

  //to hold array of countries for perticular region for CGF Office details
  const [arrOfCgfOfficeCountryRegions, setArrOfCgfOfficeCountryRegions] =
    useState([]);

  const { control, reset, setValue, watch, trigger } = useForm({
    defaultValues: defaultValues,
  });
  const formatRegionCountries = (regionCountries) => {
    regionCountries.forEach(
      (country, id) => (regionCountries[id] = country.hasOwnProperty('_id') ? country.name : country)
    );
    console.log("arr of country ", regionCountries);
    return regionCountries;
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
      console.log("error inside get Country code",error)
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
      console.log("Error inside get Countres",error)
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
      try {
        const stateCountries = await axios.get(STATES+`/${watch("country")}`)
        setArrOfStateCountry(stateCountries.data)   
      } catch (error) {
        console.log("error")
      }
     
    
      const countriesOnRegion2 = await getCountries(watch("cgfOfficeRegion"));
      console.log("countriesOnRegion2", countriesOnRegion2);
      const arrOfCgfOfficeCountryRegionsTemp1 = await formatRegionCountries(
        countriesOnRegion2.data
      );
      setArrOfCgfOfficeCountryRegions([...arrOfCgfOfficeCountryRegionsTemp1]);

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
      replacedMember: "Kit Kat",
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
      totalOperationMembers: "124",
      createdBy: data?.createdBy,
    });
    setMember(response.data);
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    arrOfRegions.length === 0 && getRegions(controller);
    arrOfCountryCode.length === 0 && getCountryCode(controller);
    isMounted && getMemberByID();
    makeApiCall && getMembers(isMounted, controller);
    return () => {
      isMounted = false;
      clearTimeout(searchTimeout);
      controller.abort();
    };
    // console.log("member",member)
  }, [watch, page, rowsPerPage, orderBy, order, filters, makeApiCall]);
  console.log("Member", member);
  return (
    <div className="page-wrapper" onClick={() => isActive && setActive(false)}>
      <Toaster
        myRef={myRef}
        titleMessage={toasterDetails.titleMessage}
        descriptionMessage={toasterDetails.descriptionMessage}
        messageType={toasterDetails.messageType}
      />
      <DialogBox
        title={`Delete Member ${member.companyName}`}
        info1={`We recommend you to replace this member with the new one because deleting all the statistics & records would get deleted and this will be an irreversible action`}
        info2={`Are you sure want to delete ${member.companyName} !`}
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        onPrimaryModalButtonClickHandler={onDialogPrimaryButtonClickHandler}
        onSecondaryModalButtonClickHandler={onDialogSecondaryButtonClickHandler}
        openModal={openDialog}
        setOpenModal={setOpenDialog}
      />
      <div className="breadcrumb-wrapper">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link to="/users/members">Members</Link>
            </li>
            <li>View Member</li>
          </ul>
        </div>
      </div>
      <section>
        <div className="container">
          <div className="form-header flex-between">
            <h2 className="heading2">View Member</h2>
            <span className="form-header-right-txt" onClick={handleToggle}>
              <span
                className={`crud-operation ${
                  isActive && "crud-operation-active"
                }`}
              >
                <MoreVertIcon />
              </span>
              <div
                className="crud-toggle-wrap"
                style={{ display: isActive ? "block" : "none" }}
              >
                <ul className="crud-toggle-list">
                  <li
                    onClick={() =>
                      navigate(`/users/members/edit-member/${params.id}`)
                    }
                  >
                    Edit
                  </li>
                  <li onClick={() => setOpenDialog(true)}>Delete</li>
                  {/* <li>Replace</li> */}
                </ul>
              </div>
              {/* <CustomModal /> */}
            </span>
          </div>
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
                      isDisabled
                      control={control}
                      name="memberCompany"
                      placeholder="Enter member company"
                    />
                  </div>
                </div>

                <div className="card-form-field">
                  <div className="form-group">
                    <label htmlFor="companyType">
                      Company Type <span className="mandatory">*</span>
                    </label>
                    <div className="radio-btn-field">
                      <RadioGroup
                        value={member?.companyType ? member.companyType : ""}
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
                    </div>
                  </div>
                </div>
                <div className="card-form-field">
                  <div className="form-group">
                    <label htmlFor="parentCompany">Parent Company</label>
                    <Autocomplete
                      disabled
                      className="searchable-input"
                      value={
                        member?.parentCompany ? member.parentCompany : "NA"
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
                          placeholder="NA"
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
                      isDisabled
                      control={control}
                      name="cgfCategory"
                      placeholder="Select category"
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
                      isDisabled
                      control={control}
                      name="cgfActivity"
                      placeholder="Select activity"
                      options={
                        watch("cgfCategory") === "Manufacturer"
                          ? cgfActivitiesManufacturer
                          : cgfActivitiesRetailer
                      }
                    />
                  </div>
                  {/* </div> */}
                </div>
                <div className="card-form-field">
                  <div className="form-group">
                    {/* <div className="select-field"> */}
                    <label htmlFor="replacedMember">
                      Replaced Member <span className="mandatory">*</span>
                    </label>
                    <Input
                      isDisabled
                      control={control}
                      name="replacedMember"
                      placeholder="Enter replaced company"
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
                      isDisabled
                      control={control}
                      name="corporateEmail"
                      placeholder="Enter email"
                    />
                  </div>
                </div>
                <div className="card-form-field">
                  <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <div className="phone-number-field">
                      <div className="select-field country-code">
                        <Autocomplete
                          className="phone-number-disable"
                          readOnly
                          options={arrOfCountryCode ? arrOfCountryCode : []}
                          autoHighlight
                          value={member?.countryCode ? member.countryCode : ""}
                          renderOption={(props, option) => (
                            <li {...props}>{option}</li>
                          )}
                          renderInput={(params) => (
                            <TextField
                              className={`input-field`}
                              {...params}
                              inputProps={{
                                ...params.inputProps,
                              }}
                              placeholder={"NA"}
                            />
                          )}
                        />
                      </div>
                      <Input
                        isDisabled
                        control={control}
                        name="phoneNumber"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </div>
                <div className="card-form-field">
                  <div className="form-group">
                    <label htmlFor="websiteUrl">Website URL</label>
                    <Input
                      isDisabled
                      control={control}
                      name="websiteUrl"
                      placeholder="NA"
                      myHelper={myHelper}
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
                      isDisabled
                      control={control}
                      name="region"
                      placeholder="Select region"
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
                      isDisabled
                      control={control}
                      name="country"
                      placeholder="Select country"
                      myHelper={myHelper}
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
                      isDisabled
                      control={control}
                      name="state"
                      placeholder="Enter state"
                      options={arrOfStateCountry ? arrOfStateCountry : []}
                    />
                  </div>
                </div>
                <div className="card-form-field">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <Autocomplete
                      disabled
                      className="searchable-input"
                      handleHomeEndKeys
                      value={member?.city ? member.city : ""}
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
                          placeholder="NA"
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
                    <TextField
                      disabled
                      multiline
                      value={member?.address ? member.address : ""}
                      //   {...field}
                      inputProps={{
                        maxLength: 250,
                      }}
                      className={`input-textarea`}
                      id="outlined-basic"
                      placeholder="Enter address"
                      variant="outlined"
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
                          isDisabled
                          control={control}
                          name="memberContactSalutation"
                          placeholder="Mr."
                          options={["Mr.", "Mrs.", "Ms."]}
                        />
                      </div>
                      <div className="salutation-inputblk">
                        <label htmlFor="memberContactFullName">
                          Full Name <span className="mandatory">*</span>
                        </label>
                        <Input
                          isDisabled
                          control={control}
                          name="memberContactFullName"
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
                      isDisabled
                      control={control}
                      name="title"
                      placeholder="NA"
                    />
                  </div>
                </div>
                <div className="card-form-field">
                  <div className="form-group">
                    <label htmlFor="department">Department</label>
                    <Input
                      isDisabled
                      control={control}
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
                        <Autocomplete
                          className="phone-number-disable"
                          readOnly
                          value={
                            member?.memberRepresentativeId?.countryCode
                              ? member.memberRepresentativeId.countryCode
                              : ""
                          }
                          options={arrOfCountryCode ? arrOfCountryCode : []}
                          autoHighlight
                          placeholder="Select country code"
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
                              placeholder={"NA"}
                            />
                          )}
                        />
                      </div>
                      <Input
                        isDisabled
                        control={control}
                        name="memberContactPhoneNuber"
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
                      <RadioGroup
                        value={
                          member?.memberRepresentativeId?.isActive
                            ? "active"
                            : "inactive"
                        }
                        // {...field}
                        aria-labelledby="demo-radio-buttons-group-label"
                        name="radio-buttons-group"
                        className="radio-btn"
                      >
                        <FormControlLabel
                          disabled
                          value="active"
                          control={<Radio />}
                          label="Active"
                        />
                        <FormControlLabel
                          disabled
                          value="inactive"
                          control={<Radio />}
                          label="Inactive"
                        />
                      </RadioGroup>
                    </div>
                  </div>
                </div>
                <div className="card-form-field">
                  <div className="form-group">
                    <label htmlFor="totalOperationMembers">
                      Toatal Operation Member{" "}
                      <span className="mandatory">*</span>
                    </label>
                    <Input
                      isDisabled
                      control={control}
                      name="totalOperationMembers"
                      placeholder="NA"
                    />
                  </div>
                </div>
                <div className="card-form-field">
                  <div className="form-group">
                    <label htmlFor="createdBy">
                      Created By <span className="mandatory">*</span>
                    </label>
                    <Input
                      isDisabled
                      control={control}
                      name="createdBy"
                      placeholder="NA"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-header member-form-header flex-between">
              <div className="form-header-left-blk flex-start">
                {/* <h2 className="heading2 mr-40">Members</h2> */}
              </div>
              <div className="form-header-right-txt">
                <div className="tertiary-btn-blk mr-20">
                  <span className="download-icon">
                    <DownloadIcon />
                  </span>
                  Download
                </div>
                <div className="form-btn">
                  <button
                    type="submit"
                    className="primary-button add-button"
                    onClick={() => navigate("/users/members/add-member")}
                  >
                    Add Operation Member
                  </button>
                </div>
              </div>
            </div>
            <div className="member-filter-sect">
              <div className="member-filter-wrap flex-between">
                <div className="member-filter-left">
                  <div className="searchbar">
                    <input
                      type="text"
                      value={search}
                      name="search"
                      placeholder="Search member name, email and member company"
                      onKeyDown={(e) =>
                        e.key === "Enter" && setMakeApiCall(true)
                      }
                      onChange={onSearchChangeHandler}
                    />
                    <button type="submit">
                      <i className="fa fa-search"></i>
                    </button>
                  </div>
                </div>
                <div className="member-filter-right">
                  <div className="filter-select-wrap flex-between">
                    <div className="filter-select-field">
                      <div className="dropdown-field">
                        <Select
                          sx={{display: "none"}}
                          name="createdBy"
                          multiple
                          value={selectedCreatedBy}
                          onChange={handleCreatedByFilter}
                          onFocus={(e) => onFilterFocusHandler("createdBy")}
                          renderValue={(val) =>
                            selectedCreatedBy.length > 1
                              ? val.slice(1).join(", ")
                              : "Created By"
                          }
                        >
                          <MenuItem
                            value="none"
                            sx={{
                              display:
                                showFilterPlaceholder === "createdBy" && "none",
                            }}
                          >
                            Created By
                          </MenuItem>

                          <MenuItem value="">
                            <Checkbox
                              className="table-checkbox"
                              checked={isAllCreatedByMemberSelected}
                              indeterminate={
                                selectedCreatedBy.length > 1 &&
                                selectedCreatedBy.length - 1 < allMembers.length
                              }
                            />
                            Select All
                          </MenuItem>
                          {allMembers.map((member) => (
                            <MenuItem key={member} value={member}>
                              <Checkbox
                                className="table-checkbox"
                                checked={selectedCreatedBy.indexOf(member) > -1}
                              />
                              {member}
                            </MenuItem>
                          ))}
                        </Select>
                      </div>
                    </div>
                    <div className="filter-select-field">
                      <div className="dropdown-field">
                        <Select
                          sx={{display:"none"}}
                          name="status"
                          value={filters.status}
                          onChange={onFilterChangehandler}
                          onFocus={(e) => onFilterFocusHandler("status")}
                        >
                          <MenuItem
                            value="none"
                            sx={{
                              display:
                                showFilterPlaceholder === "status" && "none",
                            }}
                          >
                            Status
                          </MenuItem>
                          <MenuItem value="active">Active</MenuItem>
                          <MenuItem value="inactive">Inactive</MenuItem>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="member-info-wrapper table-content-wrap">
              <TableComponent
                tableHead={tableHead}
                records={records}
                handleChangePage1={handleTablePageChange}
                handleChangeRowsPerPage1={handleRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                selected={selected}
                setSelected={setSelected}
                totalRecords={totalRecords}
                orderBy={orderBy}
                // icons={["visibility"]}
                onClickVisibilityIconHandler1={onClickVisibilityIconHandler}
                order={order}
                setOrder={setOrder}
                setOrderBy={setOrderBy}
                setCheckBoxes={false}
                onRowClick
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ViewMember;
