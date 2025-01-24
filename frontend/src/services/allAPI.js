import { commonAPI } from "./commonAPI"
import { server_url } from "./serverurl"


export const registerAPI = async(user)=>{
    return await commonAPI('POST',`${server_url}/register`,user,"")
}

// loginAPI


export const loginAPI = async(user)=>{
    return await commonAPI('POST',`${server_url}/login`,user,"")
}

