import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { privateAxios } from "../../api/axios";
import { ADD_SUB_ADMIN, FETCH_ROLES, WITHDRAW_SUB_ADMIN } from "../../api/Url";
import Loader2 from "../../assets/Loader/Loader2.svg";
import DialogBox from "../../components/DialogBox";
import TableComponent from "../../components/TableComponent";
import useCallbackState from "../../utils/useCallBackState";
const pendingTableColumnHead = [
    {
        id: "name",
        // width: "30%",
        disablePadding: false,
        label: "Name",
    },
    {
        id: "email",

        disablePadding: false,
        label: "Email",
    },
    {
        id: "role",

        disablePadding: false,
        label: "Role",
    },
    {
        id: "createdAt",

        disablePadding: false,
        label: "Onboarded On",
    },

    {
        id: "action",

        disablePadding: false,
        label: "Actions",
    },
];

function PendingCGFAdmins({
    makeApiCall,
    setMakeApiCall,
    search,
    filters,

    myRef,
    toasterDetails,
    setToasterDetails,
}) {
    const [openDeleteDialogBoxPendingCGFAdmin, setOpenDeleteDialogBoxPendingCGFAdmin] = useState(false);
    const [withdrawInviteidPendingCGFAdmin, setWithdrawInviteidPendingCGFAdmin] = useState("");
    const [withdrawInviteUserPendingCGFAdmin, setWithdrawInviteUserPendingCGFAdmin] = useState([]);

    // state to manage loader
    const [isLoading, setIsLoading] = useState(true);

    //state to hold search timeout delay
    const [searchTimeoutPendingCGFAdmin, setSearchTimeoutPendingCGFAdmin] = useState(null);
    //state to hold wheather to make api call or not

    const navigate = useNavigate();
    //(onboarded users/cgf-admin/ table) order in which records needs to show
    const [pageForPendingTabCGFAdmin, setPageForPendingTabCGFAdmin] = React.useState(1);
    const [rowsPerPageForPendingTabCGFAdmin, setRowsPerPageForPendingTabCGFAdmin] =
        React.useState(10);
    const [orderForPendingTabCGFAdmin, setOrderForPendingTabCGFAdmin] = React.useState("desc");
    const [orderByForPending, setOrderByForPendingTab] =
        React.useState("createdAt");
    const [recordsForPendingTabCGFAdmin, setRecordsForPendingTabCGFAdmin] = React.useState([]);
    const [totalRecordsForPendingTabCGFAdmin, setTotalRecordsForPendingTabCGFAdmin] =
        React.useState(0);

    const pendingKeysOrder = [
        "_id",
        "name",
        "email",
        "role",
        "createdAt",
        // "token",
    ];
    const updatePendingRecords = (data) => {
        console.log("data before update----", data);

        let staleData = data;
        staleData.forEach((object) => {
            // console.log("subRole-------", object["data"]["subRoleId"].name);
            delete object["updatedAt"];
            delete object["data"]["description"];
            delete object["data"]["countryCode"];
            delete object["data"]["isDeleted"];
            delete object["data"]["isReplaced"];
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
            object["createdAt"] = new Date(
                object["createdAt"]
            ).toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
            });

            // object["role"] = object["data"]["subRoleId"].name;
            // object["role"] = object["data"]["subRole"][0].name;
            object["role"] = object["subRole"][0].name;
            object["name"] = object["data"]["name"];
            object["email"] = object["data"].email;
            // object["_id"] = object["_id"];
            // object["createdAt"] = object["createdAt"];
            // delete object["data"]["subRoleId"];
            // delete object["data"]["subRole"][0].name;
            delete object["createdBy"];
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
        setRecordsForPendingTabCGFAdmin([...staleData]);
    };

    //page change method for pending tab
    const handlePendingTablePageChangeCGFAdmin = (newPage) => {
        setPageForPendingTabCGFAdmin(newPage);
    };

    // rows per page method for pending tab
    const handleRowsPerPageChangeForPendingTabCGFAdmin = (event) => {
        console.log("rows per page", event);
        setRowsPerPageForPendingTabCGFAdmin(parseInt(event.target.value, 10));
        setPageForPendingTabCGFAdmin(1);
    };

    //  on click delete icon open delete modal
    const onClickDeleteIconHandlerCGFAdmin = async (id) => {
        console.log("id for delete", id);
        setOpenDeleteDialogBoxPendingCGFAdmin(true);
        setWithdrawInviteidPendingCGFAdmin(id);
        console.log("records: ", recordsForPendingTabCGFAdmin);
        const withdrawCgfAdmin = recordsForPendingTabCGFAdmin.filter(
            (user) => user?._id === id
        );
        console.log("Withdraw user", withdrawCgfAdmin);
        setWithdrawInviteUserPendingCGFAdmin([...withdrawCgfAdmin]);
    };

    const withdrawInviteByIdCGFAdmin = async () => {
        try {
            const response = await privateAxios.delete(
                WITHDRAW_SUB_ADMIN + withdrawInviteidPendingCGFAdmin
            );
            if (response.status == 200) {
                console.log("user invite withdrawn successfully");
                setToasterDetails(
                    {
                        titleMessage: "Success",
                        descriptionMessage: response?.data?.message,
                        messageType: "success",
                    },
                    () => myRef.current()
                );
                getSubAdminPendingCGFAdmin();
                setOpenDeleteDialogBoxPendingCGFAdmin(false);
            }
        } catch (error) {
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
            console.log("error from withdrawInvite id", error);
        }
    };

    // url for pending tab
    const generateUrlForPendingTabCGFAdmin = () => {
        console.log("filters", filters);
        console.log("Search", search);
        let url = `${ADD_SUB_ADMIN}/pending/list?page=${pageForPendingTabCGFAdmin}&size=${rowsPerPageForPendingTabCGFAdmin}&orderBy=${orderByForPending}&order=${orderForPendingTabCGFAdmin}`;

        if (search?.length >= 3) url += `&search=${search}`;

        return url;
    };

    const getSubAdminPendingCGFAdmin = async (
        isMounted = true,
        controller = new AbortController()
    ) => {
        try {
            let url = generateUrlForPendingTabCGFAdmin();
            setIsLoading(true);
            const response = await privateAxios.get(url, {
                signal: controller.signal,
            });
            // console.log(response.headers["x-total-count"]);
            setTotalRecordsForPendingTabCGFAdmin(
                parseInt(response.headers["x-total-count"])
            );
            console.log(
                "Response from sub admin api get for pending tab table",
                response
            );

            updatePendingRecords(response.data);
            setIsLoading(false);
        } catch (error) {
            if (error?.code === "ERR_CANCELED") return;
            // console.log(toasterDetails);
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

            console.log(
                "Error from getSubAdmin pending tab table-------",
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
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        makeApiCall && getSubAdminPendingCGFAdmin(isMounted, controller);
        console.log("makeApiCall", makeApiCall);
        console.log("inside use Effect");
        return () => {
            isMounted = false;
            clearTimeout(searchTimeoutPendingCGFAdmin);
            controller.abort();
        };
    }, [
        filters,
        makeApiCall,

        setMakeApiCall,
        searchTimeoutPendingCGFAdmin,
        pageForPendingTabCGFAdmin,
        rowsPerPageForPendingTabCGFAdmin,
        orderByForPending,
        orderForPendingTabCGFAdmin,
    ]);
    {
        console.log("makeApiCall outside UseEffect ", makeApiCall);
        // console.log("order", order, "order BY", orderBy);
    }
    return (
        <>
            <DialogBox
                title={
                    <p>
                        Withdraw "
                        {withdrawInviteUserPendingCGFAdmin && `${withdrawInviteUserPendingCGFAdmin[0]?.name}`}
                        's" Invitation
                    </p>
                }
                info1={
                    <p>
                        On withdrawal, CGF admin will not be able to verify
                        their account.
                    </p>
                }
                info2={<p>Do you want to withdraw the invitation?</p>}
                primaryButtonText={"Yes"}
                secondaryButtonText={"No"}
                onPrimaryModalButtonClickHandler={() => {
                    withdrawInviteByIdCGFAdmin();
                }}
                onSecondaryModalButtonClickHandler={() => {
                    setOpenDeleteDialogBoxPendingCGFAdmin(false);
                }}
                openModal={openDeleteDialogBoxPendingCGFAdmin}
                setOpenModal={setOpenDeleteDialogBoxPendingCGFAdmin}
            />
            {isLoading ? (
                <div className="loader-blk">
                    <img src={Loader2} alt="Loading" />
                </div>
            ) : (
                <TableComponent
                    tableHead={pendingTableColumnHead}
                    records={recordsForPendingTabCGFAdmin}
                    handleChangePage1={handlePendingTablePageChangeCGFAdmin}
                    handleChangeRowsPerPage1={
                        handleRowsPerPageChangeForPendingTabCGFAdmin
                    }
                    page={pageForPendingTabCGFAdmin}
                    rowsPerPage={rowsPerPageForPendingTabCGFAdmin}
                    totalRecords={totalRecordsForPendingTabCGFAdmin}
                    orderBy={orderByForPending}
                    icons={["delete"]}
                    // onClickVisibilityIconHandler1={
                    //     onClickDeleteIconHandlerCGFAdmin
                    // }
                    onClickDeleteIconHandler1={onClickDeleteIconHandlerCGFAdmin}
                    order={orderForPendingTabCGFAdmin}
                    setOrder={setOrderForPendingTabCGFAdmin}
                    setOrderBy={setOrderByForPendingTab}
                    setCheckBoxes={false}
                    onRowClick={false}
                />
            )}
        </>
    );
}

export default PendingCGFAdmins;
