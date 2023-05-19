import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  TextField,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  Autocomplete,
} from "@mui/material";
import Loader from "../../utils/Loader";
// import "react-phone-number-input/style.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { privateAxios } from "../../api/axios";
import { DELETE_SUB_ADMIN, FETCH_SUB_ADMIN_BY_ADMIN } from "../../api/Url";

import useCallbackState from "../../utils/useCallBackState";
import Toaster from "../../components/Toaster";
import DialogBox from "../../components/DialogBox";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import { Logger } from "../../Logger/Logger";
import { catchError } from "../../utils/CatchError";
const ViewSubAdmin = () => {
  //custom hook to set title of page
  useDocumentTitle("View CGF Admin");
  // state to manage loader
  const [isCgfLoading, setIsCgfLoading] = useState(true);
  const history = useNavigate();
  const params = useParams();
  const toasterRef = useRef();
  const navigate = useNavigate();
  const [toasterDetails, setToasterDetails] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "",
  });
  // const [modalData, setData] = useState();

  const [isActive, setActive] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [fetchedSubAdminDetails, setFetchedSubAdminDetails] = useState({});

  // const [open, setOpen] = React.useState(false);

  useEffect(() => {
    let isMounted = true;
    let controller = new AbortController();

    (async () => {
      try {
        setIsCgfLoading(true);
        const response = await privateAxios.get(
          FETCH_SUB_ADMIN_BY_ADMIN + params.id,
          {
            signal: controller.signal,
          }
        );
        Logger.debug("response from sub admin view page fetch api", response);
        if (response.status === 200) {
          setFetchedSubAdminDetails(response.data);
        }
        setIsCgfLoading(false);
      } catch (error) {
        if (error?.code === "ERR_CANCELED") return;
        Logger.debug("error from sub admin view page fetch api", error);
        setIsCgfLoading(false);
        catchError(
          error,
          setToasterDetails,
          toasterRef,
          navigate,
          "/users/cgf-admin"
        );
        // if (error?.response?.status === 500) {
        //     navigate("/users/cgf-admin/");
        // } else if (error?.response?.status === 401) {
        //     setToasterDetails(
        //         {
        //             titleMessage: "Oops",
        //             descriptionMessage:
        //                 "Session Timeout: Please login again",
        //             messageType: "error",
        //         },
        //         () => toasterRef.current()
        //     );
        //     setTimeout(() => {
        //         navigate("/login");
        //     }, 3000);
        // } else if (error?.response?.status === 403) {
        //     setToasterDetails(
        //         {
        //             titleMessage: "Oops",
        //             descriptionMessage: error?.response?.data?.message
        //                 ? error?.response?.data?.message
        //                 : "Something went wrong",
        //             messageType: "error",
        //         },
        //         () => toasterRef.current()
        //     );
        //     setTimeout(() => {
        //         navigate("/home");
        //     }, 3000);
        // } else {
        //     setToasterDetails(
        //         {
        //             titleMessage: "Oops",
        //             descriptionMessage: error?.response?.data?.message
        //                 ? error?.response?.data?.message
        //                 : "Something went wrong",
        //             messageType: "error",
        //         },
        //         () => toasterRef.current()
        //     );
        // }
      }
    })();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const handleDeleteSubAdmin = async () => {
    try {
      const response = await privateAxios.delete(DELETE_SUB_ADMIN + params.id);
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
          navigate("/users/cgf-admin/");
        }, 2000);
      }
    } catch (error) {
      Logger.debug("error from delete API", error);
      catchError(error, setToasterDetails, toasterRef, navigate);
      // if (error?.response?.status === 401) {
      //     setToasterDetails(
      //         {
      //             titleMessage: "Oops",
      //             descriptionMessage:
      //                 "Session Timeout: Please login again",
      //             messageType: "error",
      //         },
      //         () => toasterRef.current()
      //     );
      //     setTimeout(() => {
      //         navigate("/login");
      //     }, 3000);
      // } else if (error?.response?.status === 403) {
      //     setToasterDetails(
      //         {
      //             titleMessage: "Oops",
      //             descriptionMessage: error?.response?.data?.message
      //                 ? error?.response?.data?.message
      //                 : "Something went wrong",
      //             messageType: "error",
      //         },
      //         () => toasterRef.current()
      //     );
      //     setTimeout(() => {
      //         navigate("/home");
      //     }, 3000);
      // } else {
      //     setToasterDetails(
      //         {
      //             titleMessage: "Oops!",
      //             descriptionMessage: error?.response?.data?.message,
      //             messageType: "error",
      //         },
      //         () => toasterRef.current()
      //     );
      // }
    }
  };
  Logger.debug("fetchedSubAdminDetails---", fetchedSubAdminDetails?.isActive);
  const handleToggle = () => {
    setActive(!isActive);
  };
  const handleOpen = (index) => {
    // setOpen(true);
    // setData(data[index]);
    Logger.debug("clicked", index);
    Logger.debug(index);
    if (index === 0) {
      // setOpen(false);
      history(`/users/cgf-admin/edit-cgf-admin/${params.id}`);
    }
    if (index === 1) {
      // setOpen(false);
      history(`/users/cgf-admin/replace-cgf-admin/${params.id}`);
    }
    if (index === 2) {
      // setOpen(false);
      setOpenDeleteDialog(true);
    }
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

  return (
    <div className="page-wrapper" onClick={() => isActive && setActive(false)}>
      <Toaster
        messageType={toasterDetails.messageType}
        descriptionMessage={toasterDetails.descriptionMessage}
        myRef={toasterRef}
        titleMessage={toasterDetails.titleMessage}
      />
      <DialogBox
        title={<p> Delete CGF Admin "{fetchedSubAdminDetails?.name}" </p>}
        info1={
          <p>
            Deleting all the details will be an irreversible action, we
            recommend you replace them instead.
          </p>
        }
        info2={
          <p>
            Do you still want to delete <b>{fetchedSubAdminDetails?.name}</b>?
          </p>
        }
        onPrimaryModalButtonClickHandler={handleDeleteSubAdmin}
        onSecondaryModalButtonClickHandler={() => {
          setOpenDeleteDialog(false);
          navigate(`/users/cgf-admin/replace-cgf-admin/${params.id}`);
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
              <Link to="/users/cgf-admin/">CGF Admins</Link>
            </li>
            <li>View CGF Admin</li>
          </ul>
        </div>
      </div>
      <section>
        <div className="container">
          <div className="form-header flex-between">
            <h2 className="heading2">View CGF Admin</h2>

            <span className="form-header-right-txt" onClick={handleToggle}>
              <span
                className={`crud-operation ${
                  isActive && "crud-operation-active"
                }`}
              >
                <MoreVertIcon />
              </span>
              <div
                className="crud-toggle-wrap"
                style={{ display: isActive ? "block" : "none" }}
              >
                <ul className="crud-toggle-list">
                  {data.map((d, index) => (
                    <li
                      hidden={
                        !fetchedSubAdminDetails.hasOwnProperty("subRoleId") &&
                        d.action == "Replace"
                      }
                      onClick={() => handleOpen(index)}
                      key={index}
                    >
                      {d.action}
                    </li>
                  ))}
                </ul>
              </div>
              {/* <CustomModal /> */}
              {/* <ReplaceSubAdminModal /> */}
            </span>
          </div>
          {isCgfLoading ? (
            <Loader />
          ) : (
            <div className="card-wrapper">
              <div className="card-blk flex-between">
                <div className="card-form-field">
                  <div className="form-group">
                    <label htmlFor="subAdminName">
                      CGF Admin Name <span className="mandatory">*</span>
                    </label>
                    <TextField
                      id="outlined-basic"
                      placeholder="N/A"
                      variant="outlined"
                      className={`input-field`}
                      disabled={true}
                      value={fetchedSubAdminDetails?.name}
                      helperText={" "}
                    />
                  </div>
                </div>
                <div className="card-form-field">
                  <div className="form-group">
                    <label htmlFor="email">
                      Email <span className="mandatory">*</span>
                    </label>
                    <TextField
                      className={`input-field `}
                      id="outlined-basic"
                      placeholder="N/A"
                      variant="outlined"
                      disabled={true}
                      value={fetchedSubAdminDetails?.email}
                      helperText={" "}
                    />
                  </div>
                </div>
                <div className="card-form-field">
                  <div className="form-group">
                    <label htmlFor="emailid">Phone Number</label>
                    <div className="phone-number-field">
                      <div className="select-field country-code">
                        <Autocomplete
                          disabled
                          popupIcon={<KeyboardArrowDownRoundedIcon />}
                          className="phone-number-disable"
                          options={[]}
                          autoHighlight
                          // getOptionLabel={(country) =>
                          //     country?.countryCode
                          // }
                          readOnly
                          value={fetchedSubAdminDetails?.countryCode}
                          renderOption={(props, option) => (
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
                              placeholder="N/A"
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
                              // helperText={" "}
                            />
                          )}
                        />
                      </div>
                      <TextField
                        // className={`input-field ${
                        //     errors.email && "input-error"
                        // }`}
                        id="outlined-basic"
                        placeholder="N/A"
                        variant="outlined"
                        // {...register("phoneNumber")}
                        disabled
                        value={fetchedSubAdminDetails?.phoneNumber}
                        helperText={" "}
                      />
                    </div>
                  </div>
                </div>
                <div className="card-form-field">
                  <div className="form-group">
                    <label htmlFor="role">
                      Role <span className="mandatory">*</span>
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
                        value={fetchedSubAdminDetails?.subRoleId?.name ?? "N/A"}
                        // helperText={" "}
                      />
                    </div>
                  </div>
                </div>
                <div className="card-form-field">
                  <div className="form-group">
                    <label htmlFor="email">Replaced CGF Admin </label>
                    <TextField
                      className={`input-field `}
                      id="outlined-basic"
                      placeholder="N/A"
                      variant="outlined"
                      disabled={true}
                      value={
                        fetchedSubAdminDetails?.replacedUsers
                          ? fetchedSubAdminDetails?.replacedUsers[0]?.name
                          : "N/A"
                      }
                      helperText={" "}
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
          )}
        </div>
      </section>
    </div>
  );
};

export default ViewSubAdmin;
