import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DownloadIcon from "@mui/icons-material/Download";
import Loader2 from "../../assets/Loader/Loader2.svg";

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
import {
  COUNTRIES,
  FETCH_ROLES,
  MEMBER,
  MEMBER_OPERATION_MEMBERS,
  REGIONCOUNTRIES,
  REGIONS,
  STATES,
} from "../../api/Url";
import TableComponent from "../../components/TableComponent";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { useSelector } from "react-redux";
import { privateAxios } from "../../api/axios";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
//Ideally get those from backend
const allMembers = ["Erin", "John", "Maria", "Rajkumar"];

// CGF Categories (Ideally get from backend)
const cgfCategories = ["Manufacturer", "Retailer", "Other"];

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
  "N/A",
];

const ViewMember = () => {
  //Code for Operatiom Member List
  //custom hook to set title of page
  useDocumentTitle("View Member");

  const tableHead = [
    {
      id: "name",
      // width: "10%",
      disablePadding: false,
      label: "Operation Member",
    },
    {
      id: "email",
      disablePadding: false,
      label: "Email",
    },
    {
      id: "assessment",
      disablePadding: false,
      //   width: "30%",
      label: "Assessment",
    },
    {
      id: "createdBy",
      disablePadding: false,
      label: "Created By",
    },
    {
      id: "createdAt",
      disablePadding: false,
      // width: "5%",
      label: "Onboarded on",
    },
    {
      id: "is Active",
      disablePadding: false,
      // width: "15%",
      label: "Status",
    },
  ];
  const keysOrder = [
    "_id",
    "name",
    "email",
    "assessment",
    "createdBy",
    "createdAt",
    "isActive",
  ];

  //code of tablecomponent
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("");
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
  // state to manage loader
  const [isLoading, setIsLoading] = useState(false);

  //State to hold filter values
  const [filters, setFilters] = useState({
    status: "none",
  });
  // state to hold roles
  const [roles, setRoles] = useState([]);

  const privilege = useSelector((state) => state?.user?.privilege);
  const SUPER_ADMIN = privilege?.name === "Super Admin" ? true : false;
  let privilegeArray = privilege ? Object.values(privilege?.privileges) : [];
  let moduleAccesForMember = privilegeArray
    .filter((data) => data?.moduleId?.name === "Members")
    .map((data) => ({
      member: {
        list: data?.list,
        view: data?.view,
        edit: data?.edit,
        delete: data?.delete,
      },
    }));

  //format records as backend requires
  const updateRecords = (data) => {
    data.forEach((object) => {
      delete object["department"];
      delete object["memberId"];
      delete object["operationType"];
      delete object["password"];
      delete object["reportingManager"];
      delete object["roleId"];
      delete object["salt"];
      delete object["salutation"];
      delete object["title"];
      delete object["countryCode"];
      delete object["phoneNumber"];
      delete object["updatedAt"];
      delete object["updatedBy"];
      delete object["isDeleted"];
      delete object["address"];
      delete object["isReplaced"];
      delete object["uuid"];
      delete object["__v"];
      delete object["isMemberRepresentative"];
      delete object["isCGFStaff"];
      delete object["isOperationMember"];
      delete object["memberData"];
      // delete object["createdBy"]
      object.assessment = object["assessment"]?.toString() ?? "0";
      console.log(
        "type of created By",
        typeof object["createdBy"],
        "createdBy",
        object["createdBy"]
      );
      object["createdAt"] = new Date(object["createdAt"])?.toLocaleDateString(
        "en-US",
        {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        }
      );
      typeof object["createdBy"] === "object" &&
        (object.createdBy = object["createdBy"]["name"]);

      keysOrder.forEach((k) => {
        const v = object[k];
        delete object[k];
        object[k] = v;
      });
    });
    setRecords([...data]);
  };
  const generateUrl = () => {
    // console.log("filters", filters);
    let url = `${MEMBER_OPERATION_MEMBERS}/${param.id}/list?page=${page}&size=${rowsPerPage}&orderBy=${orderBy}&order=${order}`;
    if (search?.length >= 3) url = url + `&search=${search}`;
    if (filters?.status !== "all" && filters?.status !== "none")
      url = url + `&status=${filters.status}`;
    return url;
  };

  // const getMembers = async (isMounted, controller) => {
  //   try {
  //     let url = generateUrl();
  //     const response = await axios.get(url, { signal: controller.signal });
  //     setTotalRecords(parseInt(response.headers["x-total-count"]));
  //     console.log("response from backend", response);
  //     updateRecords(response.data);
  //   } catch (error) {
  //     console.log("Error from backend", error);
  //   }
  // };
  //handle createdBy filter change handler
  const handleCreatedByFilter = (e) => {
    const { value } = e.target;
    // console.log("name", name, "value", value);
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
    // console.log("name", name, "Value ", value);
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
    // console.log("id", id);
    return navigate(`/users/operation-member/view-operation-member/${id}`);
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
  const param = useParams();
  //code form View Member
  const navigate = useNavigate();
  const [isActive, setActive] = useState(false);
  const handleToggle = () => {
    setActive(!isActive);
  };
  const [openDialog, setOpenDialog] = useState(false);
  const onDialogPrimaryButtonClickHandler = async () => {
    try {
      await axios.delete(MEMBER + `/${param.id}`);
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
      // console.log("error on delete", error);
      if (error?.code === "ERR_CANCELED") return;
      // console.log(toasterDetails);
      setErrorToaster(error);
      // setToasterDetails(
      //   {
      //     titleMessage: "Error",
      //     descriptionMessage:
      //       error?.response?.data?.error &&
      //       typeof error.response.data.error === "string"
      //         ? error.response.data.error
      //         : "Something went wrong!",
      //     messageType: "error",
      //   },
      //   () => myRef.current()
      // );
    } finally {
      setOpenDialog(false);
    }
  };
  const onDialogSecondaryButtonClickHandler = () => {
    navigate("/users/members");
  };
  //state to hold member data send by back end
  const [member, setMember] = useState({});
  console.log("member", member);
  //to hold all regions
  const [arrOfRegions, setArrOfRegions] = useState([]);
  //to hold array of countries for perticular region for Company Adress
  const [arrOfCountryRegions, setArrOfCountryRegions] = useState([]);
  //to hold array of Country states
  const [arrOfStateCountry, setArrOfStateCountry] = useState([]);
  const [arrOfCountryCode, setArrOfCountryCode] = useState([]);
  // state to hold all operation members associated with member
  // const [memberOperationMembers, setMemberOperationMembers] = useState([]);

  //to hold array of countries for perticular region for CGF Office details
  const [arrOfCgfOfficeCountryRegions, setArrOfCgfOfficeCountryRegions] =
    useState([]);

  const { control, reset, watch, trigger } = useForm({
    defaultValues: defaultValues,
  });
  const formatRegionCountries = (regionCountries) => {
    regionCountries &&
      regionCountries.forEach(
        (country, id) =>
          (regionCountries[id] = country.hasOwnProperty("_id")
            ? country.name
            : country)
      );
    // console.log("arr of country ", regionCountries);
    return regionCountries;
  };

  const getCountryCode = async (
    isMounted = true,
    controller = new AbortController()
  ) => {
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
      console.log("error inside get Country code", error);
      if (error?.code === "ERR_CANCELED") return;
      isMounted && setErrorToaster(error);
    }
  };

  const getCountries = async (region) => {
    let controller = new AbortController();
    try {
      console.log("region: ", region);
      if (region) {
        return await axios.get(REGIONCOUNTRIES + `/${region}`, {
          signal: controller.signal,
        });
      }
      return [];
    } catch (error) {
      console.log("Error inside get Countres", error);
      if (error?.code === "ERR_CANCELED") return;
      setErrorToaster(error);
      return [];
    }
  };
  const getRegions = async (
    isMounted = true,
    controller = new AbortController()
  ) => {
    try {
      const regions = await axios.get(REGIONS, {
        signal: controller.signal,
      });
      console.log("regions ", regions);
      setArrOfRegions(regions?.data ?? []);
      const countriesOnRegion1 = await getCountries(watch("region"));
      console.log("countries", countriesOnRegion1);
      const arrOfCountryRegionsTemp1 = formatRegionCountries(
        countriesOnRegion1?.data
      );
      arrOfCountryRegionsTemp1 &&
        setArrOfCountryRegions([...arrOfCountryRegionsTemp1]);
      if (watch("country")) {
        const stateCountries = await axios.get(STATES + `/${watch("country")}`);
        setArrOfStateCountry(stateCountries.data);
      }

      const countriesOnRegion2 = await getCountries(watch("cgfOfficeRegion"));
      console.log("countriesOnRegion2", countriesOnRegion2);
      const arrOfCgfOfficeCountryRegionsTemp1 = await formatRegionCountries(
        countriesOnRegion2.data
      );
      arrOfCgfOfficeCountryRegionsTemp1 &&
        setArrOfCgfOfficeCountryRegions([...arrOfCgfOfficeCountryRegionsTemp1]);

      // getCountries()
      return arrOfRegions;
    } catch (error) {
      console.log("Inside get Regions catch", error);
      if (error?.code === "ERR_CANCELED") return;
      isMounted && setErrorToaster(error);
      return [];
    }
  };
  const getMemberByID = async (
    isMounted = true,
    controller = new AbortController()
  ) => {
    try {
      setIsLoading(true);
      const response = await axios.get(MEMBER + `/${param.id}`, {
        signal: controller.signal,
      });
      const data = response.data;
      console.log("data: ", data);
      setMember({ ...data });
      reset({
        memberCompany: data?.companyName ?? "N/A",
        companyType: data?.companyType ?? "N/A",
        parentCompany: data?.parentCompany ?? "N/A",
        cgfCategory: data?.cgfCategory ?? "N/A",
        cgfActivity: data?.cgfActivity ?? "N/A",
        replacedMember: data?.replacedMember ?? "N/A",
        corporateEmail: data?.corporateEmail ?? "N/A",
        countryCode: data?.countryCode ?? "N/A",
        phoneNumber: data?.phoneNumber?.toString() ?? "N/A",
        websiteUrl: data?.website ?? "N/A",
        region: data?.region ?? "N/A",
        country: data?.country ?? "N/A",
        state: data?.state ?? "N/A",
        city: data?.city ?? "N/A",
        address: data?.address ?? "N/A",
        cgfOfficeRegion: data?.cgfOfficeRegion ?? "N/A",
        cgfOfficeCountry: data?.cgfOfficeCountry ?? "N/A",
        cgfOffice: data?.cgfOffice ?? "N/A",
        memberContactSalutation:
          data?.memberRepresentativeId[0]?.salutation ?? "N/A",
        memberContactFullName: data?.memberRepresentativeId[0]?.name ?? "N/A",
        title: data?.memberRepresentativeId[0]?.title ?? "N/A",
        department: data?.memberRepresentativeId[0]?.department ?? "N/A",
        memberContactCountryCode:
          data?.memberRepresentativeId[0]?.countryCode ?? "N/A",
        memberContactEmail: data?.memberRepresentativeId[0]?.email ?? "N/A",
        memberContactPhoneNuber:
          data?.memberRepresentativeId[0]?.phoneNumber?.toString() ?? "N/A",
        status: data?.memberRepresentativeId[0]?.isActive
          ? "active"
          : "inactive",
        totalOperationMembers: totalRecords?.toString() ?? "N/A",
        createdBy: data?.createdBy["name"] ?? "N/A",
        roleId: data?.memberRepresentativeId[0]?.roleId ?? "N/A",
      });
      setIsLoading(false);
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      setIsLoading(false);
      isMounted && setErrorToaster(error);
    }
    // console.log("response for member: ", response);
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
  const getOperationMemberByMemberId = async (controller) => {
    try {
      let url = generateUrl();
      // setIsLoading(true);
      const response = await axios.get(url);
      // setIsLoading(false);
      // console.log("response from operation member Id", response);
      setTotalRecords(parseInt(response.headers["x-total-count"]));
      updateRecords(response?.data);
    } catch (error) {
      // setIsLoading(false);
      if (error?.code === "ERR_CANCELED") return;
      setErrorToaster(error);
    }
  };

  const downloadOperationMembers = async () => {
    try {
      const response = await privateAxios.get(
        MEMBER_OPERATION_MEMBERS + `/${param.id}/list/download`,
        {
          responseType: "blob",
        }
      );
      console.log(
        "resposne from download operation members in view member page",
        response
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Operation members${Date.now()}.xls`);
      document.body.appendChild(link);
      link.click();
      if (response.status == 200) {
        setToasterDetails(
          {
            titleMessage: "Success!",
            descriptionMessage: "Download successfull!",

            messageType: "success",
          },
          () => myRef.current()
        );
      }
    } catch (error) {
      console.log("Error from download cgf admins", error);
    }
  };
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    (async () => {
      isMounted && makeApiCall && (await getMemberByID(isMounted, controller));
      isMounted && (await getCountryCode(isMounted, controller));
      isMounted && (await getRegions(isMounted, controller));
      // getRegions(controller)
      isMounted &&
        makeApiCall &&
        (await getOperationMemberByMemberId(controller));
      isMounted && fetchRoles();
    })();
    // makeApiCall && getMembers(isMounted, controller);
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
        title={
          <p>
            Delete Member "{member?.companyName ? member.companyName : "Member"}
            "
          </p>
        }
        info1={
          <p>
            We recommend you to replace this member with the new one because
            deleting all the statistics & records would get deleted and this
            will be an irreversible action
          </p>
        }
        info2={
          <p>
            Are you sure you want to delete <b>{member.companyName}</b>?
          </p>
        }
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
              {(SUPER_ADMIN === true ||
                moduleAccesForMember[0]?.member.edit == true ||
                moduleAccesForMember[0]?.member.delete == true) && (
                <span
                  className={`crud-operation ${
                    isActive && "crud-operation-active"
                  }`}
                >
                  <MoreVertIcon />
                </span>
              )}
              <div
                className="crud-toggle-wrap"
                style={{ display: isActive ? "block" : "none" }}
              >
                <ul className="crud-toggle-list">
                  {member?.memberRepresentativeId?.length > 0 && (
                    <li
                      hidden={
                        SUPER_ADMIN
                          ? false
                          : !moduleAccesForMember[0]?.member.edit
                      }
                      onClick={() =>
                        navigate(`/users/members/edit-member/${param.id}`)
                      }
                    >
                      Edit
                    </li>
                  )}
                  <li
                    hidden={
                      SUPER_ADMIN
                        ? false
                        : !moduleAccesForMember[0]?.member.delete
                    }
                    onClick={() => setOpenDialog(true)}
                  >
                    Delete
                  </li>
                  {/* <li>Replace</li> */}
                </ul>
              </div>
              {/* <CustomModal /> */}
            </span>
          </div>
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
                          value={member?.companyType ?? ""}
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
                        value={member?.parentCompany ?? "N/A"}
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
                          <TextField {...params} placeholder="N/A" />
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
                            disabled
                            popupIcon={<KeyboardArrowDownRoundedIcon />}
                            className="phone-number-disable"
                            readOnly
                            options={arrOfCountryCode}
                            autoHighlight
                            value={
                              member?.countryCode ? member.countryCode : ""
                            }
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
                                placeholder={"N/A"}
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
                        placeholder="N/A"
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
                        isDisabled
                        control={control}
                        name="country"
                        placeholder="Select country"
                        myHelper={myHelper}
                        options={arrOfCountryRegions}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="state">State</label>
                      <Dropdown
                        isDisabled
                        control={control}
                        name="state"
                        placeholder="Enter state"
                        options={arrOfStateCountry}
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
                        value={member?.city ?? ""}
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
                          <TextField {...params} placeholder="N/A" />
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
                        helperText=" "
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
                        isDisabled
                        control={control}
                        name="title"
                        placeholder="N/A"
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
                        name="memberContactEmail"
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
                          <Autocomplete
                            disabled
                            popupIcon={<KeyboardArrowDownRoundedIcon />}
                            className="phone-number-disable"
                            readOnly
                            value={
                              member?.memberRepresentativeId
                                ? member?.memberRepresentativeId[0]?.countryCode
                                : ""
                            }
                            options={arrOfCountryCode}
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
                                placeholder={"N/A"}
                              />
                            )}
                          />
                        </div>
                        <Input
                          isDisabled
                          control={control}
                          name="memberContactPhoneNuber"
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
                        <RadioGroup
                          // {...field}
                          value={
                            member?.memberRepresentativeId &&
                            member?.memberRepresentativeId[0]?.isActive
                              ? "active"
                              : "inactive"
                          }
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
                        placeholder="N/A"
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
                        placeholder="N/A"
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="role">
                        Role <span className="mandatory">*</span>
                      </label>

                      <div>
                        {/* <Input/> */}
                        <Dropdown
                          name="roleId"
                          control={control}
                          options={roles}
                          rules={{
                            required: true,
                          }}
                          isDisabled
                          // myHelper={memberHelper}
                          placeholder={"Select role"}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-header member-form-header flex-between mb-10">
                <div className="operation-member-left-blk">
                  {/* <h2 className="heading2 mr-40">Members</h2> */}
                  <div className="searchbar">
                    <input
                      type="text"
                      value={search}
                      name="search"
                      placeholder="Search"
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
                <div className="form-header-right-txt">
                  <div
                    className="tertiary-btn-blk mr-20"
                    onClick={() => downloadOperationMembers()}
                  >
                    <span className="download-icon">
                      <DownloadIcon />
                    </span>
                    Download
                  </div>
                  <div className="form-btn">
                    <button
                      type="submit"
                      className="primary-button add-button"
                      onClick={() =>
                        navigate(
                          "/users/operation-members/add-operation-member"
                        )
                      }
                    >
                      Add Operation Member
                    </button>
                  </div>
                </div>
              </div>
              <div className="member-filter-sect">
                <div className="member-filter-wrap flex-between">
                  <div className="member-filter-left"></div>
                  <div className="member-filter-right">
                    <div className="filter-select-wrap flex-between">
                      <div className="filter-select-field">
                        <div className="dropdown-field">
                          <Select
                            sx={{ display: "none" }}
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
                                  showFilterPlaceholder === "createdBy" &&
                                  "none",
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
                                  selectedCreatedBy.length - 1 <
                                    allMembers.length
                                }
                              />
                              Select All
                            </MenuItem>
                            {allMembers.map((member) => (
                              <MenuItem key={member} value={member}>
                                <Checkbox
                                  className="table-checkbox"
                                  checked={
                                    selectedCreatedBy.indexOf(member) > -1
                                  }
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
                            sx={{ display: "none" }}
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
          )}
        </div>
      </section>
    </div>
  );
};

export default ViewMember;
