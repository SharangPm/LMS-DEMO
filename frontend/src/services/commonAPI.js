import axios from 'axios'


export const commonAPI = async (method, url, body, headers) => {
    try {
      const response = await axios({
        method,
        url,
        data: body,
        headers: headers || { "Content-Type": "application/json" },
      });
      return response;
    } catch (error) {
      throw error;
    }
  };