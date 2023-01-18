import TableComponent from "../../components/TableComponent";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { privateAxios } from "../../api/axios";
import DialogBox from "../../components/DialogBox";
import { ADD_OPERATION_MEMBER, WITHDRAW_OPERATION_MEMBER } from "../../api/Url";
import { tableHead } from "../../utils/OperationMemberModuleUtil";
import Loader from "../../utils/Loader";

let tempTableHead = JSON.parse(JSON.stringify(tableHead));
tempTableHead.push({
    id: "action",
    disablePadding: false,
    label: "Action",
});

function PendingOperationMembers({
    makeApiCall,
    setMakeApiCall,
    search,
    filters,
    myRef,
    setToasterDetails,
}) {
    const navigate = useNavigate();
    // state to manage loaders
    const [
        isPendingOperationMemberLoading,
        setIsPendingOperationMemberLoading,
    ] = useState(true);
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
        staleData.forEach((pendingOPMember) => {
            delete pendingOPMember["updatedAt"];
            delete pendingOPMember["data"]["description"];
            delete pendingOPMember["data"]["countryCode"];
            delete pendingOPMember["data"]["isDeleted"];
            delete pendingOPMember["__v"];
            delete pendingOPMember["data"]["password"];
            delete pendingOPMember["data"]["roleId"];
            delete pendingOPMember["data"]["role"];
            delete pendingOPMember["data"]["salt"];
            delete pendingOPMember["data"]["uuid"];
            delete pendingOPMember["data"]["phoneNumber"];
            delete pendingOPMember["token"];
            delete pendingOPMember["tokenExpiry"];
            delete pendingOPMember["tokenType"];

            pendingOPMember["name"] = pendingOPMember["data"].name;
            pendingOPMember["email"] = pendingOPMember["data"].email;
            pendingOPMember["memberCompany"] =
                pendingOPMember["memberData"]["companyName"];
            pendingOPMember["companyType"] =
                pendingOPMember["memberData"]["companyType"];
            pendingOPMember["createdAt"] = new Date(
                pendingOPMember["createdAt"]
            ).toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
            });
            pendingOPMember["createdByName"] =
                pendingOPMember["createdBy"].name;

            delete pendingOPMember["createdBy"];

            delete pendingOPMember["subRole"];
            delete pendingOPMember["data"];
            delete pendingOPMember["memberData"];

            pendingKeysOrder.forEach((k) => {
                const v = pendingOPMember[k];
                delete pendingOPMember[k];
                pendingOPMember[k] = v;
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
            if (error?.response?.status == 401) {
                setToasterDetails(
                    {
                        titleMessage: "Oops!",
                        descriptionMessage:
                            "Session Timeout: Please login again",
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

    const generateUrlForPendingTab = () => {
        console.log("filters", filters);
        console.log("Search", search);

        let url = `${ADD_OPERATION_MEMBER}/pending/list?page=${pageForPendingOperationMemberTab}&size=${rowsPerPageForPendingOperationMemberTab}&orderBy=${orderByForPendingOperationMember}&order=${orderForPendingOperationMemberTab}`;
        if (search.length > 0) url += `&search=${search}`;

        return url;
    };

    const getPendingOperationMember = async (
        isMounted = true,
        controller = new AbortController()
    ) => {
        try {
            let url = generateUrlForPendingTab();
            setIsPendingOperationMemberLoading(true);
            const response = await privateAxios.get(
                url,

                {
                    signal: controller.signal,
                }
            );

            setTotalRecordsForPendingOperationMemberTab(
                parseInt(response.headers["x-total-count"])
            );
            console.log(
                "Response from operation member api get for pending tab table",
                response
            );

            updatePendingRecords(response.data);
            setIsPendingOperationMemberLoading(false);
        } catch (error) {
            if (error?.code === "ERR_CANCELED") return;
            setIsPendingOperationMemberLoading(false);

            console.log(
                "Error from get all pending operation member  tab table-------",
                error
            );
            if (error?.response?.status == 401) {
                isMounted &&
                    setToasterDetails(
                        {
                            titleMessage: "Oops!",
                            descriptionMessage:
                                "Session Timeout: Please login again",
                            messageType: "error",
                        },
                        () => myRef.current()
                    );
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            } else {
                isMounted &&
                    setToasterDetails(
                        {
                            titleMessage: "Error",
                            descriptionMessage:
                                error?.response?.data?.message &&
                                typeof error.response.data.message === "string"
                                    ? error.response.data.message
                                    : "Something went wrong.",

                            messageType: "error",
                        },
                        () => myRef.current()
                    );
            }
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
            {isPendingOperationMemberLoading ? (
                <Loader />
            ) : (
                <TableComponent
                    tableHead={tempTableHead}
                    records={recordsForPendingOperationMemberTab}
                    handleChangePage1={
                        handlePendingOperationMemberTablePageChange
                    }
                    handleChangeRowsPerPage1={
                        handleRowsPerPageChangeForPendingTab
                    }
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
            )}
        </>
    );
}

export default PendingOperationMembers;
