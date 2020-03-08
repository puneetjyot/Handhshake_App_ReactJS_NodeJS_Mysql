import axios from 'axios'

import { GETEDUCATION,UPDATENAME } from './action_types';

const getEducationDispatcher =(payload)=>{
    return {
        type:GETEDUCATION,payload
    };
}

const updateNameDispatcher =(payload)=>{
    return {
        type:UPDATENAME,payload
    };
}

export const getEducation=()=>
{
     //   let token=window.localStorage.getItem("student")
    console.log("localstorage is this "+window.localStorage.getItem("student"))
    let config = {
      
        headers: {
          Authorization: `${window.localStorage.getItem("student")}`,
        }
      }
      // let data={
      //   'Content-Type' : 'application/json; charset=utf-8',
      //   'Accept'       : 'application/json',
      // }
      let url=`http://localhost:3001/student/`
    return dispatch=>{
        axios.get(url,config).then(res=>{

            if (res.status === 201) {
                dispatch(getEducationDispatcher(res.data))
              }
            
        }

        ).catch(errors =>{
           console.log(errors)
        })
    }

}

export const updateName=(sname)=>
{
      //  let token=window.localStorage.getItem("student")
    console.log("localstorage is this "+window.localStorage.getItem("student"))
    console.log("updated name is"+ sname)
    let config = {
      
        headers: {
          Authorization: `${window.localStorage.getItem("student")}`,
        }
      }
      let data={
          student:{
            name:sname
          }
       
      }
      let url=`http://localhost:3001/student/name`
    return dispatch=>{
        axios.put(url,data,config).then(res=>{

            if (res.status === 201) {

                dispatch(updateNameDispatcher(res.data))
              }
            
        }

        ).catch(errors =>{

           console.log(errors)
        })
    }

}
