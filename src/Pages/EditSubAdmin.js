import React,{useState} from 'react'
import { Link, useLocation } from "react-router-dom";
import { TextField, Select, MenuItem} from '@mui/material';
import PhoneInputWithCountry from "react-phone-number-input/react-hook-form"

import 'react-phone-number-input/style.css'

import {useForm } from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'
const editSubAdminSchema =yup.object().shape({
    subAdminName:yup.string().required("Sub admin name required"),
    email:yup.string().email("Enter valid email address").required("Email address requried"),
    role:yup.string().required("Role required"),
    phoneNumber:yup.string().min(3,"Minimum 3 digits required")
  })
 
const EditSubAdmin = () => {
    const [values,setValues ]= useState( {
        subAdminName:'madhav',
        email:'madhav@yopmail.com',
        role:'manager',
        phoneNumber:'+917350378900'
      })
   
      const [defaultPhone, setDefaultPhone] = useState('+91123456789')
    const {register,handleSubmit,control,formState:{errors},reset} = useForm({
        defaultValues:values,
        resolver:yupResolver(editSubAdminSchema)
    })
        const location = useLocation()
        console.log(location)
        
        const resetVal =()=>{
            reset({
                subAdminName:'madhav',
                email:'madhav@yopmail.com',
                role:'manager',
                phoneNumber:'+917350378900'
            })
        } 
    
        const handleOnSubmit=(data)=>{
          console.log("data",data)
        }
  return (
    <div className="page-wrapper">
        <div className="breadcrumb-wrapper">
            <div className="container">
                <ul className="breadcrumb">
                <li><Link to="/sub-admins">Sub-Admin</Link></li>
                <li>Edit Sub-Admin</li>
                </ul>
            </div>
        </div>
        <section>
            <div className="container">
                <div className="form-header flex-between">
                <h2 className="heading2">Edit Sub-Admin</h2>
                {/* <div className="form-header-right-txt">
                    <div className="tertiary-btn-blk">
                        <span class="addmore-icon"><i className='fa fa-plus'></i></span>
                        <span className="addmore-txt">Save & Add More</span>
                    </div>
                </div> */}
                </div>
                <div className="card-wrapper" >
                  <form onSubmit={handleSubmit(handleOnSubmit)}>
                    <div className="card-blk flex-between">
                    <div className="card-form-field">
                        <div className="form-group">
                            <label for="subAdminName">Sub Admin Name <span className="mandatory">*</span></label>
                            <TextField 
                            
                            id="outlined-basic" 
                            placeholder='Enter sub admin name' 
                            variant="outlined" 
                            className={`input-field ${errors.subAdminName&&'input-error'}`} 
                            {...register('subAdminName')}
                            />
                            <p className={`input-error-msg`}>{errors.subAdminName?.message}</p>

                        </div>
                    </div>
                    <div className="card-form-field">
                        <div className="form-group">
                            <label for="email">Email Id <span className="mandatory">*</span></label>
                            <TextField 
                            className={`input-field ${errors.email&&'input-error'}`} 
                            id="outlined-basic" 
                            placeholder='Enter email address' 
                            variant="outlined"
                            {...register('email')}
                            />
                             <p className={`input-error-msg`}>{errors.email?.message}</p>
                        </div>
                    </div>
                    <div className="card-form-field">
                        <div className="form-group">
                            <label htmlFor="phoneNumber">Phone Number</label>
                            <PhoneInputWithCountry
        // {...register('phoneNumber',{
            
        //     value:defaultValues.phoneNumber,
        //     onChange:e=>console.log(e)
           
        // })} 
        value={defaultPhone}
        onChange={e=>setDefaultPhone(e)}

        name="phoneNumber"
        control={control}
        />
                         <p className={`input-error-msg`}>{errors.phoneNumber?.message}</p>
                        </div>
                    </div>
                    <div className="card-form-field">
                        <div className="form-group">
                            <label for="role">Select role <span className="mandatory">*</span></label>
                             
                            <div className="select-field" >
                            <Select 
                              {...register('role')}

                              className={`input-field ${errors.role&&'input-error'}`}
                             
                                value={values.role}
                                onChange={e=>setValues({...values,role:e.target.value})}
                            >
                              <MenuItem value={"manager"} >{"Manager"}</MenuItem>
                              <MenuItem value={"Assistent manager"}>{"Assistent manager"}</MenuItem>
                              <MenuItem value={"Supervisor"}>{"Supervisor"}</MenuItem>
                            </Select>
                         <p className={`input-error-msg`}>{errors.role?.message}</p>

                            </div>
                        </div>
                    </div>
                  
                   
                    <div className="form-btn flex-between add-members-btn">
                        <button  onClick={resetVal} className="secondary-button mr-10">Cancel</button>
                        <button type="submit" className="primary-button add-button">Update</button>
                    </div>
                    
                    </div>
                    </form>
                </div>
            </div>
        </section>
    </div>
  )
}

export default EditSubAdmin