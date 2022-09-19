import { Box, Checkbox, MenuItem, Select, Tab, Tabs } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import TableTester from "../../components/TableTester";
import TableComponent from "../../components/TableComponent";
import { useNavigate } from "react-router-dom";
import { MEMBER } from "../../api/Url";
import axios from "axios";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

//Ideally get those from backend
const memberCompanies = [
  "Kit Kat",
  "Puma",
  "Nike",
  "Adidas",
  "Campus",
  "Mahindaras",
];

//Ideally get those from backend
const allMembers = ["Erin", "John", "Maria", "Rajkumar"];

const tableHead = [
  {
    id: "companyName",
    // width: "10%",
    disablePadding: false,
    label: "Member Company",
  },
  {
    id: "memberName",
    disablePadding: false,
    label: "Member Name",
  },
  {
    id: "memberEmail",
    disablePadding: false,
    // width: "20%",
    label: "Email",
  },
  {
    id: "companyType",
    disablePadding: false,
    label: "Company Type",
  },
  {
    id: "operationMembers",
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
  {
    id: "action",
    disablePadding: false,
    label: "Action",
  },
];

const MemberList = () => {
  const navigate = useNavigate();
  //state to hold which tab to show

  // state to manage loader
  const [isLoading, setIsLoading] = useState(false);

  //state to hold search timeout delay
  const [searchTimeout, setSearchTimeout] = useState(null);
  //state to hold wheather to make api call or not
  const [makeApiCall, setMakeApiCall] = useState(true);

  //state to hold search keyword
  const [search, setSearch] = useState("");

  //State to hold filter values
  const [filters, setFilters] = useState({
    companyType: "none",
    status: "none",
  });
  const keysOrder = [
    "_id",
    "companyName",
    "memberName",
    "memberEmail",
    "companyType",
    "operationMembers",
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
  const [selected, setSelected] =useState([]);

  //State to hold selected memberCompnies
  const [selectedMemberCompnies, setSelectedMemberCompnies] = useState([
    "none",
  ]);
  //State to hold selected Created by Member filter
  const [selectedCreatedBy, setSelectedCreatedBy] = useState(["none"]);
  //state to hold wheather to show placeholder or not
  const [showFilterPlaceholder, setShowFilterPlaceholder] = useState("");
  //variable to hold wheater all Member company Details selected or not
  const isAllMembersSelected =
    selectedMemberCompnies.length > 1 &&
    selectedMemberCompnies.length - 1 === memberCompanies.length;
  const isAllCreatedByMemberSelected =
    selectedCreatedBy.length > 1 &&
    selectedCreatedBy.length - 1 === allMembers.length;

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
      delete object["memberRepresentativeId"];
      delete object["parentCompany"];
      delete object["phoneNumber"];
      delete object["region"];
      delete object["state"];
      delete object["updatedAt"];
      delete object["updatedBy"];
      delete object["website"];
      delete object["isDeleted"];
      delete object["__v"];
      object["createdAt"] = new Date(object["createdAt"]).toLocaleDateString(
        "en-GB"
      );
      object.memberEmail = "patel@gmail.com";
      object.memberName = "Erin";
      object.operationMembers = "123";
      keysOrder.forEach((k) => {
        const v = object[k];
        delete object[k];
        object[k] = v;
      });
    });
    setRecords([...data]);
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
  //const handle memberCompany select
  const handleMemberCompanyFilter = (e) => {
    const { name, value } = e.target;
    console.log("name", name, "value", value);
    if (value[value.length - 1] === "")
      return selectedMemberCompnies.length - 1 === memberCompanies.length
        ? setSelectedMemberCompnies(["none"])
        : setSelectedMemberCompnies(["none", ...memberCompanies]);
    setSelectedMemberCompnies([...value]);
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
    return navigate(`view-role/${id}`);
  };
  const generateUrl = () => {
    console.log("filters", filters);
    let url = `${MEMBER}?page=${page}&size=${rowsPerPage}&orderBy=${orderBy}&order=${order}`;
    if (search?.length >= 3)
      url = url + `&search=${search}`;
    if (filters?.status !== "all" && filters?.status !== "none")
      url = url + `&status=${filters.status}`;
    if (
      search?.length >= 3 &&
      filters?.status !== "all" &&
      filters?.status !== "none"
    )
      url = url + `&search=${search}&status=${filters.status}`;
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
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    makeApiCall && getMembers(isMounted, controller);
    return () => {
      isMounted = false;
      // clearTimeout(searchTimeout);
      controller.abort();
    };
  }, [page, rowsPerPage, orderBy, order, filters, makeApiCall]);
  // console.log("records: ", records);
  console.log("filters: ",filters)
  return (
    <div className="page-wrapper">
      <section>
        <div className="container">
          <div className="form-header member-form-header flex-between">
            <div className="form-header-left-blk flex-start">
              <h2 className="heading2 mr-40">Members</h2>
              {/* <div className="member-tab-wrapper">
                <Box
                  sx={{ borderBottom: 1, borderColor: "divider" }}
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
                      id="simple-tab-0"
                      aria-controls="simple-tabpanel-0"
                    />
                    <Tab
                      label="Pending"
                      {...a11yProps(1)}
                      id="simple-tab-0"
                      aria-controls="simple-tabpanel-0"
                    />
                  </Tabs>
                </Box>
              </div> */}
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
                  onClick={() => navigate("/members/add-member")}
                >
                  Add Member
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
                    onKeyDown={(e) => e.key === "Enter" && setMakeApiCall(true)}
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
                        name="memberCompany"
                        multiple
                        value={selectedMemberCompnies}
                        onChange={handleMemberCompanyFilter}
                        onFocus={(e) => onFilterFocusHandler("memberCompany")}
                        renderValue={(val) =>
                          selectedMemberCompnies.length > 1
                            ? val.slice(1).join(", ")
                            : "Member Company"
                        }
                      >
                        <MenuItem
                          value="none"
                          name="memberCompanyTitle"
                          selected
                          sx={{
                            display:
                              showFilterPlaceholder === "memberCompany" &&
                              "none",
                          }}
                        >
                          Member Company
                        </MenuItem>
                        <MenuItem value="">
                          <Checkbox
                            className="table-checkbox"
                            checked={isAllMembersSelected}
                            indeterminate={
                              selectedMemberCompnies.length > 1 &&
                              selectedMemberCompnies.length <
                                memberCompanies.length
                            }
                          />
                          Select All
                        </MenuItem>
                        {memberCompanies.map((member) => (
                          <MenuItem key={member} value={member}>
                            <Checkbox
                              className="table-checkbox"
                              checked={
                                selectedMemberCompnies.indexOf(member) > -1
                              }
                            />
                            {member}
                          </MenuItem>
                        ))}
                        {/* <MenuItem value="iom3">IOM</MenuItem>
                        <MenuItem value="iom2">Kit Kat</MenuItem>
                        <MenuItem value="iom1">Google</MenuItem> */}
                      </Select>
                    </div>
                  </div>
                  <div className="filter-select-field">
                    <div className="dropdown-field">
                      <Select
                        name="companyType"
                        value={filters.companyType}
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
              icons={["visibility"]}
              onClickVisibilityIconHandler1={onClickVisibilityIconHandler}
              order={order}
              setOrder={setOrder}
              setOrderBy={setOrderBy}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default MemberList;
