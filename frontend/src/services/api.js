import axios from  'axios';

const ApiFormData =axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials:true,
    headers:{
        "Content-Type":"multipart/form-data",

    },
});
const Api =axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials:true,
    headers:{
        "Content-Type":"application/json",

    },

})

const config ={
    headers:{
        'authorization':`Bearer ${localStorage.getItem("token")}`
    }
}

export const createUserApi =(data) => Api.post("/api/auth/register",data)
export const loginUserApi =(data) => Api.post("/api/auth/login",data)

// ASSIGNMENTS
export const addAssignment = (data) => 
    ApiFormData.post("/api/assignments/add", data, config);

export const getAllAssignments = () => 
    Api.get("/api/assignments/all", config);

export const getAssignment = (id) => 
    Api.get(`/api/assignments/${id}`, config);

export const updateAssignment = (id, data) => 
    ApiFormData.put(`/api/assignments/${id}`, data, config);

export const downloadAssignment = (id)  => Api.get(`/api/assignments/download/${id}`, {
    ...config,
    responseType: "blob"
});

export const removeAssignment = (id) => 
    Api.delete(`/api/assignments/${id}`, config);

// COURSES
export const addCourse = (data) => 
    Api.post("/api/courses/add", data, config);

export const getAllCourses = () => 
    Api.get("/api/courses/all", config);

export const getCourse = (id) => 
    Api.get(`/api/courses/${id}`, config);

export const updateCourse = (id, data) => 
    Api.put(`/api/courses/${id}`, data, config);

export const removeCourse = (id) => 
    Api.delete(`/api/courses/${id}`, config);

export const addResource    = (data)     => Api.post("/api/resources/add", data, config);
export const getAllResources = ()         => Api.get("/api/resources/all", config);
export const updateResource = (id, data) => Api.put(`/api/resources/update/${id}`, data, config);
export const removeResource = (id)       => Api.delete(`/api/resources/delete/${id}`, config);

export const getAllSubmissions           = ()          => Api.get("/api/assignment/submission/all", config);
export const getSubmissionsByAssignment = (aid)       => Api.get(`/api/assignment/submission/${aid}`, config);
export const reviewSubmission           = (id, data)  => Api.put(`/api/assignment/submission/review/${id}`, data, config);
export const downloadSubmission         = (id)        => Api.get(`/api/assignment/submission/download/${id}`, { ...config, responseType: "blob" });
export const submitAssignment           = (formData)  => Api.post("/api/assignment/submission/submit", formData, { headers: { ...config.headers, "Content-Type": "multipart/form-data" }});
export const resubmitAssignment         = (id, formData) => Api.put(`/api/assignment/submission/resubmit/${id}`, formData, { headers: { ...config.headers, "Content-Type": "multipart/form-data" }});