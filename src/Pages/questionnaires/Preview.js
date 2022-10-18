import React, { useState } from 'react'
import { TextField, Select, MenuItem, FormGroup, Box, Modal, Fade, Backdrop, Checkbox, Radio, FormControlLabel, RadioGroup } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import { Tabs, Tab, Tooltip } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import dayjs from 'dayjs';

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
const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 15,
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(9px)',
        },
    },
    '& .MuiSwitch-switchBase': {
        padding: 2,
        '&.Mui-checked': {
            transform: 'translateX(12px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        width: 12,
        height: 12,
        borderRadius: 6,
        transition: theme.transitions.create(['width'], {
            duration: 200,
        }),
    },
    '& .MuiSwitch-track': {
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor:
            theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
        boxSizing: 'border-box',
    },
}));

const data = [{ id: 0, label: "Country" }, { id: 1, label: "City" }];

const dropdownData = [{ id: 0, label: "Textbox" }, { id: 1, label: "Calendar" }, { id: 2, label: "Radiobutton" }, { id: 3, label: "Dropdown" }];

function Preview() {
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const [datevalue, setDateValue] = React.useState(null);
    return (
        <div className="page-wrapper">
            <div className="breadcrumb-wrapper">
                <div className="container">
                    <ul className="breadcrumb">
                        <li><a href="/#">Questionnaire</a></li>
                        <li>Add Questionnaire</li>
                    </ul>
                </div>
            </div>
            <section>
                <div className="container">
                    <div className="form-header flex-between">
                        <h2 className="heading2">Add Questionnaire</h2>
                    </div>
                    <div className='que-ttl-blk'>
                        <div className="form-group mb-0">
                            <label for="">Questionnaire Title <span className="mandatory">*</span></label>
                            <TextField className='input-field' id="outlined-basic" value="HQ All Operation HRDD" placeholder='Enter questionnaire title' variant="outlined" />
                        </div>
                    </div>
                    <div className='section-form-sect'>
                        <div className='section-tab-blk flex-between'>
                            <div className='section-tab-leftblk'>
                                <Box
                                    sx={{
                                        borderBottom: 1,
                                        borderColor: "divider",
                                    }}
                                    className="tabs-sect que-tab-sect"
                                >
                                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                        <Tooltip title="HQ All Operation HRDD" placement="bottom-start">
                                            <Tab className="section-tab-item" label="Section 1" {...a11yProps(0)} />
                                        </Tooltip>
                                        <Tooltip title="HQ All Operation HRDD" placement="bottom-start">
                                            <Tab className="section-tab-item" label="Section 2" {...a11yProps(1)} />
                                        </Tooltip>
                                        <Tooltip title="HQ All Operation HRDD" placement="bottom-start">
                                            <Tab className="section-tab-item" label="Section 3" {...a11yProps(2)} />
                                        </Tooltip>
                                    </Tabs>
                                </Box>
                            </div>
                            
                        </div>
                        <div className='preview-tab-data'>
                            <TabPanel value={value} index={0}>
                                <div className="preview-card-wrapper">
                                    <div className='preview-sect-ttl-wrap'>
                                        <div class="preview-sect-card-ttl-blk">
                                            <h2 class="subheading">Section Title</h2>
                                        </div>
                                        <div className='preview-sect-txt mb-0'>
                                            Section Title will come here
                                        </div>
                                    </div>
                                </div>
                                <div className="preview-card-wrapper">
                                    <div className='preview-que-wrap'>
                                        <div className='preview-que-blk'>
                                            <div class="preview-sect-txt">
                                                Question 1 title will come here
                                            </div>
                                            <div className="form-group">
                                                <TextField className='input-field' id="outlined-basic" placeholder='Enter question title' variant="outlined" />
                                            </div>
                                        </div>
                                        <div className='preview-que-blk'>
                                            <div class="preview-sect-txt">
                                                Question 2 title will come here
                                            </div>
                                            <div className="form-group">
                                                <div className="select-field">
                                                    <Select
                                                        IconComponent={(props) => <KeyboardArrowDownRoundedIcon {...props} />}
                                                        value="Select status"
                                                        MenuProps={MenuProps}>
                                                        <MenuItem value="Select status">Select status</MenuItem>
                                                        <MenuItem value="Value1" selected>Value1</MenuItem>
                                                        <MenuItem value="Value2" selected>Value2</MenuItem>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='preview-que-blk'>
                                            <div class="preview-sect-txt">
                                                Question 3 title will come here
                                            </div>
                                            <div className="form-group">
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker
                                                        className='datepicker-blk'
                                                        components={{
                                                            OpenPickerIcon: DateRangeOutlinedIcon
                                                        }}
                                                        datevalue={datevalue}
                                                        onChange={(newValue) => {
                                                            setDateValue(newValue);
                                                        }}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                </LocalizationProvider>
                                            </div>
                                        </div>
                                        <div className='preview-que-blk'>
                                            <div class="preview-sect-txt">
                                                Question 4 title will come here
                                            </div>
                                            <div className="form-group">
                                                <TextField
                                                    multiline
                                                    className="input-textarea"
                                                    id="outlined-basic"
                                                    placeholder="Enter text here.."
                                                    variant="outlined"
                                                />
                                            </div>
                                        </div>
                                        <div className='preview-que-blk'>
                                            <div class="preview-sect-txt preview-incl-padding-space">
                                                Question 5 title will come here
                                            </div>
                                            <div className="form-group">
                                                <div className="radio-btn-field">
                                                    <RadioGroup
                                                        aria-labelledby="demo-radio-buttons-group-label"
                                                        defaultValue="Active"
                                                        name="radio-buttons-group"
                                                        className='radio-btn radio-btn-vertical'
                                                    >
                                                        <FormControlLabel value="Option A" control={<Radio />} label="Option A" />
                                                        <FormControlLabel value="Option B" control={<Radio />} label="Option B" />
                                                    </RadioGroup>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='preview-que-blk'>
                                            <div class="preview-sect-txt preview-incl-padding-space">
                                                Question 6 title will come here
                                            </div>
                                            <div className="form-group mb-0">
                                                <div className='checkbox-with-labelblk'>
                                                    <FormControlLabel className='checkbox-with-label' control={<Checkbox defaultChecked />} label="Label" />
                                                    <FormControlLabel className='checkbox-with-label' control={<Checkbox />} label="Disabled" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-btn flex-between add-members-btn">
                                        <button
                                            type="reset"
                                            className="secondary-button mr-10"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="primary-button add-button"
                                        >
                                            Edit
                                        </button>
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

export default Preview