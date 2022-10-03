import TableComponent from "../../components/TableComponent";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { privateAxios } from "../../api/axios";
import DialogBox from "../../components/DialogBox";
const OnboardedOperationMemberColumnHeader = [
    {
        id: "name",
        width: "30%",
        disablePadding: false,
        label: "Operation Member",
    },
    {
        id: "email",
        width: "30%",
        disablePadding: false,
        label: "Email",
    },
    {
        id: "memberCompany",
        width: "30%",
        disablePadding: false,
        label: "Member Company",
    },
    {
        id: "companyType",
        width: "30%",
        disablePadding: false,
        label: "Company Type",
    },
    {
        id: "createdByName",
        width: "30%",
        disablePadding: false,
        label: "Created By",
    },
    {
        id: "onBoardedOn",
        width: "30%",
        disablePadding: false,
        label: "Onboarded On",
    },
    {
        id: "isActive",
        with: "30%",
        disablePadding: false,
        label: "Status",
    },
    // {
    //     id: "action",

    //     disablePadding: false,
    //     label: "Action",
    // },
];
function OnboardedOperationMember({
    makeApiCall,
    setMakeApiCall,
    search,
    filters,
    myRef,
    toasterDetails,
    setToasterDetails,
    searchTimeout,
    setSearchTimeout,
}) {
    // const [
    //     openDeleteDialogBoxOnboardedOperationMember,
    //     setOpenDeleteDialogBoxOnboardedOperationMember,
    // ] = useState(false);

    const navigate = useNavigate();
    const [
        pageForOnboardedOperationMemberTab,
        setPageForOnboardedOperationMemberTab,
    ] = React.useState(1);
    const [
        rowsPerPageForOnboardedOperationMemberTab,
        setRowsPerPageForOnboardedOperationMemberTab,
    ] = React.useState(10);
    const [
        orderForOnboardedOperationMemberTab,
        setOrderForOnboardedOperationMemberTab,
    ] = React.useState("desc");
    const [
        orderByForOnboardedOperationMember,
        setOrderByForOnboardedOperationMemberTab,
    ] = React.useState("createdAt");
    const [
        recordsForOnboardedOperationMemberTab,
        setRecordsForOnboardedOperationMemberTab,
    ] = React.useState([]);
    const [
        totalRecordsForOnboardedOperationMemberTab,
        setTotalRecordsForOnboardedOperationMemberTab,
    ] = React.useState(0);
    const [selectedOnboardOperationMember, setSelectedOnboardOperationMember] =
        useState([]);

    const updateRecords = (data) => {
        const onboardedKeysOrder = [
            "_id",
            "name",
            "email",
            "memberCompany",
            "companyType",
            "createdByName",

            "onBoardedOn",
            "isActive",
        ];

        console.log("data before update----", data);

        let staleData = data;
        staleData.forEach((object) => {
            // console.log("subRole-------", object["subRoleId"].name);
            delete object["updatedAt"];
            delete object["description"];
            delete object["countryCode"];
            delete object["isDeleted"];
            delete object["__v"];
            delete object["password"];
            delete object["roleId"];
            delete object["salt"];
            delete object["uuid"];
            delete object["phoneNumber"];
            delete object["token"];
            delete object["tokenExpiry"];
            delete object["tokenType"];
            delete object["address"];
            // delete object["isActive"];

            // object["role"] = object["data"]["subRoleId"].name;
            // object["role"] = object["data"]["subRole"][0].name;
            // object["_id"] = object["_id"];

            // object.name = object["name"];
            object["email"] = object["email"];
            // object["createdAt"] = object["createdAt"];
            object["memberCompany"] = object["memberData"]["companyName"];
            object["companyType"] = object["memberData"]["companyType"];
            object["createdByName"] = object["createdBy"]["name"];
            object["onBoardedOn"] = new Date(
                object["createdAt"]
            ).toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
            });
            object["isActive"] = object["isActive"];

            // delete object["data"]["subRoleId"];
            // delete object["data"]["subRole"][0].name;
            // delete object["isActive"];
            // delete object["name"];
            delete object["isReplaced"];
            delete object["department"];
            delete object["title"];
            delete object["salutation"];
            delete object["createdBy"];
            delete object["updatedBy"];
            delete object["createdAt"];
            delete object["subRole"];
            delete object["data"];
            delete object["memberData"];
            delete object["operationType"];
            delete object["reportingManager"];
            delete object["memberId"];

            onboardedKeysOrder.forEach((k) => {
                const v = object[k];
                delete object[k];
                object[k] = v;
            });
        });
        console.log("data in updaterecords method", staleData);
        setRecordsForOnboardedOperationMemberTab([...staleData]);
    };

    const generateUrl = () => {
        console.log("filters in onboarded table----", filters);
        console.log("Search", search);
        let url = `http://localhost:3000/api/operation-member?page=${pageForOnboardedOperationMemberTab}&size=${rowsPerPageForOnboardedOperationMemberTab}&orderBy=${orderByForOnboardedOperationMember}&order=${orderForOnboardedOperationMemberTab}`;
        if (search?.length >= 3) url += `&search=${search}`;

        return url;
    };
    const getSubAdmin = async (
        isMounted = true,
        controller = new AbortController()
    ) => {
        try {
            let url = generateUrl();
            // setIsLoading(true);
            const response = await privateAxios.get(url, {
                signal: controller.signal,
            });
            // console.log(response.headers["x-total-count"]);
            setTotalRecordsForOnboardedOperationMemberTab(
                parseInt(response.headers["x-total-count"])
            );
            console.log("Response from sub admin api get", response);

            updateRecords([...response.data]);
            // setIsLoading(false);
        } catch (error) {
            if (error?.code === "ERR_CANCELED") return;
            console.log("Error from getSubAdmin-------", error);

            if (error?.response?.status == 401) {
                navigate("/login");
            }
            // setIsLoading(false);
        }
    };
    const handleTablePageChange = (newPage) => {
        setPageForOnboardedOperationMemberTab(newPage);
    };

    // rows per page method for onboarded tab
    const handleRowsPerPageChange = (event) => {
        setRowsPerPageForOnboardedOperationMemberTab(
            parseInt(event.target.value, 10)
        );
        setPageForOnboardedOperationMemberTab(1);
    };
    // on click eye icon to  navigate view page
    const onClickVisibilityIconHandler = (id) => {
        console.log("id", id);
        return navigate(`/users/operation_member/view-operation-member/${id}`);
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
        pageForOnboardedOperationMemberTab,
        rowsPerPageForOnboardedOperationMemberTab,
        orderByForOnboardedOperationMember,
        orderForOnboardedOperationMemberTab,

        makeApiCall,
        setMakeApiCall,
        searchTimeout,
    ]);
    return (
        <>
            <TableComponent
                tableHead={OnboardedOperationMemberColumnHeader}
                records={recordsForOnboardedOperationMemberTab}
                handleChangePage1={handleTablePageChange}
                handleChangeRowsPerPage1={handleRowsPerPageChange}
                page={pageForOnboardedOperationMemberTab}
                rowsPerPage={rowsPerPageForOnboardedOperationMemberTab}
                totalRecords={totalRecordsForOnboardedOperationMemberTab}
                orderBy={orderByForOnboardedOperationMember}
                // icons={["visibility"]}
                onClickVisibilityIconHandler1={onClickVisibilityIconHandler}
                order={orderForOnboardedOperationMemberTab}
                setOrder={setOrderForOnboardedOperationMemberTab}
                setOrderBy={setOrderByForOnboardedOperationMemberTab}
                setCheckBoxes={false}
                setSelected={setSelectedOnboardOperationMember}
                selected={selectedOnboardOperationMember}
                onRowClick={true}
            />
        </>
    );
}

export default OnboardedOperationMember;
