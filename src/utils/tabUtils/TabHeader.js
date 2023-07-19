import { Box, Tab, Tabs } from "@mui/material";
import React from "react";
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}
function TabHeader({ value, handleChange }) {
    return (
        <div className="member-tab-left">
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
                        <Tab label="Onboarded" {...a11yProps(0)} />
                        <Tab label="Pending" {...a11yProps(1)} />
                    </Tabs>
                </Box>
            </div>
        </div>
    );
}

export default TabHeader;
