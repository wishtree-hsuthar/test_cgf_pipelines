import axios from "axios";
import { CATEGORIES, CGF_OFFICES } from "../api/Url";
import { Logger } from "../Logger/Logger";
export const Member_Lookup = {};

let MEMBER_LOOKUP = {};
const updateLookUp = (categoriesArray) => {
    // Logger.debug("Categories:- ",categoriesArray)
    categoriesArray.forEach((category) => {
        MEMBER_LOOKUP[category.categoryName] = category.activities;
    });
    // Logger.debug("MEMBER LOOKUP:- ",MEMBER_LOOKUP)
    return MEMBER_LOOKUP;
};
export const getCategories = async () => {
    try {
        const response = await axios.get(CATEGORIES);
        Logger.debug("response", response);
        return updateLookUp(response?.data);
    } catch (error) {
        Logger.debug("error:", error);
    }
};

export const getCGFOffices = async () => {
    try {
        const response = await axios.get(CGF_OFFICES);
        Logger.debug("response of get Offices", response);
        return response?.data;
    } catch (error) {
        Logger.debug("error", error);
    }
};
export const defaultValues = {
    memberCompany: "",
    companyType: "Partner",
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
