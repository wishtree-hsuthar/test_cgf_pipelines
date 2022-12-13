//Third party imports
import { Checkbox, MenuItem, Select } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

//Internal Imports
import TableComponent from "../../components/TableComponent";
import { DOWNLOAD_MEMBERS, MEMBER } from "../../api/Url";
import Loader2 from "../../assets/Loader/Loader2.svg";
import useCallbackState from "../../utils/useCallBackState";
import Toaster from "../../components/Toaster";
import { useSelector } from "react-redux";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import { privateAxios } from "../../api/axios";
import { downloadFunction } from "../../utils/downloadFunction";

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
        label: "Representative",
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
        label: "Ops. Members",
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
        label: "Created At",
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
    useDocumentTitle("Members");
    const navigate = useNavigate();
    //Refr for Toaster
    const memberRef = React.useRef();
    //Toaster Message setter
    const [toasterDetailsMemberList, setToasterDetailsMemberList] = useCallbackState({
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
    const [membeListPage, setMemberListPage] = useState(1);
    const [memberListrowsPerPage, setMemberListRowsPerPage] = useState(10);
    const [memberListOrder, setMemberListOrder] = useState("asc");
    const [orderByMemberList, setOrderByMemberList] = useState("initialRender");
    const [recordsMemberList, setRecordsMemberList] = useState([]);
    const [totalRecordsMemberList, setTotalRecordsMemberList] = useState(0);
    const [selectedMembers, setSelectedMember] = useState([]);

    //State to hold selectedMembers Created by Member filter
    const [selectedCreatedBy, setSelectedCreatedBy] = useState(["none"]);
    //state to hold wheather to show placeholder or not
    const [showFilterPlaceholder, setShowFilterPlaceholder] = useState("");
    const isAllCreatedByMemberSelected =
        selectedCreatedBy.length > 1 &&
        selectedCreatedBy.length - 1 === allMembers.length;

    //format recordsMemberList as backend requires
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
        setRecordsMemberList([...data]);
    };
    const onFilterFocusHandler = (filterValue) => {
        setShowFilterPlaceholder(filterValue);
    };

    //method for time based searching
    const onSearchChangeHandler = (e) => {
        console.log("event", e.key);
        if (searchTimeoutMemberList) clearTimeout(searchTimeoutMemberList);
        setMakeApiCallMemberList(false);
        console.log("searchMember values", e.target.value);
        setSearchMemberList(e.target.value);
        setSearchTimeoutMemberList(
            setTimeout(() => {
                setMakeApiCallMemberList(true);
                setMemberListPage(1);
            }, 1000)
        );
    };
    //handle sigle select memberFilters
    const onFilterChangehandler = (e) => {
        const { name, value } = e.target;
        console.log("name", name, "Value ", value);
        setMemberFilters({
            ...memberFilters,
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
        setMemberListPage(newPage);
    };
    const handleRowsPerPageChange = (event) => {
        setMemberListRowsPerPage(parseInt(event.target.value, 10));
        setMemberListPage(1);
    };
    const onClickVisibilityIconHandler = (id) => {
        console.log("id", id);
        return navigate(`/users/members/view-member/${id}`);
    };
    const generateUrl = () => {
        console.log("memberFilters", memberFilters);

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

        // let url = `${MEMBER}?membeListPage=${page}&size=${rowsPerPage}&orderBy=&order=${order}`;
        let url = `${MEMBER}/list?page=${membeListPage}&size=${memberListrowsPerPage}&orderBy=${namesMappings[orderByMemberList]}&order=${memberListOrder}`;
        if (searchMember?.length >= 3) url = url + `&search=${searchMember}`;
        if (memberFilters?.status !== "all" && memberFilters?.status !== "none")
            url = url + `&status=${memberFilters.status}`;
        if (memberFilters?.companyType !== "none")
            url = url + `&companyType=${memberFilters.companyType}`;
        return url;
    };
    // download members
    // const downloadMembers = async () => {
    //     try {
    //         const response = await privateAxios.get(DOWNLOAD_MEMBERS, {
    //             responseType: "blob",
    //         });
    //         console.log("resposne from download  members ", response);
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
    //         console.log("Error from download  members", error);
    //     }
    // };
    const getMembers = async (isMounted, controller) => {
        try {
            let url = generateUrl();
            setIsLoading(true);
            const response = await axios.get(url, {
                signal: controller.signal,
            });
            setTotalRecordsMemberList(parseInt(response.headers["x-total-count"]));
            console.log("response from backend", response);
            setIsLoading(false);
            updateRecords(response?.data);
        } catch (error) {
            if (error?.code === "ERR_CANCELED") return;
            setIsLoading(false);
            isMounted &&
                setToasterDetailsMemberList(
                    {
                        titleMessage: "Error",
                        descriptionMessage:
                            error?.response?.data?.message &&
                            typeof error.response.data.message === "string"
                                ? error.response.data.message
                                : "Something went wrong!",

                        messageType: "error",
                    },
                    () => memberRef.current()
                );
        }
    };
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        makeApiCallMemberList && getMembers(isMounted, controller);
        return () => {
            isMounted = false;
            clearTimeout(searchTimeoutMemberList);
            controller.abort();
        };
    }, [membeListPage, memberListrowsPerPage, orderByMemberList, memberListOrder, memberFilters, makeApiCallMemberList]);
    // console.log("recordsMemberList: ", recordsMemberList);
    // console.log("memberFilters: ", memberFilters);
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
                            <div
                                className="tertiary-btn-blk mr-20"
                                onClick={() =>
                                    downloadFunction(
                                        "Members",
                                        setToasterDetailsMemberList,
                                        false,
                                        memberRef,
                                        DOWNLOAD_MEMBERS
                                    )
                                }
                            >
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
                                        value={searchMember}
                                        name="search"
                                        placeholder="Search"
                                        onKeyDown={(e) =>
                                            e.key === "Enter" &&
                                            setMakeApiCallMemberList(true)
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
                                                value={memberFilters.companyType}
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
                                                value={memberFilters.status}
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
                                records={recordsMemberList}
                                handleChangePage1={handleTablePageChange}
                                handleChangeRowsPerPage1={
                                    handleRowsPerPageChange
                                }
                                page={membeListPage}
                                rowsPerPage={memberListrowsPerPage}
                                selected={selectedMembers}
                                setSelected={setSelectedMember}
                                totalRecords={totalRecordsMemberList}
                                orderBy={orderByMemberList}
                                // icons={["visibility"]}
                                onClickVisibilityIconHandler1={
                                    onClickVisibilityIconHandler
                                }
                                order={memberListOrder}
                                setOrder={setMemberListOrder}
                                setOrderBy={setOrderByMemberList}
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
