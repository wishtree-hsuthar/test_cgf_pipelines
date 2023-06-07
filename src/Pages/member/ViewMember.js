import DownloadIcon from "@mui/icons-material/Download";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
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
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Logger } from "../../Logger/Logger";
import {
  COUNTRIES,
  MEMBER,
  MEMBER_OPERATION_MEMBERS,
  PENDING_MEMBER,
  REGIONCOUNTRIES,
  REGIONS,
  STATES,
  VIEW_ROLE,
  WITHDRAW_MEMBER_INVITE,
} from "../../api/Url";
import { privateAxios } from "../../api/axios";
import DialogBox from "../../components/DialogBox";
import Dropdown from "../../components/Dropdown";
import Input from "../../components/Input";
import TableComponent from "../../components/TableComponent";
import Toaster from "../../components/Toaster";
import Loader from "../../utils/Loader";
import {
  defaultValues,
  getCGFOffices,
  getCategories,
} from "../../utils/MemberModuleUtil";
import useCallbackState from "../../utils/useCallBackState";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import { ResendEmail } from "../../utils/ResendEmail";
//Ideally get those from backend
const allMembers = ["Erin", "John", "Maria", "Rajkumar"];

let MEMBER_LOOKUP = {};
let CGF_OFFICES = [];
// CGF Categories (Ideally get from backend)
const cgfCategories = ["Manufacturer", "Retailer", "Other"];
const cgfActivites = [
  "Apparel",
  "Food manufacturer",
  "Household care",
  "None",
  "Non-food manufacturer",
  "Personal care & beauty",
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

  //code to get id from url
  const param = useParams();


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
      id: "assessmentCount",
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
    "assessmentCount",
    "createdBy",
    "createdAt",
    "isActive",
  ];

  //code of tablecomponent
  const [pageInViewMember, setPageInViewMember] = useState(1);
  const [rowsPerPageInViewMember, setRowsPerPageInViewMember] = useState(10);
  const [orderInViewMember, setOrderInViewMember] = useState("desc");
  const [orderByInViewMember, setOrderByInViewMember] = useState("");
  const [recordsInViewMember, setRecordsInViewMember] = useState([]);
  const [totalRecordsInViewMember, setTotalRecordsInViewMember] = useState(0);
  const [selected, setSelected] = useState([]);
  const [sessionActiveDailogBox, setSessionActiveDailogBox] = useState(false);
  const [sessionActiveMessage, setSessionActiveMessage] = useState("");
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
  const [isViewMemberLoading, setIsViewMemberLoading] = useState(false);

  //State to hold filter values
  const [filters, setFilters] = useState({
    status: "none",
  });
  // state to hold roles
  const privilege = useSelector((state) => state?.user?.privilege);
  const state = param["*"].includes("pending") ? 1 : 0
  const SUPER_ADMIN = privilege?.name === "Super Admin" ? true : false;
  let viewMemberPrivilegeArray = privilege
    ? Object.values(privilege?.privileges)
    : [];
  let moduleAccesForMember = viewMemberPrivilegeArray
    .filter((data) => data?.moduleId?.name === "Members")
    .map((data) => ({
      member: {
        list: data?.list,
        view: data?.view,
        edit: data?.edit,
        delete: data?.delete,
      },
    }));
  let operationMemberRights = viewMemberPrivilegeArray
    .filter((data) => data?.moduleId?.name === "Operation Members")
    .map((data) => ({
      operationMember: {
        list: data?.list,
        view: data?.view,
        edit: data?.edit,
        delete: data?.delete,
        add: data?.add,
      },
    }));
  moduleAccesForMember.push(...operationMemberRights);
  console.log("moduleAccesForMember = ", moduleAccesForMember);
  console.log("moduleAccesForMember = ", viewMemberPrivilegeArray);
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
      delete object["memberRepresentative"];
      delete object["role"];
      delete object["isCGFStaff"];
      delete object["isOperationMember"];
      delete object["replacedUsers"];
      delete object["memberData"];
      object["assessmentCount"] = `${object["assessmentCount"]}`;
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
    setRecordsInViewMember([...data]);
  };
  const generateUrl = () => {
    let url = `${MEMBER_OPERATION_MEMBERS}/${param.id}/list?page=${pageInViewMember}&size=${rowsPerPageInViewMember}&orderBy=${orderByInViewMember}&order=${orderInViewMember}`;
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
  //     Logger.debug("response from backend", response);
  //     updateRecords(response.data);
  //   } catch (error) {
  //     Logger.debug("Error from backend", error);
  //   }
  // };
  //handle createdBy filter change handler
  const handleCreatedByFilter = (e) => {
    const { value } = e.target;
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
    if (searchTimeout) clearTimeout(searchTimeout);
    setMakeApiCall(false);
    setSearch(e.target.value);
    setSearchTimeout(
      setTimeout(() => {
        setMakeApiCall(true);
        setPageInViewMember(1);
      }, 1000)
    );
  };
  //handle sigle select filters
  const onFilterChangehandler = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };
  const handleTablePageChange = (newPage) => {
    setPageInViewMember(newPage);
  };
  const handleRowsPerPageChange = (event) => {
    setRowsPerPageInViewMember(parseInt(event.target.value, 10));
    setPageInViewMember(1);
  };
  const onClickVisibilityIconHandler = (id) => {
    return navigate(`/users/operation-member/view-operation-member/${id}`);
  };

  //code to View Member Fields
  let resetObj = {};
  const myHelper = {};
  //Refr for Toaster
  const myRef = React.useRef();
  //Toaster Message setter
  const [toasterDetailsViewMember, setToasterDetailsViewMember] =
    useCallbackState({
      titleMessage: "",
      descriptionMessage: "",
      messageType: "success",
    });
  //method to call all error toaster from this method
  const setErrorToaster = (error) => {
    setToasterDetailsViewMember(
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
  const isPendingMember = param["*"].includes("pending");
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
      setToasterDetailsViewMember(
        {
          titleMessage: "Success",
          descriptionMessage: `${member?.companyName || "Member"} deleted!`,
          messageType: "success",
        },
        () => myRef.current()
      );
      return setTimeout(() => navigate("/users/members",{state}), 3000);
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      if (error?.response?.data?.hasOwnProperty("activeSessionsCount")) {
        setSessionActiveDailogBox(true);
        setSessionActiveMessage(error?.response?.data?.message);
        downloadOperationMembers(error?.response?.data?.textFileId);
      } else {
        setErrorToaster(error);
      }
    } finally {
      setOpenDialog(false);
    }
  };
  const onDialogSecondaryButtonClickHandler = () => {
    navigate("/users/members",{state});
  };
  //state to hold member data send by back end
  const [member, setMember] = useState({});
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
      if (error?.code === "ERR_CANCELED") return;
    }
  };

  const getCountries = async (region) => {
    let controller = new AbortController();
    try {
      if (region) {
        return await axios.get(REGIONCOUNTRIES + `/${region}`, {
          signal: controller.signal,
        });
      }
      return [];
    } catch (error) {
      console.log("error in get Countries");
      if (error?.code === "ERR_CANCELED") return;

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
      setArrOfRegions(regions?.data ?? []);
      console.log("region value:- ", watch("region"));
      const countriesOnRegion1 = await getCountries(watch("region"));
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
      const arrOfCgfOfficeCountryRegionsTemp1 = await formatRegionCountries(
        countriesOnRegion2.data
      );
      arrOfCgfOfficeCountryRegionsTemp1 &&
        setArrOfCgfOfficeCountryRegions([...arrOfCgfOfficeCountryRegionsTemp1]);

      // getCountries()
      return arrOfRegions;
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      if (error?.response?.status == 401) {
        setToasterDetailsViewMember(
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
        setToasterDetailsViewMember(
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
        isMounted && setErrorToaster(error);
        return [];
      }
    }
  };
  const getMemberAPICall = async () => {
    let isMounted = true;
    const controller = new AbortController();

    try {
      setIsViewMemberLoading(true);
      if (isPendingMember) {
        const response = await axios.get(PENDING_MEMBER + `/${param.id}`, {
          signal: controller.signal,
        });
        console.log("response for pending member:- ", response?.data);
        return response.data;
      } else {
        const response = await axios.get(MEMBER + `/${param.id}`, {
          signal: controller.signal,
        });
        return response?.data;
      }
    } catch (error) {
    } finally {
      setIsViewMemberLoading(false);
    }
  };
  const getMemberByID = async (
    isMounted = true,
    controller = new AbortController()
  ) => {
    try {
      const data = await getMemberAPICall();
      // const response = await axios.get(MEMBER + `/${param.id}`, {
      //   signal: controller.signal,
      // });
      // const data = response?.data
      console.log("data", data);
      const roleName = await getRoleNameByRoleId(isMounted, controller, data);
      Logger.debug("data: ", data);
      setMember({ ...data });
      resetObj = {
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
        memberContactSalutation: data?.memberRepresentativeId[0]?.salutation,
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
        createdBy: data?.createdBy["name"] ?? "N/A",
        roleId: roleName,
        // roleId: data?.memberRepresentativeId[0]?.roleId ?? "N/A",
      };
      reset({ ...resetObj });
      setIsViewMemberLoading(false);
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      if (error?.response?.status == 401) {
        isMounted &&
          setToasterDetailsViewMember(
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
          setToasterDetailsViewMember(
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
        setIsViewMemberLoading(false);
        isMounted && setErrorToaster(error);
      }
    }
  };

  Logger.debug("member", member);
  const getOperationMemberByMemberId = async (controller) => {
    try {
      let url = generateUrl();

      const response = await axios.get(url, {
        signal: controller.signal,
      });
      setTotalRecordsInViewMember(parseInt(response.headers["x-total-count"]));
      reset({
        ...resetObj,
        totalOperationMembers: parseInt(response.headers["x-total-count"]),
      });
      updateRecords(response?.data);
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      Logger.debug("Error from get operation member by member id", error);
    }
  };

  const downloadOperationMembers = async (id) => {
    try {
      const response = await privateAxios.get(
        id
          ? `${MEMBER}/${id}/activesessions/download`
          : MEMBER_OPERATION_MEMBERS + `/${param.id}/list/download`,
        {
          responseType: "blob",
        }
      );
      const urlLink = window.URL.createObjectURL(new Blob([response.data]));
      const linkFile = document.createElement("a");
      linkFile.href = urlLink;
      let ddate =
        new Date().getDate() < 10
          ? "0" + new Date().getDate().toString()
          : new Date().getDate().toString();
      let dmonth =
        new Date().getMonth() < 10
          ? "0" + (new Date().getMonth() + 1).toString()
          : new Date().getMonth().toString();
      let dyear = new Date().getFullYear().toString();
      let dhours = new Date().getHours();
      let dminutes = new Date().getMinutes();
      let dseconds = new Date().getSeconds();
      let timeStamp =
        dmonth + ddate + dyear + "_" + dhours + dminutes + dseconds;
      linkFile.setAttribute(
        `download`,
        `Operation members - ${timeStamp}.xlsx`
      );
      document.body.appendChild(linkFile);
      linkFile.click();
      if (response.status == 200) {
        setToasterDetailsViewMember(
          {
            titleMessage: "Success!",
            descriptionMessage: "Downloaded successfully",

            messageType: "success",
          },
          () => myRef.current()
        );
      }
    } catch (error) {}
  };
  const getRoleNameByRoleId = async (isMounted, controller, data) => {
    try {
      const roleId = data?.memberRepresentativeId?.[0]?.roleId;
      if (!roleId) return "";
      const response = await axios.get(VIEW_ROLE + roleId);
      Logger.debug("response", response?.data?.name);
      return response?.data?.name;
    } catch (error) {
      Logger.debug("error in get role", error);
      if (error?.code === "ERR_CANCELED") return;
    }
  };
  const callGetCategories = async () => {
    MEMBER_LOOKUP = await getCategories();
    Logger.debug("MEMBER LOOKUP", MEMBER_LOOKUP);
  };

  const callGetOffices = async () => {
    CGF_OFFICES = await getCGFOffices();
  };
  const onKeyDownChangeHandler = (e) => {
    if (e.key === "Enter") {
      setMakeApiCall(true);
      setPageInViewMember(1);
      // setPage(1)
    }
  };
  const onEditClick = () => {
    if (isPendingMember)
      navigate(`/users/members/edit-member/pending/${param.id}`);
    else navigate(`/users/members/edit-member/${param.id}`);
  };
  const onReInviteClick = () => {
    ResendEmail(param.id, setToasterDetailsViewMember,myRef,navigate )
  };
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    (async () => {
      Object.keys(MEMBER_LOOKUP)?.length === 0 && callGetCategories();
      CGF_OFFICES?.length === 0 && callGetOffices();
      isMounted && makeApiCall && (await getMemberByID(isMounted, controller));
      isMounted && (await getCountryCode(isMounted, controller));
      isMounted && (await getRegions(isMounted, controller));
      // getRegions(controller)
      isMounted &&
        makeApiCall &&
        (await getOperationMemberByMemberId(controller));
    })();

    return () => {
      isMounted = false;
      clearTimeout(searchTimeout);
      controller.abort();
    };
    // Logger.debug("member",member)
  }, [
    watch,
    pageInViewMember,
    rowsPerPageInViewMember,
    orderByInViewMember,
    orderInViewMember,
    filters,
    makeApiCall,
  ]);
  Logger.debug("Member", member);
  return (
    <div className="page-wrapper" onClick={() => isActive && setActive(false)}>
      <Toaster
        myRef={myRef}
        titleMessage={toasterDetailsViewMember.titleMessage}
        descriptionMessage={toasterDetailsViewMember.descriptionMessage}
        messageType={toasterDetailsViewMember.messageType}
      />
      <DialogBox
        title={<p>Delete Member "{member?.companyName}"</p>}
        info1={<p>Deleting all the details will be an irreversible action.</p>}
        info2={
          <p>
            Do you still want to delete <b>{member.companyName}</b>?
          </p>
        }
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        onPrimaryModalButtonClickHandler={onDialogPrimaryButtonClickHandler}
        onSecondaryModalButtonClickHandler={onDialogSecondaryButtonClickHandler}
        openModal={openDialog}
        setOpenModal={setOpenDialog}
      />
      <DialogBox
        title={<p>Session Active</p>}
        info1={<p>{sessionActiveMessage}</p>}
        primaryButtonText="Okay"
        onPrimaryModalButtonClickHandler={() =>
          setSessionActiveDailogBox(false)
        }
        openModal={sessionActiveDailogBox}
        setOpenModal={setSessionActiveDailogBox}
      />
      <div className="breadcrumb-wrapper">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link to="/users/members" state={param["*"].includes("pending") ? 1 : 0}>Members  {param["*"].includes("pending") ? "(Pending)" : "(Onboarded)"}</Link>
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
                  { (
                    <li
                      hidden={
                        SUPER_ADMIN
                          ? false
                          : !moduleAccesForMember[0]?.member.edit
                      }
                      onClick={onEditClick}
                    >
                      Edit
                    </li>
                  )}
                  {isPendingMember && member?.memberRepresentativeId?.length > 0 && (
                    <li onClick={onReInviteClick}>Re-Invite</li>
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
          {isViewMemberLoading ? (
            <Loader />
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
                            value="Partner"
                            control={<Radio />}
                            label="Partner"
                          />
                          <FormControlLabel
                            disabled
                            value="Member"
                            control={<Radio />}
                            label="Member"
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
                        //     // Logger.debug("option inside type string",option)
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
                        placeholder="N/A"
                        options={
                          Object.keys(MEMBER_LOOKUP)?.length > 0 &&
                          Object.keys(MEMBER_LOOKUP)
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
                      <Input
                        isDisabled
                        control={control}
                        name="cgfActivity"
                        placeholder="N/A"
                      />
                    </div>
                    {/* </div> */}
                  </div>
                </div>
              </div>
              {/* <div className="card-inner-wrap">
                <h2 className="sub-heading1">Contact Details</h2>
                <div className="flex-between card-blk">
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="corporateEmail">Corporate Email </label>
                      <Input
                        isDisabled
                        control={control}
                        name="corporateEmail"
                        placeholder="N/A"
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
                          placeholder=""
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
              </div> */}
              <div className="card-inner-wrap">
                <h2 className="sub-heading1">Company Address Details</h2>
                <div className="flex-between card-blk">
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="region">Region </label>
                      <Dropdown
                        isDisabled
                        control={control}
                        name="region"
                        placeholder="N/A"
                        options={arrOfRegions}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="country">Country </label>
                      <Dropdown
                        isDisabled
                        control={control}
                        name="country"
                        placeholder="N/A"
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
                        placeholder="N/A"
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
                            // Logger.debug("option inside type string",option)
                            return option;
                          }
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
                      <label htmlFor="address">Address </label>
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
                        placeholder="N/A"
                        variant="outlined"
                        helperText=" "
                      />
                      {/* Add Address Text Area field here */}
                      {/* <Input control={control} name="city" placeholder="Enter state"/> */}
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="card-inner-wrap">
                <h2 className="sub-heading1">CGF Office Details</h2>
                <div className="flex-between card-blk">
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="cgfOfficeRegion">Region </label>
                      <Dropdown
                        isDisabled
                        control={control}
                        placeholder="N/A"
                        name="cgfOfficeRegion"
                        options={arrOfRegions}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="cgfOfficeCountry">Country </label>
                      <Dropdown
                        isDisabled
                        control={control}
                        name="cgfOfficeCountry"
                        placeholder="N/A"
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
                      <label htmlFor="cgfOffice">Office </label>
                      <Dropdown
                        isDisabled
                        control={control}
                        name="cgfOffice"
                        placeholder="N/A"
                        options={CGF_OFFICES}
                      />
                    </div>
                  </div>
                </div>
              </div> */}
              <div
                className={`card-inner-wrap ${
                  isPendingMember || "pening-margin-bottom"
                }`}
              >
                <h2 className="sub-heading1">Representative Contact Details</h2>
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
                            placeholder="N/A"
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
                      <label htmlFor="title">Job Title</label>
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
                  {isPendingMember || (
                    <div className="card-form-field">
                      <div className="form-group">
                        <label htmlFor="totalOperationMembers">
                          Total Operation Member{" "}
                          <span className="mandatory">*</span>
                        </label>
                        <Input
                          isDisabled
                          control={control}
                          name="totalOperationMembers"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  )}

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
                        <Input
                          isDisabled
                          control={control}
                          name="roleId"
                          placeholder="N/A"
                        />
                        {/* <Dropdown
                          name="roleId"
                          control={control}
                          options={roles}
                          rules={{
                            required: true,
                          }}
                          isDisabled
                          // myHelper={memberHelper}
                          placeholder={"Select role"} */}
                        {/* /> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {isPendingMember || (
                <div className="form-header member-form-header flex-between mb-10">
                  <div className="operation-member-left-blk">
                    {/* <h2 className="heading2 mr-40">Members</h2> */}
                    <div className="searchbar">
                      <input
                        type="text"
                        value={search}
                        name="search"
                        placeholder="Search"
                        onKeyDown={onKeyDownChangeHandler}
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
                    <div
                      className="form-btn"
                      hidden={
                        SUPER_ADMIN === true
                          ? false
                          : !moduleAccesForMember[1]?.operationMember?.add
                        // true
                      }
                    >
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
              )}
              {isPendingMember || (
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
                                    showFilterPlaceholder === "status" &&
                                    "none",
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
              )}
              {isPendingMember || (
                <div className="member-info-wrapper table-content-wrap">
                  <TableComponent
                    tableHead={tableHead}
                    records={recordsInViewMember}
                    handleChangePage1={handleTablePageChange}
                    handleChangeRowsPerPage1={handleRowsPerPageChange}
                    page={pageInViewMember}
                    rowsPerPage={rowsPerPageInViewMember}
                    selected={selected}
                    setSelected={setSelected}
                    totalRecords={totalRecordsInViewMember}
                    orderBy={orderByInViewMember}
                    // icons={["visibility"]}
                    onClickVisibilityIconHandler1={onClickVisibilityIconHandler}
                    order={orderInViewMember}
                    setOrder={setOrderInViewMember}
                    setOrderBy={setOrderByInViewMember}
                    setCheckBoxes={false}
                    onRowClick
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ViewMember;
