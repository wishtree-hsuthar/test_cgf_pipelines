import React, { useEffect, useState } from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
function DashboardAccordian({title,children,defaultExpanded,expanded,setExpanded,name}) {
  console.log('expanded in expanded',expanded)
  const changeExpanded=(e,expanded)=>{
    console.log('expanded onchange',expanded)
   setExpanded(expanded=>{return {...expanded,[name]:!expanded[name]}})
  }
  const [defaultExpandedValue, setdefaultExpandedValue] = useState(false)
  
  return (
    <Accordion defaultExpanded={defaultExpanded} expanded={expanded} onChange={(e,expanded)=>changeExpanded(e,expanded)}  >
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel1a-content"
      id="panel1a-header"
    >
      <Typography>{title}</Typography>
    
    </AccordionSummary>
    <AccordionDetails>
      <Typography>
 {children}
      </Typography>
    </AccordionDetails>
  </Accordion>
  )
}                      

export default DashboardAccordian