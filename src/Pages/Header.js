import React from 'react'
// import "./Header.css"
import {AppBar, Box, Toolbar, Typography, Menu, Tooltip, MenuItem} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
const Header = () => {
  // const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [isActive, setActive] = React.useState("false");
  // const handleOpenNavMenu = (event) => {
  //   setAnchorElNav(event.currentTarget);
  // };

  const role = localStorage.getItem('role')
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
    setActive(!isActive);
  };

  // const handleCloseNavMenu = () => {
  //   setAnchorElNav(null);
  // };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
    setActive(!isActive);
  };
  return (
    <AppBar position="static" className='header-sect'>
      <div className='nav'>
        <div className='container'>
          <Toolbar disableGutters>
            <div className="header-wrapper">
              <div className="header-left">
                <div className="logo-blk">
                  <a href="/#">
                    <img src={process.env.PUBLIC_URL + '/images/logo.png'} className="img-fluid" alt="" />
                  </a>
                </div>
                <div className="nav-listblk">
                  <ul className="nav-list flex-between">
                    <li><a href="/dashboard">Dashboard</a></li>
                    <li hidden={role==='admin'?false:role==='sub-admin'?false:true} ><a href="/#">Members</a></li>
                    <li hidden={role==='admin'?false:role==='sub-admin'?false:role==='member'?false:true}><a href="/#">Operation Members</a></li>
                    <li ><a href="/#">Questionnaires</a></li>
                    <li hidden={role==='admin'?false:true}><a href="/sub-admins">Sub Admins</a></li>
                    <li hidden={role==='admin'?false:true}><a href="/#">Roles and Privileges</a></li>
                  </ul>
                </div>
              </div>
              <div className="header-right">
                <Box>
                  <Tooltip title="Open settings">
                    <div className="user-blk flex-between">
                      <div className="user-img">
                        <span className='user-name-txt'>ER</span>
                      </div>
                      <div className="user-info">
                        <span className="user-name">Erin</span>
                        <span className="user-type" onClick={handleOpenUserMenu}>Super Admin <span className={isActive ? "super-admin-arrow" : "super-admin-arrow active"}><KeyboardArrowDownIcon /></span></span>
                      </div>
                    </div>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '35px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    className="profile-menu-item"
                  >
                    {settings.map((setting) => (
                      <MenuItem key={setting} onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">{setting}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              </div>
            </div>
          </Toolbar>
        </div>
      </div>
    </AppBar>
  )
}

export default Header