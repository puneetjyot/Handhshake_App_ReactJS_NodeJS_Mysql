import {LOGINSTUDENT,UNAUTHENTICATEDSTUDENT,LOGINCOMPANY,UNAUTHENTICATEDCOMPANY,LOGOUTCOMPANY,LOGOUTSTUDENT, REGISTERCOMPANY, REGISTERSTUDENT} from './action_types'
import axios from 'axios'
import api_route from '../../app-config'

const loginStudentDispatcher =(payload)=>{
    return {
        type:LOGINSTUDENT,payload
    };
}
const unauthenticatedStudent =(payload)=>{
    return {
        type:UNAUTHENTICATEDSTUDENT,payload
    };
}
const loginCompanyDispatcher =(payload)=>{
    return {
        type:LOGINCOMPANY,payload
    };
}
const unauthenticatedCompany =(payload)=>{
    return {
        type:UNAUTHENTICATEDCOMPANY,payload
    };
}
export const logoutStudent = ()=>{
    return {
        type:LOGOUTSTUDENT
    }
}
export const logoutCompany = ()=>{
    return {
        type:LOGOUTCOMPANY
        }
}
const registerCompanyDispatcher =(payload)=>{
    return {
        type:REGISTERCOMPANY,payload
    };
}
const registerStudentDispatcher =(payload)=>{
    return {
        type:REGISTERSTUDENT,payload
    };
}

export const registerStudent = (payload) =>{
    return dispatch =>{
        axios.post(`${api_route.host}/student/register`,payload)
        .then(res=>{
            if (res.status === 201) {
                dispatch(registerStudentDispatcher(res.data))
              }
              console.log(res)
            
        })
        .catch(errors => {
            if(errors.response.data){
            console.log("in catch",errors.response.data);
            // this.setState({ authFlag:false,
            // errors:errors.response.data.errors.body
            // });
            dispatch(unauthenticatedStudent(errors.response.data.errors.body))
            }
            else{
                dispatch(unauthenticatedStudent("Server error"))
            }
           
          });
        
    }
}

export const registerCompany = (payload) =>{
    return dispatch =>{
        axios.post(`${api_route.host}/company/register`,payload)
        .then(res=>{
            if (res.status === 201) {
                dispatch(registerCompanyDispatcher(res.data))
              }
              console.log(res)
            
        })
        .catch(errors => {
            if(errors.response.data){
            console.log("in catch",errors.response.data);
            // this.setState({ authFlag:false,
            // errors:errors.response.data.errors.body
            // });
            dispatch(unauthenticatedCompany(errors.response.data.errors.body))
            }
            else{
                dispatch(unauthenticatedCompany("Server error"))
            }
           
          });
        
    }
}

export const loginStudent = (payload) =>{
    return dispatch =>{
        axios.post(`${api_route.host}/student/login`,payload)
        .then(res=>{
            if (res.status === 201) {
                dispatch(loginStudentDispatcher(res.data))
              }
              console.log(res)
            
        })
        .catch(errors => {
            console.log(errors)
            if(errors.response){
            console.log("in catch",errors.response.data);
            // this.setState({ authFlag:false,
            // errors:errors.response.data.errors.body
            // });
            dispatch(unauthenticatedStudent(errors.response.data.errors.body))
            }
            else{
                dispatch(unauthenticatedStudent("Server error"))
            }
           
          });
        
    }
}
export const loginCompany = (payload) =>{
    return dispatch =>{
        axios.post(`${api_route.host}/company/login`,payload)
        .then(res=>{
            if (res.status === 201) {
                dispatch(loginCompanyDispatcher(res.data))
              }
              
            
        })
        .catch(errors => {
            if(errors.response.data){
            console.log("in catch",errors.response.data);
            // this.setState({ authFlag:false,
            // errors:errors.response.data.errors.body
            // });
            dispatch(unauthenticatedCompany(errors.response.data.errors.body))
            }
            else{
                dispatch(unauthenticatedCompany("Server error"))
            }
           
          });
        
    }
}



