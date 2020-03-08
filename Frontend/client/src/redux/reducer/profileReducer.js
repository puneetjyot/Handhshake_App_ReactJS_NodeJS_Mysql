import {GETEDUCATION, UPDATENAME} from '../actions/action_types'

const initState={
    editEducation:false,
    educationarr:'',
    studentname:''
    
}

const profileReducer=(state=initState,action)=>{
    switch(action.type){
        case GETEDUCATION:{
            console.log(action.payload)
            return{
                 educationarr: action.payload
            }
            }
            case UPDATENAME:{
                console.log(action.payload+"Updating name in reducer")
                return{
                    
                    studentname:action.payload
                   
                }
            }
            default: // need this for default case
            return state 
    }
}

export default profileReducer;