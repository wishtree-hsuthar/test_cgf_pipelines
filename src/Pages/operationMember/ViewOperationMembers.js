import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  Autocomplete,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  DELETE_OPERATION_MEMBER,
  GET_OPERATION_MEMBER_BY_ID,
  MEMBER,
  COUNTRIES,
  FETCH_PENDING_OPERATION_MEMBER,
  WITHDRAW_OPERATION_MEMBER,
} from "../../api/Url";
import { privateAxios } from "../../api/axios";

import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Logger } from "../../Logger/Logger";
import DialogBox from "../../components/DialogBox";
import Dropdown from "../../components/Dropdown";
import Input from "../../components/Input";
import Toaster from "../../components/Toaster";
import { catchError } from "../../utils/CatchError";
import Loader from "../../utils/Loader";
import { getOperationTypes } from "../../utils/OperationMemberModuleUtil";
import useCallbackState from "../../utils/useCallBackState";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import { ResendEmail } from "../../utils/ResendEmail";

const defaultValues = {
  memberCompany: "",
  companyType: "Internal",
  countryCode: "",
  phoneNumber: "",
  address: "",
  title: "",
  department: "",
  email: "",
  operationType: "",
  memberId: "",
  isActive: "",
  reportingManager: "",
  isCGFStaff: "",
  role: "",
  replacedOperationMember: "",
};
let OPERATION_TYPES = [];
const ViewOperationMembers = () => {
  //custom hook to set title of page
  useDocumentTitle("View Operation Member");

  // state to manage to loaders
  const [isViewOperationMemberLoading, setIsViewOperationMemberLoading] =
    useState(true);
  const [
    openDeleteDialogBoxPendingOperationMember,
    setOpenDeleteDialogBoxPendingOperationMember,
  ] = useState(false);
  const { control, reset, trigger, setValue } = useForm({
    defaultValues: defaultValues,
  });
  const navigate = useNavigate();
  const params = useParams();
  const state = params["*"].includes("pending") ? 1 : 0
  const toasterRef = useRef();
  const [toasterDetails, setToasterDetails] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "",
  });

  const [isActive, setActive] = useState(false);
  const [countries, setCountries] = useState([]);
  const [memberCompanies, setMemberCompanies] = useState();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [fetchOperationMemberDetaills, setFetchOperationMemberDetaills] =
    useState({});
  const privilege = useSelector((state) => state.user?.privilege);
  const SUPER_ADMIN = privilege?.name === "Super Admin" ? true : false;
  let viewOperationMemberPrivilegeArray = privilege
    ? Object.values(privilege?.privileges)
    : [];
  let moduleAccessForOperationMember = viewOperationMemberPrivilegeArray
    .filter((data) => data?.moduleId?.name === "Operation Members")
    .map((data) => ({
      operationMember: {
        list: data.list,
        view: data.view,
        edit: data.edit,
        delete: data.delete,
        add: data.add,
      },
    }));
  Logger.debug(
    "member operation privilege",
    moduleAccessForOperationMember[0]?.operationMember
  );

  const fetchMemberComapany = async (controller, isMounted) => {
    try {
      const response = await privateAxios.get(MEMBER + "/list", {
        signal: controller.signal,
      });
      Logger.debug(
        "member company---",
        response.data.map((data) => {
          Logger.debug("member company=", data.companyName);
        })
      );

      if (response.status == 200) {
        isMounted &&
          setMemberCompanies(
            response.data.map((data) => ({
              _id: data._id,
              companyName: data.companyName,
              companyType: data.companyType,
            }))
          );
      }

      Logger.debug("member company---", memberCompanies);
    } catch (error) {
      Logger.debug("error from fetch member company", error);
    }
  };
  let fetchCountries = async (controller, isMounted) => {
    try {
      const response = await privateAxios.get(COUNTRIES, {
        signal: controller.signal,
      });
      Logger.debug("response", response);
      isMounted &&
        setCountries(response.data.map((country) => country.countryCode));
    } catch (error) {
      Logger.debug("error from countries api", error);
    }
  };
  const fetchOperationMember = async (controller, isMounted) => {
    try {
      setIsViewOperationMemberLoading(true);
      const response = await privateAxios.get(
        params["*"].includes("pending")
          ? FETCH_PENDING_OPERATION_MEMBER + params.id
          : GET_OPERATION_MEMBER_BY_ID + params.id,
        {
          signal: controller.signal,
        }
      );
      Logger.debug("response from fetch operation member", response);

      isMounted && setFetchOperationMemberDetaills(response.data);
      reset({
        memberId: response?.data?.memberId?.companyName,
        companyType: response?.data?.memberId?.companyType,
        countryCode: response?.data?.countryCode,
        phoneNumber: response?.data?.phoneNumber,
        address: response?.data?.address,
        title: response.data.title ? response.data.title : "N/A",
        department: response?.data?.department
          ? response?.data?.department
          : "N/A",
        email: response?.data?.email,
        operationType: response?.data?.operationType
          ? response?.data?.operationType
          : "",
        reportingManager: response?.data?.reportingManager[0]?.name
          ? response?.data?.reportingManager[0]?.name
          : "N/A",
        name: response?.data?.name,
        salutation: response?.data?.salutation,
        isActive: response?.data?.isActive,
        isCGFStaff: response?.data?.isCGFStaff === true ? "true" : "false",
        role: response?.data?.role?.name,
        replacedOperationMember:
          response?.data?.replacedUsers !== undefined
            ? response?.data?.replacedUsers[0]?.name
            : "N/A",
      });

      setIsViewOperationMemberLoading(false);
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      setIsViewOperationMemberLoading(false);
      Logger.debug(
        "error in fetch operation member method in view page",
        error
      );

      catchError(
        error,
        setToasterDetails,
        toasterRef,
        navigate,
        "/users/operation-members"
      );
    }
  };
  const callGetOpeationMember = async () => {
    OPERATION_TYPES = await getOperationTypes();
  };
  useEffect(() => {
    let isMounted = true;
    let controller = new AbortController();
    OPERATION_TYPES?.length === 0 && callGetOpeationMember();
    countries?.length === 0 && fetchCountries(controller, isMounted);
    memberCompanies?.length === 0 && fetchMemberComapany(controller, isMounted);

    fetchOperationMember(controller, isMounted);

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const handleDeleteOperationMember = async () => {
    try {
      const response = await privateAxios.delete(
        DELETE_OPERATION_MEMBER + params.id
      );
      Logger.debug("Operation member deleted successfully");
      if (response.status == 200) {
        setToasterDetails(
          {
            titleMessage: "Success",
            descriptionMessage: `${fetchOperationMemberDetaills?.name} deleted!`,
            messageType: "success",
          },
          () => toasterRef.current()
        );
        setOpenDeleteDialog(false);
        setTimeout(() => {
          navigate("/users/operation-members",{state});
        }, 2000);
      }
    } catch (error) {
      Logger.debug("error from handle delete operation member", error);
      catchError(error, setToasterDetails, toasterRef, navigate);
    }
  };

  const withdrawInviteById = async () => {
    try {
      const response = await privateAxios.delete(
        WITHDRAW_OPERATION_MEMBER + params?.id 
      );
      if (response.status == 200) {
        Logger.debug("operation member  invite withdrawn successfully");
        setToasterDetails(
          {
            titleMessage: "Success",
            descriptionMessage: response?.data?.message,
            messageType: "success",
          },
          () => toasterRef.current()
        );
        // call getPendingOperationMember below
        setOpenDeleteDialogBoxPendingOperationMember(false);
        setTimeout(() => {
          navigate("/users/operation-members",{state});
        }, 2000);
      }
    } catch (error) {
      Logger.debug("error from withdrawInvite id operation member", error);
      catchError(error, setToasterDetails, toasterRef, navigate);
    }
  };

  const handleToggle = () => {
    setActive(!isActive);
  };
  const handleOpen = (index) => {
    Logger.debug("clicked", index);
    Logger.debug(index);
    if (index === 0) {
      params["*"].includes("pending")
        ? navigate(
            `/users/operation-member/pending/edit-operation-member/${params.id}`
          )
        : navigate(
            `/users/operation-member/edit-operation-member/${params.id}`
          );
    }
    if (index === 1) {
      navigate(`/users/operation-member/replace-operation-member/${params.id}`);
    }
    if (index === 2) {
      ResendEmail(params.id, setToasterDetails, toasterRef, navigate);
    }
    if (index === 3) {
      params["*"].includes("pending")
        ? setOpenDeleteDialogBoxPendingOperationMember(true)
        : setOpenDeleteDialog(true);
    }
  };
  const hideOption = () => {
    if (params["*"].includes("pending")) {
      return true;
    } else {
      return SUPER_ADMIN
        ? false
        : !moduleAccessForOperationMember[0]?.operationMember.delete;
    }
  };

  const hideDeleteOption = () => {
    if (fetchOperationMemberDetaills.isMemberRepresentative) {
      return true;
    } else {
      return SUPER_ADMIN
        ? false
        : !moduleAccessForOperationMember[0]?.operationMember.delete;
    }
  };

  const data = [
    {
      id: 1,
      action: "Edit",
      hide:
        SUPER_ADMIN === true
          ? false
          : !moduleAccessForOperationMember[0]?.operationMember.edit,
    },
    {
      id: 2,
      action: "Replace & Delete",
      hide: hideOption(),
    },
    {
      id: 4,
      action: "Re-Invite",
      hide: !params["*"].includes("pending"),
    },
    {
      id: 3,
      action: "Delete",
      hide: hideDeleteOption(),
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
            Delete{" "}
            {fetchOperationMemberDetaills.isMemberRepresentative
              ? "Member Representative"
              : "Operation Member"}{" "}
            "{fetchOperationMemberDetaills?.name}"
          </p>
        }
        info1={
          fetchOperationMemberDetaills.isMemberRepresentative ? (
            <p>
              Deleting <b>Member Representative</b> will be an irreversible
              action, you will not be able to add new assessment for{" "}
              <b>{fetchOperationMemberDetaills.memberId.companyName}</b>. we
              recommend you replace them instead.
            </p>
          ) : (
            <p>
              Deleting all the details will be an irreversible action, we
              recommend you replace them instead.
            </p>
          )
        }
        info2={
          <p>
            {" "}
            Do you still want to delete{" "}
            <b>{fetchOperationMemberDetaills.name}</b>?
          </p>
        }
        onPrimaryModalButtonClickHandler={handleDeleteOperationMember}
        onSecondaryModalButtonClickHandler={() => {
          setOpenDeleteDialog(false);
          navigate(
            `/users/operation-member/replace-operation-member/${params?.id}`
          );
        }}
        primaryButtonText={"Delete anyway"}
        secondaryButtonText={"Replace & Delete"}
        openModal={openDeleteDialog}
        setOpenModal={setOpenDeleteDialog}
      />
      <DialogBox
        title={
          <p>Withdraw {fetchOperationMemberDetaills?.name}'s Invitation</p>
        }
        info1={
          <p>
            On withdrawal, operation member will not be able to verify their
            account.
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
      <div className="breadcrumb-wrapper">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link
                to="/users/operation-members"
                state={params["*"].includes("pending") ? 1 : 0}
              >
                Operation Member{" "}
                {params["*"].includes("pending") ? "(Pending)" : "(Onboarded)"}
              </Link>
            </li>
            <li>View Operation Member</li>
          </ul>
        </div>
      </div>
      <section>
        <div className="container">
          <div className="form-header flex-between">
            <h2 className="heading2">View Operation Member</h2>

            <span className="form-header-right-txt" onClick={handleToggle}>
              {(SUPER_ADMIN === true ||
                moduleAccessForOperationMember[0].operationMember.edit ||
                moduleAccessForOperationMember[0].operationMember.delete) && (
                <span
                  className={`crud-operation ${
                    isActive && "crud-operation-active"
                  }`}
                >
                  <MoreVertIcon />
                </span>
              )}
              <div
                className="crud-toggle-wrap"
                style={{ display: isActive ? "block" : "none" }}
              >
                <ul className="crud-toggle-list">
                  {data.map((d, index) => (
                    <li
                      onClick={() => handleOpen(index)}
                      key={d.id}
                      hidden={d.hide}
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
          {isViewOperationMemberLoading ? (
            <Loader />
          ) : (
            <div className="card-wrapper">
              <div className="card-blk flex-between">
                <div className="card-blk flex-between">
                  <div className="card-form-field">
                    <div className="form-group">
                      <div className="salutation-wrap">
                        <div className="salutation-blk">
                          <label htmlFor="salutation">
                            Salutation <span className="mandatory">*</span>
                          </label>

                          <Dropdown
                            control={control}
                            name="salutation"
                            isDisabled
                            placeholder="Mr."
                            options={["Mr.", "Mrs.", "Ms."]}
                          />
                        </div>
                        <div className="salutation-inputblk">
                          <label htmlFor="name">
                            Full Name <span className="mandatory">*</span>
                          </label>
                          <Input isDisabled name={"name"} control={control} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="email">Job Title </label>
                      <Input isDisabled name={"title"} control={control} />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="email">Department </label>
                      <Input isDisabled name={"department"} control={control} />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="email">
                        Email <span className="mandatory">*</span>
                      </label>
                      <Input name={"email"} control={control} isDisabled />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="phoneNumber">Phone Number</label>
                      <div className="phone-number-field">
                        <div className="select-field country-code">
                          <Controller
                            control={control}
                            name="countryCode"
                            rules={{
                              required: true,
                            }}
                            render={({ field, fieldState: { error } }) => (
                              <Autocomplete
                                disabled
                                popupIcon={<KeyboardArrowDownRoundedIcon />}
                                className="phone-number-disable"
                                {...field}
                                options={countries}
                                autoHighlight
                                // placeholder="Select country code"
                                getOptionLabel={(country) => country}
                                renderOption={(props, option) => (
                                  <li {...props}>{option}</li>
                                )}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    inputProps={{
                                      ...params.inputProps,
                                    }}
                                    onChange={() => trigger("countryCode")}
                                    placeholder={"N/A"}
                                    disabled
                                  />
                                )}
                              />
                            )}
                          />
                        </div>
                        <Input
                          name={"phoneNumber"}
                          placeholder="N/A"
                          control={control}
                          isDisabled
                        />
                      </div>
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="">
                        Operation Type <span className="mandatory">*</span>
                      </label>
                      <Dropdown
                        isDisabled
                        control={control}
                        name="operationType"
                        placeholder="N/A"
                        options={OPERATION_TYPES}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="">
                        CGF Staff <span className="mandatory">*</span>
                      </label>
                      <div className="radio-btn-field">
                        <Controller
                          name="isCGFStaff"
                          control={control}
                          render={({ field }) => (
                            <RadioGroup
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                e.target.value === "true"
                                  ? setValue("companyType", "Internal")
                                  : setValue("companyType", "External");
                              }}
                              // value={field.name}
                              // value={field.isCGFStaff}
                              aria-labelledby="demo-radio-buttons-group-label"
                              name="radio-buttons-group"
                              className="radio-btn"
                            >
                              <FormControlLabel
                                value="true"
                                control={<Radio disabled />}
                                label="Yes"
                              />
                              <FormControlLabel
                                value="false"
                                control={<Radio disabled />}
                                label="No"
                              />
                            </RadioGroup>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="">
                        Member Company <span className="mandatory">*</span>
                      </label>
                      <div className="country-code-auto-search">
                        {/* <Controller
                                                control={control}
                                                name="memberId"
                                                rules={{ required: true }}
                                                render={({
                                                    field,
                                                    fieldState: { error },
                                                }) => (
                                                    <Autocomplete
                                                        {...field}
                                                        value={
                                                            memberCompanies?._id
                                                        }
                                                        // clearIcon={false}
                                                        disableClearable
                                                        options={
                                                            memberCompanies
                                                        }
                                                        placeholder="Select country code"
                                                        getOptionLabel={(
                                                            company
                                                        ) =>
                                                            company.companyName
                                                        }
                                                        renderOption={(
                                                            props,
                                                            option
                                                        ) => (
                                                            <li {...props}>
                                                                {
                                                                    option.companyName
                                                                }
                                                            </li>
                                                        )}
                                                        renderInput={(
                                                            params
                                                        ) => (
                                                            <TextField
                                                                {...params}
                                                                inputProps={{
                                                                    ...params.inputProps,
                                                                }}
                                                                placeholder={
                                                                    "Select member company"
                                                                }
                                                                disabled
                                                            />
                                                        )}
                                                    />
                                                )}
                                            /> */}
                        <Input control={control} isDisabled name={"memberId"} />
                      </div>
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="status">Company Type</label>
                      <Input
                        isDisabled={true}
                        name={"companyType"}
                        control={control}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="">Address </label>
                      <Controller
                        name="address"
                        control={control}
                        rules={{
                          minLength: 3,
                          maxLength: 250,
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            multiline
                            {...field}
                            onBlur={(e) =>
                              setValue("address", e.target.value?.trim())
                            }
                            disabled
                            inputProps={{
                              maxLength: 250,
                            }}
                            className={`input-textarea ${
                              error && "input-textarea-error"
                            }`}
                            id="outlined-basic"
                            placeholder="N/A"
                            helperText={" "}
                            variant="outlined"
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="">
                        Reporting Manager <span className="mandatory">*</span>
                      </label>
                      <Input
                        control={control}
                        name="reportingManager"
                        // myHelper={myHelper}
                        placeholder={"Select reporting manager "}
                        isDisabled
                      />
                    </div>
                  </div>
                  <div
                    className="card-form-field"
                    hidden={params["*"].includes("pending")}
                  >
                    <div className="form-group">
                      <label htmlFor="">
                        Replaced Operation Member{" "}
                        <span className="mandatory">*</span>
                      </label>
                      <Input
                        control={control}
                        name="replacedOperationMember"
                        // myHelper={myHelper}
                        placeholder={"N/A"}
                        isDisabled
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="">
                        Role <span className="mandatory">*</span>
                      </label>
                      <Input
                        control={control}
                        name="role"
                        // myHelper={myHelper}
                        placeholder={"N/A"}
                        isDisabled
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
                        <Controller
                          name="isActive"
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
                                value="true"
                                disabled
                                control={<Radio />}
                                label="Active"
                              />
                              <FormControlLabel
                                value="false"
                                disabled
                                control={<Radio />}
                                label="Inactive"
                              />
                            </RadioGroup>
                          )}
                        />
                      </div>
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

export default ViewOperationMembers;
