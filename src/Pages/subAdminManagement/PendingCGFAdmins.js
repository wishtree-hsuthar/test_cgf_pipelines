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
    const [openDeleteDialogBox, setOpenDeleteDialogBox] = useState(false);
    const [withdrawInviteid, setWithdrawInviteid] = useState("");
    const [withdrawInviteUser, setWithdrawInviteUser] = useState([]);

    // state to manage loader
    const [isLoading, setIsLoading] = useState(true);

    //state to hold search timeout delay
    const [searchTimeout, setSearchTimeout] = useState(null);
    //state to hold wheather to make api call or not

    const navigate = useNavigate();
    //(onboarded users/cgf-admin/ table) order in which records needs to show
    const [pageForPendingTab, setPageForPendingTab] = React.useState(1);
    const [rowsPerPageForPendingTab, setRowsPerPageForPendingTab] =
        React.useState(10);
    const [orderForPendingTab, setOrderForPendingTab] = React.useState("desc");
    const [orderByForPending, setOrderByForPendingTab] =
        React.useState("createdAt");
    const [recordsForPendingTab, setRecordsForPendingTab] = React.useState([]);
    const [totalRecordsForPendingTab, setTotalRecordsForPendingTab] =
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
        setRecordsForPendingTab([...staleData]);
    };

    //page change method for pending tab
    const handlePendingTablePageChange = (newPage) => {
        setPageForPendingTab(newPage);
    };

    // rows per page method for pending tab
    const handleRowsPerPageChangeForPendingTab = (event) => {
        console.log("rows per page", event);
        setRowsPerPageForPendingTab(parseInt(event.target.value, 10));
        setPageForPendingTab(1);
    };

    //  on click delete icon open delete modal
    const onClickDeleteIconHandler = async (id) => {
        console.log("id for delete", id);
        setOpenDeleteDialogBox(true);
        setWithdrawInviteid(id);
        console.log("records: ", recordsForPendingTab);
        const withdrawCgfAdmin = recordsForPendingTab.filter(
            (user) => user?._id === id
        );
        console.log("Withdraw user", withdrawCgfAdmin);
        setWithdrawInviteUser([...withdrawCgfAdmin]);
    };

    const withdrawInviteById = async () => {
        try {
            const response = await privateAxios.delete(
                WITHDRAW_SUB_ADMIN + withdrawInviteid
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
                getSubAdminPending();
                setOpenDeleteDialogBox(false);
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
    const generateUrlForPendingTab = () => {
        console.log("filters", filters);
        console.log("Search", search);
        let url = `${ADD_SUB_ADMIN}/pending/list?page=${pageForPendingTab}&size=${rowsPerPageForPendingTab}&orderBy=${orderByForPending}&order=${orderForPendingTab}`;

        if (search?.length >= 3) url += `&search=${search}`;

        return url;
    };

    const getSubAdminPending = async (
        isMounted = true,
        controller = new AbortController()
    ) => {
        try {
            let url = generateUrlForPendingTab();
            setIsLoading(true);
            const response = await privateAxios.get(url, {
                signal: controller.signal,
            });
            // console.log(response.headers["x-total-count"]);
            setTotalRecordsForPendingTab(
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
            } else {
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

            console.log(
                "Error from getSubAdmin pending tab table-------",
                error
            );
        }
    };

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        makeApiCall && getSubAdminPending(isMounted, controller);
        console.log("makeApiCall", makeApiCall);
        console.log("inside use Effect");
        return () => {
            isMounted = false;
            clearTimeout(searchTimeout);
            controller.abort();
        };
    }, [
        filters,
        makeApiCall,

        setMakeApiCall,
        searchTimeout,
        pageForPendingTab,
        rowsPerPageForPendingTab,
        orderByForPending,
        orderForPendingTab,
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
                        {withdrawInviteUser && `${withdrawInviteUser[0]?.name}`}
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
                    withdrawInviteById();
                }}
                onSecondaryModalButtonClickHandler={() => {
                    setOpenDeleteDialogBox(false);
                }}
                openModal={openDeleteDialogBox}
                setOpenModal={setOpenDeleteDialogBox}
            />
            {isLoading ? (
                <div className="loader-blk">
                    <img src={Loader2} alt="Loading" />
                </div>
            ) : (
                <TableComponent
                    tableHead={pendingTableColumnHead}
                    records={recordsForPendingTab}
                    handleChangePage1={handlePendingTablePageChange}
                    handleChangeRowsPerPage1={
                        handleRowsPerPageChangeForPendingTab
                    }
                    page={pageForPendingTab}
                    rowsPerPage={rowsPerPageForPendingTab}
                    totalRecords={totalRecordsForPendingTab}
                    orderBy={orderByForPending}
                    icons={["delete"]}
                    // onClickVisibilityIconHandler1={
                    //     onClickDeleteIconHandler
                    // }
                    onClickDeleteIconHandler1={onClickDeleteIconHandler}
                    order={orderForPendingTab}
                    setOrder={setOrderForPendingTab}
                    setOrderBy={setOrderByForPendingTab}
                    setCheckBoxes={false}
                    onRowClick={false}
                />
            )}
        </>
    );
}

export default PendingCGFAdmins;
