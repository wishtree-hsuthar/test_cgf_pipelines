import axios from "axios";
import { CATEGORIES, CGF_OFFICES } from "../api/Url";
export const Member_Lookup = {};
let MEMBER_LOOKUP = {}
const updateLookUp = (categoriesArray) => {

    // console.log("Categories:- ",categoriesArray)
    categoriesArray.forEach((category) => {
      MEMBER_LOOKUP[category.categoryName] = category.activities;
    });
    // console.log("MEMBER LOOKUP:- ",MEMBER_LOOKUP)
    return MEMBER_LOOKUP;

  };
  export const getCategories =async () => {
    try {
      const response =await axios.get(CATEGORIES);
      console.log("response",response)
     return  updateLookUp(response?.data);
    } catch (error) {
        console.log("error:",error)
    }
  };

 export const getCGFOffices = async () => {
    try {
        const response = await axios.get(CGF_OFFICES)
        console.log("response of get Offices",response)
        return response?.data;
    } catch (error) {
     console.log("error",error)   
    }
 } 
export const defaultValues = {
  memberCompany: "",
  companyType: "Internal",
  parentCompany: "",
  cgfCategory: "Manufacturer",
  cgfActivity: "",
  replacedMember: "",
  corporateEmail: "",
  countryCode: "",
  phoneNumber: "",
  websiteUrl: "",
  region: "",
  country: "",
  state: "",
  city: "",
  address: "",
  cgfOfficeRegion: "",
  cgfOfficeCountry: "",
  cgfOffice: "",
  memberContactSalutation: "Mr.",
  memberContactFullName: "",
  title: "",
  department: "",
  memberContactCountryCode: "",
  memberContactEmail: "",
  memberContactPhoneNuber: "",
  totalOperationMembers: "",
  createdBy: "",
  roleId: "",
  status: "active",
};
