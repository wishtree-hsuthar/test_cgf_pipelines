import React, { useEffect, useState } from "react";
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Menu,
    Tooltip,
    MenuItem,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetUser, setUser } from "../redux/UserSlice";
import { GET_USER, LOGOUT_URL } from "../api/Url";
import axios from "axios";
import { privateAxios } from "../api/axios";
import "./Header.css";
const Header = () => {
    // const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [isActive, setActive] = React.useState("false");
    const userAuth = useSelector((state) => state?.user?.userObj);
    const privilege = useSelector((state) => state?.user?.privilege);
    // const privilege = useSelector((state) => state.user?.privilege);
    let initials = userAuth?.name?.split(" ");
    const CGF_ADMIN_ACCESS = userAuth?.roleId?.name == "Sub Admin";
    const MEMBER_ACCESS = userAuth?.roleId?.name == "Member";
    const OPERATION_MEMBER = userAuth?.roleId?.name == "Operation Member";
    const SUPER_ADMIN = privilege?.name === "Super Admin" ? true : false;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [activeStateForMembers, setActiveStateForMembers] = useState(false);
    const [activeStateForOperationMembers, setActiveStateForOperationMembers] =
        useState(false);
    // console.log("location in header", location.pathname);
    // console.log("suoer admin in header", SUPER_ADMIN);
    // console.log("privilege in header", privilege);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
        setActive(!isActive);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
        setActive(!isActive);
    };
    // console.log("privilege", );
    // console.log("privilege entries", );
    console.log("privilege from ", privilege);
    let privilegeArray =
        userAuth?.roleId?.name === "Super Admin"
            ? []
            : Object.values(privilege?.privileges);

    let modifiedPrivilegeArrayKeys = privilegeArray.map(
        (privilege, index) => privilege?.moduleId?.name
    );
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
            operationMember: {
                list: data.list,
                view: data.view,
                edit: data.edit,
                delete: data.delete,
            },
        }));
    // console.log(
    //     "module access for member",
    //     moduleAccesForMember[0]?.member?.list
    // );
    // console.log(
    //     "module access for member",
    //     moduleAccesForMember[0]?.member?.list
    // );
    // console.log(
    //     "module access for operation member",
    //     moduleAccessForOperationMember[0]?.operationMember?.list
    // );
    // console.log("modified Privilege array", modifiedPrivilegeArrayKeys);
    const handleLogOut = async () => {
        try {
            const response = await privateAxios.post(LOGOUT_URL);
            // console.log("Response from logout");

            if (response.status == 201) {
                setAnchorElUser(null);
                dispatch(resetUser());
                setActive(!isActive);
                navigate("/login");
            }
        } catch (error) {
            // console.log("Error from logout API", error);
            if (error?.response?.status === 401) {
                navigate("/login");
            }
        }
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
                                            src={
                                                process.env.PUBLIC_URL +
                                                "/images/logo.png"
                                            }
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
                                            <a
                                                hidden={
                                                    CGF_ADMIN_ACCESS
                                                        ? "active"
                                                        : ""
                                                }
                                            ></a>
                                            <a
                                                onClick={() =>
                                                    navigate("/home")
                                                }
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Home
                                            </a>
                                        </li>
                                        <li
                                            className={
                                                location.pathname.includes(
                                                    "/users"
                                                )
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
                                                <li
                                                    hidden={
                                                        SUPER_ADMIN === true
                                                            ? false
                                                            : !moduleAccesForMember[0]
                                                                  ?.member?.list
                                                    }
                                                    className={
                                                        location.pathname ===
                                                        "/users/members"
                                                            ? "subactive"
                                                            : ""
                                                    }
                                                >
                                                    <a
                                                        onClick={() => {
                                                            navigate(
                                                                "/users/members"
                                                            );
                                                        }}
                                                    >
                                                        Members
                                                    </a>
                                                </li>
                                                <li
                                                    className={
                                                        location.pathname ===
                                                        "/users/operation-members"
                                                            ? "subactive"
                                                            : ""
                                                    }
                                                    hidden={
                                                        SUPER_ADMIN === true
                                                            ? false
                                                            : !moduleAccessForOperationMember[0]
                                                                  ?.operationMember
                                                                  ?.list
                                                    }
                                                >
                                                    <a
                                                        onClick={() => {
                                                            navigate(
                                                                "/users/operation-members"
                                                            );
                                                        }}
                                                    >
                                                        Operation Members
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                        <li
                                            className={
                                                location.pathname.includes(
                                                    "/questionnaires"
                                                )
                                                    ? "list-item active"
                                                    : "list-item"
                                            }
                                        >
                                            <a
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                                onClick={() =>
                                                    navigate("/questionnaires")
                                                }
                                            >
                                                Questionnaires
                                            </a>
                                        </li>
                                        <li
                                            className={
                                                location.pathname.includes(
                                                    "/questionnaires"
                                                )
                                                    ? "list-item active"
                                                    : "list-item"
                                            }
                                        >
                                            <a
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                                onClick={() =>
                                                    navigate("/assessments")
                                                }
                                            >
                                                Assessments
                                            </a>
                                        </li>

                                        <li
                                            className={
                                                location.pathname.includes(
                                                    "/sub-admins"
                                                )
                                                    ? "list-item active"
                                                    : "list-item"
                                            }
                                        >
                                            <a
                                                hidden={!SUPER_ADMIN}
                                                onClick={() => {
                                                    // setActiveState(false);
                                                    setActiveStateForMembers(
                                                        false
                                                    );
                                                    setActiveStateForOperationMembers(
                                                        false
                                                    );
                                                    navigate("/sub-admins");
                                                }}
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                            >
                                                CGF Admins
                                            </a>
                                        </li>
                                        <li
                                            className={
                                                location.pathname == "/roles"
                                                    ? "list-item active"
                                                    : "list-item"
                                            }
                                        >
                                            <a
                                                hidden={!SUPER_ADMIN}
                                                onClick={() =>
                                                    navigate("/roles")
                                                }
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Roles and Privileges
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="header-right">
                                <Box>
                                    <Tooltip title="Open settings">
                                        <div className="user-blk flex-between">
                                            <div className="user-img">
                                                <span className="user-name-txt">
                                                    {initials?.length >= 1 &&
                                                        initials[0].slice(
                                                            0,
                                                            1
                                                        ) +
                                                            initials[1]?.slice(
                                                                0,
                                                                1
                                                            )}
                                                </span>
                                            </div>
                                            <div className="user-info">
                                                <span className="user-name">
                                                    {userAuth?.name}
                                                </span>
                                                <span
                                                    className="user-type"
                                                    onClick={handleOpenUserMenu}
                                                >
                                                    {userAuth?.role?.name}
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
                                        className="profile-menu-item"
                                    >
                                        <MenuItem
                                            onClick={handleCloseUserMenu}
                                            sx={{ width: "135px" }}
                                        >
                                            <Typography textAlign="center">
                                                Profile
                                            </Typography>
                                        </MenuItem>
                                        <MenuItem onClick={handleLogOut}>
                                            <Typography textAlign="center">
                                                Logout
                                            </Typography>
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
