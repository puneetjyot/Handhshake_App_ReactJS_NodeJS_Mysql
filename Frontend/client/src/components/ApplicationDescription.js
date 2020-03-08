import React, { Component } from 'react';
import '../styles/jobs.css';
import api_route from "../app-config";

import axios from "axios";
class ApplicationDescription extends Component {
    state = {  

        modalShow:"none",
        selectedFile: null,
        jobId:'',
        applyerror:''
    }

   
    render() { 
        console.log(this.props.jobdata)
        return ( 
            <div>
            <div className='p-2 ml-3 b-1'> 
            <p style={{fontSize:'24px',fontWeight:'700' ,fontFamily: "Suisse Int",marginBottom: "5px"}}>{this.props.jobdata.company_basic_detail?this.props.jobdata.company_basic_detail.company_name:''}</p>
             <p style={{fontSize:'18px',fontWeight:'500' ,fontFamily: "Suisse Int",color:'rgba(0,0,0,.56)'}}>{this.props.jobdata.job_title}</p>
            </div>
            <div className='d-flex ml-3'>
            <div className='d-flex '>
            <ion-icon name="briefcase"></ion-icon>
            <p style={{color: "rgba(0,0,0,.56)",fontSize:'14px' , }} className='ml-2'>{this.props.jobdata.job_category} Job,</p>
            </div>
            <div className='d-flex ml-2'>
             <ion-icon name="location"></ion-icon>
            <p style={{color: "rgba(0,0,0,.56)",fontSize:'14px' , }} className='ml-2'>{this.props.jobdata.location},</p>
            </div>
            <div className='d-flex ml-2'>
             <ion-icon name="cash-outline"></ion-icon>
            <p style={{color: "rgba(0,0,0,.56)",fontSize:'14px' , }} className='ml-2'>${this.props.jobdata.salary} per year</p>
            </div>
            </div>

            <div className='style__card___31yrn m-2'>
            <div className='' style={{fontSize:"20px",fontWeight:'600',alignSelf: "center"}}>
           <div className='col-9'> <p style={{fontSize:"15px"}}> You applied for this job on <i>{this.props.jobdata?this.props.jobdata.studentjobs[0].createdAt.split('T')[0]:''}</i></p></div>
           <div  className='col-9'> <p style={{fontSize:"15px"}}>Status for the appliation is<i> {this.props.jobdata?this.props.jobdata.studentjobs[0].job_status:''}</i>! </p></div>
               
                </div>
               


            </div>

            {/* </div>

            </div>
            </div> */}
            <div className='style__card___31yrn m-2'>
            <h4 className='mb-3'>Description about the job</h4>
            <p style={{color: "dodgerblue"}}>{this.props.jobdata.job_description}</p> 
            </div>
           
            </div>
         );
    }
}
 
export default ApplicationDescription;