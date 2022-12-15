// Third party packages
import {
  Box,
  Checkbox,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup as AddRoleRadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

//internal packages
import Toaster from "../../components/Toaster";
import "../../components/TableComponent.css";
import useCallbackState from "../../utils/useCallBackState";
import { REACT_APP_API_ENDPOINT } from "../../api/Url";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import CommonTableHead from "./CommonTableHead";

const AddRole = () => {
  useDocumentTitle("Add Role");
  const navigate1 = useNavigate();

  //Refr for Toaster
  const myRef = React.useRef();
  //Toaster Message setter
  const [toasterDetails1, setToasterDetails1] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "success",
  });
  //array to hold modules available
  let modules = [];
  // console.log("modules", modules);
  //variable to hold privileges
  let temp = {};

  //default values of input fields
  const defaultValues = {
    roleName: "",
    status: "active",
    description: "",
  };

  //helper text content for input fields
  const addRoleMyHelper = {
    roleName: {
      required: "Enter the role name",
      maxLength: "Max char limit exceed",
      minLength: "minimum 3 characters required",
      pattern: "Invalid format",
    },
    description: {
      required: "Enter the description",
      maxLength: "Max char limit exceed",
      minLength: "minimum 3 characters required",
    },
  };

  const [previleges1, setPrevileges1] = useState({ ...temp });

  const addRoleCreatePrivileges = () => {
    modules.forEach(
      (module) =>
        (temp[module.moduleId] = {
          name: module.moduleName,
          fill: false,
          list: false,
          add: false,
          edit: false,
          view: false,
          delete: false,
          // assign: false,
          all: false,
        })
    );
    setPrevileges1({ ...temp });
  };

  const createModules = (data) => {
    data.map(
      (module, id) =>
        (modules[id] = {
          moduleName: module.name,
          moduleId: module._id,
        })
    );
    addRoleCreatePrivileges();
  };

  const { control, reset, setValue, handleSubmit } = useForm({
    defaultValues: defaultValues,
  });
  const submitCall = async (data) => {
    console.log("inside on Submit");
    let previlegesForBackend = JSON.parse(JSON.stringify(previleges1));
    Object.keys(previlegesForBackend).forEach((p_key) => {
      delete previlegesForBackend[p_key]["all"];
      delete previlegesForBackend[p_key]["name"];
    });
    // console.log("previleges1 : ", previlegesForBackend);
    //backend call
    try {
      await axios.post(REACT_APP_API_ENDPOINT + "roles", {
        name: data.roleName,
        description: data.description,
        isActive: data.status === "active" ? true : false,
        privileges: previlegesForBackend,
      });
      setToasterDetails1(
        {
          titleMessage: "Hurray!",
          descriptionMessage: "New role added successfully!",
          messageType: "success",
        },
        () => myRef.current()
      );
      reset({ defaultValues });
      getSystemModules();
      return true;
    } catch (error) {
      setToasterDetails1(
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
      return false;
    }
  };
  const addRoleOnSubmit = async (data) => {
    const isSubmited = await submitCall(data);
    if (!isSubmited) return;
    setTimeout(() => navigate1("/roles"), 3000);
  };
  const onSubmitAddMoreClickHandler1 = async (data) => {
    submitCall(data);
  };
  const onClickCancelHandler1 = () => {
    reset({ defaultValues });
    return navigate1("/roles");
  };
  const getSystemModules = async () => {
    try {
      const { data } = await axios.get(
        REACT_APP_API_ENDPOINT + "system-modules"
      );
      createModules(data);
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      setToasterDetails1(
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
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    isMounted && getSystemModules();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <div className="page-wrapper">
      <Toaster
        myRef={myRef}
        titleMessage={toasterDetails1.titleMessage}
        descriptionMessage={toasterDetails1.descriptionMessage}
        messageType={toasterDetails1.messageType}
      />
      <div className="breadcrumb-wrapper">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link to="/roles">Roles</Link>
            </li>
            <li>Add Role</li>
          </ul>
        </div>
      </div>
      <section>
        <div className="container">
          <div className="form-header flex-between">
            <h2 className="heading2">Add Role</h2>
            <div className="form-header-right-txt">
              <div className="tertiary-btn-blk">
                <span className="addmore-icon">
                  <i className="fa fa-plus"></i>
                </span>
                <span
                  className="addmore-txt"
                  onClick={handleSubmit(onSubmitAddMoreClickHandler1)}
                >
                  Save & Add More
                </span>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit(addRoleOnSubmit)}>
            <div className="card-wrapper">
              <div className="card-blk flex-between">
                <div className="card-form-field">
                  <div className="form-group">
                    <label htmlFor="roleName">
                      Role Name <span className="mandatory">*</span>
                    </label>
                    <Controller
                      name="roleName"
                      rules={{
                        required: true,
                        maxLength: 50,
                        minLength: 3,
                        pattern: /^[A-Za-z]+[A-Za-z ]*$/,
                      }}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          onBlur={(e) =>
                            setValue("roleName", e.target.value.trim())
                          }
                          inputProps={{
                            maxLength: 50,
                          }}
                          className={`input-field ${error && "input-error"}`}
                          id="outlined-basic"
                          placeholder="Enter role name"
                          helperText={
                            error ? addRoleMyHelper.roleName[error.type] : " "
                          }
                          variant="outlined"
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="card-form-field">
                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <div className="radio-btn-field">
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <AddRoleRadioGroup
                            {...field}
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="radio-buttons-group"
                            className="radio-btn"
                          >
                            <FormControlLabel
                              value="active"
                              control={<Radio />}
                              label="Active"
                            />
                            <FormControlLabel
                              value="inactive"
                              control={<Radio />}
                              label="Inactive"
                            />
                          </AddRoleRadioGroup>
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className="card-form-field fullwidth">
                  <div className="form-group">
                    <label htmlFor="description">
                      Description <span className="mandatory">*</span>
                    </label>
                    <Controller
                      name="description"
                      rules={{
                        required: true,
                        maxLength: 500,
                        minLength: 3,
                      }}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          multiline
                          {...field}
                          onBlur={(e) =>
                            setValue("description", e.target.value.trim())
                          }
                          inputProps={{
                            maxLength: 500,
                          }}
                          className={`input-textarea ${
                            error && "input-textarea-error"
                          }`}
                          id="outlined-basic"
                          placeholder="Enter description"
                          helperText={
                            error
                              ? addRoleMyHelper.description[error.type]
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
              <Box sx={{ width: "100%" }} className="table-blk table-blk-role">
                <Paper sx={{ width: "100%" }}>
                  <TableContainer>
                    <Table sx={{ minWidth: 750 }}>
                      <CommonTableHead />
                      <TableBody>
                        {Object.keys(previleges1).map((previleg, _id) => {
                          console.log(
                            "previleg",
                            previleges1[previleg]["name"]
                          );
                          return (
                            <TableRow key={previleg} hover>
                              <TableCell>
                                {previleges1[previleg]["name"]}
                              </TableCell>
                              <TableCell align="center" padding="checkbox">
                                {previleges1[previleg]["name"] ===
                                  "Assessment" && (
                                  <Checkbox
                                    disabled={
                                      previleges1[previleg]["name"] !=
                                      "Assessment"
                                    }
                                    className="table-checkbox"
                                    checked={previleges1[previleg]["fill"]}
                                    onChange={() =>
                                      setPrevileges1((previous) => ({
                                        ...previous,
                                        [previleg]: {
                                          ...previous[previleg],
                                          fill: !previous[previleg]["fill"],
                                          list: !previous[previleg]["fill"],
                                          all:
                                            !previous[previleg]["fill"] &&
                                            previous[previleg]["add"] &&
                                            previous[previleg]["edit"] &&
                                            previous[previleg]["view"] &&
                                            previous[previleg]["delete"],
                                        },
                                      }))
                                    }
                                  />
                                )}
                              </TableCell>
                              <TableCell align="center" padding="checkbox">
                                <Checkbox
                                  className="table-checkbox"
                                  checked={previleges1[previleg]["list"]}
                                  onChange={() =>
                                    setPrevileges1((previous) => ({
                                      ...previous,
                                      [previleg]: {
                                        ...previous[previleg],
                                        list: !previous[previleg]["list"],
                                        all:
                                          !previous[previleg]["list"] &&
                                          previous[previleg]["add"] &&
                                          previous[previleg]["edit"] &&
                                          previous[previleg]["view"] &&
                                          previous[previleg]["delete"],
                                      },
                                    }))
                                  }
                                />
                              </TableCell>
                              <TableCell align="center" padding="checkbox">
                                <Checkbox
                                  className="table-checkbox"
                                  checked={previleges1[previleg]["add"]}
                                  onChange={() =>
                                    setPrevileges1((previous) => ({
                                      ...previous,
                                      [previleg]: {
                                        ...previous[previleg],
                                        add: !previous[previleg]["add"],
                                        list: !previous[previleg]["add"],
                                        view: !previous[previleg]["add"],
                                        all:
                                          !previous[previleg]["add"] &&
                                          previous[previleg]["edit"] &&
                                          previous[previleg]["delete"],
                                      },
                                    }))
                                  }
                                />
                              </TableCell>
                              <TableCell align="center" padding="checkbox">
                                <Checkbox
                                  className="table-checkbox"
                                  checked={previleges1[previleg]["edit"]}
                                  onChange={() =>
                                    setPrevileges1((previous) => ({
                                      ...previous,
                                      [previleg]: {
                                        ...previous[previleg],
                                        edit: !previous[previleg]["edit"],
                                        list: !previous[previleg]["edit"],
                                        view: !previous[previleg]["edit"],
                                        all:
                                          previous[previleg]["add"] &&
                                          !previous[previleg]["edit"] &&
                                          previous[previleg]["delete"],
                                      },
                                    }))
                                  }
                                />
                              </TableCell>
                              <TableCell align="center" padding="checkbox">
                                <Checkbox
                                  className="table-checkbox"
                                  checked={previleges1[previleg]["view"]}
                                  onChange={() =>
                                    setPrevileges1((previous) => ({
                                      ...previous,
                                      [previleg]: {
                                        ...previous[previleg],
                                        view: !previous[previleg]["view"],
                                        list: !previous[previleg]["view"],
                                        all:
                                          previous[previleg]["add"] &&
                                          previous[previleg]["edit"] &&
                                          !previous[previleg]["view"] &&
                                          previous[previleg]["delete"],
                                      },
                                    }))
                                  }
                                />
                              </TableCell>
                              <TableCell align="center" padding="checkbox">
                                <Checkbox
                                  className="table-checkbox"
                                  checked={previleges1[previleg]["delete"]}
                                  onChange={() =>
                                    setPrevileges1((previous) => ({
                                      ...previous,
                                      [previleg]: {
                                        ...previous[previleg],
                                        delete: !previous[previleg]["delete"],
                                        list: !previous[previleg]["delete"],
                                        edit: !previous[previleg]["delete"],
                                        view: !previous[previleg]["delete"],
                                        all:
                                          previous[previleg]["add"] &&
                                          !previous[previleg]["delete"],
                                      },
                                    }))
                                  }
                                />
                              </TableCell>
                              {/* <TableCell align="center" padding="checkbox">
                                <Checkbox
                                  className="table-checkbox"
                                  checked={previleges1[previleg]["assign"]}
                                  onChange={() =>
                                    setPrevileges1((previous) => ({
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
                              <TableCell align="center" padding="checkbox">
                                <Checkbox
                                  className="table-checkbox"
                                  checked={previleges1[previleg]["all"]}
                                  onChange={() =>
                                    setPrevileges1((previous) => ({
                                      ...previous,
                                      [previleg]: {
                                        ...previous[previleg],
                                        all: !previous[previleg]["all"],
                                        list: !previous[previleg]["all"],
                                        view: !previous[previleg]["all"],
                                        add: !previous[previleg]["all"],
                                        edit: !previous[previleg]["all"],
                                        delete: !previous[previleg]["all"],
                                        fill:
                                          previleges1[previleg]["name"] ===
                                            "Assessment" &&
                                          !previous[previleg]["all"],
                                        // assign: !previous[previleg]["all"],
                                      },
                                    }))
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
                  onClick={onClickCancelHandler1}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-button"
                  style={{ marginTop: "20px" }}
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default AddRole;
