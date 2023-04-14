import React, { useEffect, useRef, useState } from "react";
import { AppBar, Box, Toolbar, Menu, Tooltip, MenuItem } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetUser } from "../redux/UserSlice";
import { LOGOUT_URL, MASTER_LINK } from "../api/Url";
import { privateAxios } from "../api/axios";
import CloseIcon from "@mui/icons-material/Close";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { Logger } from "../Logger/Logger";
import "./Header.css";
import axios from "axios";

let REPORT_ISSUE_LINK = "";
const Header = () => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [isActive, setActive] = React.useState("false");
  const userAuth = useSelector((state) => state?.user?.userObj);
  const privilege = useSelector((state) => state?.user?.privilege);

  let initials = userAuth?.name?.split(" ");
  const CGF_ADMIN_ACCESS = userAuth?.roleId?.name == "Sub Admin";
  const OPERATION_MEMBER = userAuth?.roleId?.name == "Operation Member";
  const SUPER_ADMIN = privilege?.name === "Super Admin" ? true : false;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
    setActive(!isActive);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
    setActive(!isActive);
  };

  let privilegeArray =
    userAuth?.role?.name === "Super Admin"
      ? []
      : Object.values(privilege?.privileges ?? {});

  let moduleAccesForMember = privilegeArray
    .filter((data) => data?.moduleId?.name === "Members")
    .map((data) => ({
      member: {
        list: data.list,
        view: data.view,
        edit: data.edit,
        delete: data.delete,
      },
    }));
  let moduleAccessForOperationMember = privilegeArray
    .filter((data) => data?.moduleId?.name === "Operation Members")
    .map((data) => ({
      operationMember: {
        list: data.list,
        view: data.view,
        edit: data.edit,
        delete: data.delete,
      },
    }));
  let moduleAccessForQuestionnaire = privilegeArray
    .filter((data) => data?.moduleId?.name === "Questionnaire")
    .map((data) => ({
      questionnaire: {
        list: data.list,
        view: data.view,
        edit: data.edit,
        delete: data.delete,
      },
    }));
  let moduleAccessForAssessment = privilegeArray
    .filter((data) => data?.moduleId?.name === "Assessment")
    .map((data) => ({
      assessment: {
        list: data.list,
        view: data.view,
        edit: data.edit,
        delete: data.delete,
      },
    }));

  const userNameInitials = () => {
    let letter = "";
    if (initials.length > 1) {
      letter = initials[0].slice(0, 1) + initials[1]?.slice(0, 1);
      return letter;
    }
    letter = initials[0].slice(0, 1);
    return letter;
  };

  const handleLogOut = async () => {
    try {
      const response = await privateAxios.post(LOGOUT_URL);

      if (response.status == 201) {
        setAnchorElUser(null);
        dispatch(resetUser());
        setActive(!isActive);
        navigate("/login");
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate("/login");
      }
    }
  };
  const textElementRef = useRef();
  const textnameElementRef = useRef();
  const compareSize = () => {
    const compare =
      textElementRef.current.scrollWidth > textElementRef.current.clientWidth;
    const comparename =
      textnameElementRef.current.scrollWidth >
      textnameElementRef.current.clientWidth;
    setHover(compare);
    setNameHover(comparename);
  };

  // compare once and add resize listener on "componentDidMount"
  useEffect(() => {
    compareSize();
    window.addEventListener("resize", compareSize);
  }, []);

  // remove resize listener again on "componentWillUnmount"
  useEffect(
    () => () => {
      window.removeEventListener("resize", compareSize);
    },
    []
  );
  const replaceSpecialCharcters = (tempReportIssueLink) => {
    let tempLink = tempReportIssueLink;
    // console.log("link after slice:- ", tempLink);

    tempLink = tempLink.replaceAll("?", "%3F");
    tempLink = tempLink.replaceAll("&", "%26");
    // tempLink = tempLink.replaceAll("/", "%2F");
    tempLink = tempLink.replaceAll("<", "%3C");
    tempLink = tempLink.replaceAll(">", "%3E");
    tempLink = tempLink.replaceAll(" ", "%20");
    // tempLink = tempLink.replaceAll("-", "%2D");

    return tempLink;
  };
  const getReportIssueLink = async () => {
    try {
      const response = await axios.get(MASTER_LINK + "/reportIssueOnZoho");
      Logger.debug("response:- ", response.data);

      const url = new URL(response.data);

      REPORT_ISSUE_LINK = url;
      //   console.log("url:- ",url)
      //   REPORT_ISSUE_LINK = replaceSpecialCharcters(response?.data);
      //   console.log("REPORT AN ISSUE", REPORT_ISSUE_LINK);
    } catch (error) {
      if (
        error?.response?.status === 403 &&
        error?.response?.data?.message ===
          "You don't have required privileges to access this resource!"
      ) {
        Logger.debug(
          "You don't have required privileges to access this resource!"
        );
      }
      console.log("error", error);
      Logger.debug("Error:- ", error);
    }
  };

  let profileRole =
    userAuth?.role?.name === "Super Admin"
      ? userAuth?.role?.name
      : Object.keys(userAuth.role).length > 0 &&
        Object.keys(userAuth?.role?.privileges).length > 0
      ? userAuth?.role?.name
      : "N/A";
  useEffect(() => {
    REPORT_ISSUE_LINK?.length === 0 && getReportIssueLink();
  }, []);
  //   Logger.debug("REPORT ISSUE LINK:- ", REPORT_ISSUE_LINK);
  //   console.log("LINK",REPORT_ISSUE_LINK)
  // Define state and function to update the value
  const [hoverStatus, setHover] = useState(false);
  const [hoverNameStatus, setNameHover] = useState(false);

  const handleChangePassword = () => {
    navigate("/change-password");
    setAnchorElUser(null);
    setActive(!isActive);
  };
  const showContent = () => {
    Logger.debug("show content function");
    let hideContent;
    if (SUPER_ADMIN && Object.keys(userAuth?.role?.privileges).length === 0) {
      Logger.debug("showing content to super admin");
      hideContent = false;
    } else {
      Logger.debug("hiding content to others");
      hideContent = true;
    }
    return hideContent;
  };
  return (
    <AppBar position="sticky" className="header-sect">
      <div className="nav">
        <div className="container">
          <Toolbar disableGutters>
            <div className="header-wrapper">
              <div className="header-left">
                <div className="logo-blk">
                  <a href="/home">
                    <img
                      src={process.env.PUBLIC_URL + "/images/logo.png"}
                      className="img-fluid"
                      alt=""
                    />
                  </a>
                </div>
                <div className="nav-listblk">
                  <ul className="nav-list flex-between">
                    {/* <li
                                            className={
                                                location.pathname ==
                                                "/dashboard"
                                            }>
                                            <a hidden={MEMBER_ACCESS} style={{
                                                    cursor: "pointer",
                                                }} onClick={() => navigate("/members")}>
                                                Members
                                            </a>
                                        </li> */}
                    <li
                      className={
                        location.pathname == "/home"
                          ? "list-item active"
                          : "list-item"
                      }
                    >
                      <a hidden={CGF_ADMIN_ACCESS ? "active" : ""}></a>
                      <a
                        onClick={() => navigate("/home")}
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        Home
                      </a>
                    </li>
                    {(SUPER_ADMIN ||
                      moduleAccessForAssessment[0]?.assessment?.list) && (
                      <li
                        className={
                          location.pathname.includes("/assessment-list")
                            ? "list-item active"
                            : "list-item"
                        }
                      >
                        <a
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => navigate("/assessment-list")}
                        >
                          Assessments
                        </a>
                      </li>
                    )}

                    {(SUPER_ADMIN ||
                      moduleAccessForQuestionnaire[0]?.questionnaire?.list) && (
                      <li
                        className={
                          location.pathname.includes("/questionnaires")
                            ? "list-item active"
                            : "list-item"
                        }
                      >
                        <a
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => navigate("/questionnaires")}
                        >
                          Questionnaires
                        </a>
                      </li>
                    )}

                    {(SUPER_ADMIN ||
                      moduleAccessForOperationMember[0]?.operationMember
                        ?.list ||
                      moduleAccesForMember[0]?.member.list) && (
                      <li
                        className={
                          location.pathname.includes("/users")
                            ? "list-item active"
                            : "list-item"
                        }
                      >
                        <a
                          hidden={OPERATION_MEMBER}
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          User Management
                        </a>
                        <ul className="header-submenu">
                          {SUPER_ADMIN && (
                            <li
                              className={
                                location.pathname.includes("/users/cgf-admin")
                                  ? "subactive"
                                  : ""
                              }
                            >
                              <a
                                onClick={() => {
                                  navigate("/users/cgf-admin");
                                }}
                                style={{
                                  cursor: "pointer",
                                }}
                              >
                                CGF Admins
                              </a>
                            </li>
                          )}
                          <li
                            hidden={
                              SUPER_ADMIN === true
                                ? false
                                : !moduleAccesForMember[0]?.member?.list
                            }
                            className={
                              location.pathname === "/users/members"
                                ? "subactive"
                                : ""
                            }
                          >
                            <a
                              onClick={() => {
                                navigate("/users/members");
                              }}
                            >
                              Members
                            </a>
                          </li>
                          <li
                            className={
                              location.pathname === "/users/operation-members"
                                ? "subactive"
                                : ""
                            }
                            hidden={
                              SUPER_ADMIN === true
                                ? false
                                : !moduleAccessForOperationMember[0]
                                    ?.operationMember?.list
                            }
                          >
                            <a
                              onClick={() => {
                                navigate("/users/operation-members");
                              }}
                            >
                              Operation Members
                            </a>
                          </li>
                        </ul>
                      </li>
                    )}

                    {SUPER_ADMIN && (
                      <li
                        className={
                          location.pathname.includes("/roles")
                            ? "list-item active"
                            : "list-item"
                        }
                      >
                        <a
                          // hidden={!SUPER_ADMIN}
                          onClick={() => navigate("/roles")}
                          style={{
                            cursor: "pointer",
                            display: !SUPER_ADMIN && "none",
                          }}
                        >
                          Roles Management
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              <div className="header-right">
                <Box>
                  {/* <Tooltip title="Open settings"> */}
                  <div className="user-blk flex-between">
                    <div className="user-img">
                      <span className="user-name-txt">
                        {userNameInitials()}
                      </span>
                    </div>
                    <div className="user-info" onClick={handleOpenUserMenu}>
                      <div>
                        <Tooltip
                          title={userAuth?.name}
                          // interactive
                          disableHoverListener={!hoverNameStatus}
                          style={{ fontSize: "14px" }}
                        >
                          <span ref={textnameElementRef} className="user-name">
                            {userAuth?.name}
                          </span>
                        </Tooltip>
                        <Tooltip
                          title={userAuth?.role?.name}
                          // interactive
                          disableHoverListener={!hoverStatus}
                          style={{ fontSize: "14px" }}
                        >
                          <span ref={textElementRef} className="user-type">
                            {profileRole}
                          </span>
                        </Tooltip>
                      </div>
                      <span
                        className={
                          isActive
                            ? "super-admin-arrow"
                            : "super-admin-arrow active"
                        }
                      >
                        <KeyboardArrowDownIcon />
                      </span>
                    </div>
                  </div>
                  {/* </Tooltip> */}
                  <Menu
                    sx={{ mt: "35px", mr: "35px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    className="profile-popup-blk"
                  >
                    <MenuItem
                    // onClick={handleCloseUserMenu}
                    >
                      <div className="profile-popup-box">
                        <div
                          id="transition-modal-title"
                          className="profile-popup-ttl-blk"
                        >
                          <span
                            className="popup-close-icon"
                            onClick={handleCloseUserMenu}
                          >
                            <CloseIcon />
                          </span>
                        </div>
                        <div
                          id="transition-modal-title1"
                          className="profile-popup-wrap"
                        >
                          <div className="signin-user-blk flex-start">
                            <div className="signin-user-left">
                              <div className="signin-user-img">
                                <span className="signin-user-name-txt">
                                  {userNameInitials()}
                                </span>
                              </div>
                            </div>
                            <div className="signin-user-right">
                              <div className="profile-info-blk">
                                <div className="profile-name">
                                  {userAuth?.name}
                                </div>
                                <div className="profile-info">
                                  {userAuth?.role?.name ?? "N/A"}
                                </div>
                                <div className="profile-info">
                                  <span className="profile-info-icon">
                                    <LocalPhoneOutlinedIcon />
                                  </span>
                                  <span className="profile-info-txt">
                                    {userAuth?.countryCode
                                      ? userAuth?.countryCode +
                                        userAuth?.phoneNumber
                                      : "N/A"}
                                  </span>
                                </div>
                                <div className="profile-info">
                                  <span className="profile-info-icon">
                                    <EmailOutlinedIcon />
                                  </span>
                                  <span className="profile-info-txt">
                                    {userAuth?.email}
                                  </span>
                                </div>
                                {/* <div className="profile-info mb-0">
                                                                    <span className="profile-info-icon">
                                                                        <PlaceOutlinedIcon />
                                                                    </span>
                                                                    <span className="profile-info-txt">
                                                                        Pune
                                                                    </span>
                                                                </div> */}
                                <div
                                  className="tertiary-btn-blk mt-20"
                                  onClick={handleChangePassword}
                                >
                                  <span className="addmore-txt">
                                    Change Password
                                  </span>
                                </div>
                                <div className="tertiary-btn-blk mt-20">
                                  <span className="addmore-txt">
                                    <a
                                      hidden={showContent()}
                                      href={REPORT_ISSUE_LINK}
                                      target={"_blank"}
                                      style={{
                                        textDecoration: "none",
                                        color: "#f7a823",
                                      }}
                                    >
                                      Raise an Issue
                                    </a>
                                  </span>
                                </div>
                                <div className="form-btn flex-center mt-20">
                                  <button
                                    type="submit"
                                    className="primary-button"
                                    onClick={handleLogOut}
                                  >
                                    Log out
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </MenuItem>
                  </Menu>
                </Box>
              </div>
            </div>
          </Toolbar>
        </div>
      </div>
      {/* <div className="header-right">
                <Box>
                  <Tooltip title="Open settings">
                    <div className="user-blk flex-between">
                      <div className="user-img">
                        <span className="user-name-txt">ER</span>
                      </div>
                      <div className="user-info">
                        <span className="user-name">Erin</span>
                        <span
                          className="user-type"
                          onClick={handleOpenUserMenu}
                        >
                          Super Admin{" "}
                          <span
                            className={
                              isActive
                                ? "super-admin-arrow"
                                : "super-admin-arrow active"
                            }
                          >
                            <KeyboardArrowDownIcon />
                          </span>
                        </span>
                      </div>
                    </div>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "35px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    className="profile-menu-item"
                  >
                    <MenuItem onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">Profile</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogOut}>
                      <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </Box>
              </div> */}
    </AppBar>
  );
};

export default Header;
