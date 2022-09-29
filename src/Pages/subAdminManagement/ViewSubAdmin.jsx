import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
// import { TextField, Select, MenuItem} from '@mui/material';
import {
    TextField,
    Backdrop,
    Box,
    Modal,
    Select,
    MenuItem,
    Fade,
    Radio,
    RadioGroup,
    FormControlLabel,
    Autocomplete,
} from "@mui/material";

import "react-phone-number-input/style.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";

import { Controller } from "react-hook-form";
import { privateAxios } from "../../api/axios";
import { DELETE_SUB_ADMIN, FETCH_SUB_ADMIN_BY_ADMIN } from "../../api/Url";
import { useRef } from "react";
import useCallbackState from "../../utils/useCallBackState";
import Toaster from "../../components/Toaster";
import DialogBox from "../../components/DialogBox";

const ViewSubAdmin = () => {
    const history = useNavigate();
    const params = useParams();
    const toasterRef = useRef();
    const navigate = useNavigate();
    const [toasterDetails, setToasterDetails] = useCallbackState({
        titleMessage: "",
        descriptionMessage: "",
        messageType: "",
    });
    const [modalData, setData] = useState();

    const [isActive, setActive] = useState("false");
    const [countries, setCountries] = useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [value, setValue] = useState({
        name: "India",
        countryCode: "+91",
    });
    const [fetchedSubAdminDetails, setFetchedSubAdminDetails] = useState({});

    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        let isMounted = true;
        let controller = new AbortController();

        const fetchSubAdmin = async () => {
            try {
                const response = await privateAxios.get(
                    FETCH_SUB_ADMIN_BY_ADMIN + params.id,
                    {
                        signal: controller.signal,
                    }
                );
                console.log(
                    "response from sub admin view page fetch api",
                    response
                );
                isMounted && setFetchedSubAdminDetails(response.data);
            } catch (error) {
                console.log("error from sub admin view page fetch api", error);
                if (error?.response?.status === 500) {
                    navigate("/sub-admins");
                }
            }
        };
        fetchSubAdmin();
        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    const handleDeleteSubAdmin = async () => {
        try {
            const response = await privateAxios.delete(
                DELETE_SUB_ADMIN + params.id
            );
            if (response.status == 200) {
                setToasterDetails(
                    {
                        titleMessage: "Success",
                        descriptionMessage: response.data.message,
                        messageType: "success",
                    },
                    () => toasterRef.current()
                );
                setOpenDeleteDialog(false);
                setTimeout(() => {
                    navigate("/sub-admins");
                }, 2000);
            }
        } catch (error) {
            console.log("error from delete API", error);
            setToasterDetails(
                {
                    titleMessage: "Oops!",
                    descriptionMessage: error?.response?.data?.message,
                    messageType: "error",
                },
                () => toasterRef.current()
            );
        }
    };
    console.log("fetchedSubAdminDetails---", fetchedSubAdminDetails?.isActive);
    const handleToggle = () => {
        setActive(!isActive);
    };
    const handleOpen = (index) => {
        setOpen(true);
        setData(data[index]);
        console.log("clicked", index);
        console.log(index);
        if (index === 0) {
            setOpen(false);
            history(`/sub-admins/edit-sub-admin/${params.id}`);
        }
        if (index === 1) {
            setOpen(false);
            history(`/sub-admins/replace-sub-admin/${params.id}`);
        }
        if (index === 2) {
            setOpen(false);
            setOpenDeleteDialog(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const data = [
        {
            id: 1,
            action: "Edit",
            title: 'Edit Member "KitKat"!',
            info: "On replacing a member, all the statistics and record would get transfer to the new member. Are you sure you want to replace KitKat?",
            secondarybtn: "No",
            primarybtn: "Yes",
        },
        {
            id: 2,
            action: "Replace",
            title: 'Replace Member "KitKat"!',
            info: "On replacing a member, all the statistics and record would get transfer to the new member. Are you sure you want to replace KitKat?",
            secondarybtn: "No",
            primarybtn: "Yes",
        },
        {
            id: 3,
            action: "Delete",
            title: 'Delete Sub-admin "KitKat"!',
            info: "We recommend you to replace this sub admin with the new one because deleting all the details which sub admin has added will get deleted and this will be an irreversible action, Are you sure want to delete (sub admin name) !",
            secondarybtn: "Replace Sub-admin",
            primarybtn: "Delete Anyway",
        },
    ];
    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
    };
    const CustomModal = () => {
        return modalData ? (
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
                className="popup-blk"
            >
                <Fade in={open}>
                    <Box sx={style} className="popup-box">
                        <div
                            id="transition-modal-title"
                            className="popup-ttl-blk"
                        >
                            <h2 className="popup-ttl heading2">
                                {modalData.title}
                            </h2>
                            <span
                                class="popup-close-icon"
                                onClick={handleClose}
                            >
                                <CloseIcon />
                            </span>
                        </div>
                        <div
                            id="transition-modal-description"
                            className="popup-body"
                        >
                            <div className="popup-content-blk text-center">
                                <p>open{modalData.info}</p>
                                <div className="form-btn flex-center">
                                    <button
                                        type="submit"
                                        className="secondary-button mr-10"
                                    >
                                        {modalData.secondarybtn}
                                    </button>
                                    <button
                                        type="submit"
                                        className="primary-button"
                                    >
                                        {modalData.primarybtn}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Box>
                </Fade>
            </Modal>
        ) : null;
    };

    return (
        <div className="page-wrapper">
            <Toaster
                messageType={toasterDetails.messageType}
                descriptionMessage={toasterDetails.descriptionMessage}
                myRef={toasterRef}
                titleMessage={toasterDetails.titleMessage}
            />
            <DialogBox
                title={"Delete CGF Admin"}
                info1={
                    "We recommend you to replace this sub admin with the new one because deleting all the details which sub admin has added will get deleted and this will be an irreversible action"
                }
                info2={`Are you you want to delete${fetchedSubAdminDetails?.name}?`}
                onPrimaryModalButtonClickHandler={handleDeleteSubAdmin}
                onSecondaryModalButtonClickHandler={() => {
                    setOpenDeleteDialog(false);
                    navigate("/sub-admins/replace-sub-admin");
                }}
                primaryButtonText={"Delete anyway"}
                secondaryButtonText={"Replace"}
                openModal={openDeleteDialog}
                setOpenModal={setOpenDeleteDialog}
            />
            <div className="breadcrumb-wrapper">
                <div className="container">
                    <ul className="breadcrumb">
                        <li>
                            <Link to="/sub-admins">CGF Admin</Link>
                        </li>
                        <li>View CGF Admin</li>
                    </ul>
                </div>
            </div>
            <section>
                <div className="container">
                    <div className="form-header flex-between">
                        <h2 className="heading2">View CGF Admin</h2>

                        <span
                            className="form-header-right-txt"
                            onClick={handleToggle}
                        >
                            <span className="crud-operation">
                                <MoreVertIcon />
                            </span>
                            <div
                                className="crud-toggle-wrap"
                                style={{ display: isActive ? "none" : "block" }}
                            >
                                <ul className="crud-toggle-list">
                                    {data.map((d, index) => (
                                        <li
                                            onClick={() => handleOpen(index)}
                                            key={index}
                                        >
                                            {d.action}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <CustomModal />
                            {/* <ReplaceSubAdminModal /> */}
                        </span>
                    </div>
                    <div className="card-wrapper">
                        <div className="card-blk flex-between">
                            <div className="card-form-field">
                                <div className="form-group">
                                    <label for="subAdminName">
                                        CGF Admin Name{" "}
                                        <span className="mandatory">*</span>
                                    </label>
                                    <TextField
                                        id="outlined-basic"
                                        placeholder="Enter sub admin name"
                                        variant="outlined"
                                        className={`input-field`}
                                        disabled={true}
                                        value={fetchedSubAdminDetails?.name}
                                    />
                                </div>
                            </div>
                            <div className="card-form-field">
                                <div className="form-group">
                                    <label for="email">
                                        Email Id{" "}
                                        <span className="mandatory">*</span>
                                    </label>
                                    <TextField
                                        className={`input-field `}
                                        id="outlined-basic"
                                        placeholder="Enter email address"
                                        variant="outlined"
                                        disabled={true}
                                        value={fetchedSubAdminDetails?.email}
                                    />
                                </div>
                            </div>
                            <div className="card-form-field">
                                <div className="form-group">
                                    <label for="emailid">Phone Number</label>
                                    <div className="phone-number-field">
                                        <div className="select-field country-code">
                                            <Autocomplete
                                                options={countries}
                                                autoHighlight
                                                getOptionLabel={(country) =>
                                                    country.countryCode
                                                }
                                                disabled
                                                value={value}
                                                renderOption={(
                                                    props,
                                                    option
                                                ) => (
                                                    <Box
                                                        component="li"
                                                        sx={{
                                                            "& > img": {
                                                                mr: 2,
                                                                flexShrink: 0,
                                                            },
                                                        }}
                                                        {...props}
                                                    >
                                                        {option.name + " "}
                                                        {option.countryCode}
                                                    </Box>
                                                )}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        inputProps={{
                                                            ...params.inputProps,
                                                            autoComplete: "", // disable autocomplete and autofill
                                                        }}
                                                        // value={value}
                                                        // onChange={(e) =>
                                                        //     setValue(e.target.value)
                                                        // }
                                                        // onSelect={(e) =>
                                                        //     setValue(e.target.value)
                                                        // }
                                                        // {...register("countryCode")}
                                                        // helperText={
                                                        //     errors?.countryCode?.message
                                                        // }
                                                    />
                                                )}
                                            />
                                        </div>
                                        <TextField
                                            // className={`input-field ${
                                            //     errors.email && "input-error"
                                            // }`}
                                            id="outlined-basic"
                                            placeholder="Enter phone number"
                                            variant="outlined"
                                            // {...register("phoneNumber")}
                                            disabled
                                            value={
                                                fetchedSubAdminDetails?.phoneNumber
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="card-form-field">
                                <div className="form-group">
                                    <label for="role">
                                        Select Role{" "}
                                        <span className="mandatory">*</span>
                                    </label>

                                    <div className="select-field">
                                        {/* <Select
                                            disabled="true"
                                            className={`input-field `}
                                            value={""}
                                        >
                                            <MenuItem value={"manager"}>
                                                {"Manager"}
                                            </MenuItem>
                                            <MenuItem
                                                value={"Assistent manager"}
                                            >
                                                {"Assistent manager"}
                                            </MenuItem>
                                            <MenuItem value={"Supervisor"}>
                                                {"Supervisor"}
                                            </MenuItem>
                                        </Select> */}
                                        <TextField
                                            // className={`input-field ${
                                            //     errors.email && "input-error"
                                            // }`}
                                            id="outlined-basic"
                                            placeholder="Enter phone number"
                                            variant="outlined"
                                            // {...register("phoneNumber")}
                                            disabled
                                            value={
                                                fetchedSubAdminDetails
                                                    ?.subRoleId?.name
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="card-form-field">
                                <div className="form-group">
                                    <label for="email">
                                        Replaced CGF Admin{" "}
                                        <span className="mandatory">*</span>
                                    </label>
                                    <TextField
                                        className={`input-field `}
                                        id="outlined-basic"
                                        placeholder="Enter email address"
                                        variant="outlined"
                                        disabled={true}
                                        value={"N/A"}
                                    />
                                </div>
                            </div>
                            <div className="card-form-field">
                                <div className="form-group">
                                    <label htmlFor="status">Status</label>
                                    <div className="radio-btn-field">
                                        <RadioGroup
                                            aria-labelledby="demo-radio-buttons-group-label"
                                            name="radio-buttons-group"
                                            className="radio-btn"
                                            value={
                                                fetchedSubAdminDetails.isActive
                                                    ? "active"
                                                    : "inactive"
                                            }
                                        >
                                            <FormControlLabel
                                                disabled
                                                value={"active"}
                                                control={<Radio />}
                                                label="Active"
                                            />
                                            <FormControlLabel
                                                disabled
                                                value={"inactive"}
                                                control={<Radio />}
                                                label="Inactive"
                                            />
                                        </RadioGroup>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ViewSubAdmin;
