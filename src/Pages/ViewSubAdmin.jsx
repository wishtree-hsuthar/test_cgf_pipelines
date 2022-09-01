import React,{useEffect,useState} from 'react'
import { Link } from "react-router-dom";
// import { TextField, Select, MenuItem} from '@mui/material';
import {TextField, Backdrop, Box, Modal,Select,MenuItem, Fade, Radio, RadioGroup, FormControlLabel} from '@mui/material';

import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';

import { useNavigate } from 'react-router-dom';


const ViewSubAdmin = () => {
 
    const history = useNavigate();
    const [modalData, setData] = useState();
    const [replaceSubAdmin, setReplaceSubAdmin] = useState()
    const [openReplaceModal, setOpenReplaceModal] = useState(false)
    const [isActive, setActive] = useState("false");
    const [open, setOpen] = React.useState(false);
    const handleToggle = () => {setActive(!isActive);};
    const handleOpen = index => {
        setOpen(true);
        setData(data[index]);
        console.log('clicked', index)
        console.log(index)
        if(index === 0){
            setOpen(false);
            history('/sub-admins/edit-sub-admin');
          }
          if(index === 1){
            setOpen(false);
            history('/sub-admins/replace-sub-admin');
          }
       
      };
   
    
      const handleClose = () => {
        setOpen(false);
      };
  
    const data = [
        {
          id: 1,
          action: 'Edit',
          title: 'Edit Member "KitKat"!',
          info: "On replacing a member, all the statistics and record would get transfer to the new member. Are you sure you want to replace KitKat?",
          secondarybtn: 'No',
          primarybtn: 'Yes'
        },
        {
            id: 2,
            action: 'Replace',
            title: 'Replace Member "KitKat"!',
            info: "On replacing a member, all the statistics and record would get transfer to the new member. Are you sure you want to replace KitKat?",
            secondarybtn: 'No',
            primarybtn: 'Yes'
        },
        {
            id: 3,
            action: 'Delete',
            title: 'Delete Sub-admin "KitKat"!',
            info: 'We recommend you to replace this sub admin with the new one because deleting all the details which sub admin has added will get deleted and this will be an irreversible action, Are you sure want to delete (sub admin name) !',
            secondarybtn: 'Replace Sub-admin',
            primarybtn: 'Delete Anyway'
        },
      
      ];
      const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };
      const CustomModal = () => {
        return modalData ? (
            <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
            className='popup-blk'
          >
            <Fade in={open}>
              <Box sx={style} className='popup-box'>
                <div id="transition-modal-title" className='popup-ttl-blk'>
                      <h2 className='popup-ttl heading2'>{modalData.title}</h2>
                      <span class="popup-close-icon" onClick={handleClose}><CloseIcon/></span>
                </div>
                <div id="transition-modal-description" className='popup-body'>
                  <div className='popup-content-blk text-center'>
                      <p>
                          open{modalData.info}
                      </p>
                      <div className="form-btn flex-center">
                          <button type="submit" className="secondary-button mr-10">{modalData.secondarybtn}</button>
                          <button type="submit" className="primary-button">{modalData.primarybtn}</button>
                      </div>
                  </div>
                </div>
              </Box>
            </Fade>
          </Modal>
        ) : null;
      };

    

  return (
    <div className="page-wrapper">
    <div className="breadcrumb-wrapper">
        <div className="container">
            <ul className="breadcrumb">
            <li><Link to="/sub-admins">Sub Admin</Link></li>
            <li>View Sub Admin</li>
            </ul>
        </div>
    </div>
    <section>
        <div className="container">
            <div className="form-header flex-between">
            <h2 className="heading2">View Sub Admin</h2>
           
             <span className="form-header-right-txt" onClick={handleToggle}>
                        <span className='crud-operation'><MoreVertIcon/></span>
                        <div className="crud-toggle-wrap" style={{display: isActive ? 'none' : 'block'}}>
                            <ul className='crud-toggle-list'>
                                {data.map((d, index) => (
                                    <li onClick={()=>handleOpen(index)} key={index}>{d.action}</li>
                                ))}
                            </ul>
                        </div>
                        <CustomModal />
                        {/* <ReplaceSubAdminModal /> */}
                        </span>
            </div>
            <div className="card-wrapper" >
            
                <div className="card-blk flex-between">
                <div className="card-form-field">
                    <div className="form-group">
                        <label for="subAdminName">Sub Admin Name <span className="mandatory">*</span></label>
                        <TextField 
                        
                        id="outlined-basic" 
                        placeholder='Enter sub admin name' 
                        variant="outlined" 
                        className={`input-field`} 
                        // disabled={true}
                        value={"manav"}
                        />
                       

                    </div>
                </div>
                <div className="card-form-field">
                    <div className="form-group">
                        <label for="email">Email Id <span className="mandatory">*</span></label>
                        <TextField 
                        className={`input-field `} 
                        id="outlined-basic" 
                        placeholder='Enter email address' 
                        variant="outlined"
                        disabled={true}
                        value={"abcd@.qwe.com"}
                        />
                      
                    </div>
                </div>
                <div className="card-form-field">
                    <div className="form-group">
                        <label for="emailid">Phone Number</label>
                        <PhoneInput
                        international
                        // defaultCountry="IN"
                        limitMaxLength={15}
                        disabled={true}
                        value={'+917350378900'}
                        className={`phone-field  `} />
                  
                    </div>
                </div>
                <div className="card-form-field">
                    <div className="form-group">
                        <label for="role">Select Role <span className="mandatory">*</span></label>
                         
                        <div className="select-field" >
                        <Select 
                         disabled="true"
                          className={`input-field `}
                          value={'Supervisor'}
                        >
                          <MenuItem value={"manager"} >{"Manager"}</MenuItem>
                          <MenuItem value={"Assistent manager"}>{"Assistent manager"}</MenuItem>
                          <MenuItem value={"Supervisor"}>{"Supervisor"}</MenuItem>
                        </Select>
                  

                        </div>
                    </div>
                </div>
              
               
               
                </div>
            
            </div>
        </div>
    </section>
</div>
  )
}

export default ViewSubAdmin