import React from 'react'
import { Link } from "react-router-dom";
import { TextField, Select, MenuItem} from '@mui/material';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'


const ViewSubAdmin = () => {

  return (
    <div className="page-wrapper">
    <div className="breadcrumb-wrapper">
        <div className="container">
            <ul className="breadcrumb">
            <li><Link to="/sub-admins">Sub-Admin</Link></li>
            <li>View Sub-Admin</li>
            </ul>
        </div>
    </div>
    <section>
        <div className="container">
            <div className="form-header flex-between">
            <h2 className="heading2">View Sub-Admin</h2>
            {/* <div className="form-header-right-txt">
                <div className="tertiary-btn-blk">
                    <span class="addmore-icon"><i className='fa fa-plus'></i></span>
                    <span className="addmore-txt">Save & Add More</span>
                </div>
            </div> */}
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
                        // disabled={true}
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
                        // disabled={true}
                        value={'+917350378900'}
                        className={`phone-field  `} />
                  
                    </div>
                </div>
                <div className="card-form-field">
                    <div className="form-group">
                        <label for="role">Select role <span className="mandatory">*</span></label>
                         
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