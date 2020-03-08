import React, { Component } from 'react';
import '../styles/jobs.css'
import JobDescription from './JobDescription'
import api_route from "../app-config";
import axios from "axios";

class StudentJobs extends Component {
   constructor(props)
    
   {
       super(props);
    this.state = { 
        jobarr:[]  ,
        jobobj:'' ,
        perjobarr:[] 
         }
   } 

   componentDidMount()
   {
        let config = {
      headers: {
        Authorization: `${window.localStorage.getItem("student")}`
      }
    };
    console.log("mounting in jobs------------");
    //this.setState({educationarr:this.props.educationData})
    try {
      console.log("In try bloc");
      axios
        .get(`${api_route.host}/jobs/`, config)
        .then(res => {
          this.setState({ jobarr: res.data.result });
          this.setState({ perjobarr: res.data.result });
          this.setState({jobobj:res.data.result[0]})
          console.log(res.data.result);
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
   }
 filterByTitleOrCompany=(value)=>{
   let result=[]
   console.log(value)
    this.state.perjobarr.map(i=>{
    console.log( i.company_basic_detail.company_name.indexOf(value))
     if(i.job_title.toLowerCase().indexOf(value)>=0||i.company_basic_detail.company_name.toLowerCase().indexOf(value)>=0
     || i.job_title.indexOf(value)>=0||i.company_basic_detail.company_name.indexOf(value)>=0
     )
     {
       result.push(i)
     }
     
   })
   this.setState({jobarr:result})

 }

filterByLocation=(value)=>{
   let result=[]
   console.log(value)
    this.state.perjobarr.map(i=>{
    //console.log( i.company_basic_detail.company_name.indexOf(value))
     if(i.location.toLowerCase().indexOf(value)>=0||i.location.indexOf(value)>=0)
     {
       result.push(i)
     }
     
   })
   this.setState({jobarr:result})

 }



    render() { 
        return (  

            <div className='maindiv '>
            <div className='style__secondary-nav___3_H_G pb-2 mb-3' align='center'>
            <h2 className='ml-5' style={{fontSize:'20px',fontWeight:'600'}}>Job Search</h2>
            </div>
                <div className='container mt-3'>
                <div className="card">
                <div className="card-body d-flex justify-content-between">
                 <div className="d-flex col-6">
                 <div className='m-2' style={{left:"40px",position:'relative'}}>
                 <ion-icon name="search"></ion-icon>
                 </div>
                 <input type='text' className='form-control p-2 pl-5' placeholder='Job titles, employers, or keywords'
                 onChange={e=>{
                   this.filterByTitleOrCompany(e.target.value)
                 }}
                 />
                 </div>
                 <div className="d-flex col-6">
                 <div className='m-2' style={{left:"40px",position:'relative'}}>
                 <ion-icon name="location" ></ion-icon>
                 </div>
                 <input type='text' className='form-control p-2 pl-5' placeholder='City, State, Zip Code, or Address'
                  onChange={e=>{
                   this.filterByLocation(e.target.value)
                 }}
                 />
                 </div>
                </div>
                <div className="d-flex p-2 ml-2">
                <button className='style__pill___3uHDM' onClick={(e)=>{
                 const result= this.state.perjobarr.filter(i=>(
                    i.job_category=='Full-Time'
                  ))
                  this.setState({jobarr:result})
                }}>Full-Time Job</button>
                 <button className='style__pill___3uHDM'  onClick={(e)=>{
                 const result= this.state.perjobarr.filter(i=>(
                    i.job_category=='Part-Time'
                  ))
                  this.setState({jobarr:result})
                }}>Part-Time</button>
                 <button className='style__pill___3uHDM'  onClick={(e)=>{
                 const result= this.state.perjobarr.filter(i=>(
                    i.job_category=='Internship'
                  ))
                  this.setState({jobarr:result})
                }}>Internship</button>
                 <button className='style__pill___3uHDM'  onClick={(e)=>{
                 const result= this.state.perjobarr.filter(i=>(
                    i.job_category=='On-Campus'
                  ))
                  this.setState({jobarr:result})
                }}>On-Campus</button>
                </div>
                </div>

                </div>

                <div className='container'>
                <div className='row mt-3'>
                <div className='col-4'>
                <div className='card' style={{height:"500px"}}>
                <div className='style__jobs___3seWY'>
                <h4 className='m-2' style={{fontWeight:"200px",fontSize:'18px'}}> Few jobs are shown here which match your interests</h4>
              {this.state.jobarr?this.state.jobarr.map(i=>(

              
               <div key={i.job_id}>
                <div className='style__selected___1DMZ3 p-2 mt-3 jobdiv m-1 card' onClick={(e)=>{
                  this.setState({jobobj:i})
                }}>
                <div className='d-flex'>
                 <ion-icon name="briefcase"></ion-icon>
                <h3 className='ml-2' style={{fontSize:'16px',fontWeight:'700'}}>{i.job_title}</h3>

                </div>
                <h3 style={{fontSize:'16px',fontWeight:'400'}}>{i.company_basic_detail.company_name}</h3>
                <h3 style={{color:"rgba(0,0,0,.56)",fontWeight:"200px",fontSize:'14px'}}>{i.job_category} Job</h3>
                </div>
                </div>
))
:''}
               
                </div>

                </div>
                </div>
                <div className='col-8'>
                 <div className='card' style={{height:"500px"}}>
                 <div className='style__jobs___3seWY'>
                    <JobDescription jobdata={this.state.jobobj}/>
                 </div>
                 </div>
                </div>
                </div>
                </div>
            
            </div>
        );
    }
}
 
export default StudentJobs;