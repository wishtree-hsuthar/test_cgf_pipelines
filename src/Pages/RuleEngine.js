import { TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Dropdown from "../components/Dropdown";
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import axios from 'axios';
import { privateAxios } from '../api/axios';
import { FETCH_RULE_ENGINE_OBJECT, UPDATE_RULE_ENGINE_OBJECT } from '../api/Url';

function RuleEngine() {
  const helperTextForRuleEngine = {
    
    ruleType: {
      required: "Enter the rule type",
     
    },
    ruleEngine: {
      required: "Enter the rule engine",
     
    },
    
  };
    const [ruleEngine, setRuleEngine] = useState('')
    const [ruleType, setRuleType] = useState('saq')
    const handleChange = (e) => {
        setRuleEngine(e.target.value)
    }
    const navigate = useNavigate();
    const {
      handleSubmit,
      watch,
      formState: { errors },
      reset,
      control,
      trigger,
      setValue,
    } = useForm({
      defaultValues: {
       ruleType:'',
       ruleEngine:ruleEngine
      },
    });
    const handleSubmitRuleEngine=(data)=>{
      let rules=JSON.parse(data.ruleEngine)
      // rules['ruleType']=data.ruleType
      console.log('data = ',rules)
      updateRuleEngine(rules)
    }
    useEffect(() => {
      
    
      getRuleEngineObject()
      
    }, [])

    const getRuleEngineObject=async(ruleType)=>{
      try {
        const response = await privateAxios.get(FETCH_RULE_ENGINE_OBJECT+ruleType)
        console.log("response from ruleEngine",response)
        setRuleEngine(JSON.stringify(response.data.rules))
        setValue('ruleEngine',JSON.stringify(response.data.rules))
      } catch (error) {
        console.log('error from rule engine',error)
      }
    }
    const updateRuleEngine=async(rules)=>{
      try {
        const resposne = await privateAxios.put(UPDATE_RULE_ENGINE_OBJECT+ruleType,{rules})
        if(resposne.status===200){
          window.alert(resposne.data.message)
        }
      } catch (error) {
        console.log('error from update rule engine',error)
      }
    }

    const resetConfiguration=async(ruleType)=>{
      try {
        const response = await privateAxios.put(UPDATE_RULE_ENGINE_OBJECT+ruleType)
      } catch (error) {
        console.log('Error from reset configuration',error)
      }
    }
    
    return (
      <form onSubmit={handleSubmit(handleSubmitRuleEngine)}>
      
        <div className="page-wrapper">
            <div className="card-wrapper">
               
                <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="role">
                        Rule Type <span className="mandatory">*</span>
                      </label>

                      <div>
                        <Dropdown
                          name="ruleType"
                          control={control}
                          options={['saq','indicator','indicator_new']}
                          rules={{
                            required: true,
                          }}
                          myOnChange={(e)=>{setValue('ruleType',e.target.value);setRuleType(e.target.value);getRuleEngineObject(e.target.value)}}
                          myHelper={helperTextForRuleEngine.ruleType}
                          placeholder={"Select rule type"}
                        />

                        <p className={`password-error`}>
                          {errors.ruleType?.message}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                        <label htmlFor="name">
                            Rule Engine <span className="mandatory">*</span>
                        </label>
                        <Input
                        control={control}
                        multiline={true}
                        onBlur={(e) => setValue("ruleEngine", e.target.value?.trim())}
                        name={"ruleEngine"}
                        placeholder={"Enter Rule engine object"}
                        myHelper={helperTextForRuleEngine}
                        rules={{
                         
                          required: true,
                        }}
                      />
                    </div>
                </div>
                <div className="form-btn flex-between add-members-btn">
                <button
                      type="reset"
                    //   onClick={handleCancel}
                      className="secondary-button mr-10"
                    >
                      Reset
                    </button>
                   
                    <button
                      type="reset"
                    //   onClick={handleCancel}
                      className="secondary-button mr-10"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="primary-button add-button"
                    //   disabled={disableSubmit}
                    >
                      Save
                    </button>
                  </div>
            </div>
        </div>
        </form>
    )
}

export default RuleEngine       