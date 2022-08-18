import React, { useEffect } from 'react'

import { TextField } from '@mui/material';

import Slider from './Slider';
import {useForm } from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'

const forgetPasswordSchema=yup.object().shape({
    email:yup.string().email("Please enter valid email address").required("Email address required")
})
const ForgetPassword = () => {
    const {register,handleSubmit,formState:{errors}} = useForm({
        resolver:yupResolver(forgetPasswordSchema)
    })
    useEffect(() => {
        document.body.classList.add('login-page');
    }, []);

    const [values, setValues] = React.useState({
      email:""

    });
    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };
    const submitEmail=(data)=>{
        console.log(data)
    }
    
  return (
    <div class="page-wrapper login-page-wrap">
            <div class="login-section">
                <div class="container">
                    <div class="login-wrapper">
                        <div class="login-leftblk">
                            <div class="login-slider">
                                <Slider />
                            </div>
                        </div>
                        <div class="login-rightblk">
                            <div class="login-blk">
                                <div class="logo">
                                    <img src={process.env.PUBLIC_URL + '/images/logo.png'} alt="" class="img-fluid" />
                                </div>
                                <h2 class="heading1 text-uppercase">Forget password</h2>
                                <p className='forget-password-message'>Enter you registered email address and we'll <br /> send you a link to reset your password</p>
                                <div class="login-form">
                                    <form onSubmit={handleSubmit(submitEmail)}>
                                        <div class="form-group">
                                            <label for="emailid">Email Id <span class="mandatory">*</span></label>
                                            <TextField 
                                         className={`input-field ${errors.email&&'input-error'}`}
                                            id="outlined-basic"
                                             
                                             placeholder='Enter email id' 
                                             variant="outlined"
                                             {...register('email')}
                                             error={errors.email?true:false}
                                            
                                             />
                                                <p className={`input-error-msg`}>{errors.email?.message}</p>

                                        </div>
                                       
                                        <div class="form-btn flex-between">
                                            <button type="submit" class="primary-button">Submit</button>

                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
  )
}

export default ForgetPassword