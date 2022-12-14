import TableComponent from "../../components/TableComponent";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { privateAxios } from "../../api/axios";
import Loader2 from "../../assets/Loader/Loader2.svg";
import { useSelector } from "react-redux";
import { ADD_OPERATION_MEMBER } from "../../api/Url";
import {tableHead} from "../../utils/OperationMemberModuleUtil"

let tempTableHead = JSON.parse(JSON.stringify(tableHead)) 
tempTableHead.push( {
    id: "isActive",
    // with: "30%",
    disablePadding: false,
    label: "Status",
})

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
    // state to manage loaders
    const [isLoading, setIsLoading] = useState(true);
    const privilege = useSelector((state) => state?.user?.privilege);
    const SUPER_ADMIN = privilege?.name === "Super Admin" ? true : false;
    let privilegeArray = privilege ? Object.values(privilege?.privileges) : [];
    let moduleAccessForOperationMember = privilegeArray
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
    console.log(
        "member operation privilege",
        moduleAccessForOperationMember[0]?.operationMember
    );

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
    ] = React.useState("");
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

            "createdAt",
            "isActive",
        ];

        console.log("data before update----", data);

        let staleData = data;
        staleData.forEach((opMember) => {
            delete opMember["updatedAt"];
            delete opMember["description"];
            delete opMember["countryCode"];
            delete opMember["isDeleted"];
            delete opMember["__v"];
            delete opMember["password"];
            delete opMember["roleId"];
            delete opMember["salt"];
            delete opMember["uuid"];
            delete opMember["phoneNumber"];
            delete opMember["token"];
            delete opMember["tokenExpiry"];
            delete opMember["tokenType"];
            delete opMember["address"];
            delete opMember["isMemberRepresentative"];
            delete opMember["isCGFStaff"];
            delete opMember["isOperationMember"];
        
            opMember["memberCompany"] = opMember["memberData"]["companyName"];
            opMember["companyType"] = opMember["memberData"]["companyType"];
            opMember["createdByName"] = opMember["createdBy"]["name"];
            opMember["createdAt"] = new Date(
                opMember["createdAt"]
            ).toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
            });
            delete opMember["isReplaced"];
            delete opMember["department"];
            delete opMember["title"];
            delete opMember["salutation"];
            delete opMember["createdBy"];
            delete opMember["updatedBy"];
            delete opMember["subRole"];
            delete opMember["data"];
            delete opMember["memberData"];
            delete opMember["operationType"];
            delete opMember["reportingManager"];
            delete opMember["memberId"];
            delete opMember["assessmentCount"];

            onboardedKeysOrder.forEach((k) => {
                const v = opMember[k];
                delete opMember[k];
                opMember[k] = v;
            });
        });
        console.log("data in updaterecords method", staleData);
        setRecordsForOnboardedOperationMemberTab([...staleData]);
    };

    const generateUrl = () => {
        console.log("filters in onboarded table----", filters);
        console.log("Search", search);
        let url = `${ADD_OPERATION_MEMBER}/list?page=${pageForOnboardedOperationMemberTab}&size=${rowsPerPageForOnboardedOperationMemberTab}&orderBy=${orderByForOnboardedOperationMember}&order=${orderForOnboardedOperationMemberTab}`;
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
            
            setTotalRecordsForOnboardedOperationMemberTab(
                parseInt(response.headers["x-total-count"])
            );
            console.log("Response from sub admin api get", response);

            updateRecords([...response.data]);
            setIsLoading(false);
        } catch (error) {
            if (error?.code === "ERR_CANCELED") return;
            setIsLoading(false);
            console.log("Error from getSubAdmin-------", error);

            if (error?.response?.status == 401) {
                setToasterDetails(
                    {
                        titleMessage: "Oops!",
                        descriptionMessage: "Session Expired",
                        messageType: "error",
                    },
                    () => myRef.current()
                );
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            }
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
        return navigate(`/users/operation-member/view-operation-member/${id}`);
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
            {isLoading ? (
                <div className="loader-blk">
                    <img src={Loader2} alt="Loading" />
                </div>
            ) : (
                <TableComponent
                    tableHead={tempTableHead}
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
                    onRowClick={
                        SUPER_ADMIN === true
                            ? true
                            : moduleAccessForOperationMember[0]?.operationMember
                                  .view
                    }
                />
            )}
        </>
    );
}

export default OnboardedOperationMember;
