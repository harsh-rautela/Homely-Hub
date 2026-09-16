import {propertyAction} from "./property-slice";
import {axiosInstance} from "../../utils/axios"

export const getAllProperties = ()=>async (dispatch,getState)=>{
 try {
    console.log("inside get all")
    dispatch(propertyAction.getRequest());
    const {searchParams}= getState().property

    const response = await axiosInstance.get(`/v1/rent/listing/`,{
        params:{...searchParams}
    });
    console.log("response")
    if(!response){
        throw new Error("Could not fetch any properties")
    }
    const {data}=response;
    dispatch(propertyAction.getProperties(data))

 } catch(error){
    console.log(error)
    dispatch(propertyAction.getErrors(error.message))
 }
}