//Third party imports
import { Checkbox, MenuItem, Select } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

//Internal Imports
import TableComponent from "../../components/TableComponent";
import { MEMBER } from "../../api/Url";
import Loader2 from "../../assets/Loader/Loader2.svg";
import useCallbackState from "../../utils/useCallBackState";
import Toaster from "../../components/Toaster";
import { useSelector } from "react-redux";
import { useDocumentTitle } from "../../utils/useDocumentTitle";

//Ideally get those from backend
const allMembers = ["Erin", "John", "Maria", "Rajkumar"];

const tableHead = [
    {
        id: "companyName",
        // width: "30%",
        disablePadding: false,
        label: "Company",
    },
    {
        id: "name",
        disablePadding: false,
        label: "Name",
    },
    {
        id: "email",
        disablePadding: false,
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
        label: "Operation Team Members",
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
        id: "isActive",
        disablePadding: false,
        // width: "15%",
        label: "Status",
    },
];

const MemberList = () => {
    //custom hook to set title of page
useDocumentTitle("Members")
    const navigate = useNavigate();
    //Refr for Toaster
    const myRef = React.useRef();
    //Toaster Message setter
    const [toasterDetails, setToasterDetails] = useCallbackState({
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
    console.log(
        "module access member in view member",
        moduleAccesForMember[0]?.member
    );

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
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("initialRender");
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
            delete object["isReplaced"];
            delete object["isMemberRepresentative"];
            delete object["__v"];
            object["createdAt"] = new Date(
                object["createdAt"]
            )?.toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
            });
            if (typeof object["createdBy"] === "object") {
                object.createdBy = object["createdBy"]["name"];
            } else {
                object.createdBy = "N/A";
            }
            if (object["representative"].length > 0) {
                object["isActive"] = object["representative"][0]["isActive"];
                object.email = object["representative"][0]?.email ?? "N/A";
                object.name = object["representative"][0]?.name ?? "N/A";
            } else {
                object["isActive"] = false;
                object.email = "N/A";
                object.name = "N/A";
            }

            object.totalOperationMembers =
                object["totalOperationMembers"]?.toString();
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
    const generateUrl = () => {
        console.log("filters", filters);

        const namesMappings = {
            initialRender: "",
            companyName: "name",
            name: "representativeName",
            email: "representativeEmail",
            companyType: "companyType",
            totalOperationMembers: "operationMembersCount",
            createdBy: "createdBy",
            createdAt: "createdAt",
            isActive: "status",
        };

        // let url = `${MEMBER}?page=${page}&size=${rowsPerPage}&orderBy=&order=${order}`;
        let url = `${MEMBER}?page=${page}&size=${rowsPerPage}&orderBy=${namesMappings[orderBy]}&order=${order}`;
        if (search?.length >= 3) url = url + `&search=${search}`;
        if (filters?.status !== "all" && filters?.status !== "none")
            url = url + `&status=${filters.status}`;
        if (filters?.companyType !== "none")
            url = url + `&companyType=${filters.companyType}`;
        return url;
    };
    const getMembers = async (isMounted, controller) => {
        try {
            let url = generateUrl();
            setIsLoading(true);
            const response = await axios.get(url, {
                signal: controller.signal,
            });
            setTotalRecords(parseInt(response.headers["x-total-count"]));
            console.log("response from backend", response);
            setIsLoading(false);
            updateRecords(response?.data);
        } catch (error) {
            setIsLoading(false);
            if (error?.code === "ERR_CANCELED") return;
            isMounted &&
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
        }
    };
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        makeApiCall && getMembers(isMounted, controller);
        return () => {
            isMounted = false;
            clearTimeout(searchTimeout);
            controller.abort();
        };
    }, [page, rowsPerPage, orderBy, order, filters, makeApiCall]);
    // console.log("records: ", records);
    // console.log("filters: ", filters);
    return (
        <div className="page-wrapper">
            <Toaster
                myRef={myRef}
                titleMessage={toasterDetails.titleMessage}
                descriptionMessage={toasterDetails.descriptionMessage}
                messageType={toasterDetails.messageType}
            />
            <section>
                <div className="container">
                    <div className="form-header member-form-header flex-between">
                        <div className="form-header-left-blk flex-start">
                            <h2 className="heading2 mr-40">Members</h2>
                        </div>
                        <div className="form-header-right-txt">
                            <div className="tertiary-btn-blk mr-20">
                                <span className="download-icon">
                                    <DownloadIcon />
                                </span>
                                Download
                            </div>
                            {(SUPER_ADMIN == true ||
                                moduleAccesForMember[0]?.member?.add) && (
                                <div className="form-btn">
                                    <button
                                        type="submit"
                                        className="primary-button add-button"
                                        onClick={() =>
                                            navigate(
                                                "/users/members/add-member"
                                            )
                                        }
                                    >
                                        Add Member
                                    </button>
                                </div>
                            )}
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
                                        placeholder="Search"
                                        onKeyDown={(e) =>
                                            e.key === "Enter" &&
                                            setMakeApiCall(true)
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
                                                sx={{ display: "none" }}
                                                name="companyType"
                                                value={filters.companyType}
                                                onChange={onFilterChangehandler}
                                                onFocus={(e) =>
                                                    onFilterFocusHandler(
                                                        "companyType"
                                                    )
                                                }
                                            >
                                                <MenuItem
                                                    value="none"
                                                    sx={{
                                                        display:
                                                            showFilterPlaceholder ===
                                                                "companyType" &&
                                                            "none",
                                                    }}
                                                >
                                                    Company Type
                                                </MenuItem>
                                                <MenuItem value="Internal">
                                                    Internal
                                                </MenuItem>
                                                <MenuItem value="External">
                                                    External
                                                </MenuItem>
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
                                                onFocus={(e) =>
                                                    onFilterFocusHandler(
                                                        "createdBy"
                                                    )
                                                }
                                                renderValue={(val) =>
                                                    selectedCreatedBy.length > 1
                                                        ? val
                                                              .slice(1)
                                                              .join(", ")
                                                        : "Created By"
                                                }
                                            >
                                                <MenuItem
                                                    value="none"
                                                    sx={{
                                                        display:
                                                            showFilterPlaceholder ===
                                                                "createdBy" &&
                                                            "none",
                                                    }}
                                                >
                                                    Created By
                                                </MenuItem>

                                                <MenuItem value="">
                                                    <Checkbox
                                                        className="table-checkbox"
                                                        checked={
                                                            isAllCreatedByMemberSelected
                                                        }
                                                        indeterminate={
                                                            selectedCreatedBy.length >
                                                                1 &&
                                                            selectedCreatedBy.length -
                                                                1 <
                                                                allMembers.length
                                                        }
                                                    />
                                                    Select All
                                                </MenuItem>
                                                {allMembers.map((member) => (
                                                    <MenuItem
                                                        key={member}
                                                        value={member}
                                                    >
                                                        <Checkbox
                                                            className="table-checkbox"
                                                            checked={
                                                                selectedCreatedBy?.indexOf(
                                                                    member
                                                                ) > -1
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
                                                onFocus={(e) =>
                                                    onFilterFocusHandler(
                                                        "status"
                                                    )
                                                }
                                            >
                                                <MenuItem
                                                    value="none"
                                                    sx={{
                                                        display:
                                                            showFilterPlaceholder ===
                                                                "status" &&
                                                            "none",
                                                    }}
                                                >
                                                    Status
                                                </MenuItem>
                                                <MenuItem value="active">
                                                    Active
                                                </MenuItem>
                                                <MenuItem value="inactive">
                                                    Inactive
                                                </MenuItem>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="member-info-wrapper table-content-wrap table-footer-btm-space">
                        {isLoading ? (
                            <div className="loader-blk">
                                <img src={Loader2} alt="Loading" />
                            </div>
                        ) : (
                            <TableComponent
                                tableHead={tableHead}
                                records={records}
                                handleChangePage1={handleTablePageChange}
                                handleChangeRowsPerPage1={
                                    handleRowsPerPageChange
                                }
                                page={page}
                                rowsPerPage={rowsPerPage}
                                selected={selected}
                                setSelected={setSelected}
                                totalRecords={totalRecords}
                                orderBy={orderBy}
                                // icons={["visibility"]}
                                onClickVisibilityIconHandler1={
                                    onClickVisibilityIconHandler
                                }
                                order={order}
                                setOrder={setOrder}
                                setOrderBy={setOrderBy}
                                setCheckBoxes={false}
                                onRowClick={
                                    SUPER_ADMIN
                                        ? true
                                        : moduleAccesForMember[0]?.member?.view
                                }
                            />
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MemberList;
