import { LOGINSTUDENT,UNAUTHENTICATEDSTUDENT,LOGINCOMPANY,UNAUTHENTICATEDCOMPANY, LOGOUTSTUDENT, LOGOUTCOMPANY, REGISTERSTUDENT, REGISTERCOMPANY } from "../actions/action_types";

const initState={
    authStudent:false,
    authCompany:false,
    error:""
}

const authReducer=(state=initState,action)=>{

    switch(action.type){

    case LOGINSTUDENT :{
        console.log(action.payload)
        localStorage.setItem('student',JSON.stringify(action.payload.user.token));
        return {
           
            authStudent: true
        };
    }
    case UNAUTHENTICATEDSTUDENT :{
       console.log(action.payload)
        return{
            authStudent:false,
            autherror:action.payload
        }
    }
        case LOGINCOMPANY :{
            console.log(action.payload)
            localStorage.setItem('company',JSON.stringify(action.payload.user.token));
            return {
               
                authCompany: true
            };
        }
        case UNAUTHENTICATEDCOMPANY :{
           console.log(action.payload)
            return{
                authCompany:false,
                autherror:action.payload
            }
        }
        case LOGOUTSTUDENT:{
            console.log("logging out student")
            localStorage.removeItem('student')
            return{
                authStudent:false
            }
        }
        case LOGOUTCOMPANY:{
            console.log("logging out company")
            localStorage.removeItem('company')
            return{
                authCompany:false
            }
        }
        case REGISTERSTUDENT:{
            console.log("inside register student reducer",action.payload)
            localStorage.setItem('student',JSON.stringify(action.payload.user.token));
            return {
               
                authStudent: true
            };
        }
        case REGISTERCOMPANY:{
            console.log("inside register Company reducer",action.payload)
            localStorage.setItem('company',JSON.stringify(action.payload.company.token));
            return {
               
                authCompany: true
            };
        }
    
    
    
    default: // need this for default case
      return state 
   

}

}

export default authReducer;