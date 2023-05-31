import React, { useEffect, useState } from "react";
import {
  TextField,
  Box,
  Radio,
  RadioGroup as ViewRoleRadioGroup,
  FormControlLabel,
  Tabs,
  Tab,
  Paper,
  TableContainer,
  TableRow,
  TableCell,
  Table,
  TableBody,
  Checkbox,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Logger } from "../../Logger/Logger";
//Internal Imports
import TableComponent from "../../components/TableComponent";
import DialogBox from "../../components/DialogBox";
import Toaster from "../../components/Toaster";
import useCallbackState from "../../utils/useCallBackState";
import {
  GET_ROLE_BY_ID,
  GET_USER_BY_ROLE,
  REACT_APP_API_ENDPOINT,
} from "../../api/Url";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import { TabPanel } from "../../utils/tabUtils/TabPanel";
import CommonTableHead from "./CommonTableHead";
import Loader from "../../utils/Loader";
import { catchError } from "../../utils/CatchError";

const tableHead = [
  {
    id: "name",
    disablePadding: false,
    width: "20%",
    label: "Name",
  },
  {
    id: "email",
    disablePadding: false,
    label: "Email",
  },
  {
    id: "createdAt",
    disablePadding: false,
    label: "Created On",
  },
  {
    id: "isActive",
    disablePadding: false,
    label: "Status",
  },
];

const ViewRole = () => {
  //custom hook to set title of page
  useDocumentTitle("View Role");
  //Refr for Toaster
  const myRef4 = React.useRef();
  //order in which records needs to show
  const keysOrder = [
    "_id",
    "name",
    "email",
    "createdAt",
    "isActive",
    "isOperationMember",
    "isMemberRepresentative",
  ];
  //Toaster Message setter
  const [toasterDetails4, setToasterDetails4] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "success",
  });

  // state to manage loader
  const [isLoading3, setIsLoading3] = useState(true);

  //code to get id from url
  const params = useParams();

  //varialble to hold privileges
  let privileges = {};
  // Dialog box code
  const [fieldValues, setFieldValues] = useState({
    roleName: "",
    status: "",
    description: "",
    subAdmin: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const onDialogPrimaryButtonClickHandler = async () => {
    try {
      let response = await axios.delete(
        REACT_APP_API_ENDPOINT + `roles/${params.id}`
      );
      setToasterDetails4(
        {
          titleMessage: "Success",
          descriptionMessage: response.data.message,
          messageType: "success",
        },
        () => myRef4.current()
      );
      return setTimeout(() => navigate4("/roles"), 3000);
    } catch (error) {
      Logger.debug("error on delete", error);
      if (error?.code === "ERR_CANCELED") return;
      catchError(error, setToasterDetails4, myRef4, navigate4);
    } finally {
      setOpenDialog(false);
    }
  };
  const onDialogSecondaryButtonClickHandler = () => {
    navigate4("/roles");
  };

  //code form View Member
  const navigate4 = useNavigate();
  const [isActive, setActive] = useState(false);
  const handleToggle = () => {
    setActive(!isActive);
  };

  //code from Member List
  // function TabPanel(props) {
  //     const { children, value, index, ...other } = props;

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //state to hold privileges
  const [temp, setTemp] = useState({});
  //code of tablecomponent
  const [page, setPage] = React.useState(1);
  const [records, setRecords] = React.useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("");
  const [selected, setSelected] = React.useState([]);
  const [totalRecords, setTotalRecords] = React.useState(0);

  //implemention of pagination on front-end
  // let records = rows.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  // const tempRows = [...records];

  const handleTablePageChange = (newPage) => {
    setPage(newPage);
  };
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };
  const onClickVisibilityIconHandler = (id, isMemberRepresentative) => {
    Logger.debug("id", id);
    Logger.debug("isMemberRepresentative in view role", isMemberRepresentative);
    isMemberRepresentative
      ? navigate4(`/users/operation-member/view-operation-member/${id}`)
      : navigate4(`/users/cgf-admin/view-cgf-admin/${id}`);
  };
  const createPrevileges3 = (tempPrivileges) => {
    Logger.debug("temp data", tempPrivileges);
    Object.keys(tempPrivileges).forEach((tempPriv) => {
      // Logger.debug("temp Previ value",tempPrivileges[tempPriv])
      privileges[tempPriv] = {
        add: tempPrivileges[tempPriv]["add"],
        fill: tempPrivileges[tempPriv]["fill"],
        // assign: tempPrivileges[tempPriv]["assign"],
        delete: tempPrivileges[tempPriv]["delete"],
        view: tempPrivileges[tempPriv]["view"],
        edit: tempPrivileges[tempPriv]["edit"],
        list: tempPrivileges[tempPriv]["list"],
        all:
          tempPrivileges[tempPriv]["add"] &&
          // tempPrivileges[tempPriv]["assign"] &&
          tempPrivileges[tempPriv]["delete"] &&
          tempPrivileges[tempPriv]["edit"] &&
          tempPrivileges[tempPriv]["view"] &&
          tempPrivileges[tempPriv]["list"] &&
          (tempPrivileges[tempPriv]["moduleId"]["name"] === "Assessment"
            ? tempPrivileges[tempPriv]["fill"]
            : true),
        name: tempPrivileges[tempPriv]["moduleId"]["name"],
      };
    });
    setTemp(privileges);
  };
  const updateUsers = (data) => {
    data.forEach((viewRoleObject) => {
      delete viewRoleObject["countryCode"];
      delete viewRoleObject["createdBy"];
      delete viewRoleObject["isDeleted"];
      delete viewRoleObject["isReplaced"];
      delete viewRoleObject["password"];
      delete viewRoleObject["phoneNumber"];
      delete viewRoleObject["roleId"];
      delete viewRoleObject["salt"];
      delete viewRoleObject["subRoleId"];
      delete viewRoleObject["updatedAt"];
      delete viewRoleObject["updatedBy"];
      delete viewRoleObject["uuid"];
      delete viewRoleObject["memberId"];
      delete viewRoleObject["title"];
      delete viewRoleObject["department"];
      delete viewRoleObject["salutation"];
      delete viewRoleObject["reportingManager"];
      delete viewRoleObject["operationType"];
      delete viewRoleObject["address"];
      delete viewRoleObject["isCGFStaff"];

      delete viewRoleObject["isCGFAdmin"];

      delete viewRoleObject["__v"];
      viewRoleObject["createdAt"] = new Date(
        viewRoleObject["createdAt"]
      ).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
      keysOrder.forEach((k) => {
        const v = viewRoleObject[k];
        delete viewRoleObject[k];
        viewRoleObject[k] = v;
      });
    });
    setRecords([...data]);
  };
  const updateFileds = async (data) => {
    Logger.debug("data", data);
    setFieldValues({
      roleName: data?.name,
      description: data?.description,
      status: data?.isActive ? "active" : "inactive",
      subAdmin: 0,
    });
    createPrevileges3(data.privileges);
  };
  const getRoleById = async (isMounted, controller) => {
    try {
      setIsLoading3(true);
      const response = await axios.get(GET_ROLE_BY_ID + params.id, {
        signal: controller.signal,
      });
      isMounted && (await updateFileds(response?.data));
      setIsLoading3(false);
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      catchError(error, setToasterDetails4, myRef4, navigate4, "/roles");
      setIsLoading3(false);
    }
  };
  const getUsersByRole = async () => {
    try {
      const response = await axios.get(
        GET_USER_BY_ROLE +
          params?.id +
          `/users?page=${page}&size=${rowsPerPage}&orderBy=${orderBy}&order=${order}`
      );
      setTotalRecords(parseInt(response?.headers?.["x-total-count"]));
      updateUsers(response?.data);
      setFieldValues((previous) => ({
        ...previous,
        subAdmin: response?.headers?.["x-total-count"],
      }));
      Logger.debug("response:- ", response);
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;

      Logger.debug("error from get users", error);
    }
  };
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    (async () => {
      await getRoleById(isMounted, controller);
      await getUsersByRole();
    })();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [page, rowsPerPage, orderBy, order]);
  return (
    <div className="page-wrapper" onClick={() => isActive && setActive(false)}>
      <Toaster
        myRef={myRef4}
        titleMessage={toasterDetails4.titleMessage}
        descriptionMessage={toasterDetails4.descriptionMessage}
        messageType={toasterDetails4.messageType}
      />
      <DialogBox
        title={<p>Delete Role "{fieldValues ? fieldValues.roleName : ""}"</p>}
        info1={
          <p>
            On deleting a role, all the users associated with it will lose
            access to the system.
          </p>
        }
        info2={<p>Do you still want to continue?</p>}
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        onPrimaryModalButtonClickHandler={onDialogPrimaryButtonClickHandler}
        onSecondaryModalButtonClickHandler={onDialogSecondaryButtonClickHandler}
        openModal={openDialog}
        setOpenModal={setOpenDialog}
      />
      <div className="breadcrumb-wrapper">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link to="/roles">Roles</Link>
            </li>
            <li>View Role</li>
          </ul>
        </div>
      </div>
      <section>
        <div className="container">
          <div className="form-header flex-between">
            <h2 className="heading2">View Role</h2>
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
                  <li
                    onClick={() => navigate4(`/roles/edit-role/${params.id}`)}
                  >
                    Edit
                  </li>
                  <li onClick={() => setOpenDialog(true)}>Delete</li>
                </ul>
              </div>
              {/* <CustomModal /> */}
            </span>
          </div>
          {isLoading3 ? (
            <Loader />
          ) : (
            <div className="card-wrapper">
              <div className="card-blk flex-between">
                <div className="card-form-field">
                  <div className="form-group">
                    <label htmlFor="roleName">
                      Role Name <span className="mandatory">*</span>
                    </label>
                    <TextField
                      disabled
                      className="input-field"
                      id="outlined-basic"
                      placeholder="Enter role name"
                      value={fieldValues && fieldValues.roleName}
                      variant="outlined"
                      helperText=" "
                    />
                  </div>
                </div>
                <div className="card-form-field">
                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <div className="radio-btn-field">
                      <ViewRoleRadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        value={fieldValues && fieldValues.status}
                        name="radio-buttons-group"
                        className="radio-btn"
                      >
                        <FormControlLabel
                          disabled
                          value="active"
                          control={<Radio />}
                          label="Active"
                        />
                        <FormControlLabel
                          disabled
                          value="inactive"
                          control={<Radio />}
                          label="Inactive"
                        />
                      </ViewRoleRadioGroup>
                    </div>
                  </div>
                </div>
                <div className="card-form-field">
                  <div className="form-group">
                    <label htmlFor="description">
                      Description <span className="mandatory">*</span>
                    </label>
                    <TextField
                      disabled
                      multiline
                      inputProps={{ maxLength: 500 }}
                      className="input-textarea"
                      //   className={`input-field ${error && "input-error"}`}
                      id="outlined-basic"
                      placeholder="Enter description"
                      value={fieldValues && fieldValues.description}
                      helperText=" "
                      variant="outlined"
                    />
                  </div>
                </div>
                <div className="card-form-field">
                  <div className="form-group">
                    <label htmlFor="roleName">
                      No. of Users <span className="mandatory">*</span>
                    </label>
                    <TextField
                      disabled
                      className="input-field"
                      id="outlined-basic"
                      placeholder="Enter CGF admin"
                      value={fieldValues && fieldValues.subAdmin}
                      variant="outlined"
                      helperText=" "
                    />
                  </div>
                </div>
              </div>
              <div className="form-header-left-blk flex-start">
                <div className="member-tab-wrapper">
                  <Box
                    sx={{
                      borderBottom: 1,
                      borderColor: "divider",
                    }}
                    className="tabs-sect"
                  >
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      aria-label="basic tabs example"
                    >
                      <Tab
                        label="Module Access"
                        // {...a11yProps(0)}
                        id="simple-tab-0"
                        aria-controls="simple-tabpanel-0"
                      />
                      <Tab
                        label="Users"
                        // {...a11yProps(1)}
                        id="simple-tab-0"
                        aria-controls="simple-tabpanel-0"
                      />
                    </Tabs>
                  </Box>
                </div>
              </div>
              <div className="member-info-wrapper table-content-wrap table-role-content-wrap">
                <TabPanel value={value} index={0}>
                  <Box
                    sx={{ width: "100%" }}
                    className="table-blk table-blk-role pb-0"
                  >
                    <Paper sx={{ width: "100%" }}>
                      <TableContainer>
                        <Table sx={{ minWidth: 750 }}>
                          <CommonTableHead />
                          <TableBody>
                            {Object.keys(temp).map((previleg, id) => {
                              return (
                                <TableRow key={previleg} hover>
                                  <TableCell>
                                    {temp[previleg]["name"]}
                                  </TableCell>
                                  <TableCell align="center" padding="checkbox">
                                    {temp[previleg]["name"] ===
                                      "Assessment" && (
                                      <Checkbox
                                      className="table-checkbox"
                                        disabled
                                        checked={temp[previleg]["fill"]}
                                      />
                                    )}
                                  </TableCell>
                                  <TableCell align="center" padding="checkbox">
                                    <Checkbox
                                      disabled
                                      checked={temp[previleg]["list"]}
                                      className="table-checkbox"
                                    />
                                  </TableCell>
                                  <TableCell align="center" padding="checkbox">
                                    <Checkbox
                                      className="table-checkbox"
                                      disabled
                                      checked={temp[previleg]["add"]}
                                    />
                                  </TableCell>
                                  <TableCell align="center" padding="checkbox">
                                    <Checkbox
                                      disabled
                                      checked={temp[previleg]["edit"]}
                                      className="table-checkbox"
                                    />
                                  </TableCell>
                                  <TableCell align="center" padding="checkbox">
                                    <Checkbox
                                      disabled
                                      checked={temp[previleg]["view"]}
                                      className="table-checkbox"
                                    />
                                  </TableCell>
                                  <TableCell align="center" padding="checkbox">
                                    <Checkbox
                                      disabled
                                      checked={temp[previleg]["delete"]}
                                      className="table-checkbox"
                                    />
                                  </TableCell>
                                  {/* <TableCell align="center" padding="checkbox">
                                    <Checkbox
                                      disabled
                                      className="table-checkbox"
                                      checked={temp[previleg]["assign"]}
                                    />
                                  </TableCell> */}
                                  <TableCell align="center" padding="checkbox">
                                    <Checkbox
                                      disabled
                                      className="table-checkbox"
                                      checked={temp[previleg]["all"]}
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
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <TableComponent
                    tableHead={tableHead}
                    records={records}
                    handleChangePage1={handleTablePageChange}
                    handleChangeRowsPerPage1={handleRowsPerPageChange}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    totalRecords={totalRecords}
                    orderBy={orderBy}
                    selected={selected}
                    setSelected={setSelected}
                    // icons={["visibility"]}
                    onClickVisibilityIconHandler1={onClickVisibilityIconHandler}
                    order={order}
                    setOrder={setOrder}
                    setOrderBy={setOrderBy}
                    setCheckBoxes={false}
                    onRowClick
                  />
                </TabPanel>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ViewRole;
