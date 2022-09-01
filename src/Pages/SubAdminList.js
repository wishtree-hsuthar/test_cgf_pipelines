import React,{useState} from 'react'
import { Link,useLocation,useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types';
import { Box, Tabs, Tab, Typography, MenuItem, Select, InputLabel ,Checkbox} from '@mui/material';

import DownloadIcon from '@mui/icons-material/Download';
import TableTester from '../components/TableTester';
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
      <div
          role="tabpanel"
          hidden={value !== index}
          id={`simple-tabpanel-${index}`}
          aria-labelledby={`simple-tab-${index}`}
          {...other}
      >
          {value === index && (
              <Box sx={{ p: 3 }}>
                  <Typography>{children}</Typography>
              </Box>
          )}
      </div>
  );
          }
          TabPanel.propTypes = {
            children: PropTypes.node,
            index: PropTypes.number.isRequired,
            value: PropTypes.number.isRequired,
        };

        function a11yProps(index) {
          return {
              id: `simple-tab-${index}`,
              'aria-controls': `simple-tabpanel-${index}`,
          };
      }

const SubAdminList = () => {
  const [value, setValue] = React.useState(0);
  // const [isAllRoleSelected, setIsAllRoleSelected] = useState(false)
  let roles = ['System-Administrator','Co-ordinator']
  const [selectedRoles, setSelectedRoles] = useState([])
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("")
  const [searchText, setSearchText] = useState('')
  const handleChange = (event, newValue) => {
      setValue(newValue);
  };
    const navigate = useNavigate()
   const isAllRolesSelected = selectedRoles.length>0&&selectedRoles.length===roles.length


    const handleSelectedRole=(e)=>{
      let value = e.target.value;
      if (value[value.length - 1] === "") {

     
      setSelectedRoles(selectedRoles.length===roles.length?[]:roles)
        return;
      }
      setSelectedRoles(value)
    }

    const handleChangeStatusFilter=(e)=>{
      setSelectedStatusFilter(e.target.value)
    }
    console.log('Selected status filter---',selectedStatusFilter)
    const handleSearchText=(e)=>{
      setSearchText(e.target.value)

    }
    console.log('Search text---',searchText)

  return (
    <div class="page-wrapper">

    <section>
        <div className="container">
            <div className='member-filter-sect'>
                <div className='member-filter-wrap flex-between'>
                    <div className='member-filter-left'>
                        <div className='searchbar'>
                            <input type="text" placeholder="Search sub-admin name, email " onChange={e=>handleSearchText(e)} name="search" />
                            <button type="submit"><i class="fa fa-search"></i></button>
                        </div>

                    </div>
                    <div className='member-filter-right'>
                        <div className="filter-select-wrap flex-between">
                            <div className="filter-select-field">
                                <div className='dropdown-field'>
                                    <Select 
                                    value={selectedRoles}
                                    multiple
                                    // value={roles}
                                    onChange={e=>handleSelectedRole(e)}
                                    renderValue={(role)=>role.join(', ')}
                                    >
             

                                  <MenuItem value="" >
                                  <Checkbox checked={isAllRolesSelected} 
                        indeterminate={selectedRoles.length>0&&selectedRoles.length<roles.length}
                />
                                    Select All</MenuItem>
                                      
                                  {
                                    roles.map(role=>(
                                      <MenuItem key={role} value={role}>
                <Checkbox checked={selectedRoles.indexOf(role) > -1} />
                {role}
                                      
                                      </MenuItem>
                                    ))
                                  }
                                        
                                        {/* <MenuItem value="System-Administrator" selected>System-Administrator</MenuItem>
                                        <MenuItem value="Co-ordinator">Co-ordinator</MenuItem> */}
                                    </Select>
                                </div>
                            </div>
                           
                            
                            <div className="filter-select-field">
                                <div className='dropdown-field'>
                                    <Select value={selectedStatusFilter}
                                    onChange={e=>handleChangeStatusFilter(e)}
                                    >
                                        <MenuItem value="In-active" selected>In-active</MenuItem>
                                        <MenuItem value="Active">Active</MenuItem>
                                        <MenuItem value="Both">Both</MenuItem>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="form-header member-form-header flex-between">
                <div className='form-header-left-blk flex-start'>
                    <h2 className="heading2 mr-40">Sub Admins</h2>
                    <div className='member-tab-wrapper'>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className="tabs-sect">
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab label="Onboarded" {...a11yProps(0)} />
                                <Tab label="Pending" {...a11yProps(1)} />
                            </Tabs>
                        </Box>
                    </div>
                </div>
                <div className="form-header-right-txt">
                    <div className='tertiary-btn-blk mr-20'><span class="download-icon"><DownloadIcon /></span>Download</div>
                    <div className="form-btn">
                        <button  onClick={()=>navigate('/sub-admins/add-sub-admin')} className="primary-button add-button">Add Sub Admin</button>
                    </div>
                </div>
            </div>
            <div className='member-info-wrapper table-content-wrap'>
                <TabPanel value={value} index={0}>
                    <div className='member-data-sect'>

                        <div className='table-blk'>
                         <TableTester />
                        </div>
                    </div>
                </TabPanel>
                <TabPanel value={value} index={1}>
                <TableTester />

                </TabPanel>
            </div>
        </div>
    </section>

</div>
  )
}

export default SubAdminList