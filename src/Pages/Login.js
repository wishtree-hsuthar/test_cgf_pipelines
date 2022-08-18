import React, { useEffect } from 'react'

import Slider from './Slider';
import { TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import {useForm} from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import {Logger} from '../Logger/Logger'
import { useLocation } from 'react-router-dom';
const loginFormSchema = yup.object().shape({
    email:yup.string().email("Please enter valid email").required("Email address required"),
    password:yup.string().matches(
        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        "Password must contain at least 8 characters, one uppercase, one number and one special case character"
      ).required("Password required"),
})
const Login = (prop) => {
    Logger.info(prop)
    const location = useLocation()
    console.log('location',location)
    console.log("---------",prop)
    const navigate = useNavigate()
    const subAdminMenu = ['Dashboard',
    'Members',
    'Operation Members',
    'Questionnaires',    
   ]
    const adminMenu = ['Dashboard',
    'Members',
    'Operation Members',
    'Questionnaires',    
    'Sub Admins',
    'Roles and Privileges']
    const {register,handleSubmit,formState:{errors}} = useForm({
        resolver:yupResolver(loginFormSchema)
    })
    useEffect(() => {
        document.body.classList.add('login-page');
    }, []);

    const [values, setValues] = React.useState({
        password: '',
        showPassword: false,

    });
    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };
    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const submitLoginData=(data)=>{
        console.log(data)
        
        localStorage.setItem('user',JSON.stringify(data))
        localStorage.setItem('role','admin')
        navigate('/dashboard')
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
                                <h2 class="heading1 text-uppercase">Log in</h2>
                                <div class="login-form">
                                    <form onSubmit={handleSubmit(submitLoginData)}>
                                        <div class="form-group">
                                            <label for="emailid">Email Id <span class="mandatory">*</span></label>
                                            <TextField 
                                           className={`input-field ${errors.email&&'input-error'}`} 
                                            id="outlined-basic" 
                                            placeholder='Enter email id' 
                                            variant="outlined"
                                            {...register('email')}
                                            />
                                               <p className={`input-error-msg`}>{errors.email?.message}</p>
                                        </div>
                                        <div class="form-group">
                                            <label for="password">Password <span class="mandatory">*</span></label>
                                            <div className='password-field'>
                                                <OutlinedInput
                                                    fullWidth
                                                    id="outlined-adornment-password"
                                                    type={values.showPassword ? 'text' : 'password'}
                                                 
                                                    placeholder='Enter password'
                                                   className={`input-field ${errors.password&&'input-error'}`}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowPassword}
                                                                onMouseDown={handleMouseDownPassword}
                                                                edge="end"
                                                                className='eye-btn'
                                                            >
                                                                {values.showPassword ? <img src={process.env.PUBLIC_URL + '/images/non-visibleicon.png'} alt="" class="img-fluid" /> : <img src={process.env.PUBLIC_URL + '/images/visibleicon.png'} alt="" class="img-fluid" />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    {...register('password')}
                                                />
                                                   <p className={`input-error-msg`}>{errors.password?.message}</p>
                                            </div>
                                        </div>
                                        <div class="form-btn flex-between">
                                            <button type="submit" class="primary-button">Log In</button>
                                            <div class="tertiary-btn-blk mr-10">Forgot Password?</div>
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

export default Login