import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
    Paper,
} from "@mui/material";

import "react-phone-number-input/style.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { privateAxios } from "../../api/axios";
import {
  GET_OPERATION_MEMBER_BY_ID,
  DELETE_OPERATION_MEMBER,
  MEMBER,
  COUNTRIES,
} from "../../api/Url";

import useCallbackState from "../../utils/useCallBackState";
import Toaster from "../../components/Toaster";
import DialogBox from "../../components/DialogBox";
import { Controller, useForm } from "react-hook-form";
import Input from "../../components/Input";
import Dropdown from "../../components/Dropdown";
import { useSelector } from "react-redux";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

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
  address: "",
  isActive: "",
  reportingManager: "",
};
const ViewOperationMembers = () => {
  const { control, reset, watch, trigger } = useForm({
    defaultValues: defaultValues,
  });
  const navigate = useNavigate();
  const params = useParams();
  const toasterRef = useRef();
  const [toasterDetails, setToasterDetails] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "",
  });

  const [isActive, setActive] = useState("false");
  const [countries, setCountries] = useState([]);
  const [memberCompanies, setMemberCompanies] = useState();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [value, setValue] = useState({
    name: "India",
    countryCode: "+91",
    department: "",
  });
  const [fetchOperationMemberDetaills, setFetchOperationMemberDetaills] =
    useState({});
  const [open, setOpen] = React.useState(false);
  const privilege = useSelector((state) => state.user?.privilege);
  const SUPER_ADMIN = privilege?.name === "Super Admin" ? true : false;
  let privilegeArray = privilege ? Object.values(privilege?.privileges) : [];
  let moduleAccessForOperationMember = privilegeArray
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
  console.log(
    "member operation privilege",
    moduleAccessForOperationMember[0]?.operationMember
  );
  useEffect(() => {
    let isMounted = true;
    let controller = new AbortController();
    const fetchMemberComapany = async () => {
      try {
        const response = await privateAxios.get(MEMBER, {
          signal: controller.signal,
        });
        console.log(
          "member company---",
          response.data.map((data) => {
            console.log("member company=", data.companyName);
          })
        );

        if ((response.status = 200)) {
          isMounted &&
            setMemberCompanies(
              response.data.map((data) => ({
                _id: data._id,
                companyName: data.companyName,
                companyType: data.companyType,
              }))
            );
        }

        console.log("member company---", memberCompanies);
      } catch (error) {
        console.log("error from fetch member company", error);
      }
    };
    let fetchCountries = async () => {
      try {
        const response = await privateAxios.get(COUNTRIES, {
          signal: controller.signal,
        });
        console.log("response", response);
        isMounted &&
          setCountries(response.data.map((country) => country.countryCode));
      } catch (error) {
        console.log("error from countries api", error);
        if (error?.response?.status == 401) {
          setToasterDetails(
            {
              titleMessage: "Oops!",
              descriptionMessage: error?.response?.data?.message,
              messageType: "error",
            },
            () => toasterRef.current()
          );
          navigate("/login");
        }
      }
    };
    fetchCountries();
    fetchMemberComapany();

    const fetchOperationMember = async () => {
      try {
        const response = await privateAxios.get(
          GET_OPERATION_MEMBER_BY_ID + params.id,
          {
            signal: controller.signal,
          }
        );
        console.log("response from fetch operation member", response);

        isMounted && setFetchOperationMemberDetaills(response.data);
        reset({
          memberId: response?.data?.memberId?.companyName,
          companyType: response?.data?.companyType,
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
            : "N/A",
          reportingManager: response?.data?.reportingManager[0]?.name
            ? response?.data?.reportingManager[0]?.name
            : "N/A",
          name: response?.data?.name,
          isActive: response?.data?.isActive,
        });
      } catch (error) {
        console.log(
          "error in fetch operation member method in view page",
          error
        );
        if (error?.response?.status === 500) {
          navigate("/operation_member");
        }
      }
    };
    fetchOperationMember();

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
      console.log("Operation member deleted successfully");
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
          navigate("/users/operation-members");
        }, 2000);
      }
    } catch (error) {
      console.log("error from handle delete operation member", error);
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

  const handleToggle = () => {
    setActive(!isActive);
  };
  const handleOpen = (index) => {
    setOpen(true);
    // setData(data[index]);
    console.log("clicked", index);
    console.log(index);
    if (index === 0) {
      setOpen(false);
      navigate(`/users/operation-member/edit-operation-member/${params.id}`);
    }
    if (index === 1) {
      setOpen(false);
      navigate(`/users/operation-member/replace-operation-member/${params.id}`);
    }
    if (index === 2) {
      setOpen(false);
      setOpenDeleteDialog(true);
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
      action: "Replace",
      hide: !SUPER_ADMIN,
    },
    {
      id: 3,
      action: "Delete",
      hide:
        SUPER_ADMIN === true
          ? false
          : !moduleAccessForOperationMember[0]?.operationMember.delete,
    },
  ];
//  console.log("operation member:- ",fetchOperationMemberDetaills)
  return (
    <div className="page-wrapper">
      <Toaster
        messageType={toasterDetails.messageType}
        descriptionMessage={toasterDetails.descriptionMessage}
        myRef={toasterRef}
        titleMessage={toasterDetails.titleMessage}
      />
      <DialogBox
        title={<p>Delete opration member "{fetchOperationMemberDetaills.name}"</p>}
        info1={
          <p>
            We recommend you to replace this operation member with the new one because deleting all the statistics & records would get deleted and this will be an irreversible action
          </p>
        }
        info2={
          <p>
            {" "}
            Are you you want to delete{" "}
            <b>{fetchOperationMemberDetaills.name}</b>?
          </p>
        }
        onPrimaryModalButtonClickHandler={handleDeleteOperationMember}
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
              <Link to="/users/operation-members">Operation Member</Link>
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
                moduleAccessForOperationMember[0].operationMember.edit ==
                  true ||
                moduleAccessForOperationMember[0].operationMember.delete ==
                  true) && (
                <span className="crud-operation">
                  <MoreVertIcon />
                </span>
              )}
              <div
                className="crud-toggle-wrap"
                style={{ display: isActive ? "none" : "block" }}
              >
                <ul className="crud-toggle-list">
                  {data.map((d, index) => (
                    <li
                      onClick={() => handleOpen(index)}
                      key={index}
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
                    <label htmlFor="email">Title </label>
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
                    <label htmlfor="phoneNumber">
                      Phone Number 
                    </label>
                    <div className="phone-number-field">
                      <div className="select-field country-code">
                        <Controller
                          control={control}
                          name="countryCode"
                          rules={{ required: true }}
                          render={({ field, fieldState: { error } }) => (
                            <Autocomplete
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
                                  placeholder={"+91"}
                                  disabled
                                />
                              )}
                            />
                          )}
                        />
                      </div>
                      <Input
                        name={"phoneNumber"}
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
                      control={control}
                      name="operationType"
                      isDisabled
                      options={[
                        "Warehousing and Distribution",
                        "Manufacturing/Bottling/Roasting",
                        "Logistics and Transport",
                        "Retail/Franchise/Merchandisers",
                      ]}
                    />
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
                    <label htmlFor="">
                      Address 
                    </label>
                    <Input control={control} name={"address"} placeholder="N/A" isDisabled />
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
                <div className="card-form-field">
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
        </div>
      </section>
    </div>
  );
};

export default ViewOperationMembers;
