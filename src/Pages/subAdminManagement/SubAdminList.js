import DownloadIcon from "@mui/icons-material/Download";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logger } from "../../Logger/Logger";
import { DOWNLOAD_CGF_ADMIN } from "../../api/Url";
import Toaster from "../../components/Toaster";
import { downloadFunction } from "../../utils/downloadFunction";
import TabHeader from "../../utils/tabUtils/TabHeader";
import { TabPanel } from "../../utils/tabUtils/TabPanel";
import useCallbackState from "../../utils/useCallBackState";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import OnBoardedSubAdminsTable from "./OnBoardedSubAdminsTable";
import PendingCGFAdmins from "./PendingCGFAdmins";
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const SubAdminList = () => {
  //custom hook to set title of page
  useDocumentTitle("CGF Admins");

  const [value, setValue] = React.useState(0);

  //Refr for Toaster
  const cgfAdminRef = React.useRef();
  //Toaster Message setter
  const [toasterDetails, setToasterDetails] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "success",
  });
  // const [openDeleteDialogBox, setOpenDeleteDialogBox] = useState(false);

  // state to manage loader

  //state to hold search timeout delay
  const [searchTimeout, setSearchTimeout] = useState(null);
  //state to hold wheather to make api call or not
  const [makeApiCall, setMakeApiCall] = useState(true);

  const navigate = useNavigate();
  //(onboarded users/cgf-admin/ table) order in which records needs to show

  // const [page, setPage] = React.useState(1);

  const [search, setSearch] = useState("");

  const onSearchChangeHandler = (e) => {
    Logger.debug("event", e.key);
    if (searchTimeout) clearTimeout(searchTimeout);
    setMakeApiCall(false);
    Logger.debug("search values", e.target.value);
    setSearch(e.target.value);
    setSearchTimeout(
      setTimeout(() => {
        setMakeApiCall(true);
        // setPageForPendingTab(1)
        setPageForPendingTabCGFAdmin(1);
        setPage(1);
      }, 1000)
    );
  };
  //code of tablecomponent onboarded tab

  //code of tablecomponent pending tab
  const [pageForPendingTabCGFAdmin, setPageForPendingTabCGFAdmin] =
    React.useState(1);
  const [page, setPage] = React.useState(1);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    Logger.debug("makeApiCall", makeApiCall);
    Logger.debug("inside use Effect");
    return () => {
      isMounted = false;
      clearTimeout(searchTimeout);
      controller.abort();
    };
  }, []);
  {
    Logger.debug("makeApiCall outside UseEffect ", makeApiCall);
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const onKeyDownChangeHandler = (e) => {
    if (e.key === "Enter") {
      setMakeApiCall(true);
      // setPageForPendingTab(1)
      setPageForPendingTabCGFAdmin(1);
      setPage(1);
    }
  };
  return (
    <div className="page-wrapper">
      <Toaster
        myRef={cgfAdminRef}
        titleMessage={toasterDetails.titleMessage}
        descriptionMessage={toasterDetails.descriptionMessage}
        messageType={toasterDetails.messageType}
      />
      <section>
        <div className="container">
          <div className="member-filter-sect"></div>

          <div className="form-header member-form-header flex-between">
            <div className="form-header-left-blk flex-start">
              <h2 className="heading2">CGF Admins</h2>
            </div>

            <div className="form-header-right-txt">
              {value == 0 && (
                <div
                  className="tertiary-btn-blk mr-20"
                  onClick={() =>
                    downloadFunction(
                      "CGF Admins",
                      setToasterDetails,
                      false,
                      cgfAdminRef,
                      DOWNLOAD_CGF_ADMIN,
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
              {value === 0 && (
                <div className="form-btn">
                  <button
                    onClick={() => navigate("/users/cgf-admin/add-cgf-admin")}
                    className="primary-button add-button"
                  >
                    Add CGF Admin
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="member-filter-wrap flex-between">
            <div className="member-tab-left">
              <TabHeader value={value} handleChange={handleChange} />
              {/* <div className="member-tab-wrapper">
                                <Box
                                    sx={{
                                        borderBottom: 1,
                                        borderColor: "divider",
                                    }}
                                    className="tabs-sect"
                                >
                                    <Tabs
                                        value={value}
                                        onChange={handleChange}
                                        aria-label="basic tabs example"
                                    >
                                        <Tab
                                            label="Onboarded"
                                            {...a11yProps(0)}
                                        />
                                        <Tab
                                            label="Pending"
                                            {...a11yProps(1)}
                                        />
                                    </Tabs>
                                </Box>
                            </div> */}
            </div>
            <div className="member-filter-left">
              <div className="searchbar">
                <input
                  type="text"
                  placeholder="Search"
                  onKeyDown={onKeyDownChangeHandler}
                  onChange={(e) => onSearchChangeHandler(e)}
                  name="search"
                />
                <button type="submit">
                  <i className="fa fa-search"></i>
                </button>
              </div>
            </div>
            <div className="member-filter-right">
              {/* <div className="filter-select-wrap flex-between">
                                <div className="filter-select-field">
                                    <div className="dropdown-field">
                                        <Select
                                            value={selectedRoles}
                                           
                                            onChange={(e) =>
                                                setSelectedRoles(e.target.value)
                                            }
                                          
                                            name="role"
                                        >
                                       

                                            {roles.map((role) => (
                                                <MenuItem
                                                    key={role._id}
                                                    value={role._id}
                                                >
                                                    {role.name}
                                                </MenuItem>
                                            ))}

                                       
                                        </Select>
                                    </div>
                                </div>

                                <div className="filter-select-field">
                                    <div className="dropdown-field">
                                        <Select
                                            value={filters.status}
                                            onChange={(e) =>
                                                onFilterChangeHandler(e)
                                            }
                                            name="status"
                                        >
                                            <MenuItem value="inactive" selected>
                                                In-active
                                            </MenuItem>
                                            <MenuItem value="active">
                                                Active
                                            </MenuItem>
                                            <MenuItem value="all">All</MenuItem>
                                        </Select>
                                    </div>
                                </div>
                            </div> */}
            </div>
          </div>
          <div className="member-info-wrapper table-content-wrap table-footer-btm-space">
            <TabPanel value={value} index={0}>
              {value === 0 && (
                <OnBoardedSubAdminsTable
                  page={page}
                  setPage={setPage}
                  makeApiCall={makeApiCall}
                  setMakeApiCall={setMakeApiCall}
                  search={search}
                />
              )}
            </TabPanel>
            <TabPanel value={value} index={1}>
              {/* <TableTester /> */}

              <PendingCGFAdmins
                makeApiCall={makeApiCall}
                setMakeApiCall={setMakeApiCall}
                search={search}
                myRef={cgfAdminRef}
                pageForPendingTabCGFAdmin={pageForPendingTabCGFAdmin}
                setPageForPendingTabCGFAdmin={setPageForPendingTabCGFAdmin}
                pendingCgftoasterDetails={toasterDetails}
                setPendingCgfToasterDetails={setToasterDetails}
              />
            </TabPanel>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SubAdminList;
