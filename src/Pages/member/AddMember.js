import { FormControlLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import React from "react";
import { Link } from "react-router-dom";
import Input from "../../components/Input";
import Dropdown from "../../components/Dropdown";

const myHelper = {
  roleName: {
    required: "Enter the role name",
    maxLength: "Max char limit exceed",
    minLength: "Role must contain atleast 3 characters",
    pattern: "Invalid format",
  },
  description: {
    required: "Enter the description",
    maxLength: "Max char limit exceed",
    minLength: "Description must contain atlest 3 characters",
  },
  memberCompany: {
    maxLength: "Max char limit exceed",
    minLength: "Input must contain atleast 3 characters",
    required: "Enter member company",
  },
  parentCompany: {
    maxLength: "Max char limit exceed",
    minLength: "Input must contain atleast 3 characters",
  },
  corporateEmail: {
    required: "Enter Email",
    maxLength: "Max char limit exceed",
    minLength: "Input must contain atleast 3 characters",
    pattern: "Invalid Input",
  },
  countryCode: {},
  phoneNumber: {
    maxLength: "Max char limit exceed",
    minLength: "Input must contain atleast 3 characters",
    pattern: "Invalid Input",
  },
  websiteUrl: {
    maxLength: "Max char limit exceed",
    minLength: "Input must contain atleast 3 characters",
    pattern: "Invalid Input",
  },
  region: {
    required: "Select region",
  },
  country: {
    required: "Select country",
  },
  state: {
    required: "Select state",
  },
  city: {
    maxLength: "Max char limit exceed",
    minLength: "Input must contain atleast 3 charcters",
  },
  address:{
    required: "Enter the address",
    maxLength: "Max char limit exceed",
    minLength: "Input must contain atleast 3 characters"
  },
  cgfOfficeRegion:{
    required: "Select the Region"
  },
  cgfOfficeCountry:{
    required: "Select the Country"
  },
  cgfOffice:{
    required : "Select the office"
  },
  memberContactSalutation:{
    required: "Select the Salutation"
  },
  memberContactFullName:{
    required: "Enter the name",
    minLength: "Input must contain atleast 3 charcters",
    maxLength: "Max char limit exceed",
    pattern: "Invalid Input"

  },
  title:{
    minLength: "Input must contain atleast 3 charcters",
    maxLength: "Max char limit exceed",
    pattern: "Invalid Input"
  },
  department:{
    minLength: "Input must contain atleast 3 charcters",
    maxLength: "Max char limit exceed",
    pattern: "Invalid Input"
  },
  memberContactEmail:{
    required: true,
    minLength: "Input must contain atleast 3 charcters",
    maxLength: "Max char limit exceed",
  },
  memberContactCountryCode:{},
  memberContactPhoneNuber: {
    maxLength: "Max char limit exceed",
    minLength: "Input must contain atleast 3 characters",
    pattern: "Invalid Input",
  },
};
const AddMember = () => {
  const defaultValues = {
    memberCompany: "",
    companyType: "internal",
    parentCompany: "",
    cgfCategory: "Manufacturer",
    cgfActivity: "None",
    countryCode: "+91",
    phoneNumber: "",
    websiteUrl: "",
    region: "Africa",
    country: "",
    state: "",
    city: "",
    address: "",
    cgfOfficeRegion: "Africa",
    cgfOffice: "",
    memberContactSalutation: "Mr.",
    memberContactFullName: "",
    title: "",
    member: "",
    memberContactCountryCode: "+91",
    memberContactEmail: "",
    memberContactPhoneNuber: ""
  };
  const { control, reset, setValue, handleSubmit } = useForm({
    defaultValues: defaultValues,
  });
  const onSubmit = (data) => {
    console.log("data", data);
  };
  return (
    <div className="page-wrapper">
      <div className="breadcrumb-wrapper">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link to="/members">Members</Link>
            </li>
            <li>Add Member</li>
          </ul>
        </div>
      </div>
      <section>
        <div className="container">
          <div className="form-header flex-between">
            <h2 className="heading2">Add Member</h2>
            <div className="form-header-right-txt">
              <div className="tertiary-btn-blk">
                <span className="addmore-icon">
                  <i className="fa fa-plus"></i>
                </span>
                <span className="addmore-txt">Save & Add More</span>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card-wrapper">
              <div className="card-inner-wrap">
                <h2 className="sub-heading1">Company Details</h2>
                <div className="card-blk flex-between">
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="memberCompany">
                        Member Company <span className="mandatory">*</span>
                      </label>
                      <Input
                        control={control}
                        name="memberCompany"
                        placeholder="Enter member company"
                        myHelper={myHelper}
                        rules={{
                          required: "true",
                          maxLength: 50,
                          minLength: 3,
                        }}
                      />
                    </div>
                  </div>

                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="companyType">
                        Company Type <span className="mandatory">*</span>
                      </label>
                      <div className="radio-btn-field">
                        <Controller
                          name="companyType"
                          control={control}
                          render={({ field }) => (
                            <RadioGroup
                              {...field}
                              aria-labelledby="demo-radio-buttons-group-label"
                              name="radio-buttons-group"
                              className="radio-btn"
                            >
                              <FormControlLabel
                                value="internal"
                                control={<Radio />}
                                label="Internal"
                              />
                              <FormControlLabel
                                value="external"
                                control={<Radio />}
                                label="External"
                              />
                            </RadioGroup>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="parentCompany">Parent Company</label>
                      <Input
                        control={control}
                        name="parentCompany"
                        placeholder="Enter parent company"
                        myHelper={myHelper}
                        rules={{
                          minLength: 3,
                          maxLength: 50,
                        }}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      {/* <div className="select-field"> */}
                      <label htmlFor="cgfCategory">
                        CGF Category <span className="mandatory">*</span>
                      </label>
                      <Dropdown
                        control={control}
                        name="cgfCategory"
                        placeholder="Select category"
                        options={["Manufacturer", "Retailer", "Other"]}
                      />
                    </div>
                    {/* </div> */}
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      {/* <div className="select-field"> */}
                      <label htmlFor="cgfActivity">
                        CGF Activity <span className="mandatory">*</span>
                      </label>
                      <Dropdown
                        control={control}
                        name="cgfActivity"
                        placeholder="Select activity"
                        options={["None", "Apparel", "Food Manucaturer"]}
                      />
                    </div>
                    {/* </div> */}
                  </div>
                </div>
              </div>
              <div className="card-inner-wrap">
                <h2 className="sub-heading1">Contact Details</h2>
                <div className="flex-between card-blk">
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="corporateEmail">
                        Corporate Email <span className="mandatory">*</span>
                      </label>
                      <Input
                        control={control}
                        name="corporateEmail"
                        placeholder="Enter email"
                        myHelper={myHelper}
                        rules={{
                          required: "true",
                          maxLength: 50,
                          minLength: 3,
                        }}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="phoneNumber">Phone Number</label>
                      <Dropdown
                        control={control}
                        name="countryCode"
                        placeholder="+91"
                        options={["+91", "+92", "+404"]}
                      />
                      <Input
                        control={control}
                        name="phoneNuber"
                        placeholder="Enter phone number"
                        myHelper={myHelper}
                        rules={{
                          maxLength: 15,
                          minLength: 3,
                        }}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="websiteUrl">Website URL</label>
                      <Input
                        control={control}
                        name="websiteUrl"
                        placeholder="Enter website URL"
                        myHelper={myHelper}
                        rules={{
                          maxLength: 50,
                          minLength: 3,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-inner-wrap">
                <h2 className="sub-heading1">Company Address Details</h2>
                <div className="flex-between card-blk">
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="region">
                        Region <span className="mandatory">*</span>
                      </label>
                      <Dropdown
                        control={control}
                        name="region"
                        placeholder="Select region"
                        myHelper={myHelper}
                        rules={{ required: true }}
                        options={[
                          "Asia",
                          "Europe",
                          "Africa",
                          "Middle East",
                          "Madacascar",
                        ]}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="country">
                        Conuntry <span className="mandatory">*</span>
                      </label>
                      <Dropdown
                        control={control}
                        name="country"
                        placeholder="Select country"
                        myHelper={myHelper}
                        rules={{ required: true }}
                        options={[
                          "India",
                          "USA",
                          "Britan",
                          "Australia",
                          "Israel",
                          "Japan",
                        ]}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="state">
                        State <span className="mandatory">*</span>
                      </label>
                      <Dropdown
                        control={control}
                        name="state"
                        placeholder="Enter state"
                        myHelper={myHelper}
                        rules={{ required: true }}
                        options={["Gujrat", "Maharashtra", "Ontario", "Texas"]}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="city">City</label>
                      <Input
                        control={control}
                        myHelper={myHelper}
                        rules={{ maxLength: 50, minLength: 3 }}
                        name="city"
                        placeholder="Enter state"
                      />
                    </div>
                  </div>

                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="address">
                        Address <span className="mandatory">*</span>
                      </label>
                      <Controller
                        name="address"
                        control={control}
                        rules={{
                          required: true,
                          minLength: 3,
                          maxLength: 250
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            multiline
                            {...field}
                            inputProps={{
                              maxLength: 250,
                            }}
                            className={`input-textarea ${
                              error && "input-textarea-error"
                            }`}
                            id="outlined-basic"
                            placeholder="Enter address"
                            helperText={
                              error ? myHelper.address[error.type] : " "
                            }
                            variant="outlined"
                          />
                        )}
                      />
                      {/* Add Address Text Area field here */}
                      {/* <Input control={control} name="city" placeholder="Enter state"/> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-inner-wrap">
                <h2 className="sub-heading1">CGF Office Details</h2>
                <div className="flex-between card-blk">
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="cgfOfficeRegion">
                        Region <span className="mandatory">*</span>
                      </label>
                      <Dropdown
                        control={control}
                        name="cgfOfficeRegion"
                        placeholder="Select Region"
                        myHelper={myHelper}
                        rules={{required : true}}
                        options={["Asia", "Africa", "Europe"]}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="cgfOfficeCountry">
                        Country <span className="mandatory">*</span>
                      </label>
                      <Dropdown
                        control={control}
                        name="cgfOfficeCountry"
                        placeholder="Select country"
                        myHelper={myHelper}
                        rules={{required :true}}
                        options={["Canda", "USA", "India"]}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="cgfOffice">
                        Office <span className="mandatory">*</span>
                      </label>
                      <Dropdown
                        control={control}
                        name="cgfOffice"
                        placeholder="Select office"
                        myHelper={myHelper}
                        rules={{required : true}}
                        options={["Mumbai", "Delhi", "Vadodara"]}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-inner-wrap">
                <h2 className="sub-heading1">Member Contact Details</h2>
                <div className="flex-between card-blk">
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="memberContactSalutation">
                        Salutation <span className="mandatory">*</span>
                      </label>
                      <Dropdown
                        control={control}
                        name="memberContactSalutation"
                        placeholder="Mr."
                        myHelper={myHelper}
                        rules={{required: true}}
                        options={["Mr.", "Mrs.", "Ms."]}
                      />
                      <label htmlFor="memberContactFullName">
                        Full Name <span className="mandatory">*</span>
                      </label>
                      <Input
                        control={control}
                        myHelper={myHelper}
                        rules={{required: true, maxLength: 50, minLength: 3, pattern:  /^[A-Za-z]+[A-Za-z ]*$/}}
                        name="memberContactFullName"
                        placeholder="Enter full name"
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="title">Title</label>
                      <Input
                        control={control}
                        myHelper={myHelper}
                        rules={{maxLength:50,minLength:3}}
                        name="title"
                        placeholder="Enter title"
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="department">Department</label>
                      <Input
                        control={control}
                        myHelper={myHelper}
                        rules={{maxLength: 50,minLength:3}}
                        name="department"
                        placeholder="Enter department"
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="memberContactEmail">
                        Email <span className="mandatory">*</span>
                      </label>
                      <Input
                        control={control}
                        myHelper={myHelper}
                        rules={{required: true, maxLength: 50,minLength:3}}
                        name="memberContactEmail"
                        placeholder="Enter email"
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="memberContactPhoneNumber">
                        Phone Number
                      </label>
                      <Dropdown
                        control={control}
                        name="memberContactCountryCode"
                        placeholder="+91"
                        options={["+91", "+92", "+404"]}
                      />
                      <Input
                        control={control}
                        name="memberContactPhoneNuber"
                        myHelper={myHelper}
                        rules={{
                          maxLength: 15,
                          minLength: 3,
                        }}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-btn flex-between add-members-btn">
                <button type="reset" className="secondary-button mr-10">
                  Cancel
                </button>
                <button
                  type="submit"
                  //   onClick={}
                  className="primary-button add-button"
                >
                  Add
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default AddMember;
