import React,{useState} from 'react'
import { Link,useLocation,useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types';
import { Box, Tabs, Tab, Typography, MenuItem, Select, InputLabel ,Checkbox} from '@mui/material';
import DialogBox from '../components/DialogBox';


import TableTester from '../components/TableTester';

const ReplaceSubAdmin = () => {
    const [searchText, setSearchText] = useState('')
    const [open, setOpen] = useState(false)
    const handleSearchText=(e)=>{
        setSearchText(e.target.value)
  
      }
      console.log('Search text---',searchText)
  
     const handleYes =()=>{
        console.log("Yes replcae")
     } 
     const handleNo =()=>{
        console.log("No replcae")
     } 
     const openReplaceDailogBox=()=>{
        setOpen(true)
     }
  return (
    <div class="page-wrapper">
         <DialogBox
        title='Replace Sub-admin '
        info={`On replacing a sub-admin, all the statistics and record would get transfer to the new member. Are you sure you want to replace ${'coco-cola'}?`}
        primaryButtonText="Yes"
        secondaryButtonText="No"
        onPrimaryModalButtonClickHandler={handleYes}
        onSecondaryModalButtonClickHandler={handleNo}
        openModal={open}
        setOpenModal={setOpen}
      />
 <div className="breadcrumb-wrapper">
        <div className="container">
            <ul className="breadcrumb">
            <li><Link to="/sub-admins">Sub-Admin</Link></li>
            <li><Link to="/sub-admins/view-sub-admin">View-Admin</Link></li>
            <li>Replace Sub-Admin</li>
            </ul>
        </div>
    </div>
    <section>
        <div className="container">
        <div className="form-header flex-between ">
                <h2 className="heading2">Select any one sub-admin to replace john doe</h2>
               <div className="form-header-right-txt 
        member-filter-right
               
               ">
                    {/* <div className="tertiary-btn-blk"> */}
                       <div className='searchbar'>
                            <input type="text" placeholder="Search sub-admin name, email " onChange={e=>handleSearchText(e)} name="search" />
                            <button type="submit"><i class="fa fa-search"></i></button>
                        </div> 
                    {/* </div> */}
                </div> 
                </div>
         
                 
                     
                 
                        
                   
                
            
            <div >
               
                
            </div>
            <div className='card-wrapper'>
            <div className='member-info-wrapper table-content-wrap'>
             
                    <div className='member-data-sect'>

                        <div className='table-blk'>
                         <TableTester />
                        </div>
                    </div>
              
                  

               
            </div>
            <div className="form-btn flex-between add-members-btn">
                        <button onClick={openReplaceDailogBox} className="primary-button add-button replace-assign-btn">Assign</button>
                    </div>
                
                    </div>
        </div>
    </section>

</div>
  )
}
  


export default ReplaceSubAdmin