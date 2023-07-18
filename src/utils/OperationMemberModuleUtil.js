import axios from "axios";
import { OPERATION_TYPES } from "../api/Url";
import { Logger } from "../Logger/Logger";
export const helperText = {
  salutation: {
    required: "Select salutation",
  },
  name: {
    required: "Enter the operation member name",
    maxLength: "Max char limit exceed",
    minLength: "minimum 3 characters required",
    pattern: "Invalid format",
  },
  department: {
    // required: "Enter the role name",
    maxLength: "Max char limit exceed",
    minLength: "minimum 3 characters required",
    pattern: "Invalid format",
  },
  title: {
    // required: "Enter the role name",
    maxLength: "Max char limit exceed",
    minLength: "minimum 3 characters required",
    pattern: "Invalid format",
  },
  email: {
    required: "Enter the email",
    // maxLength: "Max char limit exceed",
    // minLength: "Role must contain atleast 3 characters",
    pattern: "Invalid format",
  },
  countryCode: {
    required: "Enter country code",
    validate: "Select country code",
  },
  phoneNumber: {
    required: "Enter the phone number",
    maxLength: "Max digits limit exceed",
    minLength: "Enter the valid phone number (Eg: 1234567890)",
    validate: "Enter the valid phone number (Eg: 1234567890)",
    // pattern: "Invalid format",
  },
  memberCompany: {
    required: "Select member company",
  },
  operationType: {
    required: "Select the operation type",
    // maxLength: "Max char limit exceed",
    // minLength: "Role must contain atleast 3 characters",
    // pattern: "Invalid format",
  },
  memberId: {
    required: "Select the member company",
    // validate: "Select the member company",
    // maxLength: "Max char limit exceed",
    // minLength: "Role must contain atleast 3 characters",
    // pattern: "Invalid format",
  },
  companyType: {
    required: "Enter company type",
    // maxLength: "Max char limit exceed",
    // minLength: "Role must contain atleast 3 characters",
    // pattern: "Invalid format",
  },
  address: {
    required: "Enter address",
    maxLength: "Max char limit exceed",
    minLength: "minimum 3 characters required",
    pattern: "Invalid format",
  },
  roleId: {
    required: "Select the role",
  },
  reportingManager: {
    required: "Select the reporting manager ",
    // maxLength: "Max char limit exceed",
    // minLength: "Role must contain atleast 3 characters",
    // pattern: "Invalid format",
  },
  isCGFStaff: {
    required: "Select the CGFSTaff",
  },
};

export const tableHead = [
  {
    id: "name",
    // width: "30%",
    disablePadding: false,
    label: "Operation Member",
  },
  {
    id: "email",
    // width: "30%",
    disablePadding: false,
    label: "Email",
  },
  {
    id: "memberCompany",
    // width: "30%",
    disablePadding: false,
    label: "Member Company",
  },
  {
    id: "companyType",
    // width: "30%",
    disablePadding: false,
    label: "Company Type",
  },
  {
    id: "createdByName",
    // width: "30%",
    disablePadding: false,
    label: "Created By",
  },
  {
    id: "createdAt",
    // width: "30%",
    disablePadding: false,
    label: "Created At",
  },
];

export const getOperationTypes = async () => {
  try {
    const response = await axios.get(OPERATION_TYPES);
    Logger.info(`Operation member module - getOperationTypes handler`);
    return response?.data;
  } catch (error) {
    Logger.info(
      `Operation member module - getOperationTypes handler catch error ${error?.response?.data?.message}`
    );
  }
};
