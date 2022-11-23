import TableComponent from "../../components/TableComponent";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { privateAxios } from "../../api/axios";
import DialogBox from "../../components/DialogBox";
import { ADD_OPERATION_MEMBER, WITHDRAW_OPERATION_MEMBER } from "../../api/Url";
const pendingOperationMemberTableColumnHeader = [
    {
        id: "name",
        // width: "30%",
        disablePadding: false,
        label: "Operation Member",
    },
    {
        id: "email",
        // width: "30%",
        disablePadding: false,
        label: "Email",
    },
    {
        id: "memberCompany",
        // width: "30%",
        disablePadding: false,
        label: "Member Company",
    },
    {
        id: "companyType",
        // width: "30%",
        disablePadding: false,
        label: "Company Type",
    },
    {
        id: "createdByName",
        // width: "30%",
        disablePadding: false,
        label: "Created By",
    },
    {
        id: "createdAt",
        // width: "30%",
        disablePadding: false,
        label: "Created At",
    },
    {
        id: "action",

        disablePadding: false,
        label: "Action",
    },
];
function PendingOperationMembers({
    makeApiCall,
    setMakeApiCall,
    search,
    filters,
    myRef,
    toasterDetails,
    setToasterDetails,
    setSearch,
    setFilters,
}) {
    const [
        openDeleteDialogBoxPendingOperationMember,
        setOpenDeleteDialogBoxPendingOperationMember,
    ] = useState(false);
    const [
        withdrawInviteidOfOperationMember,
        setWithdrawInviteidOfOperationMember,
    ] = useState("");

    const [
        pageForPendingOperationMemberTab,
        setPageForPendingOperationMemberTab,
    ] = React.useState(1);
    const [
        rowsPerPageForPendingOperationMemberTab,
        setRowsPerPageForPendingOperationMemberTab,
    ] = React.useState(10);
    const [
        orderForPendingOperationMemberTab,
        setOrderForPendingOperationMemberTab,
    ] = React.useState("desc");
    const [
        orderByForPendingOperationMember,
        setOrderByForPendingOperationMemberTab,
    ] = React.useState("");
    const [
        recordsForPendingOperationMemberTab,
        setRecordsForPendingOperationMemberTab,
    ] = React.useState([]);
    const [
        totalRecordsForPendingOperationMemberTab,
        setTotalRecordsForPendingOperationMemberTab,
    ] = React.useState(0);

    const pendingKeysOrder = [
        "_id",
        "name",
        "email",
        "memberCompany",
        "companyType",
        "createdByName",
        "createdAt",
        // "token",
    ];

    // update recordes from backend i.e remove unnecessary values
    const updatePendingRecords = (data) => {
        console.log("data before update----", data);

        let staleData = data;
        staleData.forEach((object) => {
            delete object["updatedAt"];
            delete object["data"]["description"];
            delete object["data"]["countryCode"];
            delete object["data"]["isDeleted"];
            delete object["__v"];
            delete object["data"]["password"];
            delete object["data"]["roleId"];
            delete object["data"]["salt"];
            delete object["data"]["uuid"];
            delete object["data"]["phoneNumber"];
            delete object["token"];
            delete object["tokenExpiry"];
            delete object["tokenType"];

            // delete object["isActive"];

            // object["role"] = object["data"]["subRoleId"].name;
            // object["role"] = object["data"]["subRole"][0].name;

            object["name"] = object["data"].name;
            object["email"] = object["data"].email;
            // object["createdAt"] = object["createdAt"];
            object["memberCompany"] = object["memberData"]["companyName"];
            object["companyType"] = object["memberData"]["companyType"];
            // object["createdByName"] = object["createdBy"]["name"];
            object["createdAt"] = new Date(
                object["createdAt"]
            ).toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
            });
            object["createdByName"] = object["createdBy"].name;

            // delete object["data"]["subRoleId"];
            // delete object["data"]["subRole"][0].name;
            delete object["createdBy"];
            // delete object["createdAt"];
            delete object["subRole"];
            delete object["data"];
            delete object["memberData"];

            pendingKeysOrder.forEach((k) => {
                const v = object[k];
                delete object[k];
                object[k] = v;
            });
        });
        console.log(
            "data in updaterecords method in pending method",
            staleData
        );
        setRecordsForPendingOperationMemberTab([...staleData]);
    };

    //page change method for pending tab
    const handlePendingOperationMemberTablePageChange = (newPage) => {
        setPageForPendingOperationMemberTab(newPage);
    };

    // rows per page method for pending tab
    const handleRowsPerPageChangeForPendingTab = (event) => {
        console.log("rows per page", event);
        setRowsPerPageForPendingOperationMemberTab(
            parseInt(event.target.value, 10)
        );
        setPageForPendingOperationMemberTab(1);
    };

    //  on click delete icon open delete modal
    const onClickDeleteIconHandler = (id) => {
        console.log("id for delete", id);
        setOpenDeleteDialogBoxPendingOperationMember(true);
        setWithdrawInviteidOfOperationMember(id);
    };

    const withdrawInviteById = async () => {
        try {
            const response = await privateAxios.delete(
                WITHDRAW_OPERATION_MEMBER + withdrawInviteidOfOperationMember
            );
            if (response.status == 200) {
                console.log("operation member  invite withdrawn successfully");
                setToasterDetails(
                    {
                        titleMessage: "Success",
                        descriptionMessage: response?.data?.message,
                        messageType: "success",
                    },
                    () => myRef.current()
                );
                // call getPendingOperationMember below
                getPendingOperationMember();
                setOpenDeleteDialogBoxPendingOperationMember(false);
            }
        } catch (error) {
            console.log("error from withdrawInvite id operation member", error);
        }
    };

    const generateUrlForPendingTab = () => {
        console.log("filters", filters);
        console.log("Search", search);

        let url = `${ADD_OPERATION_MEMBER}/pending?page=${pageForPendingOperationMemberTab}&size=${rowsPerPageForPendingOperationMemberTab}&orderBy=${orderByForPendingOperationMember}&order=${orderForPendingOperationMemberTab}`;
        if (search.length > 0) url += `&search=${search}`;

        return url;
    };

    const getPendingOperationMember = async (
        isMounted = true,
        controller = new AbortController()
    ) => {
        try {
            let url = generateUrlForPendingTab();
            // setIsLoading(true);
            const response = await privateAxios.get(
                url,

                {
                    signal: controller.signal,
                }
            );
            // console.log(response.headers["x-total-count"]);
            setTotalRecordsForPendingOperationMemberTab(
                parseInt(response.headers["x-total-count"])
            );
            console.log(
                "Response from operation member api get for pending tab table",
                response
            );

            updatePendingRecords(response.data);
            // setIsLoading(false);
        } catch (error) {
            if (error?.code === "ERR_CANCELED") return;
            // console.log(toasterDetails);
            console.log(
                "Error from get all pending operation member  tab table-------",
                error
            );
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
            // setIsLoading(false);
        }
    };
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        makeApiCall && getPendingOperationMember(isMounted, controller);
        console.log("makeApiCall", makeApiCall);
        console.log("inside use Effect");
        return () => {
            isMounted = false;
            // clearTimeout(searchTimeout);
            controller.abort();
        };
    }, [
        filters,
        makeApiCall,

        setMakeApiCall,

        pageForPendingOperationMemberTab,
        rowsPerPageForPendingOperationMemberTab,
        orderByForPendingOperationMember,
        orderForPendingOperationMemberTab,
    ]);

    return (
        <>
            <DialogBox
                title={<p>Withdraw Operation Member Invitation</p>}
                info1={
                    <p>
                        On withdrawal, operation member will not be able to
                        verify their account.
                    </p>
                }
                info2={<p>Do you want to withdraw the invitation?</p>}
                primaryButtonText={"Yes"}
                secondaryButtonText={"No"}
                onPrimaryModalButtonClickHandler={() => {
                    withdrawInviteById();
                }}
                onSecondaryModalButtonClickHandler={() => {
                    setOpenDeleteDialogBoxPendingOperationMember(false);
                }}
                openModal={openDeleteDialogBoxPendingOperationMember}
                setOpenModal={setOpenDeleteDialogBoxPendingOperationMember}
                isModalForm={false}
            />
            <TableComponent
                tableHead={pendingOperationMemberTableColumnHeader}
                records={recordsForPendingOperationMemberTab}
                handleChangePage1={handlePendingOperationMemberTablePageChange}
                handleChangeRowsPerPage1={handleRowsPerPageChangeForPendingTab}
                page={pageForPendingOperationMemberTab}
                rowsPerPage={rowsPerPageForPendingOperationMemberTab}
                totalRecords={totalRecordsForPendingOperationMemberTab}
                orderBy={orderByForPendingOperationMember}
                icons={["delete"]}
                onClickDeleteIconHandler1={onClickDeleteIconHandler}
                order={orderForPendingOperationMemberTab}
                setOrder={setOrderForPendingOperationMemberTab}
                setOrderBy={setOrderByForPendingOperationMemberTab}
                setCheckBoxes={false}
            />
        </>
    );
}

export default PendingOperationMembers;
