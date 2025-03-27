import {makeRequest} from "../../utils/Requests/Requests.js";

export const remove = async (url,{rejectWithValue}) => {
    try {
        const [status,result]=await makeRequest({
            url:url,
            method:"DELETE",
            use_jwt:true
        })

        if (status >= 200 && status < 300) return result; // Handle 200-299 status codes
        return rejectWithValue(result);
    }catch (error) {
        return rejectWithValue(error)
    }
}