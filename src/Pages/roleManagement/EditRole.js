//Third party imports
import {
    Box,
    Checkbox,
    FormControlLabel,
    Paper,
    Radio,
    RadioGroup as EditRoleRadioGroup,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Logger } from "../../Logger/Logger";
//Internal Imports
import Toaster from "../../components/Toaster";
import "../../components/TableComponent.css";
import useCallbackState from "../../utils/useCallBackState";
import Loader2 from "../../assets/Loader/Loader2.svg";
import { REACT_APP_API_ENDPOINT } from "../../api/Url";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import CommonTableHead from "./CommonTableHead";
import Loader from "../../utils/Loader";
import { catchError } from "../../utils/CatchError";

const titleMessage = "";
const descriptionMessage = "";
const messageType = "";

const EditRole = () => {
    useDocumentTitle("Edit Role");
    const params = useParams();

    // state to manage loader
    const [isLoading1, setIsLoading1] = useState(false);

    const navigate2 = useNavigate();
    const [toasterDetails2, setToasterDetails2] = useCallbackState({
        titleMessage,
        descriptionMessage,
        messageType,
    });
    //method to call all error toaster from this method
    const setErrorToaster = (error) => {
        Logger.debug("error", error);
        setToasterDetails2(
            {
                titleMessage: "Error",
                descriptionMessage:
                    error?.response?.data?.message &&
                    typeof error.response.data.message === "string"
                        ? error.response.data.message
                        : "Something went wrong.",
                messageType: "error",
            },
            () => myRef2.current()
        );
    };

    // let temp = {};
    //Ref for Toaster
    const myRef2 = React.useRef();

    let editDefault = {
        roleName: "",
        status: "",
        description: "",
    };
    //temp to hold privileges
    let temp = {};
    const [previleges, setPrevileges] = useState({ ...temp });
    const [disableEditRoleUpdateButton, setDisableEditRoleUpdateButton] =
        useState(false);
    const { control, reset, setValue, handleSubmit } = useForm({
        defaultValues: editDefault,
    });

    //helper message for inputs
    const myHelper = {
        description: {
            required: "Enter the description",
            maxLength: "Max char limit exceed",
            minLength: "minimum 3 characters required",
        },
    };
    const validatePrivelages = (previleges) => {
        return Object.values(previleges).some((module) => {
            return Object.values(module).some((previlege) => previlege);
        });
    };

    const onSubmit1 = async (data) => {
        try {
            Logger.debug("input Data: ", data, "Previleges: ", previleges);
            let previlegesForBackend = JSON.parse(JSON.stringify(previleges));
            Object.keys(previlegesForBackend).forEach((p_key) => {
                delete previlegesForBackend[p_key]["all"];
                delete previlegesForBackend[p_key]["name"];
            });
            if (!validatePrivelages(previlegesForBackend)) {
                setToasterDetails2(
                    {
                        titleMessage: "Hurray!",
                        descriptionMessage: "Select atleast 1 privilege",
                        messageType: "error",
                    },
                    () => myRef2.current()
                );
                return;
            }
            setIsLoading1(true);

            Logger.debug("previleges : ", previlegesForBackend);
            const response = await axios.put(
                REACT_APP_API_ENDPOINT + `roles/${params.id}`,
                {
                    description: data.description,
                    isActive: data.status === "active" ? true : false,
                    privileges: previlegesForBackend,
                }
            );
            Logger.debug("response", response);
            if (response.status == 200) {
                setIsLoading1(false);
                setToasterDetails2(
                    {
                        titleMessage: "Success!",
                        descriptionMessage: response.data.message,
                        messageType: "success",
                    },
                    () => myRef2.current()
                );
                Logger.debug("Default Values", editDefault);
                reset({
                    roleName: "",
                    status: "active",
                    description: "",
                });
                setTimeout(
                    () => navigate2(`/roles/view-role/${params.id}`),
                    3000
                );
            }
        } catch (error) {
            Logger.debug("error", error);
            catchError(error, setToasterDetails2, myRef2, navigate2);
            // if (error?.response?.status == 401) {
            //     setToasterDetails2(
            //         {
            //             titleMessage: "Error",
            //             descriptionMessage:
            //                 "Session Timeout: Please login again",
            //             messageType: "error",
            //         },
            //         () => myRef2.current()
            //     );
            //     setTimeout(() => {
            //         navigate2("/login");
            //     }, 3000);
            // } else if (error?.response?.status === 403) {
            //     setToasterDetails2(
            //         {
            //             titleMessage: "Error",
            //             descriptionMessage: error?.response?.data?.message
            //                 ? error?.response?.data?.message
            //                 : "Something went wrong",
            //             messageType: "error",
            //         },
            //         () => myRef2.current()
            //     );
            //     setTimeout(() => {
            //         navigate2("/home");
            //     }, 3000);
            // } else {
            //     setErrorToaster(error);
            // }
        }
    };
    const onClickCancelHandler2 = () => {
        navigate2(`/roles/view-role/${params.id}`);
    };
    const createPrevileges2 = (tempPrivileges) => {
        Logger.debug("temp data", tempPrivileges);
        Object.keys(tempPrivileges).forEach((tempPriv) => {
            // Logger.debug("temp Previ value",tempPrivileges[tempPriv])
            temp[tempPriv] = {
                add: tempPrivileges[tempPriv]["add"],
                fill: tempPrivileges[tempPriv]["fill"],
                // assign: tempPrivileges[tempPriv]["assign"],
                delete: tempPrivileges[tempPriv]["delete"],
                edit: tempPrivileges[tempPriv]["edit"],
                list: tempPrivileges[tempPriv]["list"],
                view: tempPrivileges[tempPriv]["view"],
                all:
                    tempPrivileges[tempPriv]["add"] &&
                    // tempPrivileges[tempPriv]["assign"] &&
                    tempPrivileges[tempPriv]["delete"] &&
                    tempPrivileges[tempPriv]["edit"] &&
                    tempPrivileges[tempPriv]["view"] &&
                    tempPrivileges[tempPriv]["list"] &&
                    (tempPrivileges[tempPriv]["moduleId"]["name"] ===
                    "Assessment"
                        ? tempPrivileges[tempPriv]["fill"]
                        : true),
                name: tempPrivileges[tempPriv]["moduleId"]["name"],
            };
        });
        Logger.debug("temp", temp);
        setPrevileges({ ...temp });
    };
    const updateEditFields = (data) => {
        Logger.debug("previleges", data.privileges);
        reset({
            roleName: data.name,
            status: data.isActive ? "active" : "inactive",
            description: data.description,
        });
        createPrevileges2(data.privileges);
    };
    const getRoleById = async (isMounted, controller) => {
        try {
            setIsLoading1(true);
            const response = await axios.get(
                REACT_APP_API_ENDPOINT + `roles/${params.id}`,
                {
                    signal: controller.signal,
                }
            );
            Logger.debug("response: ", response);
            updateEditFields(response.data);
            setIsLoading1(false);
        } catch (error) {
            Logger.debug("Error", error);
            if (error?.code === "ERR_CANCELED") return;
            setIsLoading1(false);
            catchError(error, setToasterDetails2, myRef2, navigate2);
            // if (error?.response?.status === 401) {
            //     setToasterDetails2(
            //         {
            //             titleMessage: "Error",
            //             descriptionMessage:
            //                 "Session Timeout: Please login again",
            //             messageType: "error",
            //         },
            //         () => myRef2.current()
            //     );
            //     setTimeout(() => {
            //         navigate2("/login");
            //     }, 3000);
            // } else if (error?.response?.status === 403) {
            //     setToasterDetails2(
            //         {
            //             titleMessage: "Error",
            //             descriptionMessage: error?.response?.data?.message
            //                 ? error?.response?.data?.message
            //                 : "Something went wrong",
            //             messageType: "error",
            //         },
            //         () => myRef2.current()
            //     );
            //     setTimeout(() => {
            //         navigate2("/home");
            //     }, 3000);
            // } else {
            //     setErrorToaster(error);
            // }
        }
    };
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        isMounted && getRoleById(isMounted, controller);
        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);
    Logger.debug("Privilege", previleges);
    return (
        <div className="page-wrapper">
            <Toaster
                myRef={myRef2}
                titleMessage={toasterDetails2.titleMessage}
                descriptionMessage={toasterDetails2.descriptionMessage}
                messageType={toasterDetails2.messageType}
            />
            <div className="breadcrumb-wrapper">
                <div className="container">
                    <ul className="breadcrumb">
                        <li>
                            <Link to="/roles">Roles</Link>
                        </li>
                        <li>
                            <Link to={`/roles/view-role/${params.id}`}>
                                View Role
                            </Link>
                        </li>
                        <li>Edit Role</li>
                    </ul>
                </div>
            </div>
            <section>
                <div className="container">
                    <div className="form-header flex-between">
                        <h2 className="heading2">Edit Role</h2>
                    </div>
                    {isLoading1 ? (
                        <Loader />
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit1)}>
                            <div className="card-wrapper">
                                <div className="card-blk flex-between">
                                    <div className="card-form-field">
                                        <div className="form-group">
                                            <label htmlFor="roleName">
                                                Role Name{" "}
                                                <span className="mandatory">
                                                    *
                                                </span>
                                            </label>
                                            <Controller
                                                name="roleName"
                                                control={control}
                                                render={({
                                                    field,
                                                    fieldState: { error },
                                                }) => (
                                                    <TextField
                                                        disabled
                                                        {...field}
                                                        // value={editDefault && editDefault.roleName}
                                                        className={`input-field ${
                                                            error &&
                                                            "input-error"
                                                        }`}
                                                        id="outlined-basic"
                                                        placeholder="Enter role name"
                                                        variant="outlined"
                                                        helperText=" "
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="card-form-field">
                                        <div className="form-group">
                                            <label htmlFor="status">
                                                Status
                                            </label>
                                            <div className="radio-btn-field">
                                                <Controller
                                                    name="status"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <EditRoleRadioGroup
                                                            {...field}
                                                            // value={editDefault && editDefault.status}
                                                            aria-labelledby="demo-radio-buttons-group-label"
                                                            name="radio-buttons-group"
                                                            className="radio-btn"
                                                        >
                                                            <FormControlLabel
                                                                value="active"
                                                                control={
                                                                    <Radio />
                                                                }
                                                                label="Active"
                                                            />
                                                            <FormControlLabel
                                                                value="inactive"
                                                                control={
                                                                    <Radio />
                                                                }
                                                                label="Inactive"
                                                            />
                                                        </EditRoleRadioGroup>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-form-field fullwidth">
                                        <div className="form-group">
                                            <label htmlFor="description">
                                                Description{" "}
                                                <span className="mandatory">
                                                    *
                                                </span>
                                            </label>
                                            <Controller
                                                name="description"
                                                rules={{
                                                    required: true,
                                                    maxLength: 500,
                                                    minLength: 3,
                                                }}
                                                control={control}
                                                render={({
                                                    field,
                                                    fieldState: { error },
                                                }) => (
                                                    <TextField
                                                        multiline
                                                        {...field}
                                                        // value={editDefault && editDefault.description}
                                                        onBlur={(e) =>
                                                            setValue(
                                                                "description",
                                                                e.target.value.trim()
                                                            )
                                                        }
                                                        inputProps={{
                                                            maxLength: 500,
                                                        }}
                                                        className={`input-textarea ${
                                                            error &&
                                                            "input-textarea-error"
                                                        }`}
                                                        //   className={`input-field ${error && "input-error"}`}
                                                        id="outlined-basic"
                                                        placeholder="Enter description"
                                                        helperText={
                                                            error
                                                                ? myHelper
                                                                      .description[
                                                                      error.type
                                                                  ]
                                                                : " "
                                                        }
                                                        variant="outlined"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="table-blk"> */}
                                <Box
                                    sx={{ width: "100%" }}
                                    className="table-blk table-blk-role"
                                >
                                    <Paper sx={{ width: "100%" }}>
                                        <TableContainer>
                                            <Table sx={{ minWidth: 750 }}>
                                                <CommonTableHead />
                                                <TableBody>
                                                    {Object.keys(
                                                        previleges
                                                    ).map(
                                                        (editPrevileg, id) => {
                                                            return (
                                                                <TableRow
                                                                    key={
                                                                        editPrevileg
                                                                    }
                                                                    hover
                                                                >
                                                                    <TableCell>
                                                                        {
                                                                            previleges[
                                                                                editPrevileg
                                                                            ][
                                                                                "name"
                                                                            ]
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell
                                                                        align="center"
                                                                        padding="checkbox"
                                                                    >
                                                                        {previleges[
                                                                            editPrevileg
                                                                        ][
                                                                            "name"
                                                                        ] ===
                                                                            "Assessment" && (
                                                                            <Checkbox
                                                                                className="table-checkbox"
                                                                                checked={
                                                                                    previleges[
                                                                                        editPrevileg
                                                                                    ][
                                                                                        "fill"
                                                                                    ]
                                                                                }
                                                                                onChange={() =>
                                                                                    setPrevileges(
                                                                                        (
                                                                                            previous
                                                                                        ) => ({
                                                                                            ...previous,
                                                                                            [editPrevileg]:
                                                                                                {
                                                                                                    ...previous[
                                                                                                        editPrevileg
                                                                                                    ],
                                                                                                    fill: !previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "fill"
                                                                                                    ],
                                                                                                    list:
                                                                                                        previous[
                                                                                                            editPrevileg
                                                                                                        ][
                                                                                                            "list"
                                                                                                        ] ||
                                                                                                        !previous[
                                                                                                            editPrevileg
                                                                                                        ][
                                                                                                            "fill"
                                                                                                        ],
                                                                                                    view:
                                                                                                        previous[
                                                                                                            editPrevileg
                                                                                                        ][
                                                                                                            "view"
                                                                                                        ] ||
                                                                                                        !previous[
                                                                                                            editPrevileg
                                                                                                        ][
                                                                                                            "fill"
                                                                                                        ],
                                                                                                    all:
                                                                                                        !previous[
                                                                                                            editPrevileg
                                                                                                        ][
                                                                                                            "fill"
                                                                                                        ] &&
                                                                                                        previous[
                                                                                                            editPrevileg
                                                                                                        ][
                                                                                                            "add"
                                                                                                        ] &&
                                                                                                        previous[
                                                                                                            editPrevileg
                                                                                                        ][
                                                                                                            "edit"
                                                                                                        ] &&
                                                                                                        previous[
                                                                                                            editPrevileg
                                                                                                        ][
                                                                                                            "delete"
                                                                                                        ],
                                                                                                },
                                                                                        })
                                                                                    )
                                                                                }
                                                                            />
                                                                        )}
                                                                    </TableCell>

                                                                    <TableCell
                                                                        align="center"
                                                                        padding="checkbox"
                                                                    >
                                                                        <Checkbox
                                                                            className="table-checkbox"
                                                                            checked={
                                                                                previleges[
                                                                                    editPrevileg
                                                                                ][
                                                                                    "list"
                                                                                ]
                                                                            }
                                                                            onChange={() =>
                                                                                setPrevileges(
                                                                                    (
                                                                                        previous
                                                                                    ) => ({
                                                                                        ...previous,
                                                                                        [editPrevileg]:
                                                                                            {
                                                                                                ...previous[
                                                                                                    editPrevileg
                                                                                                ],
                                                                                                list: !previous[
                                                                                                    editPrevileg
                                                                                                ][
                                                                                                    "list"
                                                                                                ],
                                                                                                view:
                                                                                                    (previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "view"
                                                                                                    ] &&
                                                                                                        !previous[
                                                                                                            editPrevileg
                                                                                                        ][
                                                                                                            "list"
                                                                                                        ]) ||
                                                                                                    false,
                                                                                                edit:
                                                                                                    (previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "edit"
                                                                                                    ] &&
                                                                                                        !previous[
                                                                                                            editPrevileg
                                                                                                        ][
                                                                                                            "list"
                                                                                                        ]) ||
                                                                                                    false,
                                                                                                delete:
                                                                                                    (previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "delete"
                                                                                                    ] &&
                                                                                                        !previous[
                                                                                                            editPrevileg
                                                                                                        ][
                                                                                                            "list"
                                                                                                        ]) ||
                                                                                                    false,
                                                                                                add:
                                                                                                    (previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "add"
                                                                                                    ] &&
                                                                                                        !previous[
                                                                                                            editPrevileg
                                                                                                        ][
                                                                                                            "list"
                                                                                                        ]) ||
                                                                                                    false,
                                                                                                fill:
                                                                                                    (previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "fill"
                                                                                                    ] &&
                                                                                                        !previous[
                                                                                                            editPrevileg
                                                                                                        ][
                                                                                                            "list"
                                                                                                        ]) ||
                                                                                                    false,

                                                                                                all:
                                                                                                    !previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "list"
                                                                                                    ] &&
                                                                                                    previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "add"
                                                                                                    ] &&
                                                                                                    previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "edit"
                                                                                                    ] &&
                                                                                                    previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "view"
                                                                                                    ] &&
                                                                                                    previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "delete"
                                                                                                    ],
                                                                                            },
                                                                                    })
                                                                                )
                                                                            }
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell
                                                                        align="center"
                                                                        padding="checkbox"
                                                                    >
                                                                        <Checkbox
                                                                            className="table-checkbox"
                                                                            checked={
                                                                                previleges[
                                                                                    editPrevileg
                                                                                ][
                                                                                    "add"
                                                                                ]
                                                                            }
                                                                            onChange={() =>
                                                                                setPrevileges(
                                                                                    (
                                                                                        previous
                                                                                    ) => ({
                                                                                        ...previous,
                                                                                        [editPrevileg]:
                                                                                            {
                                                                                                ...previous[
                                                                                                    editPrevileg
                                                                                                ],
                                                                                                add: !previous[
                                                                                                    editPrevileg
                                                                                                ][
                                                                                                    "add"
                                                                                                ],
                                                                                                list:
                                                                                                    previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "list"
                                                                                                    ] ||
                                                                                                    !previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "add"
                                                                                                    ],
                                                                                                view:
                                                                                                    previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "view"
                                                                                                    ] ||
                                                                                                    !previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "add"
                                                                                                    ],

                                                                                                all:
                                                                                                    !previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "add"
                                                                                                    ] &&
                                                                                                    previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "edit"
                                                                                                    ] &&
                                                                                                    previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "delete"
                                                                                                    ],
                                                                                            },
                                                                                    })
                                                                                )
                                                                            }
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell
                                                                        align="center"
                                                                        padding="checkbox"
                                                                    >
                                                                        <Checkbox
                                                                            className="table-checkbox"
                                                                            checked={
                                                                                previleges[
                                                                                    editPrevileg
                                                                                ][
                                                                                    "edit"
                                                                                ]
                                                                            }
                                                                            onChange={() =>
                                                                                setPrevileges(
                                                                                    (
                                                                                        previous
                                                                                    ) => ({
                                                                                        ...previous,
                                                                                        [editPrevileg]:
                                                                                            {
                                                                                                ...previous[
                                                                                                    editPrevileg
                                                                                                ],
                                                                                                edit: !previous[
                                                                                                    editPrevileg
                                                                                                ][
                                                                                                    "edit"
                                                                                                ],
                                                                                                list:
                                                                                                    previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "list"
                                                                                                    ] ||
                                                                                                    !previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "edit"
                                                                                                    ],
                                                                                                view:
                                                                                                    previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "view"
                                                                                                    ] ||
                                                                                                    !previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "edit"
                                                                                                    ],
                                                                                                all:
                                                                                                    previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "add"
                                                                                                    ] &&
                                                                                                    !previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "edit"
                                                                                                    ] &&
                                                                                                    previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "delete"
                                                                                                    ],
                                                                                            },
                                                                                    })
                                                                                )
                                                                            }
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell
                                                                        align="center"
                                                                        padding="checkbox"
                                                                    >
                                                                        <Checkbox
                                                                            className="table-checkbox"
                                                                            checked={
                                                                                previleges[
                                                                                    editPrevileg
                                                                                ][
                                                                                    "view"
                                                                                ]
                                                                            }
                                                                            onChange={() =>
                                                                                setPrevileges(
                                                                                    (
                                                                                        previous
                                                                                    ) => ({
                                                                                        ...previous,
                                                                                        [editPrevileg]:
                                                                                            {
                                                                                                ...previous[
                                                                                                    editPrevileg
                                                                                                ],
                                                                                                view: !previous[
                                                                                                    editPrevileg
                                                                                                ][
                                                                                                    "view"
                                                                                                ],
                                                                                                list:
                                                                                                    previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "list"
                                                                                                    ] ||
                                                                                                    !previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "view"
                                                                                                    ],
                                                                                                edit:
                                                                                                    (previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "edit"
                                                                                                    ] &&
                                                                                                        !previous[
                                                                                                            editPrevileg
                                                                                                        ][
                                                                                                            "view"
                                                                                                        ]) ||
                                                                                                    false,
                                                                                                delete:
                                                                                                    (previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "delete"
                                                                                                    ] &&
                                                                                                        !previous[
                                                                                                            editPrevileg
                                                                                                        ][
                                                                                                            "view"
                                                                                                        ]) ||
                                                                                                    false,
                                                                                                fill:
                                                                                                    (previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "fill"
                                                                                                    ] &&
                                                                                                        !previous[
                                                                                                            editPrevileg
                                                                                                        ][
                                                                                                            "view"
                                                                                                        ]) ||
                                                                                                    false,

                                                                                                all:
                                                                                                    previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "add"
                                                                                                    ] &&
                                                                                                    previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "edit"
                                                                                                    ] &&
                                                                                                    !previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "view"
                                                                                                    ] &&
                                                                                                    previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "delete"
                                                                                                    ],
                                                                                            },
                                                                                    })
                                                                                )
                                                                            }
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell
                                                                        align="center"
                                                                        padding="checkbox"
                                                                    >
                                                                        <Checkbox
                                                                            className="table-checkbox"
                                                                            checked={
                                                                                previleges[
                                                                                    editPrevileg
                                                                                ][
                                                                                    "delete"
                                                                                ]
                                                                            }
                                                                            onChange={() =>
                                                                                setPrevileges(
                                                                                    (
                                                                                        previous
                                                                                    ) => ({
                                                                                        ...previous,
                                                                                        [editPrevileg]:
                                                                                            {
                                                                                                ...previous[
                                                                                                    editPrevileg
                                                                                                ],
                                                                                                delete: !previous[
                                                                                                    editPrevileg
                                                                                                ][
                                                                                                    "delete"
                                                                                                ],
                                                                                                list:
                                                                                                    previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "list"
                                                                                                    ] ||
                                                                                                    !previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "delete"
                                                                                                    ],
                                                                                                edit:
                                                                                                    previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "edit"
                                                                                                    ] ||
                                                                                                    !previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "delete"
                                                                                                    ],
                                                                                                view:
                                                                                                    previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "view"
                                                                                                    ] ||
                                                                                                    !previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "delete"
                                                                                                    ],

                                                                                                all:
                                                                                                    previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "add"
                                                                                                    ] &&
                                                                                                    !previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "delete"
                                                                                                    ],
                                                                                            },
                                                                                    })
                                                                                )
                                                                            }
                                                                        />
                                                                    </TableCell>
                                                                    {/* <TableCell align="center" padding="checkbox">
                                  <Checkbox
                                    className="table-checkbox"
                                    checked={previleges[editPrevileg]["assign"]}
                                    onChange={() =>
                                      setPrevileges((previous) => ({
                                        ...previous,
                                        [editPrevileg]: {
                                          ...previous[editPrevileg],
                                          assign: !previous[editPrevileg]["assign"],
                                          all: false,
                                        },
                                      }))
                                    }
                                  />
                                </TableCell> */}
                                                                    <TableCell
                                                                        align="center"
                                                                        padding="checkbox"
                                                                    >
                                                                        <Checkbox
                                                                            className="table-checkbox"
                                                                            checked={
                                                                                previleges[
                                                                                    editPrevileg
                                                                                ][
                                                                                    "all"
                                                                                ]
                                                                            }
                                                                            onChange={() =>
                                                                                setPrevileges(
                                                                                    (
                                                                                        previous
                                                                                    ) => ({
                                                                                        ...previous,
                                                                                        [editPrevileg]:
                                                                                            {
                                                                                                ...previous[
                                                                                                    editPrevileg
                                                                                                ],
                                                                                                all: !previous[
                                                                                                    editPrevileg
                                                                                                ][
                                                                                                    "all"
                                                                                                ],
                                                                                                list: !previous[
                                                                                                    editPrevileg
                                                                                                ][
                                                                                                    "all"
                                                                                                ],
                                                                                                view: !previous[
                                                                                                    editPrevileg
                                                                                                ][
                                                                                                    "all"
                                                                                                ],
                                                                                                add: !previous[
                                                                                                    editPrevileg
                                                                                                ][
                                                                                                    "all"
                                                                                                ],
                                                                                                edit: !previous[
                                                                                                    editPrevileg
                                                                                                ][
                                                                                                    "all"
                                                                                                ],
                                                                                                delete: !previous[
                                                                                                    editPrevileg
                                                                                                ][
                                                                                                    "all"
                                                                                                ],
                                                                                                fill:
                                                                                                    previleges[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "name"
                                                                                                    ] ===
                                                                                                        "Assessment" &&
                                                                                                    !previous[
                                                                                                        editPrevileg
                                                                                                    ][
                                                                                                        "all"
                                                                                                    ],
                                                                                            },
                                                                                    })
                                                                                )
                                                                            }
                                                                        />
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        }
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Paper>
                                </Box>
                                {/* </div> */}
                                <div className="form-btn flex-between add-members-btn">
                                    <button
                                        type="reset"
                                        style={{ marginTop: "20px" }}
                                        className="secondary-button mr-10"
                                        onClick={onClickCancelHandler2}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="primary-button"
                                        style={{ marginTop: "20px" }}
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </section>
        </div>
    );
};

export default EditRole;
