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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { privateAxios } from "../../api/axios";
import {
  DELETE_SUB_ADMIN,
  FETCH_PENDING_CGF_ADMIN,
  FETCH_SUB_ADMIN_BY_ADMIN,
  WITHDRAW_SUB_ADMIN,
} from "../../api/Url";

import useCallbackState from "../../utils/useCallBackState";
import Toaster from "../../components/Toaster";
import DialogBox from "../../components/DialogBox";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import { Logger } from "../../Logger/Logger";
import { catchError } from "../../utils/CatchError";
import { ResendEmail } from "../../utils/ResendEmail";
const ViewSubAdmin = () => {
  //custom hook to set title of page
  useDocumentTitle("View CGF Admin");
  const params = useParams();
  const state = params["*"].includes("pending") ? 1 : 0
  // state to manage loader
  const [
    openDeleteDialogBoxPendingCGFAdmin,
    setOpenDeleteDialogBoxPendingCGFAdmin,
  ] = useState(false);
  const [isCgfLoading, setIsCgfLoading] = useState(true);
  const history = useNavigate();
  
  const toasterRef = useRef();
  const navigate = useNavigate();
  const [toasterDetails, setToasterDetails] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "",
  });

  const [isActive, setActive] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [fetchedSubAdminDetails, setFetchedSubAdminDetails] = useState({});
  Logger.debug("params = ", params);
  useEffect(() => {
    let isMounted = true;
    let controller = new AbortController();

    const getCGFAdmin = async () => {
      try {
        setIsCgfLoading(true);
        const response = await privateAxios.get(
          params["*"].includes("pending")
            ? FETCH_PENDING_CGF_ADMIN + params?.id
            : FETCH_SUB_ADMIN_BY_ADMIN + params?.id,
          {
            signal: controller.signal,
          }
        );
        Logger.debug("response from sub admin view page fetch api", response);
        if (response.status === 200) {
          isMounted && setFetchedSubAdminDetails(response.data);
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
      }
    };
    getCGFAdmin();
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
          navigate("/users/cgf-admin/",{state});
        }, 2000);
      }
    } catch (error) {
      Logger.debug("error from delete API", error);
      catchError(error, setToasterDetails, toasterRef, navigate);
    }
  };

  const withdrawInviteByIdCGFAdmin = async () => {
    try {
      const response = await privateAxios.delete(
        WITHDRAW_SUB_ADMIN + params.id
      );
      if (response.status == 200) {
        Logger.debug("user invite withdrawn successfully");
        setToasterDetails(
          {
            titleMessage: "Success",
            descriptionMessage: response.data.message,
            messageType: "success",
          },
          () => toasterRef.current()
        );
        setTimeout(() => {
          navigate("/users/cgf-admin/", { state: 1 });
        }, 3000);
        // setOpenDeleteDialog(false);
        setOpenDeleteDialogBoxPendingCGFAdmin(false);
      }
    } catch (error) {
      catchError(error, setToasterDetails, toasterRef, navigate);

      Logger.debug("error from withdrawInvite id", error);
    }
  };

  Logger.debug("fetchedSubAdminDetails---", fetchedSubAdminDetails?.isActive);
  const handleToggle = () => {
    setActive(!isActive);
  };
  const handleOpen = (index) => {
    Logger.debug("clicked", index);
    Logger.debug(index);
    if (index === 0) {
      params["*"].includes("pending")
        ? history(`/users/cgf-admin/pending/edit-cgf-admin/${params.id}`)
        : history(`/users/cgf-admin/edit-cgf-admin/${params.id}`);
    }
    if (index === 1) {
      history(`/users/cgf-admin/replace-cgf-admin/${params.id}`);
    }
    if (index == 2) {
      Logger.debug("resend email");
      ResendEmail(params.id, setToasterDetails, toasterRef, navigate);
    }
    if (index === 3) {
      params["*"].includes("pending")
        ? setOpenDeleteDialogBoxPendingCGFAdmin(true)
        : setOpenDeleteDialog(true);
    }
  };

  const data = [
    {
      id: 1,
      action: "Edit",
    },
    {
      id: 2,
      action: "Replace & Delete",
    },
    {
      id: 4,
      action: "Re-Invite",
    },
    {
      id: 3,
      action: "Delete",
    },
  ];

  return (
    <div className="page-wrapper" onClick={() => isActive && setActive(false)}>
      <Toaster
        messageType={toasterDetails.messageType}
        descriptionMessage={toasterDetails.descriptionMessage}
        myRef={toasterRef}
        titleMessage={toasterDetails.titleMessage}
      />
      <DialogBox
        title={
          <p>
            Withdraw "
            {fetchedSubAdminDetails && `${fetchedSubAdminDetails?.name}`}
            's" Invitation
          </p>
        }
        info1={
          <p>
            On withdrawal, CGF admin will not be able to verify their account.
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
        secondaryButtonText={"Replace & Delete"}
        openModal={openDeleteDialog}
        setOpenModal={setOpenDeleteDialog}
      />
      <div className="breadcrumb-wrapper">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link
                to="/users/cgf-admin/"
                state={params["*"].includes("pending") ? 1 : 0}
              >
                CGF Admins{" "}
                {params["*"].includes("pending") ? "(Pending)" : "(Onboarded)"}
              </Link>
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
                        (params["*"].includes("pending") &&
                          d.action == "Replace & Delete") ||
                        (!params["*"].includes("pending") &&
                          d.action == "Re-Invite")
                      }
                      onClick={() => handleOpen(index)}
                      key={d.id}
                    >
                      {d.action}
                    </li>
                  ))}
                </ul>
              </div>
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
                            />
                          )}
                        />
                      </div>
                      <TextField
                        id="outlined-basic"
                        placeholder="N/A"
                        variant="outlined"
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
                      <TextField
                        id="outlined-basic"
                        placeholder="Enter phone number"
                        variant="outlined"
                        disabled
                        value={fetchedSubAdminDetails?.subRoleId?.name ?? "N/A"}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="card-form-field"
                  hidden={params["*"].includes("pending")}
                >
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
                <div
                  className="card-form-field"
                  hidden={params["*"].includes("pending")}
                >
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
