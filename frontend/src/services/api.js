const API_URL="http://localhost:8080/api";

export const uploadFrame=async(image)=>{
    const response=await fetch(`${API_URL}/upload_frame/`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({image})
    });
    return response.json();
}