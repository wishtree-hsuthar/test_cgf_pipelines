//Third party imports
import DownloadIcon from "@mui/icons-material/Download";
import { Checkbox, MenuItem, Select } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

//Internal Imports
import { useSelector } from "react-redux";
import { Logger } from "../../Logger/Logger";
import { DOWNLOAD_MEMBERS } from "../../api/Url";
import Toaster from "../../components/Toaster";
import { downloadFunction } from "../../utils/downloadFunction";
import TabHeader from "../../utils/tabUtils/TabHeader";
import { TabPanel } from "../../utils/tabUtils/TabPanel";
import useCallbackState from "../../utils/useCallBackState";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import OnboardedMember from "./OnboardedMember";
import PendingMember from "./PendingMember";
//Ideally get those from backend
const allMembers = ["Erin", "John", "Maria", "Rajkumar"];

const MemberList = () => {
  //custom hook to set title of page
  useDocumentTitle("Members");
  const { state } = useLocation();

  const [value, setValue] = React.useState(state ? state : 0);

  const navigate = useNavigate();
  //Refr for Toaster
  const memberRef = React.useRef();
  //Toaster Message setter
  const [toasterDetailsMemberList, setToasterDetailsMemberList] =
    useCallbackState({
      titleMessage: "",
      descriptionMessage: "",
      messageType: "success",
    });

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
        add: data?.add,
      },
    }));
  const checkViewAccess = SUPER_ADMIN
    ? true
    : moduleAccesForMember[0]?.member?.view;
  console.log("check View Access:- ", checkViewAccess);

  Logger.debug(
    "module access member in view member",
    moduleAccesForMember[0]?.member
  );
  const [onboardedPage, setOnboardedPage] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  //state to hold search timeout delay
  const [searchTimeoutMemberList, setSearchTimeoutMemberList] = useState(null);
  //state to hold wheather to make api call or not
  const [makeApiCallMemberList, setMakeApiCallMemberList] = useState(true);

  //state to hold search keyword
  const [searchMember, setSearchMemberList] = useState("");

  //State to hold filter values
  const [memberFilters, setMemberFilters] = useState({
    companyType: "none",
    status: "none",
  });
  //State to hold selectedMembers Created by Member filter
  const [selectedCreatedBy, setSelectedCreatedBy] = useState(["none"]);
  //state to hold wheather to show placeholder or not
  const [showFilterPlaceholder, setShowFilterPlaceholder] = useState("");
  const isAllCreatedByMemberSelected =
    selectedCreatedBy.length > 1 &&
    selectedCreatedBy.length - 1 === allMembers.length;

  const onFilterFocusHandler = (filterValue) => {
    setShowFilterPlaceholder(filterValue);
  };

  const handleChange = (event, newValue) => {
    setPendingPage(1)
    setOnboardedPage(1)
    setValue(newValue);
  };
  //method for time based searching
  const onSearchChangeHandler = (e) => {
    Logger.debug("event", e.key);
    if (searchTimeoutMemberList) clearTimeout(searchTimeoutMemberList);
    setMakeApiCallMemberList(false);
    Logger.debug("searchMember values", e.target.value);
    setSearchMemberList(e.target.value);
    setSearchTimeoutMemberList(
      setTimeout(() => {
        setMakeApiCallMemberList(true);
        setOnboardedPage(1);
        setPendingPage(1);
      }, 1000)
    );
  };
  //handle sigle select memberFilters
  const onFilterChangehandler = (e) => {
    const { name, value } = e.target;
    Logger.debug("name", name, "Value ", value);
    setMemberFilters({
      ...memberFilters,
      [name]: value,
    });
  };
  //handle createdBy filter change handler
  const handleCreatedByFilter = (e) => {
    const { name, value } = e.target;
    Logger.debug("name", name, "value", value);
    if (value[value.length - 1] === "")
      return selectedCreatedBy.length - 1 === allMembers.length
        ? setSelectedCreatedBy(["none"])
        : setSelectedCreatedBy(["none", ...allMembers]);
    setSelectedCreatedBy([...value]);
  };

  // download members
  // const downloadMembers = async () => {
  //     try {
  //         const response = await privateAxios.get(DOWNLOAD_MEMBERS, {
  //             responseType: "blob",
  //         });
  //         Logger.debug("resposne from download  members ", response);
  //         const url = window.URL.createObjectURL(new Blob([response.data]));
  //         const link = document.createElement("a");
  //         link.href = url;
  //         link.setAttribute("download", `Members - ${new Date()}.xls`);
  //         document.body.appendChild(link);
  //         link.click();
  //         if (response.status == 200) {
  //             setToasterDetailsMemberList(
  //                 {
  //                     titleMessage: "Success!",
  //                     descriptionMessage: "Download successfull!",

  //                     messageType: "success",
  //                 },
  //                 () => myRef.current()
  //             );
  //         }
  //     } catch (error) {
  //         Logger.debug("Error from download  members", error);
  //     }
  // };

  const onKeyDownChangeHandler = (e) => {
    if (e.key === "Enter") {
      setMakeApiCallMemberList(true);
      setOnboardedPage(1);
    }
  };
  useEffect(() => {
    setValue(state ? state : 0);
    navigate("", { state: 0 });
  }, []);

  return (
    <div className="page-wrapper">
      <Toaster
        myRef={memberRef}
        titleMessage={toasterDetailsMemberList.titleMessage}
        descriptionMessage={toasterDetailsMemberList.descriptionMessage}
        messageType={toasterDetailsMemberList.messageType}
      />
      <section>
        <div className="container">
          <div className="form-header member-form-header flex-between">
            <div className="form-header-left-blk flex-start">
              <h2 className="heading2 mr-40">Members</h2>
            </div>
            <div className="form-header-right-txt">
              {value === 0 && (
                <div
                  className="tertiary-btn-blk mr-20"
                  onClick={() =>
                    downloadFunction(
                      "Members",
                      setToasterDetailsMemberList,
                      false,
                      memberRef,
                      DOWNLOAD_MEMBERS,
                      navigate
                    )
                  }
                >
                  <span className="download-icon">
                    <DownloadIcon />
                  </span>
                  Download
                </div>
              )}

              {(SUPER_ADMIN == true || moduleAccesForMember[0]?.member?.add) &&
                value === 0 && (
                  <div className="form-btn">
                    <button
                      type="submit"
                      className="primary-button add-button"
                      onClick={() => navigate("/users/members/add-member")}
                    >
                      Add Member
                    </button>
                  </div>
                )}
            </div>
          </div>
          <div className="member-filter-sect">
            <div className="member-filter-wrap flex-between">
              <div className="member-tab-left">
                <TabHeader value={value} handleChange={handleChange} />
              </div>

              <div className="member-filter-left">
                <div className="searchbar">
                  <input
                    type="text"
                    value={searchMember}
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
              <div className="member-filter-right">
                <div className="filter-select-wrap flex-between">
                  <div className="filter-select-field">
                    <div className="dropdown-field">
                      <Select
                        sx={{ display: "none" }}
                        name="companyType"
                        value={memberFilters.companyType}
                        onChange={onFilterChangehandler}
                        onFocus={(e) => onFilterFocusHandler("companyType")}
                      >
                        <MenuItem
                          value="none"
                          sx={{
                            display:
                              showFilterPlaceholder === "companyType" && "none",
                          }}
                        >
                          Company Type
                        </MenuItem>
                        <MenuItem value="Internal">Internal</MenuItem>
                        <MenuItem value="External">External</MenuItem>
                      </Select>
                    </div>
                  </div>
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
                              checked={selectedCreatedBy?.indexOf(member) > -1}
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
                        value={memberFilters.status}
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
          <div className="member-info-wrapper table-content-wrap table-footer-btm-space">
            <TabPanel value={value} index={0}>
              <OnboardedMember
                onboardedPage={onboardedPage}
                setOnboardedPage={setOnboardedPage}
                makeApiCallMemberList={makeApiCallMemberList}
                searchMember={searchMember}
                searchTimeoutMemberList={searchTimeoutMemberList}
                setToasterDetailsMemberList={setToasterDetailsMemberList}
                memberRef={memberRef}
                checkViewAccess={checkViewAccess}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <PendingMember
                pendingPage={pendingPage}
                setPendingPage={setPendingPage}
                makeApiCallMemberList={makeApiCallMemberList}
                searchMember={searchMember}
                searchTimeoutMemberList={searchTimeoutMemberList}
                setToasterDetailsMemberList={setToasterDetailsMemberList}
                memberRef={memberRef}
                checkViewAccess={checkViewAccess}
              />
            </TabPanel>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MemberList;
