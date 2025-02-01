import { commonAPI } from "./commonAPI"
import { server_url } from "./serverurl"


// registerAPI
export const registerAPI = async (user) => {
  try {
    const response = await commonAPI('POST', `${server_url}/register`, user, "");
    return response;
  } catch (error) {
    throw error;
  }
};
// loginAPI


export const loginAPI = async(user)=>{
    return await commonAPI('POST',`${server_url}/login`,user,"")
}

export const verifyOTPAPI = async (otpData) => {
    try {
      const response = await commonAPI('POST', `${server_url}/verify-otp`, otpData, "");
      return response;
    } catch (error) {
      // Throw the error to be caught in the component
      throw error;
    }
  };