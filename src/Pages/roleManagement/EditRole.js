//Third party imports
import {
    Box,
    Checkbox,
    FormControlLabel,
    Paper,
    Radio,
    RadioGroup,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

//Internal Imports
import Toaster from "../../components/Toaster";
import "../../components/TableComponent.css";
import useCallbackState from "../../utils/useCallBackState";
import Loader2 from "../../assets/Loader/Loader2.svg";
import { REACT_APP_API_ENDPOINT } from "../../api/Url";
import { useDocumentTitle } from "../../utils/useDocumentTitle";

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

    const onSubmit1 = async (data) => {
        try {
            console.log("input Data: ", data, "Previleges: ", previleges);
            let previlegesForBackend = JSON.parse(JSON.stringify(previleges));
            Object.keys(previlegesForBackend).forEach((p_key) => {
                delete previlegesForBackend[p_key]["all"];
                delete previlegesForBackend[p_key]["name"];
            });
            console.log("previleges : ", previlegesForBackend);
            const response = await axios.put(
                REACT_APP_API_ENDPOINT + `roles/${params.id}`,
                {
                    description: data.description,
                    isActive: data.status === "active" ? true : false,
                    privileges: previlegesForBackend,
                }
            );
            console.log("response", response);
            setToasterDetails2(
                {
                    titleMessage: "Success!",
                    descriptionMessage: "Role details updated successfully!",
                    messageType: "success",
                },
                () => myRef2.current()
            );
            console.log("Default Values", editDefault);
            reset({
                roleName: "",
                status: "active",
                description: "",
            });
            setTimeout(() => navigate2(`/roles/view-role/${params.id}`), 3000);
        } catch (error) {
            console.log("error", error);
            if (error?.response?.status == 401) {
                setToasterDetails2(
                    {
                        titleMessage: "Error",
                        descriptionMessage:
                            "Session Timeout: Please login again",

                        messageType: "error",
                    },
                    () => myRef2.current()
                );
                navigate2("/login");
            } else {
                setToasterDetails2(
                    {
                        titleMessage: "Error",
                        descriptionMessage:
                            error?.response?.data?.message &&
                            typeof error.response.data.message === "string"
                                ? error.response.data.message
                                : "Something went wrong!",
                        messageType: "error",
                    },
                    () => myRef2.current()
                );
            }
        }
    };
    const onClickCancelHandler2 = () => {
        navigate2(`/roles/view-role/${params.id}`);
    };
    const createPrevileges2 = (tempPrivileges) => {
        console.log("temp data", tempPrivileges);
        Object.keys(tempPrivileges).forEach((tempPriv) => {
            // console.log("temp Previ value",tempPrivileges[tempPriv])
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
        console.log("temp", temp);
        setPrevileges({ ...temp });
    };
    const updateEditFields = (data) => {
        console.log("previleges", data.privileges);
        reset({
            roleName: data.name,
            status: data.isActive ? "active" : "inactive",
            description: data.description,
        });
        createPrevileges2(data.privileges);
    };
    const getRoleById = async () => {
        try {
            setIsLoading1(true);
            const response = await axios.get(
                REACT_APP_API_ENDPOINT + `roles/${params.id}`
            );
            console.log("response: ", response);
            updateEditFields(response.data);
            setIsLoading1(false);
        } catch (error) {
            console.log("Error", error);
            if (error?.code === "ERR_CANCELED") return;
            if (error?.response?.status == 401) {
                setToasterDetails2(
                    {
                        titleMessage: "Error",
                        descriptionMessage:
                            "Session Timeout: Please login again",

                        messageType: "error",
                    },
                    () => myRef2.current()
                );
                navigate2("/login");
            } else {
                setIsLoading1(false);
                setToasterDetails2(
                    {
                        titleMessage: "Error",
                        descriptionMessage:
                            error?.response?.data?.message &&
                            typeof error.response.data.message === "string"
                                ? error.response.data.message
                                : "Something went wrong!",
                        messageType: "error",
                    },
                    () => myRef2.current()
                );
            }
        }
    };
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        isMounted && getRoleById();
        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);
    console.log("Privilege", previleges);
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
                        <div className="loader-blk">
                            <img src={Loader2} alt="Loading" />
                        </div>
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
                                                        <RadioGroup
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
                                                        </RadioGroup>
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
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell
                                                            align="left"
                                                            className="table-header"
                                                            width="16%"
                                                        >
                                                            <span className="sorted-blk">
                                                                Modules
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="table-header">
                                                            <span className="sorted-blk">
                                                                Fill
                                                            </span>
                                                        </TableCell>

                                                        <TableCell className="table-header">
                                                            <span className="sorted-blk">
                                                                List
                                                            </span>
                                                        </TableCell>
                                                        <TableCell
                                                            align="center"
                                                            className="table-header"
                                                        >
                                                            <span className="sorted-blk">
                                                                Add
                                                            </span>
                                                        </TableCell>
                                                        <TableCell
                                                            align="center"
                                                            className="table-header"
                                                        >
                                                            <span className="sorted-blk">
                                                                Edit
                                                            </span>
                                                        </TableCell>
                                                        <TableCell
                                                            align="center"
                                                            className="table-header"
                                                        >
                                                            <span className="sorted-blk">
                                                                View
                                                            </span>
                                                        </TableCell>
                                                        <TableCell
                                                            align="center"
                                                            className="table-header"
                                                        >
                                                            <span className="sorted-blk">
                                                                Delete
                                                            </span>
                                                        </TableCell>
                                                        {/* <TableCell
                              align="center"
                              className="table-header"
                              width="16%"
                            >
                              Assign to Member
                            </TableCell> */}
                                                        <TableCell
                                                            align="center"
                                                            className="table-header"
                                                        >
                                                            <span className="sorted-blk">
                                                                All
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {Object.keys(
                                                        previleges
                                                    ).map((previleg, id) => {
                                                        return (
                                                            <TableRow
                                                                key={previleg}
                                                                hover
                                                            >
                                                                <TableCell>
                                                                    {
                                                                        previleges[
                                                                            previleg
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
                                                                        previleg
                                                                    ][
                                                                        "name"
                                                                    ] ===
                                                                        "Assessment" && (
                                                                        <Checkbox
                                                                            className="table-checkbox"
                                                                            checked={
                                                                                previleges[
                                                                                    previleg
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
                                                                                        [previleg]:
                                                                                            {
                                                                                                ...previous[
                                                                                                    previleg
                                                                                                ],
                                                                                                fill: !previous[
                                                                                                    previleg
                                                                                                ][
                                                                                                    "fill"
                                                                                                ],
                                                                                                all:
                                                                                                    !previous[
                                                                                                        previleg
                                                                                                    ][
                                                                                                        "fill"
                                                                                                    ] &&
                                                                                                    previous[
                                                                                                        previleg
                                                                                                    ][
                                                                                                        "list"
                                                                                                    ] &&
                                                                                                    previous[
                                                                                                        previleg
                                                                                                    ][
                                                                                                        "add"
                                                                                                    ] &&
                                                                                                    previous[
                                                                                                        previleg
                                                                                                    ][
                                                                                                        "edit"
                                                                                                    ] &&
                                                                                                    previous[
                                                                                                        previleg
                                                                                                    ][
                                                                                                        "view"
                                                                                                    ] &&
                                                                                                    previous[
                                                                                                        previleg
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
                                                                                previleg
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
                                                                                    [previleg]:
                                                                                        {
                                                                                            ...previous[
                                                                                                previleg
                                                                                            ],
                                                                                            list: !previous[
                                                                                                previleg
                                                                                            ][
                                                                                                "list"
                                                                                            ],
                                                                                            all:
                                                                                                !previous[
                                                                                                    previleg
                                                                                                ][
                                                                                                    "list"
                                                                                                ] &&
                                                                                                previous[
                                                                                                    previleg
                                                                                                ][
                                                                                                    "add"
                                                                                                ] &&
                                                                                                previous[
                                                                                                    previleg
                                                                                                ][
                                                                                                    "edit"
                                                                                                ] &&
                                                                                                previous[
                                                                                                    previleg
                                                                                                ][
                                                                                                    "view"
                                                                                                ] &&
                                                                                                previous[
                                                                                                    previleg
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
                                                                                previleg
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
                                                                                    [previleg]:
                                                                                        {
                                                                                            ...previous[
                                                                                                previleg
                                                                                            ],
                                                                                            add: !previous[
                                                                                                previleg
                                                                                            ][
                                                                                                "add"
                                                                                            ],
                                                                                            list: !previous[
                                                                                                previleg
                                                                                            ][
                                                                                                "add"
                                                                                            ],
                                                                                            view: !previous[
                                                                                                previleg
                                                                                            ][
                                                                                                "add"
                                                                                            ],
                                                                                            all:
                                                                                                !previous[
                                                                                                    previleg
                                                                                                ][
                                                                                                    "add"
                                                                                                ] &&
                                                                                                previous[
                                                                                                    previleg
                                                                                                ][
                                                                                                    "edit"
                                                                                                ] &&
                                                                                                previous[
                                                                                                    previleg
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
                                                                                previleg
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
                                                                                    [previleg]:
                                                                                        {
                                                                                            ...previous[
                                                                                                previleg
                                                                                            ],
                                                                                            edit: !previous[
                                                                                                previleg
                                                                                            ][
                                                                                                "edit"
                                                                                            ],
                                                                                            list: !previous[
                                                                                                previleg
                                                                                            ][
                                                                                                "edit"
                                                                                            ],
                                                                                            view: !previous[
                                                                                                previleg
                                                                                            ][
                                                                                                "edit"
                                                                                            ],
                                                                                            all:
                                                                                                previous[
                                                                                                    previleg
                                                                                                ][
                                                                                                    "add"
                                                                                                ] &&
                                                                                                !previous[
                                                                                                    previleg
                                                                                                ][
                                                                                                    "edit"
                                                                                                ] &&
                                                                                                previous[
                                                                                                    previleg
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
                                                                                previleg
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
                                                                                    [previleg]:
                                                                                        {
                                                                                            ...previous[
                                                                                                previleg
                                                                                            ],
                                                                                            view: !previous[
                                                                                                previleg
                                                                                            ][
                                                                                                "view"
                                                                                            ],
                                                                                            list: !previous[
                                                                                                previleg
                                                                                            ][
                                                                                                "view"
                                                                                            ],
                                                                                            all:
                                                                                                previous[
                                                                                                    previleg
                                                                                                ][
                                                                                                    "add"
                                                                                                ] &&
                                                                                                previous[
                                                                                                    previleg
                                                                                                ][
                                                                                                    "edit"
                                                                                                ] &&
                                                                                                !previous[
                                                                                                    previleg
                                                                                                ][
                                                                                                    "view"
                                                                                                ] &&
                                                                                                previous[
                                                                                                    previleg
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
                                                                                previleg
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
                                                                                    [previleg]:
                                                                                        {
                                                                                            ...previous[
                                                                                                previleg
                                                                                            ],
                                                                                            delete: !previous[
                                                                                                previleg
                                                                                            ][
                                                                                                "delete"
                                                                                            ],
                                                                                            list: !previous[
                                                                                                previleg
                                                                                            ][
                                                                                                "delete"
                                                                                            ],
                                                                                            edit: !previous[
                                                                                                previleg
                                                                                            ][
                                                                                                "delete"
                                                                                            ],
                                                                                            view: !previous[
                                                                                                previleg
                                                                                            ][
                                                                                                "delete"
                                                                                            ],
                                                                                            all:
                                                                                                previous[
                                                                                                    previleg
                                                                                                ][
                                                                                                    "add"
                                                                                                ] &&
                                                                                                !previous[
                                                                                                    previleg
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
                                    checked={previleges[previleg]["assign"]}
                                    onChange={() =>
                                      setPrevileges((previous) => ({
                                        ...previous,
                                        [previleg]: {
                                          ...previous[previleg],
                                          assign: !previous[previleg]["assign"],
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
                                                                                previleg
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
                                                                                    [previleg]:
                                                                                        {
                                                                                            ...previous[
                                                                                                previleg
                                                                                            ],
                                                                                            all: !previous[
                                                                                                previleg
                                                                                            ][
                                                                                                "all"
                                                                                            ],
                                                                                            list: !previous[
                                                                                                previleg
                                                                                            ][
                                                                                                "all"
                                                                                            ],
                                                                                            view: !previous[
                                                                                                previleg
                                                                                            ][
                                                                                                "all"
                                                                                            ],
                                                                                            add: !previous[
                                                                                                previleg
                                                                                            ][
                                                                                                "all"
                                                                                            ],
                                                                                            edit: !previous[
                                                                                                previleg
                                                                                            ][
                                                                                                "all"
                                                                                            ],
                                                                                            delete: !previous[
                                                                                                previleg
                                                                                            ][
                                                                                                "all"
                                                                                            ],
                                                                                            fill:
                                                                                                previleges[
                                                                                                    previleg
                                                                                                ][
                                                                                                    "name"
                                                                                                ] ===
                                                                                                    "Assessment" &&
                                                                                                !previous[
                                                                                                    previleg
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
                                                    })}
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
