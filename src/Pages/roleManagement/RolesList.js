//Third party imports
import { MenuItem, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

//Internal imports
import "../../components/TableComponent.css";
import TableComponent from "../../components/TableComponent";
// import { backendBase } from "../../utils/urls";
import useCallbackState from "../../utils/useCallBackState";
import Toaster from "../../components/Toaster";
import Loader2 from "../../assets/Loader/Loader2.svg";
import { REACT_APP_API_ENDPOINT } from "../../api/Url";
import { useDocumentTitle } from "../../utils/useDocumentTitle";

const tableHead1 = [
    {
        id: "name",
        // width: "30%",
        disablePadding: false,
        label: "Roles",
    },
    {
        id: "totalCgfAdmins",
        disablePadding: false,
        label: "Users",
    },
    {
        id: "createdAt",
        disablePadding: false,
        label: "Created On",
    },
    {
        id: "isActive",
        disablePadding: false,
        label: "Status",
    },
    // {
    //   id: "action",
    //   disablePadding: false,
    //   label: "Action",
    // },
];

const RolesList = () => {
    //custom hook to set title of page
    useDocumentTitle("Roles")
    //Refr for Toaster
    const myRef3 = React.useRef();
    //Toaster Message setter
    const [toasterDetails3, setToasterDetails3] = useCallbackState({
        titleMessage: "",
        descriptionMessage: "",
        messageType: "success",
    });

    // state to manage loader
    const [isLoading2, setIsLoading2] = useState(false);

    //state to hold search timeout delay
    const [searchTimeout, setSearchTimeout] = useState("none");
    //state to hold wheather to make api call or not
    const [makeApiCall, setMakeApiCall] = useState(true);

    const navigate3 = useNavigate();
    //order in which records needs to show
    const keysOrder = [
        "_id",
        "name",
        "totalCgfAdmins",
        "createdAt",
        "isActive",
    ];
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
        status: "none",
    });
    const [showStatusFilterPlaceholder, setShowStatusFilterPlaceholder] =
        useState(filters.status === "none");
    const onFilterChangeHandler = (e) => {
        console.log("value: ", e.target.value);
        // console.log("type of time out func",typeof(timoutFunc))
        setPage(1);
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };
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
    //code of tablecomponent
    const [page, setPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [order, setOrder] = React.useState("desc");
    const [orderBy, setOrderBy] = React.useState("");
    const [records, setRecords] = React.useState([]);
    const [totalRecords, setTotalRecords] = React.useState(0);

    //implemention of pagination on front-end
    // let records = [];
    const updateRecords = (data) => {
        data.forEach((object) => {
            delete object["updatedAt"];
            delete object["description"];
            delete object["isDeleted"];
            delete object["__v"];
            delete object["cgfAdmins"];
            object.totalCgfAdmins = object["totalCgfAdmins"].toString();
            object["createdAt"] = new Date(
                object["createdAt"]
            ).toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
            });
            keysOrder.forEach((k) => {
                const v = object[k];
                delete object[k];
                object[k] = v;
            });
        });
        setRecords([...data]);
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
        return navigate3(`view-role/${id}`);
    };
    const generateUrl = () => {
        console.log("filters", filters);
        let url = `${REACT_APP_API_ENDPOINT}roles?page=${page}&size=${rowsPerPage}&orderBy=${orderBy}&order=${order}`;
        if (search?.length >= 3) url = url + `&search=${search}`;
        if (filters?.status !== "none" && filters?.status !== "all")
            url = url + `&status=${filters.status}`;
        // if (
        //   search?.length >= 3 &&
        //   filters?.status !== "none" &&
        //   filters?.status !== "all"
        // )
        //   url = `${backendBase}roles?page=${page}&size=${rowsPerPage}&orderBy=${orderBy}&order=${order}&search=${search}&status=${filters.status}`;
        return url;
    };
    const getRoles = async (
        isMounted = true,
        controller = new AbortController()
    ) => {
        try {
            let url = generateUrl();
            setIsLoading2(true);
            const response = await axios.get(url, {
                signal: controller.signal,
            });
            console.log("Response: ", response);
            setTotalRecords(parseInt(response.headers["x-total-count"]));
            updateRecords(response.data);
            setIsLoading2(false);
        } catch (error) {
            if (error?.code === "ERR_CANCELED") return;
            isMounted &&
                setToasterDetails3(
                    {
                        titleMessage: "Error",
                        descriptionMessage:
                            error?.response?.data?.message &&
                            typeof error.response.data.message === "string"
                                ? error.response.data.message
                                : "Something went wrong!",

                        messageType: "error",
                    },
                    () => myRef3.current()
                );
            setIsLoading2(false);
        }
    };
    
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        makeApiCall && getRoles(isMounted, controller);
        console.log("makeApiCall", makeApiCall);
        console.log("inside use Effect");
        return () => {
            isMounted = false;
            clearTimeout(searchTimeout);
            controller.abort();
        };
    }, [page, rowsPerPage, orderBy, order, filters, makeApiCall]);
    {
        console.log("Records: ", records);
    }
    return (
        <div className="page-wrapper">
            <Toaster
                myRef={myRef3}
                titleMessage={toasterDetails3.titleMessage}
                descriptionMessage={toasterDetails3.descriptionMessage}
                messageType={toasterDetails3.messageType}
            />
            <section>
                <div className="container">
                    <div className="member-filter-sect">
                        <div className="form-header member-form-header flex-between mb-0">
                            <div className="form-header-left-blk flex-start">
                                <h2 className="heading2 mr-40">Roles</h2>
                            </div>
                            <div className="form-header-right-txt search-and-btn-field-right">
                                <div className="search-and-btn-field-blk">
                                    <div className="searchbar">
                                        <input
                                            type="text"
                                            placeholder="Search"
                                            onChange={onSearchChangeHandler}
                                            onKeyDown={(e) =>
                                                e.key === "Enter" &&
                                                setMakeApiCall(true)
                                            }
                                            value={search}
                                            name="search"
                                        />
                                        <button type="submit">
                                            <i className="fa fa-search"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="form-btn">
                                    <button
                                        type="submit"
                                        className="primary-button add-button"
                                        onClick={() =>
                                            navigate3("/roles/add-role")
                                        }
                                    >
                                        Add Role
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="member-filter-wrap flex-between">
                            {/* <div className="member-filter-left">
                <div className="searchbar">
                  <input
                    type="text"
                    placeholder="Search"
                    onChange={onSearchChangeHandler}
                    onKeyDown={(e) => e.key === "Enter" && setMakeApiCall(true)}
                    value={search}
                    name="search"
                  />
                  <button type="submit">
                    <i className="fa fa-search"></i>
                  </button>
                </div>
              </div> */}
                            <div className="member-filter-right">
                                <div className="filter-select-wrap flex-between">
                                    <div className="filter-select-field">
                                        <div className="dropdown-field">
                                            <Select
                                                sx={{ display: "none" }}
                                                displayEmpty
                                                name="status"
                                                value={filters.status}
                                                onChange={onFilterChangeHandler}
                                                onFocus={(e) =>
                                                    setShowStatusFilterPlaceholder(
                                                        false
                                                    )
                                                }
                                                onClose={(e) =>
                                                    setShowStatusFilterPlaceholder(
                                                        e.target.value ===
                                                            undefined
                                                    )
                                                }
                                            >
                                                <MenuItem
                                                    value="none"
                                                    disabled
                                                    sx={{
                                                        display:
                                                            !showStatusFilterPlaceholder &&
                                                            "none",
                                                    }}
                                                >
                                                    Status
                                                </MenuItem>
                                                <MenuItem value="active">
                                                    active
                                                </MenuItem>
                                                <MenuItem value="inactive">
                                                    inactive
                                                </MenuItem>
                                                <MenuItem value="all">
                                                    All
                                                </MenuItem>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {isLoading2 ? (
                            <div className="loader-blk">
                                <img src={Loader2} alt="Loading" />
                            </div>
                        ) : (
                            <div className="member-info-wrapper table-content-wrap table-content-width table-footer-btm-space">
                                <TableComponent
                                    tableHead={tableHead1}
                                    records={records}
                                    handleChangePage1={handleTablePageChange}
                                    handleChangeRowsPerPage1={
                                        handleRowsPerPageChange
                                    }
                                    page={page}
                                    rowsPerPage={rowsPerPage}
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
                                    onRowClick
                                />
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default RolesList;
