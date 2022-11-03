import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { privateAxios } from "../../api/axios";
import { ADD_SUB_ADMIN } from "../../api/Url";
import TableComponent from "../../components/TableComponent";
import useCallbackState from "../../utils/useCallBackState";
const onBoardedTableColumnHead = [
    {
        id: "name",
        // width: "30%",
        disablePadding: false,
        label: "CGF Admin Name",
    },
    {
        id: "email",

        disablePadding: false,
        label: "Email Address",
    },
    {
        id: "role",

        disablePadding: false,
        label: "Role",
    },
    {
        id: "createdAt",

        disablePadding: false,
        label: "Created At",
    },
    {
        id: "status",

        disablePadding: false,
        label: "Status",
    },
    // {
    //     id: "action",

    //     disablePadding: false,
    //     label: "Action",
    // },
];
function OnBoardedSubAdminsTable({
    makeApiCall,
    setMakeApiCall,
    search,
    filters,
    selectedRoles,
}) {
    const navigate = useNavigate();
    const [page, setPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [order, setOrder] = React.useState("desc");
    const [orderBy, setOrderBy] = React.useState("createdAt");
    const [records, setRecords] = React.useState([]);
    const [totalRecords, setTotalRecords] = React.useState(0);
    const [selected, setSelected] = useState([]);
    // const [search, setSearch] = useState("");
    // const [filters, setFilters] = useState({
    //     status: "all",
    // });
    const [isLoading, setIsLoading] = useState(false);

    //state to hold search timeout delay
    const [searchTimeout, setSearchTimeout] = useState(null);
    //state to hold wheather to make api call or not
    // const [makeApiCall, setMakeApiCall] = useState(true);
    //Refr for Toaster
    const myRef = React.useRef();
    //Toaster Message setter
    const [toasterDetails, setToasterDetails] = useCallbackState({
        titleMessage: "",
        descriptionMessage: "",
        messageType: "success",
    });

    const updateRecords = (data) => {
        const onboardedKeysOrder = [
            "_id",
            "name",
            "email",
            "role",
            "createdAt",
            "isActive",
        ];

        console.log("data before update----", data);

        let staleData = data;
        staleData.forEach((object) => {
            console.log("subRole-------", object["subRoleId"].name);
            delete object["updatedAt"];
            delete object["updatedBy"];
            delete object["createdBy"];
            delete object["description"];
            delete object["countryCode"];
            delete object["isDeleted"];
            delete object["isReplaced"];
            delete object["__v"];
            delete object["password"];
            delete object["roleId"];
            delete object["salt"];
            delete object["uuid"];
            delete object["phoneNumber"];
            // delete object["_id"];
            object["createdAt"] = new Date(
                object["createdAt"]
            ).toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
            });
            object["role"] = object["subRole"][0].name;
            delete object["subRole"];
            delete object["subRoleId"];

            onboardedKeysOrder.forEach((k) => {
                const v = object[k];
                delete object[k];
                object[k] = v;
            });
        });
        console.log("data in updaterecords method", staleData);
        setRecords([...staleData]);
    };

    const generateUrl = () => {
        console.log("filters in onboarded table----", filters);
        console.log("Search", search);
        let url = `${ADD_SUB_ADMIN}/?page=${page}&size=${rowsPerPage}&orderBy=${orderBy}&order=${order}`;

        if (search?.length >= 3) url += `&search=${search}`;

        return url;
    };
    const getSubAdmin = async (
        isMounted = true,
        controller = new AbortController()
    ) => {
        try {
            let url = generateUrl();
            setIsLoading(true);
            const response = await privateAxios.get(url, {
                signal: controller.signal,
            });
            // console.log(response.headers["x-total-count"]);
            setTotalRecords(parseInt(response.headers["x-total-count"]));
            console.log("Response from sub admin api get", response);

            updateRecords([...response.data]);
            setIsLoading(false);
        } catch (error) {
            if (error?.code === "ERR_CANCELED") return;
            // console.log(toasterDetails);
            console.log("Error from getSubAdmin-------", error);

            if (error?.response?.status == 401) {
                // navigate("/login");
            }
            setIsLoading(false);
        }
    };
    const handleTablePageChange = (newPage) => {
        setPage(newPage);
    };

    // rows per page method for onboarded tab
    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };
    // on click eye icon to  navigate view page
    const onClickVisibilityIconHandler = (id) => {
        console.log("id", id);
        return navigate(`view-sub-admin/${id}`);
    };

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        makeApiCall && getSubAdmin(isMounted, controller);
        console.log("makeApiCall", makeApiCall);
        console.log("inside use Effect");
        return () => {
            isMounted = false;
            clearTimeout(searchTimeout);
            controller.abort();
        };
    }, [
        page,
        rowsPerPage,
        orderBy,
        order,
        filters,
        makeApiCall,
        setMakeApiCall,
        searchTimeout,
    ]);
    return (
        <>
            <TableComponent
                tableHead={onBoardedTableColumnHead}
                records={records}
                handleChangePage1={handleTablePageChange}
                handleChangeRowsPerPage1={handleRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                totalRecords={totalRecords}
                orderBy={orderBy}
                // icons={["visibility"]}
                onClickVisibilityIconHandler1={onClickVisibilityIconHandler}
                order={order}
                setOrder={setOrder}
                setOrderBy={setOrderBy}
                setCheckBoxes={false}
                setSelected={setSelected}
                selected={selected}
                onRowClick={true}
            />
        </>
    );
}

export default OnBoardedSubAdminsTable;
