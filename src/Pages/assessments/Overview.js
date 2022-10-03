import React from 'react'
import PropTypes from 'prop-types';
import { Box, Tabs, Tab, Typography, MenuItem, Select } from '@mui/material';
// import TableData from '../admin/Table';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

const ITEM_HEIGHT = 22;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5
    },
  },
};
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
                <Box>
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
function Overview() {

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <div className="page-wrapper">
            <section>
                <div className="container">
                    <div className="form-header pt-30">
                        <h2 className="heading2">Overview</h2>
                    </div>
                    <div className='assessment-tab-sect'>
                        <div className='assessment-tab-wrap'>
                            <Box className="assessment-tabs-blk">
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                    <Tab className="assessment-tab-item" wrapped iconWrapper iconPosition="start" icon={(<div className='assessment-type-icon'><img src={process.env.PUBLIC_URL + '/images/create-assessment-icon.svg'} alt="" class="img-fluid" /></div>)} label={(<div className='assessment-type-txtblk'><div className='assessment-type-txt'>{"Created Assessments"}</div><div className='assessment-count'>{"100"}</div></div>)}{...a11yProps(0)}/>
                                    <Tab className="assessment-tab-item" wrapped iconWrapper iconPosition="start" icon={(<div className='assessment-type-icon'><img src={process.env.PUBLIC_URL + '/images/pending-assessment-icon.svg'} alt="" class="img-fluid" /></div>)} label={(<div className='assessment-type-txtblk'><div className='assessment-type-txt'>{"Pending Assessments"}</div><div className='assessment-count'>{"20"}</div></div>)}{...a11yProps(1)}/>
                                    <Tab className="assessment-tab-item" wrapped iconWrapper iconPosition="start" icon={(<div className='assessment-type-icon'><img src={process.env.PUBLIC_URL + '/images/ongoing-assessment-icon.svg'} alt="" class="img-fluid" /></div>)} label={(<div className='assessment-type-txtblk'><div className='assessment-type-txt'>{"Ongoing Assessments"}</div><div className='assessment-count'>{"50"}</div></div>)}{...a11yProps(2)}/>
                                    <Tab className="assessment-tab-item" wrapped iconWrapper iconPosition="start" icon={(<div className='assessment-type-icon'><img src={process.env.PUBLIC_URL + '/images/submitted-assessment-icon.svg'} alt="" class="img-fluid" /></div>)} label={(<div className='assessment-type-txtblk'><div className='assessment-type-txt'>{"Submitted Assessments"}</div><div className='assessment-count'>{"30"}</div></div>)}{...a11yProps(3)}/>
                                </Tabs>
                            </Box>
                        </div>
                        <div className='assessment-tab-data'>
                            <TabPanel value={value} index={0}>
                                <div className='assessment-tab-cont'>
                                    <div className='assessment-typeblk flex-between'>
                                        <div className='assessment-type-ttl'>
                                        <h3 className='subheading'>Created Assessments</h3>
                                        </div>
                                        <div className='assesment-monthblk'>
                                            <div className="form-group">
                                                <div className="select-field">
                                                    <Select 
                                                    IconComponent={(props) => <KeyboardArrowDownRoundedIcon {...props}/>}
                                                    value="This month" 
                                                    MenuProps={MenuProps}>
                                                        <MenuItem value="This month">This month</MenuItem>
                                                        <MenuItem value="This week" selected>This week</MenuItem>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='table-blk'>
                                        {/* <TableData/> */}
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                            <div className='assessment-tab-cont'>
                                    <div className='assessment-typeblk flex-between'>
                                        <div className='assessment-type-ttl'>
                                        <h3 className='subheading'>Pending Assessments</h3>
                                        </div>
                                        <div className='assesment-monthblk'>
                                            <div className="form-group">
                                                <div className="select-field">
                                                    <Select value="This month" MenuProps={MenuProps}>
                                                        <MenuItem value="This month">This month</MenuItem>
                                                        <MenuItem value="This week" selected>This week</MenuItem>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='table-blk'>
                                        {/* <TableData/> */}
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                            <div className='assessment-tab-cont'>
                                    <div className='assessment-typeblk flex-between'>
                                        <div className='assessment-type-ttl'>
                                        <h3 className='subheading'>Ongoing Assessments</h3>
                                        </div>
                                        <div className='assesment-monthblk'>
                                            <div className="form-group">
                                                <div className="select-field">
                                                    <Select value="This month" MenuProps={MenuProps}>
                                                        <MenuItem value="This month">This month</MenuItem>
                                                        <MenuItem value="This week" selected>This week</MenuItem>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='table-blk'>
                                        {/* <TableData/> */}
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel value={value} index={3}>
                            <div className='assessment-tab-cont'>
                                    <div className='assessment-typeblk flex-between'>
                                        <div className='assessment-type-ttl'>
                                        <h3 className='subheading'>Submitted Assessments</h3>
                                        </div>
                                        <div className='assesment-monthblk'>
                                            <div className="form-group">
                                                <div className="select-field">
                                                    <Select value="This month" MenuProps={MenuProps}>
                                                        <MenuItem value="This month">This month</MenuItem>
                                                        <MenuItem value="This week" selected>This week</MenuItem>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='table-blk'>
                                        {/* <TableData/> */}
                                    </div>
                                </div>
                            </TabPanel>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Overview